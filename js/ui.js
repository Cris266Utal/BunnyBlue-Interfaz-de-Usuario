/**
 * ui.js — Componentes de interfaz reutilizables.
 * Modal estándar de BunnyBlue (500 px, overlay #0B1220 al 60 %, sin cierre al hacer clic fuera).
 */
(function (BB) {
  'use strict';

  const ICONOS = Object.freeze({
    error: { simbolo: '!', clase: 'error' },
    bloqueo: { simbolo: '✕', clase: 'error' },
    advertencia: { simbolo: '!', clase: 'advertencia' },
    exito: { simbolo: '✓', clase: 'exito' }
  });

  let contador = 0;

  function crear(etiqueta, clase, texto) {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }

  /**
   * Abre un modal y devuelve una promesa con el texto del botón presionado.
   * Todo el contenido se inserta con textContent (sin riesgo de inyección HTML).
   * @param {{tipo?: string, titulo: string, mensaje?: string, lista?: string[],
   *          botones?: {texto: string, estilo?: string}[]}} opciones
   */
  function modal({ tipo = 'error', titulo, mensaje = '', lista = [], botones = [{ texto: 'Aceptar' }] }) {
    return new Promise((resolver) => {
      const id = `modal-titulo-${++contador}`;
      const icono = ICONOS[tipo] || ICONOS.error;

      const dialogo = crear('dialog', 'modal');
      dialogo.setAttribute('aria-labelledby', id);

      const marca = crear('span', `modal__icono modal__icono--${icono.clase}`, icono.simbolo);
      marca.setAttribute('aria-hidden', 'true');
      const encabezado = crear('h2', 'modal__titulo', titulo);
      encabezado.id = id;
      dialogo.append(marca, encabezado);

      if (mensaje) dialogo.append(crear('p', 'modal__texto', mensaje));
      if (lista.length) {
        const ul = crear('ul', 'modal__lista');
        lista.forEach((item) => ul.append(crear('li', '', item)));
        dialogo.append(ul);
      }

      const acciones = crear('div', 'modal__acciones');
      botones.forEach((boton, indice) => {
        const estilo = boton.estilo || (indice === botones.length - 1 ? 'primario' : 'secundario');
        const elemento = crear('button', `btn btn--${estilo}`, boton.texto);
        elemento.type = 'button';
        elemento.addEventListener('click', () => dialogo.close(boton.texto));
        acciones.append(elemento);
      });
      dialogo.append(acciones);

      // Escape no cierra el modal: la persona debe elegir una opción.
      dialogo.addEventListener('cancel', (evento) => evento.preventDefault());
      dialogo.addEventListener('close', () => {
        const respuesta = dialogo.returnValue;
        dialogo.remove();
        resolver(respuesta);
      });

      document.body.append(dialogo);
      dialogo.showModal();
    });
  }

  BB.UI = { modal };
})(window.BB);
