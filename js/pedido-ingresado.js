/* Vista Pedido Ingresado (RIU 5): selección única, editar y eliminar. */
(function () {
  const $ = id => document.getElementById(id);
  const tbody = $("lista");
  let sel = null;
  function render(focusId) {
    const orders = BBData.pendientes();
    tbody.textContent = ""; $("vacio").hidden = orders.length > 0;
    orders.forEach(o => {
      const tr = document.createElement("tr"); if (o.id === sel) tr.className = "sel";
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = o.id === sel; cb.dataset.id = o.id;
      cb.setAttribute("aria-label", "Seleccionar pedido #" + o.id);
      [cb, "#" + o.id, o.cliente.nombre, o.cliente.correo, o.cliente.telefono, BBData.clp(BBData.total(o))].forEach((c, i) => {
        const td = document.createElement("td");
        if (typeof c === "string") td.textContent = c; else td.appendChild(c);
        if (i === 5) td.className = "num";
        tr.appendChild(td);
      });
      const toggle = fromCb => { sel = sel === o.id ? null : o.id; render(fromCb ? o.id : null); };
      cb.addEventListener("change", () => toggle(true));
      tr.addEventListener("click", e => { if (e.target !== cb) toggle(false); });
      tbody.appendChild(tr);
    });
    $("editar").disabled = $("eliminar").disabled = sel === null;
    if (focusId) tbody.querySelector(`[data-id="${focusId}"]`).focus();
  }
  $("editar").addEventListener("click", () => { location.href = "pedidos.html?editar=" + sel; });
  $("eliminar").addEventListener("click", () => {
    const o = BBData.orders().find(x => x.id === sel);
    BB.modal({
      title: `¿Eliminar pedido #${o.id}?`, tone: "orange",
      text: `Se eliminará el pedido #${o.id} de ${o.cliente.nombre} por ${BBData.clp(BBData.total(o))}. Esta acción no se puede deshacer.`,
      buttons: [{ label: "Cancelar", kind: "sec" }, { label: "Eliminar", kind: "peligro", onClick: () => {
        BBData.saveOrders(BBData.orders().filter(x => x.id !== o.id)); sel = null; render();
        BB.modal({ title: `Pedido #${o.id} eliminado correctamente`, text: "El pedido ya no aparece en el listado.", tone: "green" });
      } }]
    });
  });
  render();
})();
