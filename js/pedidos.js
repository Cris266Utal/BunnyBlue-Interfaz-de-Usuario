/* Vista Pedidos (RIU 4): datos del cliente, detalle con cálculo en CLP, validaciones y modales. */
(function () {
  const $ = id => document.getElementById(id);
  const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const editId = Number(new URLSearchParams(location.search).get("editar")) || 0;
  const order = editId ? BBData.orders().find(o => o.id === editId) : null;
  if (editId && (!order || order.estado === "Procesado")) { location.replace("pedido-ingresado.html"); return; }

  const FIELDS = [
    { id: "nombre", label: "NOMBRE COMPLETO", ok: BBV.nombre, hint: "Ingresa nombre y apellido." },
    { id: "run", label: "RUN", ok: BBV.run, hint: "RUN inválido. Ej.: 12.345.678-5" },
    { id: "telefono", label: "TELÉFONO", ok: BBV.tel, hint: "Formato: +56912345678" },
    { id: "correo", label: "CORREO", ok: BBV.correo, hint: "Correo inválido. Ej.: nombre@correo.cl" },
    { id: "direccion", label: "DIRECCIÓN", ok: BBV.dir, hint: "Ingresa calle y número." }
  ];
  const val = f => $(f.id).value.trim();
  const status = f => !val(f) ? "empty" : f.ok(val(f)) ? "ok" : "bad";
  const datosOk = () => FIELDS.every(f => status(f) === "ok");
  const lista = a => a.length > 1 ? a.slice(0, -1).join(", ") + " y " + a[a.length - 1] : a.join("");

  let rows = [], locked = false, intentado = false;
  const blank = () => ({ qty: "", text: "", product: null });
  const isBlank = r => !r.product && !r.text.trim() && !String(r.qty).trim();
  const qtyOk = q => /^\d+$/.test(String(q)) && +q >= 1 && +q <= 100;

  /* ---- datos del cliente ---- */
  function showErrors() {
    FIELDS.forEach(f => {
      const st = status(f), bad = st !== "ok" && (intentado || st === "bad" && document.activeElement !== $(f.id));
      $(f.id).parentElement.classList.toggle("error", bad);
      $(f.id).parentElement.classList.toggle("ok", st === "ok");
      $(f.id).setAttribute("aria-invalid", bad);
      $("n-" + f.id).textContent = bad ? "! " + (st === "empty" ? "Campo obligatorio" : f.hint) : "";
    });
  }
  function lock(v) {
    locked = v; FIELDS.forEach(f => $(f.id).readOnly = v); renderBar();
    if (!v) $("nombre").focus();
  }
  function renderBar() {
    $("badge").hidden = !datosOk();
    const bar = $("acciones"); bar.textContent = "";
    const add = (t, cls, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = "btn " + cls; b.textContent = t; b.addEventListener("click", fn); bar.appendChild(b); };
    if (editId) { add("Cancelar", "sec", () => location.href = "pedido-ingresado.html"); add("Borrar", "peligro", borrar); add("Guardar cambios", "", enviar); }
    else { if (locked) add("Editar datos", "sec", () => lock(false)); if (datosOk()) add("Borrar", "peligro", borrar); add("Enviar", "", enviar); }
  }
  $("card-datos").addEventListener("input", () => { showErrors(); renderBar(); });
  $("card-datos").addEventListener("focusout", () => setTimeout(() => {
    if ($("card-datos").contains(document.activeElement)) return;
    $("run").value = BBV.run($("run").value) ? BBV.formatRun($("run").value) : $("run").value;
    showErrors(); renderBar();
    if (!editId && datosOk()) lock(true);
  }, 0));

  /* ---- detalle del pedido ---- */
  const tbody = $("filas");
  function paint(tr) {
    const r = tr._r, p = r.product, vu = tr.querySelector(".vu"), vv = tr.querySelector(".vv");
    tr.classList.toggle("tiene", !!p);
    vu.textContent = p ? BBData.clp(p.price) : ""; vv.textContent = p && qtyOk(r.qty) ? BBData.clp(p.price * r.qty) : "";
    if (!p && tr === tbody.firstElementChild) { const n = document.createElement("span"); n.className = "dis"; n.textContent = "deshabilitado"; vu.appendChild(n); }
  }
  function rowEl(r) {
    const tr = document.createElement("tr"); tr._r = r;
    tr.innerHTML = '<td><input class="qty" type="number" min="0" max="100" inputmode="numeric" aria-label="Cantidad"></td>' +
      '<td class="prod"><input class="buscar" type="text" autocomplete="off" placeholder="" aria-label="Producto"><ul class="sug" role="listbox" hidden></ul></td>' +
      '<td class="ro vu"></td><td class="ro vv"></td>';
    tr.querySelector(".qty").value = r.qty; tr.querySelector(".buscar").value = r.text;
    paint(tr); return tr;
  }
  function ensureBlank() { if (!isBlank(rows[rows.length - 1])) { const r = blank(); rows.push(r); tbody.appendChild(rowEl(r)); } }
  const pad = list => { while (list.length < 5) list.push(blank()); return list; };
  function setRows(list) { rows = pad(list); tbody.textContent = ""; rows.forEach(r => tbody.appendChild(rowEl(r))); ensureBlank(); refresh(); }

  function issues() {
    let qtyBad = false, prodBad = false, any = 0;
    rows.forEach(r => { if (isBlank(r)) return; if (!r.product) prodBad = true; else if (!qtyOk(r.qty)) qtyBad = true; else any++; });
    const m = [];
    if (qtyBad) m.push("La cantidad debe ser un número entero mayor a 0 (máximo 100).");
    if (prodBad) m.push("No puedes dejar filas con producto vacío. Elige un producto de la lista.");
    if (!any && intentado) m.push("Debes agregar al menos 1 producto para enviar el pedido.");
    return m;
  }
  const lines = () => rows.filter(r => r.product && qtyOk(r.qty)).map(r => ({ pid: r.product.id, name: r.product.name, price: r.product.price, qty: +r.qty }));
  const total = () => lines().reduce((s, l) => s + l.price * l.qty, 0);
  function refresh() {
    ensureBlank();
    $("total").textContent = "Total: " + BBData.clpTotal(total());
    $("reglas").hidden = !rows.some(r => r.product);
    if (tbody.firstElementChild) paint(tbody.firstElementChild);
    const m = issues(), box = $("avisos");
    box.hidden = !m.length; box.innerHTML = ""; m.forEach(t => { const li = document.createElement("li"); li.textContent = t; box.appendChild(li); });
  }
  function suggest(tr, text) {
    const ul = tr.querySelector(".sug"), q = norm(text.trim());
    ul.textContent = "";
    const hits = q.length >= 3 ? BBData.products().filter(p => p.estado === "Habilitado" && norm(p.name).includes(q)) : [];
    hits.forEach((p, i) => { const li = document.createElement("li"); li.setAttribute("role", "option"); li._p = p;
      const b = document.createElement("b"), sm = document.createElement("small"); b.textContent = p.name; sm.textContent = (p.desc || p.id) + " · " + BBData.clp(p.price); li.append(b, sm); if (!i) li.className = "on"; ul.appendChild(li); });
    ul.hidden = !hits.length;
    if (hits.length) place(tr);
  }
  /* La lista se dibuja con posición fija para que no la recorte el scroll de la tabla; se abre hacia arriba si abajo no cabe. */
  function place(tr) {
    const inp = tr.querySelector(".buscar"), ul = tr.querySelector(".sug"), r = inp.getBoundingClientRect();
    ul.style.left = r.left + "px"; ul.style.width = Math.max(r.width, 230) + "px";
    const h = ul.offsetHeight, abajo = window.innerHeight - r.bottom;
    ul.style.top = (abajo >= h + 8 || abajo >= r.top ? r.bottom + 2 : r.top - h - 2) + "px";
  }
  const cierraPorScroll = e => { if (!(e.target.classList && e.target.classList.contains("sug"))) tbody.querySelectorAll(".sug").forEach(u => u.hidden = true); };
  window.addEventListener("scroll", cierraPorScroll, true); window.addEventListener("resize", cierraPorScroll);
  function pick(tr, p) {
    const r = tr._r; r.product = p; r.text = p.name; if (!String(r.qty).trim()) r.qty = "1";
    tr.querySelector(".buscar").value = p.name; tr.querySelector(".qty").value = r.qty;
    tr.querySelector(".sug").hidden = true; paint(tr); refresh();
  }
  tbody.addEventListener("input", e => {
    const tr = e.target.closest("tr"), r = tr._r;
    if (e.target.classList.contains("qty")) {
      if (e.target.validity && e.target.validity.badInput) e.target.value = ""; // Firefox/Safari dejan escribir letras en type=number
      r.qty = e.target.value;
    }
    else {
      r.text = e.target.value; r.product = null;
      if (!r.text.trim()) { r.qty = ""; tr.querySelector(".qty").value = ""; }
      suggest(tr, r.text);
    }
    paint(tr); refresh();
  });
  tbody.addEventListener("mousedown", e => {
    const li = e.target.closest("li");
    if (li) { e.preventDefault(); pick(li.closest("tr"), li._p); }
    else if (e.target.classList.contains("sug")) e.preventDefault(); // permite arrastrar la barra de scroll sin cerrar la lista
  });
  tbody.addEventListener("keydown", e => {
    if (e.target.classList.contains("qty") && e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); return; }
    if (!e.target.classList.contains("buscar")) return;
    const ul = e.target.nextElementSibling;
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !ul.hidden) {
      e.preventDefault();
      const items = [...ul.children], i = items.findIndex(li => li.classList.contains("on"));
      const j = Math.min(items.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)));
      items.forEach(li => li.classList.remove("on")); items[j].classList.add("on"); items[j].scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && !ul.hidden) { e.preventDefault(); pick(e.target.closest("tr"), (ul.querySelector("li.on") || ul.firstChild)._p); }
    if (e.key === "Escape") ul.hidden = true;
  });
  tbody.addEventListener("focusout", e => { const ul = e.target.nextElementSibling; if (ul && ul.classList.contains("sug")) ul.hidden = true; });
  $("add").addEventListener("click", () => { const r = blank(); rows.push(r); tbody.appendChild(rowEl(r)); tbody.lastChild.querySelector(".qty").focus(); });
  $("del").addEventListener("click", () => {
    const idx = rows.map((r, i) => isBlank(r) ? i : -1).filter(i => i >= 0);
    if (idx.length < 2) {
      BB.modal({ title: "No se puede eliminar la fila", text: "Los productos ya ingresados no se eliminan con «Eliminar fila». Borra el nombre del producto para liberar la fila y luego elimínala. Siempre debe quedar una fila en blanco.", tone: "orange" });
      return;
    }
    rows.splice(idx[0], 1); tbody.removeChild(tbody.children[idx[0]]); refresh();
  });

  /* ---- acciones ---- */
  const cliente = () => ({ nombre: val(FIELDS[0]), run: BBV.formatRun(val(FIELDS[1])), telefono: val(FIELDS[2]).replace(/\s/g, ""), correo: val(FIELDS[3]), direccion: val(FIELDS[4]) });
  function enviar() {
    intentado = true; showErrors(); refresh();
    const bad = FIELDS.filter(f => status(f) !== "ok");
    if (bad.length) {
      const vac = bad.filter(f => status(f) === "empty"), uso = vac.length ? vac : bad;
      BB.modal({ title: vac.length ? "Faltan campos por completar" : "Hay datos con formato incorrecto", text: vac.length ? "Completa los siguientes campos obligatorios:" : "Corrige los siguientes campos:", list: uso.map(f => f.label), tone: "red", onClose: () => $(bad[0].id).focus() });
      return;
    }
    if (issues().length) { $("avisos").scrollIntoView({ block: "center" }); return; }
    const orders = BBData.orders(), t = BBData.clp(total());
    if (editId) {
      const o = orders.find(x => x.id === editId); o.cliente = cliente(); o.items = lines(); BBData.saveOrders(orders);
      BB.modal({ title: "Cambios guardados", text: `El pedido #${editId} fue actualizado. Total: ${t}.`, tone: "green", onClose: () => location.href = "pedido-ingresado.html" });
    } else {
      const id = BBData.nextId();
      orders.push({ id, cliente: cliente(), items: lines(), estado: "Ingresado", creadoPor: BB.session().username }); BBData.saveOrders(orders);
      BB.modal({ title: "Pedido enviado", text: `El pedido fue enviado correctamente.\nTotal: ${t}`, tone: "green", onClose: reset });
    }
  }
  function reset() { FIELDS.forEach(f => $(f.id).value = ""); intentado = false; lock(false); $("nombre").blur(); setRows([]); showErrors(); renderBar(); }
  function borrar() {
    BB.modal({
      title: editId ? `¿Eliminar el pedido #${editId}?` : "¿Eliminar este pedido?", tone: "orange",
      text: "Se perderán los datos del cliente y el detalle ingresado. Esta acción no se puede deshacer.",
      buttons: [{ label: "Cancelar", kind: "sec" }, { label: "Eliminar", kind: "peligro", onClick: () => {
        if (editId) { BBData.saveOrders(BBData.orders().filter(o => o.id !== editId)); location.href = "pedido-ingresado.html"; } else reset();
      } }]
    });
  }

  /* ---- inicio ---- */
  if (order) {
    $("titulo").textContent = "Editar pedido #" + editId; $("titulo").hidden = false;
    const c = order.cliente; ["nombre", "run", "telefono", "correo", "direccion"].forEach(k => $(k).value = c[k]);
    setRows(order.items.map(i => ({ qty: String(i.qty), text: i.name, product: { id: i.pid, name: i.name, price: i.price } })));
  } else setRows([]);
  renderBar();
})();
