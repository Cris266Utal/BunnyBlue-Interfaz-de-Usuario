/* Almacenamiento seguro: si el navegador bloquea localStorage/sessionStorage (modo privado, cookies bloqueadas,
   política del navegador) no se cae la aplicación; usa memoria y avisa en el Home (BBStore.persistent). */
const BBStore = (function () {
  function area(kind) {
    try { const s = window[kind + "Storage"], k = "__bb_probe"; s.setItem(k, "1"); s.removeItem(k); return s; } catch (e) { return null; }
  }
  function wrap(st) {
    const mem = {};
    return {
      get(k) { try { if (st) return st.getItem(k); } catch (e) { /* usa memoria */ } return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      set(k, v) { try { if (st) { st.setItem(k, v); return; } } catch (e) { /* usa memoria */ } mem[k] = String(v); },
      del(k) { try { if (st) st.removeItem(k); } catch (e) { /* nada */ } delete mem[k]; }
    };
  }
  const L = area("local"), S = area("session");
  return { local: wrap(L), session: wrap(S), persistent: !!(L && S) };
})();

/* Datos de prueba (simulan una base de datos). Evaluación 3 - BunnyBlue */

/* Ajustes de la demostración (se cambian aquí, en un solo lugar). */
const BB_CONFIG = {
  CLAVE: "1234",               // contraseña de prueba de todos los usuarios (user y admin)
  PEDIDOS_DE_EJEMPLO: false    // true: carga 5 pedidos de ejemplo; false: solo existen los pedidos que se ingresan en la vista Pedidos
};

const BB_USERS = [
  { username: "camila", name: "Camila Rojas", role: "user"  },
  { username: "andres", name: "Andrés Soto",  role: "admin" }
].map(u => ({ ...u, password: BB_CONFIG.CLAVE }));

/* ---- Catálogo de productos. Se guarda en localStorage para compartirse entre vistas. ----
   Los 10 primeros mantienen su posición (los usan los pedidos de ejemplo). Cada fila: [nombre, detalle, precio CLP, cantidad]. */
const BB_CATALOGO = [
  ["Tallarines", "Fideos 400 g", 500, 300], ["Arroz grado 1", "Arroz 1 kg", 1200, 200], ["Aceite 1 L", "Aceite vegetal", 2300, 150],
  ["Azúcar 1 kg", "Azúcar blanca", 1190, 180], ["Leche entera 1 L", "Leche entera", 990, 250], ["Pan de molde", "Pan blanco 500 g", 1890, 90],
  ["Atún en lata", "Atún en agua 170 g", 1490, 120], ["Harina 1 kg", "Harina de trigo", 1090, 140], ["Té 25 bolsitas", "Té negro", 1590, 0],
  ["Detergente 1 L", "Detergente líquido", 3290, 60],
  ["Tallarines integrales", "Fideos integrales 400 g", 890, 120], ["Tallo de apio", "Apio por unidad", 790, 80],
  ["Tallo de perejil", "Perejil en atado", 490, 70], ["Tallo de brócoli", "Brócoli por unidad", 1290, 60], ["Espagueti", "Fideos 400 g", 790, 160],
  ["Arroz integral", "Arroz 1 kg", 1590, 110], ["Lentejas 1 kg", "Legumbre seca", 1890, 95], ["Porotos negros 1 kg", "Legumbre seca", 2190, 80],
  ["Garbanzos 1 kg", "Legumbre seca", 2290, 75], ["Sal de mesa 1 kg", "Sal yodada", 590, 200], ["Aceite de oliva 500 ml", "Extra virgen", 5490, 45],
  ["Vinagre blanco 1 L", "Vinagre de alcohol", 990, 70], ["Salsa de tomate 200 g", "Salsa lista", 690, 150], ["Pasta de tomate 200 g", "Concentrado", 890, 100],
  ["Mayonesa 400 g", "Mayonesa clásica", 2490, 85], ["Ketchup 400 g", "Salsa de tomate", 1790, 90], ["Mermelada de frutilla 250 g", "Mermelada", 1990, 65],
  ["Café instantáneo 170 g", "Café soluble", 4990, 55], ["Cereal de avena 500 g", "Avena en hojuelas", 2790, 60], ["Galletas de agua", "Pack de 6 unidades", 1490, 130],
  ["Leche descremada 1 L", "Leche descremada", 950, 140], ["Leche sin lactosa 1 L", "Leche deslactosada", 1290, 100], ["Yogur natural 1 kg", "Yogur sin azúcar", 1890, 90],
  ["Mantequilla 250 g", "Mantequilla con sal", 2790, 80], ["Queso gauda laminado 250 g", "Queso laminado", 3490, 70], ["Huevos blancos x12", "Bandeja de 12", 3290, 150],
  ["Pan hallulla", "Por kilo", 1990, 100], ["Palta Hass", "Por kilo", 4990, 90], ["Plátano", "Por kilo", 1490, 140],
  ["Manzana roja", "Por kilo", 1790, 130], ["Tomate", "Por kilo", 1990, 120], ["Cebolla", "Por kilo", 990, 150],
  ["Papa", "Por kilo", 890, 200], ["Zanahoria", "Por kilo", 790, 160], ["Lechuga hidropónica", "Por unidad", 990, 100],
  ["Limón", "Por kilo", 1990, 85], ["Pollo entero", "Por kilo", 3290, 70], ["Carne molida 500 g", "Vacuno molido", 3990, 60],
  ["Jamón de pavo 200 g", "Jamón laminado", 2490, 75], ["Salchichas 500 g", "Pack de 10", 2190, 95], ["Agua mineral 1,5 L", "Sin gas", 890, 200],
  ["Bebida cola 2 L", "Bebida gaseosa", 1990, 180], ["Jugo de naranja 1 L", "Jugo néctar", 1490, 110], ["Jugo de manzana 1 L", "Jugo néctar", 1490, 100],
  ["Papel higiénico 12 rollos", "Doble hoja", 5990, 90], ["Lavaloza 750 ml", "Lavaloza líquido", 2490, 100], ["Cloro 1 L", "Cloro gel", 1290, 120],
  ["Shampoo 400 ml", "Cuidado personal", 3490, 70], ["Jabón de tocador x3", "Pack de 3", 1990, 110]
];
const BB_PRODUCTS = BB_CATALOGO.map(([name, desc, price, stock], i) => ({
  id: "P-" + (101 + i), name, desc, price, stock, estado: stock === 0 ? "Deshabilitado" : "Habilitado"
}));

const it = (p, qty) => ({ pid: p.id, name: p.name, price: p.price, qty });
const P = BB_PRODUCTS;
/* Pedidos de ejemplo (solo si BB_CONFIG.PEDIDOS_DE_EJEMPLO es true); sus totales coinciden con la Figura 62 del informe. */
const BB_EJEMPLOS = [
  { id: 1001, estado: "Ingresado", cliente: { nombre: "María González Pérez", run: "12.345.678-5", telefono: "+56912345678", correo: "maria.gonzalez@correo.cl", direccion: "Av. Libertad 123, Talca" }, items: [it(P[0], 5)] },
  { id: 1002, estado: "Ingresado", cliente: { nombre: "Pedro Núñez Soto", run: "9.876.543-3", telefono: "+56987654321", correo: "pedro.nunez@correo.cl", direccion: "Calle 2 Norte 830, Talca" }, items: [it(P[1], 10), it(P[2], 3)] },
  { id: 1003, estado: "Ingresado", cliente: { nombre: "Javiera Muñoz Díaz", run: "14.567.890-0", telefono: "+56955551212", correo: "j.munoz@correo.cl", direccion: "Pasaje Los Aromos 22, Talca" }, items: [it(P[1], 2), it(P[4], 5)] },
  { id: 1004, estado: "Ingresado", cliente: { nombre: "Luis Herrera Vega", run: "10.987.654-2", telefono: "+56944443030", correo: "lherrera@correo.cl", direccion: "1 Sur 1120, Talca" }, items: [it(P[3], 12), it(P[4], 18)] },
  { id: 1005, estado: "Ingresado", cliente: { nombre: "Ana Castillo Ríos", run: "17.654.321-3", telefono: "+56967672020", correo: "ana.castillo@correo.cl", direccion: "Av. San Miguel 305, Talca" }, items: [it(P[2], 5), it(P[4], 1)] }
];
const BB_SEED_ORDERS = BB_CONFIG.PEDIDOS_DE_EJEMPLO ? BB_EJEMPLOS : [];

const BB_DATA_VERSION = "2026-11-27-catalogo-" + (BB_CONFIG.PEDIDOS_DE_EJEMPLO ? "con" : "sin") + "-ejemplos";
const BBData = {
  load(key, seed) {
    try {
      if (BBStore.local.get("bb_ver") !== BB_DATA_VERSION) {
        BBStore.local.del("bb_products"); BBStore.local.del("bb_orders"); BBStore.local.set("bb_ver", BB_DATA_VERSION);
      }
      const v = JSON.parse(BBStore.local.get(key)); if (v) return v;
    } catch (e) { /* usa la semilla */ }
    BBStore.local.set(key, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  },
  /* Cantidad 0 => Deshabilitado automáticamente (RIU 6). */
  products() { return BBData.load("bb_products", BB_PRODUCTS).map(p => ({ ...p, estado: p.stock === 0 ? "Deshabilitado" : (p.estado || "Habilitado") })); },
  saveProducts(l) { BBStore.local.set("bb_products", JSON.stringify(l)); },
  enUso(id) { return BBData.orders().some(o => o.items.some(i => i.pid === id)); },
  pendientes() { return BBData.orders().filter(o => o.estado !== "Procesado"); },
  orders() { return BBData.load("bb_orders", BB_SEED_ORDERS); },
  saveOrders(o) { BBStore.local.set("bb_orders", JSON.stringify(o)); },
  nextId() { return Math.max(1000, ...BBData.orders().map(o => o.id)) + 1; },
  total(o) { return o.items.reduce((s, i) => s + i.price * i.qty, 0); },
  clp(n) { return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); },
  /* Total con espacio tras el signo, como en los mockups: «$ 2.500». */
  clpTotal(n) { return "$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); },
  /* Teléfono para mostrar: +56 9 1234 5678. */
  tel(t) { const d = String(t).replace(/\D/g, ""); return d.length === 11 ? `+${d.slice(0, 2)} ${d[2]} ${d.slice(3, 7)} ${d.slice(7)}` : t; }
};
