/**
 * login.js — Vista «Iniciar sesión» (RIU 2): validación de campos, usuario inexistente,
 * contraseña incorrecta con intentos restantes y bloqueo tras 3 intentos fallidos.
 */
(function (BB) {
  'use strict';

  const { Auth, UI, MAX_INTENTOS } = BB;

  const formulario = document.getElementById('form-login');
  const campoUsuario = document.getElementById('usuario');
  const campoClave = document.getElementById('clave');
  const botonIngresar = document.getElementById('btn-ingresar');
  const avisoBloqueo = document.getElementById('aviso-bloqueo');
  const botonReiniciar = document.getElementById('btn-reiniciar');

  /** Deshabilita contraseña e «Ingresar» si el usuario escrito está bloqueado. */
  function aplicarEstadoBloqueo() {
    const bloqueado = Auth.estaBloqueado(campoUsuario.value);
    campoClave.disabled = bloqueado;
    botonIngresar.disabled = bloqueado;
    avisoBloqueo.hidden = !bloqueado;
    return bloqueado;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const clave = campoClave.value;

    const faltantes = [];
    if (!usuario) faltantes.push({ nombre: 'USUARIO', campo: campoUsuario });
    if (!clave) faltantes.push({ nombre: 'CONTRASEÑA', campo: campoClave });
    if (faltantes.length) {
      await UI.modal({
        tipo: 'error',
        titulo: 'Faltan campos por completar',
        mensaje: 'Completa los siguientes campos:',
        lista: faltantes.map((f) => f.nombre)
      });
      faltantes[0].campo.focus();
      return;
    }

    const resultado = Auth.intentarLogin(usuario, clave);

    switch (resultado.estado) {
      case 'ok':
        location.href = Auth.url('home');
        break;

      case 'no_existe':
        await UI.modal({
          tipo: 'error',
          titulo: 'Usuario no encontrado',
          mensaje: `El usuario «${usuario}» no existe en la base de datos.`
        });
        campoUsuario.focus(); // conserva lo escrito
        break;

      case 'clave_incorrecta':
        await UI.modal({
          tipo: 'error',
          titulo: 'Contraseña incorrecta',
          mensaje: `La contraseña no coincide. Intentos restantes: ${resultado.restantes} de ${MAX_INTENTOS}.`
        });
        campoClave.value = '';
        campoClave.focus();
        break;

      case 'bloqueado':
        await UI.modal({
          tipo: 'bloqueo',
          titulo: 'Cuenta bloqueada',
          mensaje: `La cuenta «${resultado.usuario.usuario}» se bloqueó tras ${MAX_INTENTOS} intentos fallidos. Solo un administrador puede restablecerla.`
        });
        campoClave.value = '';
        aplicarEstadoBloqueo();
        break;
    }
  }

  async function reiniciarDemo() {
    Auth.reiniciarBloqueos();
    aplicarEstadoBloqueo();
    await UI.modal({
      tipo: 'exito',
      titulo: 'Bloqueos reiniciados',
      mensaje: 'Todas las cuentas de prueba quedaron habilitadas nuevamente.'
    });
  }

  formulario.addEventListener('submit', manejarEnvio);
  campoUsuario.addEventListener('input', aplicarEstadoBloqueo);
  botonReiniciar.addEventListener('click', reiniciarDemo);
})(window.BB);
