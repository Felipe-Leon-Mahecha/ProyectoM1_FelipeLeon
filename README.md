# ◆ THE GEM — Landing Page + GEM Color Studio

> Proyecto Integrador Módulo 1 — Soy Henry Full Stack 3.0  
> Desarrollado por **Felipe Matheus León Mahecha**

---

## 📌 Descripción

Landing page oficial de **THE GEM**, un juego arcade 2D de supervivencia hecho en JavaScript puro + HTML5 Canvas. La página presenta el juego, sus características, información del creador, un minijuego jugable en el navegador y el **GEM Color Studio**: una herramienta interactiva para generar paletas de colores aleatorias en formato HSL y HEX.

El GEM Color Studio nació de la identidad visual del juego — toda la paleta de THE GEM fue diseñada con colores HSL, y esta herramienta permite explorar combinaciones similares para fanart, assets o diseño.

---

## 🚀 Demo en vivo

🌐 [Ver en GitHub Pages](https://felipe-leon-mahecha.github.io/the-gem-landing/)  
🎮 [Jugar THE GEM completo](https://thegembyfelixcompany.netlify.app)

---

## 🛠️ Tech Stack

- **HTML5** — Semántico: `header`, `nav`, `main`, `article`, `aside`, `footer`
- **CSS3** — Variables HSL, CSS Grid, Flexbox, Media Queries, animaciones
- **JavaScript vanilla** — DOM, eventos, `Math.random()`, Canvas API, Clipboard API
- **Git / GitHub** — Control de versiones y portafolio
- **GitHub Pages** — Deploy de producción

---

## ✨ Funcionalidades

### Landing Page
- Header con logo animado y tagline
- Navegación sticky con scroll suave
- Sección hero con descripción del juego y stack tecnológico
- Grid de características (CSS Grid responsive)
- Sección "Sobre el creador"
- Footer con año automático via JavaScript

### 🎮 Minijuego demo
- Canvas 500×320 jugable en el navegador
- Control con mouse (desktop) y touch (móvil)
- Obstáculos con velocidad progresiva
- Sistema de puntaje en tiempo real
- Pantalla de Game Over

### 🎨 GEM Color Studio
- Selector de tamaño de paleta: 6, 8 o 9 colores
- Generación aleatoria en formato **HSL** y **HEX**
- Visualización de cada color con su código
- **Clic para copiar HEX** al portapapeles
- Microfeedback tipo **toast** al generar y copiar
- Animación de entrada en las tarjetas
- Accesibilidad: labels, foco visible, contraste, `aria-label`

---

## 📁 Estructura del proyecto

```
the-gem-landing/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          ← año automático en footer
│   ├── minijuego.js    ← demo jugable en Canvas
│   └── paleta.js       ← GEM Color Studio
├── img/
│   ├── Logo_THE_GEM.png
│   ├── pelota.png
│   └── felix.png
├── docs/
│   └── capturas/       ← capturas de la app y uso de IA
└── README.md
```

---

## ⚙️ Cómo ejecutar localmente

1. Clonar el repositorio:
```bash
git clone https://github.com/Felipe-Leon-Mahecha/the-gem-landing.git
```

2. Abrir la carpeta del proyecto y ejecutar con Live Server (VS Code) o simplemente abrir `index.html` en el navegador.

> No requiere instalación de dependencias ni servidor especial.

---

## 🌐 Cómo desplegar en GitHub Pages

1. Ir al repositorio en GitHub
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **main** → / (root)
5. Guardar — en unos minutos el sitio queda publicado

---

## 🎨 Decisiones técnicas

### ¿Por qué HSL en vez de HEX para generar colores?
HSL (Hue, Saturation, Lightness) permite controlar el rango de colores de forma legible y predecible. Al generar aleatoriamente:
- `H` entre 0-360 garantiza variedad de tonos
- `S` entre 40-100% garantiza colores vivos, no apagados
- `L` entre 30-70% garantiza contraste suficiente contra fondos claros y oscuros

Con HEX tendríamos que generar 3 valores RGB completamente aleatorios, lo que produce muchos grises y colores sin contraste.

### ¿Por qué separar en 3 archivos JS?
- `app.js` — lógica general de la página (footer, inicialización)
- `minijuego.js` — todo lo relacionado al Canvas y el juego
- `paleta.js` — lógica del generador de colores

Separar por responsabilidad hace el código más legible y fácil de mantener.

### CSS con variables HSL
Todo el sistema de colores usa variables CSS con HSL documentadas, lo que permite crear variaciones de un mismo tono solo cambiando la luminosidad. Ejemplo:
```css
--gem-cyan:        hsl(185, 100%, 50%);  /* color principal */
--gem-cyan-dark:   hsl(185, 100%, 30%);  /* versión oscura */
--gem-cyan-deeper: hsl(185, 100%, 8%);   /* para fondos */
```

---

## 🤖 Uso de IA en el desarrollo

Se utilizó **Claude (Anthropic)** como herramienta de apoyo durante el desarrollo. Las capturas de las conversaciones están en `docs/capturas/`.

### Prompts utilizados (ejemplos):
- *"Crea una función en JavaScript que convierta colores HSL a HEX"* → generó la función base de conversión
- *"Explícame línea por línea qué hace esta función de conversión"* → permitió entender el algoritmo
- *"¿Por qué usar HSL en vez de HEX para generar colores aleatorios?"* → ayudó a entender y documentar la decisión técnica
- *"¿Cómo funciona requestAnimationFrame en el loop del juego?"* → explicó el ciclo de animación del Canvas

La IA se usó como colaboradora técnica y herramienta de aprendizaje, no como reemplazo del proceso de desarrollo.

---

## 📋 Checklist de entrega

- [x] HTML semántico completo
- [x] CSS externo con variables HSL documentadas
- [x] CSS Grid + Flexbox + Responsive (3→2→1 columnas)
- [x] JavaScript: DOM, eventos, Math.random(), Canvas, Clipboard API
- [x] Botón "Generar paleta" operativo
- [x] Generación correcta HSL y HEX
- [x] Render dinámico según tamaño seleccionado (6/8/9)
- [x] Microfeedback visible (toast)
- [x] Accesibilidad básica (labels, contraste, foco visible)
- [x] Repositorio GitHub público con commits claros
- [x] Deploy en GitHub Pages
- [x] README con instrucciones y decisiones técnicas
- [x] Capturas del flujo principal y uso de IA
- [x] Extra: copiar HEX al portapapeles
- [x] Extra: animaciones de entrada

---

## 👤 Autor

**Felipe León Mahecha**  
Estudiante Full Stack — Soy Henry 3.0  
📧 fmleonm19@ejemplo.com  
🔗 [LinkedIn]([https://www.linkedin.com/](https://www.linkedin.com/in/felipe-matheus-le%C3%B3n-mahecha-351482408/))  
💻 [GitHub](https://github.com/Felipe-Leon-Mahecha)
