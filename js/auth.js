/* Sesión, login con bloqueo y control de acceso por perfil (RIU 2, 3, 8, 9, 10).
   Nota: es una simulación del lado del cliente; en un sistema real la validación va en el servidor. */
const BB = {
  MAX_INTENTOS: 3,
  session() {
    try { return JSON.parse(sessionStorage.getItem("bb_session")); } catch (e) { return null; }
  },
  home(role) { return role === "admin" ? "home-admin.html" : "home-user.html"; },
  fails() {
    try { return JSON.parse(localStorage.getItem("bb_fails")) || {}; } catch (e) { return {}; }
  },
  saveFails(f) { localStorage.setItem("bb_fails", JSON.stringify(f)); },
  login(username, password) {
    const user = BB_USERS.find(u => u.username === username.trim().toLowerCase());
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
    sessionStorage.setItem("bb_session", JSON.stringify({ username: user.username, name: user.name, role: user.role }));
    return { code: "ok", role: user.role };
  },
  logout() { sessionStorage.removeItem("bb_session"); location.replace("../index.html"); },
  /* Se ejecuta al cargar cada vista: sin sesión -> login; perfil distinto -> su propio Home. */
  guard(role) {
    const s = BB.session();
    if (!s) location.replace("../index.html");
    else if (s.role !== role) location.replace(BB.home(s.role));
  }
};
