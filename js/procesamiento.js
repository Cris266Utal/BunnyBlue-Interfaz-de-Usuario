/* Procesamiento de Pedido en 2 pasos (RIU 7): selección única -> visto bueno y destino -> confirmación. */
(function () {
  const $ = id => document.getElementById(id);
  const DEST = { "Sí": ["Producción", "Bodega", "Despacho"], "No": ["Revisión"] };
  let sel = null;

  function paso(n) {
    $("paso1").hidden = n !== 1; $("paso2").hidden = n !== 2;
    $("paso").textContent = n === 1 ? "Paso 1 de 2: selecciona el pedido a procesar." : "Paso 2 de 2: da el visto bueno y elige el destino.";
  }
  function renderCards() {
    const box = $("tarjetas"), list = BBData.pendientes(); box.textContent = "";
    if (!list.some(o => o.id === sel)) sel = null;
    $("vacio").hidden = list.length > 0;
    list.forEach(o => {
      const card = document.createElement("label"); card.className = "pcard" + (o.id === sel ? " sel" : "");
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = o.id === sel; cb.setAttribute("aria-label", "Seleccionar pedido #" + o.id);
      const n = o.items.reduce((s, i) => s + i.qty, 0);
      [["h2", "Pedido #" + o.id], ["p", o.cliente.nombre], ["p", n + " unidades · " + o.items.length + " productos"], ["p", BBData.clp(BBData.total(o))]].forEach(([t, x], i) => {
        const e = document.createElement(t); e.textContent = x; if (i === 3) e.className = "tot"; card.appendChild(e);
      });
      const ok = document.createElement("span"); ok.className = "ok"; ok.textContent = "✓ Seleccionado"; card.append(cb, ok);
      cb.addEventListener("change", () => { sel = sel === o.id ? null : o.id; renderCards(); const c = box.querySelector("input:checked"); if (c) c.focus(); });
      box.appendChild(card);
    });
    $("procesar").disabled = sel === null;
  }
  $("procesar").addEventListener("click", () => {
    const o = BBData.pendientes().find(x => x.id === sel); if (!o) { renderCards(); return; }
    const dl = $("datos"); dl.textContent = "";
    [["Pedido", "#" + o.id], ["Nombre", o.cliente.nombre], ["RUN", o.cliente.run], ["Teléfono", o.cliente.telefono], ["Correo", o.cliente.correo], ["Dirección", o.cliente.direccion]].forEach(([k, v]) => {
      const dt = document.createElement("dt"), dd = document.createElement("dd"); dt.textContent = k; dd.textContent = v; dl.append(dt, dd);
    });
    const tb = $("det"); tb.textContent = "";
    o.items.forEach(i => {
      const tr = document.createElement("tr");
      [i.qty, i.name, BBData.clp(i.price), BBData.clp(i.price * i.qty)].forEach(v => { const td = document.createElement("td"); td.textContent = v; tr.appendChild(td); });
      tb.appendChild(tr);
    });
    $("total").textContent = BBData.clp(BBData.total(o));
    $("vb").value = ""; fillDest(""); paso(2); $("vb").focus();
  });
  function fillDest(vb) {
    const d = $("dest"); d.textContent = "";
    const first = document.createElement("option"); first.value = ""; first.textContent = vb ? "Seleccionar…" : "Primero elige el visto bueno"; d.appendChild(first);
    (DEST[vb] || []).forEach(t => { const o = document.createElement("option"); o.textContent = t; d.appendChild(o); });
    d.disabled = !vb; check();
  }
  const check = () => { $("aceptar").disabled = !($("vb").value && $("dest").value); };
  $("vb").addEventListener("change", () => fillDest($("vb").value));
  $("dest").addEventListener("change", check);
  $("volver").addEventListener("click", () => { paso(1); renderCards(); });
  $("aceptar").addEventListener("click", () => {
    const orders = BBData.orders(), o = orders.find(x => x.id === sel); if (!o) return;
    const vb = $("vb").value, dest = $("dest").value;
    Object.assign(o, { estado: "Procesado", vistoBueno: vb, destino: dest, procesadoPor: BB.session().username, fecha: new Date().toISOString() });
    BBData.saveOrders(orders);
    BB.modal({ title: `Pedido #${o.id} procesado`, text: `Visto bueno: ${vb}. Enviado a: ${dest}.`, tone: "green", onClose: () => { sel = null; paso(1); renderCards(); } });
  });
  paso(1); renderCards();
})();
