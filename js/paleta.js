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

// 3. Estado actual de la paleta (permite bloquear colores individuales)
let paletaActual = []; // array de { h, s, l, bloqueado }

// ------------------------------------------------
// UTILIDADES DE COLOR
// ------------------------------------------------

// Genera un color HSL aleatorio
// Usa rangos amplios para garantizar variedad y contraste suficiente
function generarColorHSL() {
  const h = Math.floor(Math.random() * 360);       // tono: 0-360
  const s = Math.floor(Math.random() * 60) + 40;   // saturación: 40-100%
  const l = Math.floor(Math.random() * 40) + 30;   // luminosidad: 30-70%
  return { h, s, l, bloqueado: false };
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

// Genera una paleta nueva, respetando los colores que estén bloqueados
function generarNuevaPaleta() {
  const cantidad = parseInt(selectTamano.value);
  const nuevaPaleta = [];

  for (let i = 0; i < cantidad; i++) {
    // Si en esa posición ya había un color bloqueado, se conserva tal cual
    if (paletaActual[i] && paletaActual[i].bloqueado) {
      nuevaPaleta.push(paletaActual[i]);
    } else {
      nuevaPaleta.push(generarColorHSL());
    }
  }

  paletaActual = nuevaPaleta;
  renderizarPaleta();
}

// Solo pinta la paleta actual en pantalla (no genera colores nuevos)
function renderizarPaleta() {
  const formato = selectFormato.value;

  // Limpiar grid anterior
  paletteGrid.innerHTML = '';

  paletaActual.forEach(function (color, index) {
    const hslStr = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const hexStr = hslAHex(color.h, color.s, color.l);

    // Crear tarjeta
    const card = document.createElement('article');
    card.className = 'palette-card' + (color.bloqueado ? ' bloqueado' : '');
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Color ${hexStr}. Clic para copiar.`);

    card.innerHTML = `
      <div class="palette-color-block" style="background: ${hslStr};">
        <button type="button" class="palette-lock-btn" aria-label="${color.bloqueado ? 'Desbloquear color' : 'Bloquear color'}" title="${color.bloqueado ? 'Desbloquear' : 'Bloquear'}">${color.bloqueado ? '🔒' : '🔓'}</button>
      </div>
      <div class="palette-color-info">
        <span class="palette-color-hex">${hexStr}</span>
        <span class="palette-color-hsl">${formato === 'hsl' ? hslStr : `h:${color.h} s:${color.s}% l:${color.l}%`}</span>
        <span class="palette-copy-hint">📋 Copiar HEX</span>
      </div>
    `;

    // Clic en la tarjeta: copiar HEX al portapapeles (Extra credit #4)
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

    // Clic en el candado: bloquea/desbloquea el color (no dispara el copiado)
    const btnLock = card.querySelector('.palette-lock-btn');
    btnLock.addEventListener('click', function (e) {
      e.stopPropagation();
      color.bloqueado = !color.bloqueado;
      renderizarPaleta();
    });

    paletteGrid.appendChild(card);
  });

  // Animación sutil de entrada solo para las tarjetas nuevas (no las bloqueadas)
  const cards = paletteGrid.querySelectorAll('.palette-card:not(.bloqueado)');
  cards.forEach(function(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(function() {
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 40);
  });

  console.log('[GEM Color Studio] Paleta renderizada: ' + paletaActual.length + ' colores (' + formato + ')');
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

// Botón principal: genera colores nuevos (respetando los bloqueados)
btnGenerar.addEventListener('click', function() {
  generarNuevaPaleta();
  mostrarToast('✅ Paleta generada — clic en un color para copiar su HEX');
});

// Cambiar el tamaño sí regenera (agrega/quita colores, mantiene bloqueados)
selectTamano.addEventListener('change', function() {
  if (paletaActual.length > 0) {
    generarNuevaPaleta();
  }
});

// Cambiar el formato SOLO redibuja los mismos colores en otra notación
// (antes regeneraba colores nuevos por error — ver punto 3)
selectFormato.addEventListener('change', function() {
  if (paletaActual.length > 0) {
    renderizarPaleta();
  }
});

console.log('[GEM Color Studio] Módulo cargado ✅');
