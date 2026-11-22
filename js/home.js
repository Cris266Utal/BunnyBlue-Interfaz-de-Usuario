/* Home de bienvenida (RIU 3): nombre, perfil y tarjetas de acceso según el perfil. */
(function () {
  const s = BB.session();
  document.getElementById("saludo").textContent = "Bienvenido/a, " + s.name;
  document.getElementById("perfil").textContent = "Perfil: " + s.role;
  const pend = BBData.pendientes().length;
  const CARDS = {
    user: [["Pedidos", "Registra un pedido nuevo con los datos del cliente y su detalle.", "pedidos.html", "Nuevo pedido"],
           ["Pedido Ingresado", "Revisa, edita o elimina los pedidos ya enviados.", "pedido-ingresado.html", pend + " pedidos ingresados"]],
    admin: [["Productos", "Administra el catálogo: ingresa, edita y elimina productos.", "productos.html", BBData.products().length + " productos"],
            ["Procesamiento de Pedido", "Da el visto bueno y envía los pedidos a su destino.", "procesamiento.html", pend + " pedidos pendientes"]]
  };
  CARDS[s.role].forEach(([t, d, href, meta]) => {
    const a = document.createElement("a"); a.className = "card-link"; a.href = href;
    [["h2", t], ["p", d], ["span", meta]].forEach(([tag, txt]) => { const e = document.createElement(tag); e.textContent = txt; a.appendChild(e); });
    document.getElementById("cards").appendChild(a);
  });
})();
