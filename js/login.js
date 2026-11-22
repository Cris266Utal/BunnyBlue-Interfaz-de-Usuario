/* Vista Iniciar sesión (RIU 2). */
(function () {
  const s = BB.session();
  if (s) { location.replace("pages/" + BB.home(s.role)); return; }
  const form = document.getElementById("form-login");
  const btn = document.getElementById("btn-ingresar");
  const user = document.getElementById("usuario");
  const pass = document.getElementById("clave");
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!user.value.trim() || !pass.value) {
      BB.modal({ title: "Faltan campos por completar", text: "Ingresa tu usuario y tu contraseña para continuar.", tone: "orange" });
      return;
    }
    const r = BB.login(user.value, pass.value);
    if (r.code === "ok") { location.replace("pages/" + BB.home(r.role)); return; }
    if (r.code === "nouser") {
      BB.modal({ title: "Usuario no encontrado", text: "El usuario ingresado no existe en la base de datos.", tone: "red" });
    } else if (r.code === "badpass") {
      pass.value = "";
      BB.modal({ title: "Contraseña incorrecta", text: `Te quedan ${r.left} ${r.left === 1 ? "intento" : "intentos"} antes de que la cuenta se bloquee.`, tone: "red" });
    } else {
      btn.disabled = user.disabled = pass.disabled = true;
      BB.modal({ title: "Cuenta bloqueada", text: "Superaste los 3 intentos permitidos. Contacta al administrador para desbloquearla.", tone: "red" });
    }
  });
})();
