/* Home de bienvenida (RIU 3): nombre, perfil y tarjetas de acceso según el perfil (Figuras 54 y 55). */
(function () {
  const s = BB.session();
  document.getElementById("saludo").textContent = "Bienvenido/a, " + s.name;
  const perfil = document.getElementById("perfil");
  perfil.textContent = "Perfil: ";
  const b = document.createElement("strong"); b.textContent = s.role; perfil.appendChild(b);
  const CARDS = {
    user: [["Pedidos", "pedidos.html"], ["Pedido Ingresado", "pedido-ingresado.html"]],
    admin: [["Productos", "productos.html"], ["Procesamiento de Pedido", "procesamiento.html"]]
  };
  CARDS[s.role].forEach(([t, href]) => {
    const a = document.createElement("a"); a.className = "card-link"; a.href = href; a.textContent = t;
    document.getElementById("cards").appendChild(a);
  });
})();
