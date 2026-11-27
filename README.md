# BunnyBlue – Interfaz de Usuario

Interfaz web (HTML5, CSS3 y JavaScript) del sistema interno de gestión de pedidos de BunnyBlue, una cadena de supermercados. Evaluación 3, Interfaces de Usuario, Universidad de Talca.

## Cómo ejecutarlo
Elige una de estas formas (las tres funcionan igual):
1. **GitHub Pages (recomendada para revisión):** en el repositorio, *Settings → Pages → Deploy from a branch → main / (root)*. En unos minutos el sistema queda disponible en una URL `https://<usuario>.github.io/<repositorio>/`.
2. **Live Server (VS Code):** abre la carpeta y pulsa *Go Live*.
3. **Abrir el archivo:** doble clic en `index.html`. Para comprobar que tu navegador lo permite, abre antes `pruebas/compatibilidad.html` (ver más abajo).

No requiere instalar nada: usa `sessionStorage` y `localStorage` para simular sesión y datos.

## Navegadores compatibles
Probado y exigido para **Google Chrome, Microsoft Edge, Opera, Mozilla Firefox y Safari** (versiones actuales; mínimo Chrome/Edge 90, Opera 76, Firefox 90, Safari 15.4).

| Aspecto | Decisión técnica |
|---|---|
| Código | HTML5, CSS3 y JavaScript clásico, sin módulos ni librerías externas ni peticiones de red, por lo que no depende de un servidor. |
| Almacenamiento | `BBStore` (en `js/data.js`) envuelve `localStorage` y `sessionStorage`; si el navegador los bloquea, el sistema no se cae y el Home avisa. |
| Selectores | **Visto bueno** y **Enviar a** contienen solo las opciones del requerimiento. El texto guía se dibuja encima y no es una opción (Safari lista las opciones `hidden`). |
| Cantidad | Solo acepta dígitos en todos los navegadores (Firefox y Safari dejan escribir letras en `type="number"`). |
| Botón «Atrás» | Tras cerrar sesión, `pageshow` vuelve a validar el acceso (Safari, Firefox y Chrome guardan páginas en caché). |
| Estilos | `appearance` con prefijo `-webkit-`, `inset` con alternativa `top/right/bottom/left`. |

### Diagnóstico en cada navegador
Abre `pruebas/compatibilidad.html`, pulsa *Continuar con la prueba 2* y revisa el resultado. Si dice **APROBADO**, el navegador comparte la sesión y los datos entre archivos y el sistema funciona abriéndolo directamente. Si dice **ATENCIÓN** (puede pasar en algunos navegadores con archivos locales), usa Live Server o GitHub Pages.

## Credenciales de prueba
| Perfil | Usuario | Contraseña | Nombre que aparece en la bienvenida |
|---|---|---|---|
| user  | `camila` | `1234` | Camila Rojas |
| admin | `andres` | `1234` | Andrés Soto |

Para desbloquear una cuenta tras 3 intentos fallidos, abre la consola del navegador (F12) y ejecuta `localStorage.clear()`.

## Fidelidad con el diseño
Las vistas replican los mockups del *Informe de Interfaces de Usuario* (Figuras 50 a 79): mismos textos, colores, medidas, botones y modales.

## Ajustes de la demostración
Al inicio de `js/data.js`, en `BB_CONFIG`:
- `CLAVE`: contraseña de los usuarios de prueba (`1234`).
- `PEDIDOS_DE_EJEMPLO` (por defecto `false`): si es `true`, carga 5 pedidos de ejemplo. Con `false`, *Pedido Ingresado* y *Procesamiento de Pedido* muestran solo los pedidos ingresados en la vista *Pedidos*.

Los datos se guardan en el navegador (`localStorage`): un pedido ingresado con el usuario *user* lo ve y procesa el *admin* desde el mismo navegador.

## Reglas de negocio implementadas
- **Pedidos (RIU 4):** RUN validado con módulo 11, teléfono `+569XXXXXXXX`, cálculo en CLP, cantidad de 1 a 100, siempre una fila en blanco y buscador desde 3 letras sobre un catálogo de 59 productos, que muestra todas las coincidencias (por ejemplo «tal»: Tallarines, Tallo de apio, Tallo de perejil, Tallo de brócoli…), solo de productos habilitados.
- **Pedido Ingresado (RIU 5):** selección única; Editar y Eliminar solo con una fila marcada. Un pedido ya procesado deja de aparecer y no se puede editar.
- **Productos (RIU 6):** cantidad 0 deshabilita el producto automáticamente; no se puede deshabilitar ni eliminar un producto incluido en pedidos; el valor se bloquea si el producto está en uso o deshabilitado; el código no se edita.
- **Procesamiento (RIU 7):** el paso 1 lista solo los pedidos ingresados en la vista Pedidos y se elige uno; paso 2 muestra los datos en solo lectura y pide **VISTO BUENO** (Sí / No / Pendiente) y **ENVIAR A** (Producción / Bodega, solo esas dos opciones). ENVIAR A se habilita al elegir el visto bueno y «Aceptar» solo con ambos selectores completos.

## Estructura
```
index.html          Home: Iniciar sesión (RIU 2)
pages/              Vistas por perfil (home, pedidos, productos, procesamiento)
assets/logo.png     Logo de BunnyBlue
css/base.css        Estilos y paleta (HEAD, FOOT, modal, login, Home)
css/pedidos.css     Estilos de Pedidos y Pedido Ingresado
css/admin.css       Estilos de Productos y Procesamiento
js/data.js          Datos de prueba, productos y pedidos (localStorage)
js/validar.js       Validación de RUN (módulo 11), teléfono, correo
js/pedidos.js       Vista Pedidos (RIU 4)
js/productos.js     Vista Productos (RIU 6)
js/procesamiento.js Procesamiento de Pedido (RIU 7)
js/pedido-ingresado.js  Vista Pedido Ingresado (RIU 5)
js/auth.js          Sesión, login con bloqueo y guardia por perfil
js/layout.js        HEAD, BODY y FOOT comunes y modal estándar
js/login.js, home.js
js/compat.js        Diagnóstico de compatibilidad
pruebas/            Páginas de diagnóstico por navegador
```

## Avance por semana
| Semana | Contenido | Estado |
|---|---|---|
| 1 | Plantilla HEAD/BODY/FOOT (RIU 1), login con bloqueo (RIU 2), perfiles y control de acceso (RIU 3, 8, 9, 10) | Hecho |
| 2 (hito 3) | Pedidos (RIU 4) y Pedido Ingresado (RIU 5) | Hecho |
| 2 (hito 4) | Productos (RIU 6, 6.1 a 6.3) y Procesamiento de Pedido en 2 pasos (RIU 7) | Hecho |
| 3 | Refactorización, responsivo, pruebas e informe | Pendiente |

## Equipo
- Cristóbal Alonso González – jefe de grupo
- Maite Godoy Vergara – integrante

> El control de acceso es una simulación del lado del cliente; en un sistema real la validación debe hacerse en el servidor.
