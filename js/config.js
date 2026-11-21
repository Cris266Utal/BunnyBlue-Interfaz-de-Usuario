/**
 * config.js — Datos y constantes compartidas por todo el sistema BunnyBlue.
 * Se carga primero en todas las páginas y publica el espacio de nombres global BB.
 */
(function (global) {
  'use strict';

  // Rutas relativas a la raíz del proyecto (funcionan en file://, Live Server y GitHub Pages).
  const RUTAS = Object.freeze({
    login: 'index.html',
    home: 'pages/home.html',
    pedidos: 'pages/pedidos.html',
    pedidoIngresado: 'pages/pedido-ingresado.html',
    productos: 'pages/productos.html',
    procesamiento: 'pages/procesamiento-pedido.html'
  });

  // RIU 8 y RIU 9: cada perfil tiene exactamente tres opciones de menú.
  const MENUS = Object.freeze({
    user: Object.freeze([
      { id: 'home', texto: 'Home', ruta: 'home' },
      { id: 'pedidos', texto: 'Pedidos', ruta: 'pedidos' },
      { id: 'pedidoIngresado', texto: 'Pedido Ingresado', ruta: 'pedidoIngresado' }
    ]),
    admin: Object.freeze([
      { id: 'home', texto: 'Home', ruta: 'home' },
      { id: 'productos', texto: 'Productos', ruta: 'productos' },
      { id: 'procesamiento', texto: 'Procesamiento de Pedido', ruta: 'procesamiento' }
    ])
  });

  // Usuarios de demostración (credenciales de prueba documentadas en el README).
  // Es un prototipo de frontend: en un sistema real esto vive en un servidor.
  const USUARIOS = Object.freeze([
    { usuario: 'camila', clave: 'user123', nombre: 'Camila Rojas', rol: 'user' },
    { usuario: 'andres', clave: 'admin123', nombre: 'Andrés Soto', rol: 'admin' }
  ]);

  global.BB = {
    RUTAS,
    MENUS,
    USUARIOS,
    MAX_INTENTOS: 3,
    CLAVES: Object.freeze({
      SESION: 'bb_sesion',
      INTENTOS: 'bb_intentos',
      BLOQUEADOS: 'bb_bloqueados',
      AVISO_DENEGADO: 'bb_aviso_denegado'
    })
  };
})(window);
