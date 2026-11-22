/* Plantilla común HEAD / BODY / FOOT (RIU 1) y modal estándar. */
(function () {
  const MENUS = {
    user:  [["Home", "home-user.html"], ["Pedidos", "pedidos.html"], ["Pedido Ingresado", "pedido-ingresado.html"]],
    admin: [["Home", "home-admin.html"], ["Productos", "productos.html"], ["Procesamiento de Pedido", "procesamiento.html"]]
  };
  const inPages = location.pathname.includes("/pages/");
  const toIndex = inPages ? "../index.html" : "index.html";
  const toPages = inPages ? "" : "pages/";
  const s = BB.session();
  const active = document.body.dataset.page || "";

  function menu(cls) {
    if (!s) return "";
    const items = MENUS[s.role].map(([label, href]) =>
      `<a href="${toPages}${href}"${href === active ? ' class="activo" aria-current="page"' : ""}>${label}</a>`).join("");
    return `<nav class="${cls}" aria-label="Menú ${s.role}">${items}</nav>`;
  }

  document.getElementById("head").outerHTML =
    `<header class="head"><div class="head-fila">
       <a class="marca" href="${s ? toPages + BB.home(s.role) : toIndex}"><span class="logo" aria-hidden="true">BB</span>BunnyBlue</a>
       ${s ? '<button class="btn-salir" id="btn-salir" type="button">Cerrar sesión</button>' : ""}
     </div>${menu("menu")}</header>`;
  document.getElementById("foot").outerHTML =
    `<footer class="foot">${menu("menu-foot")}
       <div class="foot-fila"><span>© 2026 BunnyBlue. Todos los derechos reservados.</span>
       <span class="foot-links"><a href="#">Términos</a><a href="#">Privacidad</a><a href="#">Ayuda</a></span></div></footer>`;
  const out = document.getElementById("btn-salir");
  if (out) out.addEventListener("click", BB.logout);

  /* Modal estándar: BB.modal({ title, text, tone: "red|green|orange|blue", buttons: [{label, kind, onClick}], onClose }) */
  BB.modal = function ({ title, text, tone = "blue", buttons, onClose }) {
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.innerHTML = `<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-d">
      <div class="m-icono ${tone}" aria-hidden="true">${{ red: "✕", green: "✓", orange: "!", blue: "i" }[tone]}</div>
      <h2 id="m-t"></h2><p id="m-d"></p><div class="m-btns"></div></div>`;
    ov.querySelector("h2").textContent = title;
    ov.querySelector("p").textContent = text;
    const close = fn => () => { ov.remove(); if (fn) fn(); };
    (buttons || [{ label: "Aceptar", onClick: onClose }]).forEach(b => {
      const el = document.createElement("button");
      el.type = "button"; el.className = "btn " + (b.kind || ""); el.textContent = b.label;
      el.addEventListener("click", close(b.onClick));
      ov.querySelector(".m-btns").appendChild(el);
    });
    ov.addEventListener("keydown", e => { if (e.key === "Escape") ov.remove(); });
    document.body.appendChild(ov);
    ov.querySelector("button").focus();
  };
})();
