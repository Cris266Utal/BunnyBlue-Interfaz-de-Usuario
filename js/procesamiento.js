/* Procesamiento de Pedido en 2 pasos (RIU 7). Opciones según el requerimiento y las Figuras 75 a 79:
   VISTO BUENO = Sí / No / Pendiente; ENVIAR A = Producción / Bodega (se habilita al elegir el visto bueno). */
(function () {
  const $ = id => document.getElementById(id);
  let sel = null;

  const paso = n => { $("paso1").hidden = n !== 1; $("paso2").hidden = n !== 2; };

  function renderLista() {
    const box = $("lista"), list = BBData.pendientes(); box.textContent = "";
    if (!list.some(o => o.id === sel)) sel = null;
    $("vacio").hidden = list.length > 0;
    list.forEach(o => {
      const row = document.createElement("label"); row.className = "pfila" + (o.id === sel ? " sel" : "");
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = o.id === sel;
      cb.setAttribute("aria-label", "Seleccionar pedido #" + o.id);
      const txt = document.createElement("div");
      const h = document.createElement("h2"); h.textContent = "Pedido #" + o.id;
      const p = document.createElement("p"); p.textContent = `Cliente: ${o.cliente.nombre} · Total: ${BBData.clp(BBData.total(o))}`;
      txt.append(h, p); row.append(cb, txt);
      cb.addEventListener("change", () => { sel = sel === o.id ? null : o.id; renderLista(); const c = box.querySelector("input:checked"); if (c) c.focus(); });
      box.appendChild(row);
    });
    $("procesar").disabled = sel === null;
  }

  $("procesar").addEventListener("click", () => {
    const o = BBData.pendientes().find(x => x.id === sel); if (!o) { renderLista(); return; }
    const c = o.cliente;
    $("d-nombre").value = c.nombre; $("d-run").value = c.run; $("d-telefono").value = BBData.tel(c.telefono);
    $("d-correo").value = c.correo; $("d-direccion").value = c.direccion;
    const tb = $("det"); tb.textContent = "";
    o.items.forEach(i => {
      const tr = document.createElement("tr");
      [i.qty, i.name, BBData.clp(i.price), BBData.clp(i.price * i.qty)].forEach((v, k) => {
        const td = document.createElement("td"); td.textContent = v; if (k > 1) td.className = "ro"; tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    $("total").textContent = "Total: " + BBData.clpTotal(BBData.total(o));
    resetSelectores(); paso(2); $("vb").focus();
  });

  function resetSelectores() {
    $("vb").selectedIndex = -1; $("vb").classList.add("vacio");
    $("dest").selectedIndex = -1; $("dest").classList.add("vacio"); $("dest").disabled = true;
    $("campo-dest").classList.add("dis"); check();
  }
  /* «Aceptar» solo se habilita con ambos selectores completos. */
  function check() { $("aceptar").disabled = !($("vb").value && $("dest").value); }

  $("vb").addEventListener("change", () => {
    $("vb").classList.toggle("vacio", !$("vb").value);
    $("dest").disabled = !$("vb").value; $("campo-dest").classList.toggle("dis", !$("vb").value);
    check();
  });
  $("dest").addEventListener("change", () => { $("dest").classList.toggle("vacio", !$("dest").value); check(); });
  $("volver").addEventListener("click", () => { paso(1); renderLista(); });
  $("aceptar").addEventListener("click", () => {
    const orders = BBData.orders(), o = orders.find(x => x.id === sel); if (!o) return;
    const vb = $("vb").value, dest = $("dest").value;
    Object.assign(o, { estado: "Procesado", vistoBueno: vb, destino: dest, procesadoPor: BB.session().username, fecha: new Date().toISOString() });
    BBData.saveOrders(orders);
    BB.modal({ title: "Pedido procesado", text: `Pedido #${o.id} procesado correctamente.\nVisto bueno: ${vb} · Enviado a: ${dest}`, tone: "green", onClose: () => { sel = null; paso(1); renderLista(); } });
  });
  paso(1); renderLista();
})();
