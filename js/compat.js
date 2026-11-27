/* Diagnóstico de compatibilidad (Chrome, Edge, Opera, Firefox y Safari).
   pruebas/compatibilidad.html escribe un dato; pruebas/compatibilidad-2.html lo lee desde OTRO archivo,
   que es justo lo que hace el sistema al pasar de una vista a otra. */
(function () {
  const paso = document.body.dataset.paso;
  const out = document.getElementById("resultado");
  const fila = (nombre, ok, detalle) => {
    const li = document.createElement("li");
    li.textContent = (ok ? "✔ " : "✘ ") + nombre + (detalle ? " — " + detalle : "");
    li.className = ok ? "ok-t" : "mal-t";
    out.appendChild(li);
    return ok;
  };
  const supports = (p, v) => !!(window.CSS && CSS.supports && CSS.supports(p, v));
  const almacenamiento = kind => { try { const s = window[kind + "Storage"]; s.setItem("__t", "1"); s.removeItem("__t"); return true; } catch (e) { return false; } };
  document.getElementById("ua").textContent = navigator.userAgent;

  if (paso === "1") {
    const r = [
      fila("localStorage disponible", almacenamiento("local")),
      fila("sessionStorage disponible", almacenamiento("session")),
      fila("CSS grid", supports("display", "grid")),
      fila("CSS flexbox con gap", supports("gap", "10px")),
      fila("CSS inset", supports("inset", "0")),
      fila("CSS position: sticky", supports("position", "sticky")),
      fila("JS normalize() (búsqueda sin tildes)", typeof "".normalize === "function"),
      fila("JS URLSearchParams", typeof URLSearchParams === "function"),
      fila("JS Element.closest()", typeof Element.prototype.closest === "function"),
      fila("JS Array.from y spread", typeof Array.from === "function")
    ];
    try { localStorage.setItem("bb_compat", "ok"); sessionStorage.setItem("bb_compat", "ok"); } catch (e) { /* se informa en la prueba 2 */ }
    document.getElementById("estado").textContent = r.every(Boolean) ? "Prueba 1 aprobada. Continúa con la prueba 2." : "Hay funciones no disponibles en este navegador (ver ✘).";
  } else {
    const l = (function () { try { return localStorage.getItem("bb_compat"); } catch (e) { return null; } })();
    const s = (function () { try { return sessionStorage.getItem("bb_compat"); } catch (e) { return null; } })();
    const a = fila("Los datos de localStorage llegan a otra vista (pedidos, productos)", l === "ok");
    const b = fila("La sesión de sessionStorage llega a otra vista (login → Home)", s === "ok");
    document.getElementById("estado").textContent = a && b
      ? "APROBADO: el sistema funciona en este navegador abriendo los archivos directamente."
      : "ATENCIÓN: este navegador aísla los archivos locales. Abre el sistema con Live Server o desde GitHub Pages (ver README).";
  }
})();
