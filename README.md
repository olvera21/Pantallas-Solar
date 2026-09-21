# Solar — Bienes raíces con ficha técnica

Proyecto académico (Programación de Aplicaciones Web Progresivas · UTTT) que simula una plataforma de bienes raíces enfocada en Tula de Allende, Jilotepec y zonas cercanas. Cada publicación reúne en una sola ficha las dimensiones, la construcción, los servicios, la situación legal del predio y una estimación de precio orientativa asistida por IA.

Es un sitio estático (HTML, CSS y JavaScript sin frameworks ni backend); el "inicio de sesión" y los formularios son un mockup funcional que guarda datos en `localStorage` del navegador.

## Páginas principales

- **`index.html`** — Portada: propuesta de valor, sección "Sobre nosotros" (misión, visión, valores) y acceso al perfil.
- **`login.html`** / **`registro.html`** — Inicio de sesión y creación de cuenta como pantallas independientes, con selección de rol (comprador o vendedor).
- **`perfil.html`** — Perfil del usuario autenticado, con accesos a su panel de comprador o vendedor.
- **`catalogo.html`** / **`detalle.html`** — Listado de inmuebles con filtros y ficha técnica completa de una propiedad, incluyendo perfil del vendedor.
- **`perfil-vendedor.html`** — Perfil público de un vendedor (calificación, publicaciones activas, reseñas).
- **`publicar.html`** y **`publicar-*.html`** — Flujo de publicación de un inmueble en 6 pasos: ubicación y tipo, dimensiones y colindancias, situación legal y precio, características y servicios, fotografías/documentos, y revisión final. Requiere haber iniciado sesión.
- **`estimacion.html`** — Resultado simulado de la estimación de precio con IA.
- **`comprador.html`** / **`vendedor.html`** — Paneles de cada rol.

## Estructura del proyecto

```
css/styles.css     Sistema de diseño (colores, tipografía, componentes)
js/main.js         Interacciones: tabs, filtros, sesión simulada, flujo de publicación
images/            Ilustraciones SVG de muestra para las fichas de propiedades
manifest.json      Manifest de PWA
```

## Cómo verlo

Al ser un sitio estático, basta con abrir `index.html` en un navegador. Para probar el manifest de PWA sin advertencias de CORS, sírvelo con un servidor local (por ejemplo, la extensión "Live Server" de VS Code) en lugar de abrirlo directamente como archivo.
