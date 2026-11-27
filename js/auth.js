/* Sesión, login con bloqueo y control de acceso por perfil (RIU 2, 3, 8, 9, 10).
   Nota: es una simulación del lado del cliente; en un sistema real la validación va en el servidor. */
const BB = {
  MAX_INTENTOS: 3,
  session() {
    try { return JSON.parse(BBStore.session.get("bb_session")); } catch (e) { return null; }
  },
  clean(t) { return String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase(); },
  home(role) { return role === "admin" ? "home-admin.html" : "home-user.html"; },
  fails() {
    try { return JSON.parse(BBStore.local.get("bb_fails")) || {}; } catch (e) { return {}; }
  },
  saveFails(f) { BBStore.local.set("bb_fails", JSON.stringify(f)); },
  login(username, password) {
    const n = BB.clean(username); // se compara sin tildes ni mayúsculas
    const user = BB_USERS.find(u => BB.clean(u.username) === n);
    if (!user) return { code: "nouser" };
    const f = BB.fails();
    if ((f[user.username] || 0) >= BB.MAX_INTENTOS) return { code: "locked" };
    if (user.password !== password) {
      f[user.username] = (f[user.username] || 0) + 1;
      BB.saveFails(f);
      return f[user.username] >= BB.MAX_INTENTOS
        ? { code: "locked" }
        : { code: "badpass", left: BB.MAX_INTENTOS - f[user.username] };
    }
    delete f[user.username];
    BB.saveFails(f);
    BBStore.session.set("bb_session", JSON.stringify({ username: user.username, name: user.name, role: user.role }));
    return { code: "ok", role: user.role };
  },
  logout() { BBStore.session.del("bb_session"); location.replace("../index.html"); },
  /* Se ejecuta al cargar cada vista: sin sesión -> login; perfil distinto -> su propio Home. */
  guard(role) {
    const s = BB.session();
    if (!s) location.replace("../index.html");
    else if (s.role !== role) location.replace(BB.home(s.role));
    window.addEventListener("pageshow", e => { if (e.persisted) BB.guard(role); });
  }
};
