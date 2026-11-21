# BunnyBlue – Sistema de Gestión de Pedidos (Interfaz de Usuario)

Interfaz web del sistema interno de gestión de pedidos de **BunnyBlue**, una cadena de supermercados. Está construida con **HTML5, CSS3 y JavaScript** puros (sin frameworks ni librerías externas) y tiene dos perfiles de usuario: **user** (registra pedidos) y **admin** (administra productos y procesa pedidos).

> **Evaluación 3 · Interfaces de Usuario · Universidad de Talca · 2026**
> Escuela de Ingeniería Informática Empresarial, Facultad de Economía y Negocios
> **Académico:** M. Sc. Sergio Antonio Baltierra Valenzuela

## Equipo

| Rol | Integrante |
|-----|------------|
| **Jefe de Grupo** | Cristóbal Alfonso Alonso González |
| Integrante | Maite Antonia Godoy Vergara |

## Estado del proyecto

El trabajo se desarrolla en 3 semanas (16 de noviembre al 6 de diciembre de 2026). Cada semana se sube su avance a este repositorio.

| Semana | Hito | RIU | Estado |
|--------|------|-----|--------|
| 1 | Plantilla HEAD/BODY/FOOT, login con bloqueo y control de acceso por perfiles | 1, 2, 3, 8, 9, 10 | ✅ Entregado |
| 2 | Vista Pedidos y Pedido Ingresado (perfil user) | 4, 5 | ⏳ En desarrollo |
| 2 | Vista Productos y Procesamiento de Pedido (perfil admin) | 6, 6.1, 6.2, 6.3, 7 | ⏳ En desarrollo |
| 3 | Refactorización, diseño responsivo, plan de pruebas, matriz de trazabilidad e informe final | — | ⏳ Pendiente |

Las vistas de la Semana 2 ya existen como páginas con la plantilla y el control de acceso activos. Muestran el mensaje «Vista en construcción» hasta que se programe su contenido.

## Cómo ejecutarlo

No necesita instalación ni servidor.

1. Descarga el repositorio (**Code → Download ZIP**) y descomprímelo, o clónalo:
   ```bash
   git clone https://github.com/Cris266Utal/BunnyBlue-Interfaz-de-Usuario.git
   ```
2. Abre el archivo **`index.html`** con doble clic en Chrome, Edge o Firefox.

También puede abrirse con la extensión *Live Server* de VS Code.

## Credenciales de prueba

| Perfil | Usuario | Contraseña | Nombre que muestra el sistema |
|--------|---------|------------|-------------------------------|
| **user** | `camila` | `user123` | Camila Rojas |
| **admin** | `andres` | `admin123` | Andrés Soto |

## Cómo comprobar lo implementado (2 minutos)

| # | Prueba | Qué hacer | Resultado esperado | RIU |
|---|--------|-----------|--------------------|-----|
| 1 | Login correcto | Ingresar `camila` / `user123` | Dashboard «Bienvenido/a, Camila Rojas», «Perfil: user» y menú Home · Pedidos · Pedido Ingresado | 2, 3, 9 |
| 2 | Menú de admin | Cerrar sesión e ingresar `andres` / `admin123` | Menú Home · Productos · Procesamiento de Pedido | 8 |
| 3 | Usuario inexistente | Ingresar un usuario que no existe | Modal «Usuario no encontrado» | 2 |
| 4 | Contraseña incorrecta | Usar `camila` con clave errónea | Modal con los intentos restantes (2 y luego 1) | 2 |
| 5 | Bloqueo | Fallar la contraseña 3 veces | Modal «Cuenta bloqueada» y botón «Ingresar» deshabilitado; el otro usuario sigue pudiendo entrar | 2 |
| 6 | Campos vacíos | Pulsar «Ingresar» sin datos | Modal que lista los campos faltantes | 2 |
| 7 | Acceso cruzado por URL | Con sesión de `andres`, escribir en la barra de direcciones `pages/pedidos.html` | Vuelve a su Home con el aviso «Acceso denegado» | 10 |
| 8 | Acceso sin sesión | Sin iniciar sesión, abrir `pages/productos.html` | Redirige al login | 10 |
| 9 | Cerrar sesión | Pulsar «Cerrar sesión» (visible arriba a la derecha en todas las vistas) | Vuelve al login | 2 |

Para desbloquear una cuenta durante las pruebas, usar el enlace **«Reiniciar bloqueos (solo demo)»** bajo el botón «Ingresar».

## Requerimientos cubiertos (Semana 1)

| RIU | Requerimiento | Dónde está implementado |
|-----|---------------|-------------------------|
| 1 | HEAD, BODY y FOOT iguales en todas las vistas; el menú activo se resalta | `js/layout.js`, `css/styles.css` |
| 2 | Login con usuario y contraseña, aviso de usuario inexistente, bloqueo tras 3 intentos (modal), dashboard de bienvenida y botón «Cerrar sesión» siempre visible | `index.html`, `js/login.js`, `js/auth.js`, `js/ui.js`, `js/home.js` |
| 3 | Dos tipos de usuario: user y admin | `js/config.js`, `js/home.js` |
| 8 | Menú de admin: solo Home, Productos y Procesamiento de Pedido | `js/config.js`, `js/layout.js` |
| 9 | Menú de user: solo Home, Pedidos y Pedido Ingresado | `js/config.js`, `js/layout.js` |
| 10 | Ningún perfil accede a las vistas del otro, ni siquiera escribiendo la URL | `js/auth.js` (guardián de rutas) |

## Estructura del código

```
index.html                    Vista de login (Iniciar sesión)
pages/
  home.html                   Dashboard de bienvenida (user y admin)
  pedidos.html                Vista Pedidos            (user)   → Semana 2
  pedido-ingresado.html       Vista Pedido Ingresado   (user)   → Semana 2
  productos.html              Vista Productos          (admin)  → Semana 2
  procesamiento-pedido.html   Procesamiento de Pedido  (admin)  → Semana 2
css/
  styles.css                  Paleta de colores, plantilla y componentes
js/
  config.js                   Rutas, menús por perfil y usuarios de prueba
  auth.js                     Sesión, login con bloqueo y guardián de rutas
  ui.js                       Modal estándar reutilizable
  layout.js                   Genera HEAD, menú y FOOT (plantilla común)
  login.js                    Lógica de la vista de login
  home.js                     Lógica del dashboard
img/
  logo.png                    Logo de BunnyBlue
docs/
  prompts.md                  Prompts (método RECETA) y herramientas de IA usadas
```

## Decisiones técnicas

- **Separación de responsabilidades:** el HTML contiene solo la estructura, el CSS está en un archivo externo y el JavaScript está dividido por función. No hay estilos ni scripts embebidos en las páginas.
- **Plantilla única (RIU 1):** el encabezado, el menú y el pie de página se generan desde `layout.js`, por lo que son idénticos en todas las vistas.
- **Control de acceso (RIU 10):** cada página declara qué perfiles pueden verla mediante `<meta name="bb-roles">`. Antes de mostrarse, `auth.js` revisa la sesión: sin sesión va al login, y si el perfil no corresponde vuelve a su Home con el aviso «Acceso denegado».
- **Bloqueo de cuenta (RIU 2):** los intentos fallidos se guardan por usuario, por lo que el bloqueo persiste al recargar la página y no afecta al otro perfil.
- **Accesibilidad:** HTML5 semántico (`header`, `nav`, `main`, `footer`), modales con `<dialog>`, indicación de página activa con `aria-current`, foco visible y colores con contraste AA.
- **Responsivo:** la plantilla se adapta a pantallas de teléfono y tablet.
- **Sin dependencias:** funciona abriendo `index.html` directamente, sin módulos ES ni servidor.

**Limitación conocida:** es un prototipo de frontend. La sesión se guarda en el navegador (`sessionStorage`) y las credenciales de prueba están en `js/config.js`. Un sistema real validaría usuarios y permisos en un servidor.

## Paleta de colores

| Color | HEX | Uso |
|-------|-----|-----|
| BunnyBlue 900 | `#0F2A5E` | Títulos y texto principal |
| BunnyBlue 800 | `#1944AF` | Barra de menú y hover de botones |
| BunnyBlue 700 | `#1E4FD1` | Encabezado, botones primarios y foco |
| BunnyBlue 100 | `#E8F0FF` | Paneles y campos de solo lectura |
| Rojo de alerta | `#B73A3E` | Errores y acciones de riesgo |
| Verde éxito | `#257E3D` | Confirmaciones |
| Naranja advertencia | `#A16218` | Avisos previos a acciones irreversibles |

## Uso de inteligencia artificial

Se utilizó **Claude (Anthropic)** como apoyo en la programación, con prompts estructurados con el método RECETA (Rol, Escenario, Contenido, Tarea y Ajustes). Los prompts, la validación del resultado y el refinamiento manual del código están documentados en [`docs/prompts.md`](docs/prompts.md).

## Historial de versiones del diseño

El diseño de las interfaces (wireframes, mockups y prototipo en Figma) se documentó en el *Informe de Interfaces de Usuario, Evaluación 2*. Este repositorio corresponde a su implementación en código.
