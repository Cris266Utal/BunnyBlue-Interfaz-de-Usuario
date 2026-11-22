# BunnyBlue – Interfaz de Usuario

Interfaz web (HTML5, CSS3 y JavaScript) del sistema interno de gestión de pedidos de BunnyBlue, una cadena de supermercados. Evaluación 3, Interfaces de Usuario, Universidad de Talca.

## Cómo ejecutarlo
1. Descarga o clona el repositorio.
2. Abre `index.html` en el navegador (o usa la extensión *Live Server* de VS Code).

No requiere instalar nada ni servidor: usa `sessionStorage` y `localStorage` para simular sesión y datos.

## Credenciales de prueba
| Perfil | Usuario | Contraseña |
|---|---|---|
| user  | `camila` | `user123`  |
| admin | `andres` | `admin123` |

Para desbloquear una cuenta tras 3 intentos fallidos, abre la consola del navegador (F12) y ejecuta `localStorage.clear()`.

## Reglas de negocio implementadas
- **Pedidos (RIU 4):** RUN validado con módulo 11, teléfono `+569XXXXXXXX`, cálculo en CLP, cantidad de 1 a 100, siempre una fila en blanco y buscador desde 3 letras (solo productos habilitados).
- **Pedido Ingresado (RIU 5):** selección única; Editar y Eliminar solo con una fila marcada. Un pedido ya procesado deja de aparecer y no se puede editar.
- **Productos (RIU 6):** cantidad 0 deshabilita el producto automáticamente; no se puede deshabilitar ni eliminar un producto incluido en pedidos; el valor se bloquea si el producto está en uso o deshabilitado; el código no se edita.
- **Procesamiento (RIU 7):** paso 1 elige el pedido, paso 2 pide visto bueno y destino; «Aceptar» se habilita solo con ambos.

## Estructura
```
index.html          Iniciar sesión
pages/              Vistas por perfil (home, pedidos, productos, procesamiento)
css/base.css        Estilos y paleta
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
