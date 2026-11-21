/**
 * layout.js — Plantilla común HEAD / BODY / FOOT (RIU 1).
 * Genera el encabezado, el menú del perfil y el pie de página desde un único lugar,
 * por lo que son idénticos en todas las vistas.
 */
(function (BB) {
  'use strict';

  const { Auth, MENUS } = BB;
  const ENLACES_PIE = ['Servicio al cliente', 'Nuestra Empresa', 'Redes Sociales'];

  function menuDelPerfil(sesion) {
    // Sin sesión solo existe «Home», que lleva al login.
    return sesion ? MENUS[sesion.rol] : [{ id: 'home', texto: 'Home', ruta: 'login' }];
  }

  function itemsMenu(items, paginaActiva) {
    return items
      .map((item) => {
        const actual = item.id === paginaActiva ? ' aria-current="page"' : '';
        return `<li><a href="${Auth.url(item.ruta)}"${actual}>${item.texto}</a></li>`;
      })
      .join('');
  }

  function plantillaCabecera(sesion, items, paginaActiva) {
    const boton = sesion
      ? '<button type="button" class="btn btn--contorno" data-accion="cerrar-sesion">Cerrar sesión</button>'
      : '';
    return `
      <div class="cabecera__fila">
        <a class="marca" href="${Auth.url(sesion ? 'home' : 'login')}">
          <img class="marca__logo" src="${BB.raiz}img/logo.png" alt="" width="48" height="48">
          <span class="marca__nombre">BunnyBlue</span>
        </a>
        ${boton}
      </div>
      <nav class="menu" aria-label="Menú principal">
        <ul class="menu__lista">${itemsMenu(items, paginaActiva)}</ul>
      </nav>`;
  }

  function plantillaPie(items, paginaActiva) {
    const enlaces = ENLACES_PIE.map((texto) => `<li><a href="#" data-pendiente>${texto}</a></li>`).join('');
    return `
      <nav class="menu-pie" aria-label="Menú del pie de página">
        <ul class="menu-pie__lista">${itemsMenu(items, paginaActiva)}</ul>
      </nav>
      <div class="pie__inferior">
        <p class="pie__copyright">© 2026 BunnyBlue</p>
        <ul class="pie__enlaces">${enlaces}</ul>
      </div>`;
  }

  function renderizar() {
    const sesion = Auth.obtenerSesion();
    const items = menuDelPerfil(sesion);
    const paginaActiva = document.body.dataset.pagina;

    const cabecera = document.getElementById('sitio-cabecera');
    const pie = document.getElementById('sitio-pie');
    if (cabecera) cabecera.innerHTML = plantillaCabecera(sesion, items, paginaActiva);
    if (pie) pie.innerHTML = plantillaPie(items, paginaActiva);
  }

  document.addEventListener('click', (evento) => {
    if (evento.target.closest('[data-accion="cerrar-sesion"]')) {
      Auth.cerrarSesion();
      location.href = Auth.url('login');
    }
    // Los enlaces del pie aún no tienen destino: no deben saltar al inicio de la página.
    if (evento.target.closest('[data-pendiente]')) evento.preventDefault();
  });

  renderizar();
})(window.BB);
