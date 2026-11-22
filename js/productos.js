/* Vista Productos (RIU 6, 6.1, 6.2 y 6.3): listado, ingreso, edición y eliminación con reglas de stock y uso. */
(function () {
  const $ = id => document.getElementById(id);
  const FIELDS = [
    { id: "codigo", label: "PRODUCTO NÚMERO", ok: v => /^P-\d{3}$/.test(v), hint: "Formato: P-104" },
    { id: "nombre", label: "NOMBRE", ok: v => v.length >= 2, hint: "Mínimo 2 caracteres." },
    { id: "cantidad", label: "CANTIDAD", ok: v => /^\d{1,5}$/.test(v), hint: "Número entero de 0 en adelante." },
    { id: "valor", label: "VALOR", ok: v => num(v) > 0, hint: "Valor en pesos mayor a $0. Ej: $2.500" }
  ];
  const num = v => Number(String(v).replace(/[$.\s]/g, "")) || 0;
  const val = f => f.id === "codigo" ? $(f.id).value.trim().toUpperCase() : $(f.id).value.trim();
  const lista = a => a.length > 1 ? a.slice(0, -1).join(", ") + " y " + a[a.length - 1] : a.join("");
  let sel = null, editId = null, snap = "";

  /* ---- listado ---- */
  function render(focusId) {
    const tb = $("lista"); tb.textContent = "";
    BBData.products().forEach(p => {
      const tr = document.createElement("tr"); tr.className = (p.estado === "Deshabilitado" ? "off " : "") + (p.id === sel ? "sel" : "");
      const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = p.id === sel; cb.dataset.id = p.id;
      cb.setAttribute("aria-label", "Seleccionar " + p.name);
      const est = document.createElement("span"); est.className = "est " + (p.estado === "Habilitado" ? "on" : "off");
      est.textContent = (p.estado === "Habilitado" ? "✓ " : "⊘ ") + p.estado;
      [cb, p.id, p.name, String(p.stock), BBData.clp(p.price), est].forEach((c, i) => {
        const td = document.createElement("td");
        if (typeof c === "string") td.textContent = c; else td.appendChild(c);
        if (i === 3 || i === 4) td.className = "num";
        tr.appendChild(td);
      });
      const toggle = fromCb => { sel = sel === p.id ? null : p.id; render(fromCb ? p.id : null); };
      cb.addEventListener("change", () => toggle(true));
      tr.addEventListener("click", e => { if (e.target !== cb) toggle(false); });
      tb.appendChild(tr);
    });
    $("editar").disabled = $("eliminar").disabled = sel === null;
    if (focusId) tb.querySelector(`[data-id="${focusId}"]`).focus();
  }
  const find = id => BBData.products().find(p => p.id === id);
  $("ingresar").addEventListener("click", () => abrir(null));
  $("editar").addEventListener("click", () => abrir(find(sel)));
  $("eliminar").addEventListener("click", () => {
    const p = find(sel);
    if (BBData.enUso(p.id)) { BB.modal({ title: "No puedes eliminar este producto", text: "Está incluido en pedidos existentes.", tone: "orange" }); return; }
    BB.modal({
      title: `¿Eliminar ${p.name} (${p.id})?`, tone: "orange", text: "El producto se quitará del catálogo. Esta acción no se puede deshacer.",
      buttons: [{ label: "Cancelar", kind: "sec" }, { label: "Eliminar", kind: "peligro", onClick: () => {
        BBData.saveProducts(BBData.products().filter(x => x.id !== p.id)); sel = null; render();
        BB.modal({ title: `${p.name} (${p.id}) eliminado correctamente`, text: "El producto ya no aparece en el listado.", tone: "green" });
      } }]
    });
  });

  /* ---- formulario ---- */
  const values = () => FIELDS.map(val).concat($("estado").value).join("|");
  function clearErrors() { FIELDS.forEach(f => { $(f.id).parentElement.classList.remove("error"); $(f.id).setAttribute("aria-invalid", "false"); $("n-" + f.id).textContent = ""; }); }
  function abrir(p) {
    editId = p ? p.id : null; clearErrors();
    $("f-titulo").textContent = p ? "Editar Producto" : "Ingresar Producto";
    $("codigo").value = p ? p.id : ""; $("nombre").value = p ? p.name : "";
    $("cantidad").value = p ? p.stock : ""; $("valor").value = p ? BBData.clp(p.price) : "";
    $("estado").value = p ? p.estado : "Habilitado";
    const uso = p && BBData.enUso(p.id), off = p && p.estado === "Deshabilitado";
    $("codigo").readOnly = !!p; $("valor").readOnly = !!(uso || off);
    $("ley-valor").textContent = uso ? "Valor bloqueado: el producto está incluido en pedidos existentes." : off ? "Valor bloqueado: el producto está deshabilitado." : "";
    $("vista-lista").hidden = true; $("vista-form").hidden = false;
    snap = values(); (p ? $("nombre") : $("codigo")).focus();
  }
  function cerrar() { $("vista-form").hidden = true; $("vista-lista").hidden = false; render(); }
  $("volver").addEventListener("click", () => {
    if (values() === snap) { cerrar(); return; }
    BB.modal({ title: "¿Volver sin guardar?", text: "Los cambios que hiciste no se guardarán.", tone: "orange",
      buttons: [{ label: "Seguir editando", kind: "sec" }, { label: "Volver", kind: "peligro", onClick: cerrar }] });
  });
  $("borrar").addEventListener("click", () => {
    BB.modal({ title: "¿Borrar los campos?", text: "Se vaciarán los datos escritos en el formulario. No se elimina ningún producto del listado.", tone: "orange",
      buttons: [{ label: "Cancelar", kind: "sec" }, { label: "Borrar", kind: "peligro", onClick: () => {
        FIELDS.forEach(f => { if (!$(f.id).readOnly) $(f.id).value = ""; }); clearErrors();
      } }] });
  });
  $("guardar").addEventListener("click", () => {
    const st = f => !val(f) ? "empty" : f.ok(val(f)) ? "ok" : "bad";
    FIELDS.forEach(f => {
      const s = st(f), bad = s !== "ok";
      $(f.id).parentElement.classList.toggle("error", bad); $(f.id).setAttribute("aria-invalid", bad);
      $("n-" + f.id).textContent = bad ? (s === "empty" ? "Campo obligatorio" : f.hint) : "";
    });
    const vac = FIELDS.filter(f => st(f) === "empty"), mal = FIELDS.filter(f => st(f) === "bad");
    if (vac.length || mal.length) {
      BB.modal({ title: vac.length ? "Faltan campos por completar" : "Hay datos con formato incorrecto", tone: "red",
        text: (vac.length ? "Completa: " : "Corrige: ") + lista((vac.length ? vac : mal).map(f => f.label)) + "." });
      return;
    }
    const list = BBData.products(), id = val(FIELDS[0]), stock = Number(val(FIELDS[2]));
    let estado = $("estado").value; const forzado = stock === 0 && estado === "Habilitado"; if (stock === 0) estado = "Deshabilitado";
    const actual = editId ? list.find(p => p.id === editId) : null;
    if (!editId && list.some(p => p.id === id)) { BB.modal({ title: "El producto ya existe", text: `El PRODUCTO NÚMERO ${id} ya está registrado.`, tone: "red" }); return; }
    if (actual && estado === "Deshabilitado" && actual.estado === "Habilitado" && BBData.enUso(id)) {
      BB.modal({ title: "No puedes deshabilitar este producto", text: "Está incluido en pedidos existentes.", tone: "orange" }); return;
    }
    const nuevo = { id, name: val(FIELDS[1]), price: num($("valor").value), stock, estado };
    if (actual) list[list.indexOf(actual)] = nuevo; else list.push(nuevo);
    BBData.saveProducts(list);
    BB.modal({ title: "Producto guardado", tone: "green", onClose: cerrar,
      text: `${nuevo.name} (${id}) quedó ${estado}.` + (forzado ? " Como la cantidad es 0, se deshabilitó automáticamente." : "") });
  });
  render();
})();
