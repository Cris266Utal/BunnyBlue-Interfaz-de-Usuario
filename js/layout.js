/* Plantilla común HEAD / BODY / FOOT (RIU 1) y modal estándar. */
(function () {
  const MENUS = {
    user:  [["Home", "home-user.html"], ["Pedidos", "pedidos.html"], ["Pedido Ingresado", "pedido-ingresado.html"]],
    admin: [["Home", "home-admin.html"], ["Productos", "productos.html"], ["Procesamiento de Pedido", "procesamiento.html"]]
  };
  const inPages = location.pathname.includes("/pages/");
  const toIndex = inPages ? "../index.html" : "index.html";
  const toPages = inPages ? "" : "pages/";
  const logo = (inPages ? "../" : "") + "assets/logo.png";
  const s = BB.session();
  const active = document.body.dataset.page || "";

  /* Sin sesión el menú solo tiene «Home», que corresponde al inicio de sesión (RIU 1 y 2). */
  function menu(cls) {
    const items = s
      ? MENUS[s.role].map(([label, href]) => [label, toPages + href, href === active])
      : [["Home", toIndex, true]];
    const links = items.map(([label, href, on]) =>
      `<a href="${href}"${on ? ' class="activo" aria-current="page"' : ""}>${label}</a>`).join("");
    return `<nav class="${cls}" aria-label="Menú principal">${links}</nav>`;
  }

  document.getElementById("head").outerHTML =
    `<header class="head"><div class="head-fila">
       <a class="marca" href="${s ? toPages + BB.home(s.role) : toIndex}"><img class="logo" src="${logo}" alt="" width="48" height="48">BunnyBlue</a>
       ${s ? '<button class="btn-salir" id="btn-salir" type="button">Cerrar sesión</button>' : ""}
     </div>${menu("menu")}</header>`;
  document.getElementById("foot").outerHTML =
    `<footer class="foot">${menu("menu-foot")}
       <div class="foot-fila"><span>© 2026 BunnyBlue</span>
       <span class="foot-links"><a href="#">Servicio al cliente</a><a href="#">Nuestra Empresa</a><a href="#">Redes Sociales</a></span></div></footer>`;
  document.querySelectorAll(".foot-links a").forEach(a => a.addEventListener("click", e => e.preventDefault()));
  const out = document.getElementById("btn-salir");
  if (out) out.addEventListener("click", BB.logout);

  /* Modal estándar: BB.modal({ title, text, list, tone: "red|redx|green|orange|blue", buttons: [{label, kind, onClick}], onClose, auto })
     - tone "redx" muestra la ✕ (cuenta bloqueada); "red" muestra «!».
     - buttons: [] y auto: ms => aviso sin botones que se cierra solo. */
  BB.modal = function ({ title, text, list, tone = "blue", buttons, onClose, auto }) {
    const ov = document.createElement("div");
    ov.className = "overlay";
    const sym = { red: "!", redx: "✕", green: "✓", orange: "!", blue: "i" }[tone];
    const cls = tone === "redx" ? "red" : tone;
    ov.innerHTML = `<div class="modal${auto ? " compacto" : ""}" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-d">
      <div class="m-icono ${cls}" aria-hidden="true">${sym}</div>
      <h2 id="m-t"></h2><div id="m-d"></div><div class="m-btns"></div></div>`;
    ov.querySelector("h2").textContent = title;
    const d = ov.querySelector("#m-d");
    if (text) { const p = document.createElement("p"); p.textContent = text; d.appendChild(p); }
    if (list && list.length) {
      const ul = document.createElement("ul");
      list.forEach(t => { const li = document.createElement("li"); li.textContent = "• " + t; ul.appendChild(li); });
      d.appendChild(ul);
    }
    const close = fn => () => { ov.remove(); if (fn) fn(); };
    const defs = buttons || (auto ? [] : [{ label: "Aceptar", onClick: onClose }]);
    defs.forEach(b => {
      const el = document.createElement("button");
      el.type = "button"; el.className = "btn " + (b.kind || ""); el.textContent = b.label;
      el.addEventListener("click", close(b.onClick));
      ov.querySelector(".m-btns").appendChild(el);
    });
    if (!defs.length) ov.querySelector(".m-btns").remove();
    ov.addEventListener("keydown", e => { if (e.key === "Escape" && defs.length) ov.remove(); });
    document.body.appendChild(ov);
    const first = ov.querySelector("button"); if (first) first.focus();
    if (auto) setTimeout(close(onClose), auto);
  };
})();
