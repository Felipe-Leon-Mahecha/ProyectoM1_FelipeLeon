// ================================================
// THE GEM — GEM Color Studio
// paleta.js — Generador de paletas de colores
// ================================================

// 1. Referencias al DOM
const btnGenerar     = document.getElementById('btn-generar-paleta');
const selectTamano   = document.getElementById('palette-size');
const selectFormato  = document.getElementById('palette-format');
const paletteGrid    = document.getElementById('palette-grid');
const toast          = document.getElementById('palette-toast');

// 2. Variable para el timer del toast
let toastTimer = null;

// ------------------------------------------------
// UTILIDADES DE COLOR
// ------------------------------------------------

// Genera un color HSL aleatorio
// Usa rangos amplios para garantizar variedad y contraste suficiente
function generarColorHSL() {
  const h = Math.floor(Math.random() * 360);       // tono: 0-360
  const s = Math.floor(Math.random() * 60) + 40;   // saturación: 40-100%
  const l = Math.floor(Math.random() * 40) + 30;   // luminosidad: 30-70%
  return { h, s, l };
}

// Convierte HSL a HEX
// Fórmula estándar de conversión HSL → RGB → HEX
function hslAHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Determina si el texto encima del color debe ser negro o blanco
// para garantizar contraste accesible (WCAG básico)
function textoContraste(l) {
  return l > 55 ? '#111' : '#fff';
}

// ------------------------------------------------
// RENDER DE LA PALETA
// ------------------------------------------------

function renderizarPaleta() {
  const cantidad = parseInt(selectTamano.value);
  const formato  = selectFormato.value;

  // Limpiar grid anterior
  paletteGrid.innerHTML = '';

  // Crear N tarjetas de color
  for (let i = 0; i < cantidad; i++) {
    const color = generarColorHSL();
    const hslStr = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const hexStr = hslAHex(color.h, color.s, color.l);
    const codigoVisible = formato === 'hsl' ? hslStr : hexStr;
    const textoColor = textoContraste(color.l);

    // Crear tarjeta
    const card = document.createElement('article');
    card.className = 'palette-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Color ${hexStr}. Clic para copiar.`);

    card.innerHTML = `
      <div class="palette-color-block" style="background: ${hslStr};"></div>
      <div class="palette-color-info">
        <span class="palette-color-hex">${hexStr}</span>
        <span class="palette-color-hsl">${formato === 'hsl' ? hslStr : `h:${color.h} s:${color.s}% l:${color.l}%`}</span>
        <span class="palette-copy-hint">📋 Copiar HEX</span>
      </div>
    `;

    // Clic: copiar HEX al portapapeles (Extra credit #4)
    card.addEventListener('click', function () {
      copiarAlPortapapeles(hexStr);
    });

    // Soporte teclado: Enter y Espacio también copian
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copiarAlPortapapeles(hexStr);
      }
    });

    paletteGrid.appendChild(card);
  }

  // Animación sutil de entrada
  const cards = paletteGrid.querySelectorAll('.palette-card');
  cards.forEach(function(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(function() {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 40);
  });

  mostrarToast('✅ Paleta generada — clic en un color para copiar su HEX');
  console.log('[GEM Color Studio] Paleta generada: ' + cantidad + ' colores (' + formato + ')');
}

// ------------------------------------------------
// COPIAR AL PORTAPAPELES
// ------------------------------------------------

function copiarAlPortapapeles(hex) {
  // navigator.clipboard requiere HTTPS o localhost
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(hex).then(function() {
      mostrarToast('📋 Copiado: ' + hex);
    }).catch(function() {
      mostrarToast('⚠️ No se pudo copiar');
    });
  } else {
    // Fallback para entornos sin HTTPS (abrir index.html directo)
    const input = document.createElement('input');
    input.value = hex;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    mostrarToast('📋 Copiado: ' + hex);
  }
}

// ------------------------------------------------
// TOAST DE MICROFEEDBACK
// ------------------------------------------------

function mostrarToast(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add('visible');

  // Cancelar timer anterior si había uno activo
  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(function() {
    toast.classList.remove('visible');
  }, 2500);
}

// ------------------------------------------------
// EVENTOS
// ------------------------------------------------

// Botón principal
btnGenerar.addEventListener('click', function() {
  renderizarPaleta();
});

// También regenerar si cambia el tamaño o formato (si ya hay paleta)
selectTamano.addEventListener('change', function() {
  if (paletteGrid.children.length > 0) {
    renderizarPaleta();
  }
});

selectFormato.addEventListener('change', function() {
  if (paletteGrid.children.length > 0) {
    renderizarPaleta();
  }
});

console.log('[GEM Color Studio] Módulo cargado ✅');
