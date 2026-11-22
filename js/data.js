/* Datos de prueba (simulan una base de datos). Evaluación 3 - BunnyBlue */
const BB_USERS = [
  { username: "camila", password: "user123",  name: "Camila Rojas", role: "user"  },
  { username: "andres", password: "admin123", name: "Andrés Soto",  role: "admin" }
];

/* ---- Productos y pedidos (hito 3). Se guardan en localStorage para compartirse entre vistas. ---- */
const BB_PRODUCTS = [
  { id: "P-101", name: "Tallarines",       price: 500,  stock: 300, estado: "Habilitado" },
  { id: "P-102", name: "Arroz grado 1",    price: 1200, stock: 200, estado: "Habilitado" },
  { id: "P-103", name: "Aceite 1 L",       price: 2300, stock: 150, estado: "Habilitado" },
  { id: "P-104", name: "Azúcar 1 kg",      price: 1190, stock: 180, estado: "Habilitado" },
  { id: "P-105", name: "Leche entera 1 L", price: 990,  stock: 250, estado: "Habilitado" },
  { id: "P-106", name: "Pan de molde",     price: 1890, stock: 90, estado: "Habilitado" },
  { id: "P-107", name: "Atún en lata",     price: 1490, stock: 120, estado: "Habilitado" },
  { id: "P-108", name: "Harina 1 kg",      price: 1090, stock: 140, estado: "Habilitado" },
  { id: "P-109", name: "Té 25 bolsitas",   price: 1590, stock: 0, estado: "Deshabilitado" },
  { id: "P-110", name: "Detergente 1 L",   price: 3290, stock: 60, estado: "Habilitado" }
];
const it = (p, qty) => ({ pid: p.id, name: p.name, price: p.price, qty });
const P = BB_PRODUCTS;
const BB_SEED_ORDERS = [
  { id: 1001, estado: "Ingresado", cliente: { nombre: "Ana Pérez Rojas", run: "16.452.318-7", telefono: "+56987654321", correo: "ana.perez@correo.cl", direccion: "Av. Lircay 1450, Talca" }, items: [it(P[0], 5), it(P[4], 2)] },
  { id: 1002, estado: "Ingresado", cliente: { nombre: "Pedro Núñez Soto", run: "9.876.543-3", telefono: "+56912345678", correo: "pedro.nunez@correo.cl", direccion: "Calle 2 Norte 830, Talca" }, items: [it(P[1], 10), it(P[2], 3)] },
  { id: 1003, estado: "Ingresado", cliente: { nombre: "María González Díaz", run: "18.234.567-9", telefono: "+56955512345", correo: "maria.gonzalez@correo.cl", direccion: "Pasaje Los Aromos 22, Talca" }, items: [it(P[5], 3), it(P[6], 4)] },
  { id: 1004, estado: "Ingresado", cliente: { nombre: "Luis Herrera Vega", run: "10.987.654-2", telefono: "+56944433221", correo: "luis.herrera@correo.cl", direccion: "1 Sur 1120, Talca" }, items: [it(P[3], 6), it(P[7], 2), it(P[8], 1)] },
  { id: 1005, estado: "Ingresado", cliente: { nombre: "Carla Muñoz Soto", run: "12.345.678-5", telefono: "+56933322110", correo: "carla.munoz@correo.cl", direccion: "Av. San Miguel 305, Talca" }, items: [it(P[9], 2), it(P[0], 10)] }
];
const BBData = {
  load(key, seed) {
    try { const v = JSON.parse(localStorage.getItem(key)); if (v) return v; } catch (e) { /* usa la semilla */ }
    localStorage.setItem(key, JSON.stringify(seed));
    return JSON.parse(JSON.stringify(seed));
  },
  /* Cantidad 0 => Deshabilitado automáticamente (RIU 6). */
  products() { return BBData.load("bb_products", BB_PRODUCTS).map(p => ({ ...p, estado: p.stock === 0 ? "Deshabilitado" : (p.estado || "Habilitado") })); },
  saveProducts(l) { localStorage.setItem("bb_products", JSON.stringify(l)); },
  enUso(id) { return BBData.orders().some(o => o.items.some(i => i.pid === id)); },
  pendientes() { return BBData.orders().filter(o => o.estado !== "Procesado"); },
  orders() { return BBData.load("bb_orders", BB_SEED_ORDERS); },
  saveOrders(o) { localStorage.setItem("bb_orders", JSON.stringify(o)); },
  nextId() { return Math.max(1000, ...BBData.orders().map(o => o.id)) + 1; },
  total(o) { return o.items.reduce((s, i) => s + i.price * i.qty, 0); },
  clp(n) { return "$" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
};
