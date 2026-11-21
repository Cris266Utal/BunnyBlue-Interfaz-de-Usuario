# Prompts y uso de IA (método RECETA)

**Herramienta:** Claude (Anthropic), en claude.ai. **IDE:** VS Code. **Fecha:** 20 de noviembre de 2026 (Semana 1).
> Ajusta este documento a lo que realmente usaste y completa la sección «Refinamiento manual».

## Prompt S1-01 — Plantilla común, login y control por perfiles (RIU 1, 2, 3, 8, 9 y 10)

**R (Rol):** Desarrollador frontend senior, especialista en HTML5 semántico, CSS3 y JavaScript sin frameworks.

**E (Escenario):** BunnyBlue es un sistema interno de gestión de pedidos para trabajadores de supermercado, con perfiles `user` y `admin`. Se parte de los mockups y definiciones de la Evaluación 2 (paleta, header de 72 px, menú de 44 px, footer, modal estándar de 500 px).

**C (Contenido):**
- RIU 1: HEAD (logo, marca, menú, «Cerrar sesión»), BODY y FOOT idénticos en todas las vistas, con la opción activa en negrita y subrayada.
- RIU 2: login con validación de usuario y luego de contraseña; modales «Usuario no encontrado», «Contraseña incorrecta» (intentos restantes) y «Cuenta bloqueada» al tercer fallo.
- RIU 3, 8 y 9: dashboard «Bienvenido/a, NOMBRE» y «Perfil: user|admin»; menú de exactamente tres opciones por perfil.
- RIU 10: ningún perfil puede abrir vistas del otro, tampoco escribiendo la URL.
- Usuarios de prueba: camila / user123 (user) y andres / admin123 (admin).

**T (Tarea):** Genera los archivos separados `index.html`, `pages/*.html`, `css/styles.css` y `js/*.js`, con la plantilla generada desde un solo módulo (`layout.js`) y el guardián de rutas en `auth.js`.

**A (Ajustes):** Sin frameworks ni ES modules (debe funcionar abriendo `index.html` con doble clic); sin estilos ni scripts embebidos en el HTML; textos en español de Chile; tokens de color de la Tabla 3; contraste AA; responsivo.

### Resultado y validación
- Se obtuvo la estructura de archivos y la lógica de login, bloqueo y guardián de rutas.
- Se verificó con 23 comprobaciones automatizadas (login, bloqueo persistente, acceso cruzado por URL, logout, menús por perfil y ausencia de errores de consola).

### Refinamiento manual (completar)
- [ ] Ajustes de estilo comparando con los mockups de Figma (colores del footer, espaciados).
- [x] Integración del logo oficial del grupo (`img/logo.png`, recortado en círculo y con borde blanco en el HEAD).
- [ ] Decisiones propias del grupo sobre textos de los modales.
