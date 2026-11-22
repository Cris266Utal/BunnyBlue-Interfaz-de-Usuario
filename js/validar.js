/* Validaciones de formato (RIU 4): nombre, RUN (módulo 11), teléfono, correo y dirección. */
const BBV = {
  nombre: s => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]{5,}$/.test(s.trim()) && s.trim().split(/\s+/).length >= 2,
  run(s) {
    const c = s.replace(/[.\s-]/g, "").toUpperCase();
    if (!/^\d{7,8}[\dK]$/.test(c)) return false;
    let sum = 0, m = 2;
    for (let i = c.length - 2; i >= 0; i--) { sum += Number(c[i]) * m; m = m === 7 ? 2 : m + 1; }
    const r = 11 - (sum % 11);
    return c.slice(-1) === (r === 11 ? "0" : r === 10 ? "K" : String(r));
  },
  formatRun(s) {
    const c = s.replace(/[.\s-]/g, "").toUpperCase();
    return c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + c.slice(-1);
  },
  tel: s => /^\+569\d{8}$/.test(s.replace(/\s/g, "")),
  correo: s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()),
  dir: s => s.trim().length >= 5
};
