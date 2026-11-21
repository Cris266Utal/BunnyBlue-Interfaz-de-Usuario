/**
 * auth.js — Sesión, login con bloqueo (RIU 2) y control de acceso por perfil (RIU 3, 8, 9 y 10).
 * Se carga en el <head>: el guardián de ruta se ejecuta antes de pintar la página.
 */
(function (BB) {
  'use strict';

  const { RUTAS, MENUS, USUARIOS, MAX_INTENTOS, CLAVES } = BB;

  // Raíz del proyecto calculada desde la ubicación de este script (js/auth.js → ../).
  const RAIZ = new URL('../', document.currentScript.src).href;

  /* ---------- Almacenamiento seguro (puede fallar en modo privado) ---------- */
  function leer(storage, clave, porDefecto) {
    try {
      const valor = storage.getItem(clave);
      return valor ? JSON.parse(valor) : porDefecto;
    } catch (error) {
      return porDefecto;
    }
  }

  function escribir(storage, clave, valor) {
    try {
      storage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      /* sin almacenamiento disponible: se ignora */
    }
  }

  function url(ruta) {
    return RAIZ + RUTAS[ruta];
  }

  function normalizar(usuario) {
    return String(usuario || '').trim().toLowerCase();
  }

  function buscarUsuario(usuario) {
    const buscado = normalizar(usuario);
    return USUARIOS.find((u) => u.usuario === buscado) || null;
  }

  /* ---------- Sesión (sessionStorage: se pierde al cerrar la pestaña) ---------- */
  function obtenerSesion() {
    const sesion = leer(sessionStorage, CLAVES.SESION, null);
    return sesion && MENUS[sesion.rol] ? sesion : null;
  }

  function iniciarSesion(usuario) {
    escribir(sessionStorage, CLAVES.SESION, {
      usuario: usuario.usuario,
      nombre: usuario.nombre,
      rol: usuario.rol
    });
  }

  function cerrarSesion() {
    try {
      sessionStorage.removeItem(CLAVES.SESION);
    } catch (error) {
      /* se ignora */
    }
  }

  /* ---------- Bloqueo por intentos fallidos (RIU 2) ---------- */
  function estaBloqueado(usuario) {
    return Boolean(leer(localStorage, CLAVES.BLOQUEADOS, {})[normalizar(usuario)]);
  }

  function reiniciarBloqueos() {
    try {
      localStorage.removeItem(CLAVES.INTENTOS);
      localStorage.removeItem(CLAVES.BLOQUEADOS);
    } catch (error) {
      /* se ignora */
    }
  }

  /**
   * Valida usuario y contraseña (primero el usuario, después la contraseña).
   * @returns {{estado: 'ok'|'no_existe'|'clave_incorrecta'|'bloqueado', usuario?: object, restantes?: number}}
   */
  function intentarLogin(usuarioIngresado, clave) {
    const usuario = buscarUsuario(usuarioIngresado);
    if (!usuario) return { estado: 'no_existe' };
    if (estaBloqueado(usuario.usuario)) return { estado: 'bloqueado', usuario };

    const intentos = leer(localStorage, CLAVES.INTENTOS, {});

    if (usuario.clave === clave) {
      delete intentos[usuario.usuario];
      escribir(localStorage, CLAVES.INTENTOS, intentos);
      iniciarSesion(usuario);
      return { estado: 'ok', usuario };
    }

    intentos[usuario.usuario] = (intentos[usuario.usuario] || 0) + 1;
    escribir(localStorage, CLAVES.INTENTOS, intentos);

    if (intentos[usuario.usuario] >= MAX_INTENTOS) {
      const bloqueados = leer(localStorage, CLAVES.BLOQUEADOS, {});
      bloqueados[usuario.usuario] = true;
      escribir(localStorage, CLAVES.BLOQUEADOS, bloqueados);
      return { estado: 'bloqueado', usuario };
    }
    return {
      estado: 'clave_incorrecta',
      usuario,
      restantes: MAX_INTENTOS - intentos[usuario.usuario]
    };
  }

  /* ---------- Guardián de rutas (RIU 10) ---------- */
  function redirigir(destino) {
    document.documentElement.hidden = true; // evita mostrar contenido del otro perfil
    location.replace(destino);
  }

  /**
   * Lee <meta name="bb-roles" content="user,admin|user|admin|public"> y decide:
   *  - sin sesión            → vuelve al login
   *  - perfil no autorizado  → vuelve a su Home con aviso «Acceso denegado»
   *  - página pública con sesión activa → va al Home
   */
  function protegerPagina() {
    const meta = document.querySelector('meta[name="bb-roles"]');
    if (!meta) return;

    const permitidos = meta.content.split(',').map((rol) => rol.trim());
    const sesion = obtenerSesion();

    if (permitidos.includes('public')) {
      if (sesion) redirigir(url('home'));
      return;
    }
    if (!sesion) {
      redirigir(url('login'));
      return;
    }
    if (!permitidos.includes(sesion.rol)) {
      try {
        sessionStorage.setItem(CLAVES.AVISO_DENEGADO, '1');
      } catch (error) {
        /* se ignora */
      }
      redirigir(url('home'));
    }
  }

  protegerPagina();
  // Si el navegador restaura la página desde caché (botón «Atrás» tras cerrar sesión), se revalida.
  window.addEventListener('pageshow', (evento) => {
    if (evento.persisted) protegerPagina();
  });

  BB.raiz = RAIZ;
  BB.Auth = {
    url,
    buscarUsuario,
    obtenerSesion,
    cerrarSesion,
    intentarLogin,
    estaBloqueado,
    reiniciarBloqueos
  };
})(window.BB);
