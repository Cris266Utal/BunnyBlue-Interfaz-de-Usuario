/* Vista Home / Iniciar sesión (RIU 2). Textos de los modales según las Figuras 51 a 53 del informe. */
(function () {
  const s = BB.session();
  if (s) { location.replace("pages/" + BB.home(s.role)); return; }
  if (!BBStore.persistent) {
    BB.modal({ title: "Almacenamiento bloqueado", text: "Tu navegador bloquea el almacenamiento local (modo privado o cookies bloqueadas). Desactiva ese bloqueo o abre el sistema en una ventana normal; de lo contrario la sesión y los pedidos no se conservan entre vistas.", tone: "orange" });
  }
  const form = document.getElementById("form-login");
  const btn = document.getElementById("btn-ingresar");
  const user = document.getElementById("usuario");
  const pass = document.getElementById("clave");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const falta = [[user, "USUARIO", !user.value.trim()], [pass, "CONTRASEÑA", !pass.value]].filter(x => x[2]);
    if (falta.length) {
      BB.modal({ title: "Faltan campos por completar", text: "Completa los siguientes campos obligatorios:", list: falta.map(x => x[1]), tone: "red", onClose: () => falta[0][0].focus() });
      return;
    }
    const r = BB.login(user.value, pass.value);
    if (r.code === "ok") { location.replace("pages/" + BB.home(r.role)); return; }
    if (r.code === "nouser") {
      BB.modal({ title: "Usuario no encontrado", text: "El usuario ingresado no existe en la base de datos. Revisa los datos e inténtalo nuevamente.", tone: "red", onClose: () => user.focus() });
    } else if (r.code === "badpass") {
      pass.value = "";
      const sig = r.left === 1 ? "en el siguiente aviso: la cuenta se bloqueará" : "en el siguiente aviso: " + (r.left - 1);
      BB.modal({ title: "Contraseña incorrecta", text: `La contraseña ingresada no es correcta. Intentos restantes: ${r.left} (${sig}).`, tone: "red", onClose: () => pass.focus() });
    } else {
      btn.disabled = user.disabled = pass.disabled = true;
      BB.modal({ title: "Cuenta bloqueada", text: "Superaste los 3 intentos permitidos. Tu cuenta queda bloqueada hasta que un administrador la restablezca.", tone: "redx" });
    }
  });
})();
