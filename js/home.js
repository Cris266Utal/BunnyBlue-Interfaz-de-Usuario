/**
 * home.js — Dashboard de bienvenida (RIU 3): saludo, perfil y tarjetas según el rol.
 * También informa cuando se intentó abrir una sección de otro perfil (RIU 10).
 */
(function (BB) {
  'use strict';

  const { Auth, UI, MENUS, CLAVES } = BB;
  const sesion = Auth.obtenerSesion();
  if (!sesion) return; // el guardián de auth.js ya está redirigiendo al login

  document.getElementById('saludo').textContent = `Bienvenido/a, ${sesion.nombre}`;
  document.getElementById('perfil-nombre').textContent = sesion.rol;

  const contenedor = document.getElementById('tarjetas-acceso');
  MENUS[sesion.rol]
    .filter((item) => item.id !== 'home')
    .forEach((item) => {
      const enlace = document.createElement('a');
      enlace.className = 'tarjeta-acceso';
      enlace.href = Auth.url(item.ruta);
      enlace.textContent = item.texto;
      contenedor.append(enlace);
    });

  let hayAviso = false;
  try {
    hayAviso = sessionStorage.getItem(CLAVES.AVISO_DENEGADO) === '1';
    sessionStorage.removeItem(CLAVES.AVISO_DENEGADO);
  } catch (error) {
    /* se ignora */
  }
  if (hayAviso) {
    UI.modal({
      tipo: 'error',
      titulo: 'Acceso denegado',
      mensaje: `El perfil ${sesion.rol} no tiene permiso para abrir esa sección. Permaneces en tu vista.`
    });
  }
})(window.BB);
