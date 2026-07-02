// ================================================
// THE GEM — Mini Demo Jugable
// minijuego.js
// ================================================

// 1. Seleccionamos el canvas y obtenemos el contexto 2D
const canvas = document.getElementById('gem-canvas');
const ctx = canvas.getContext('2d');

// 2. Seleccionamos botones y textos del DOM
const btnIniciar = document.getElementById('btn-iniciar');
const textoEstado = document.getElementById('estado-juego');
const textoPuntaje = document.getElementById('puntaje-juego');

// 3. Variables de estado del juego
let juegoActivo = false;
let puntaje = 0;
let animFrameId = null;

// 4. La GEM (bolita del jugador)
const gem = {
  x: canvas.width / 2,   // posición horizontal: centro
  y: canvas.height / 2,  // posición vertical: centro
  radio: 14,             // tamaño de la bolita
  velocidadX: 0,         // cuánto se mueve en X por frame
  velocidadY: 0,         // cuánto se mueve en Y por frame
  color: 'hsl(185, 100%, 55%)'
};

// 5. Array de obstáculos (spikes)
let obstaculos = [];

// 6. Función para crear un obstáculo nuevo en borde aleatorio
function crearObstaculo() {
  // Elegimos un lado aleatorio: 0=arriba, 1=abajo, 2=izquierda, 3=derecha
  const lado = Math.floor(Math.random() * 4);
  let x, y, velX, velY;
  const speed = 2 + puntaje * 0.008; // aumenta más lento, tope más suave

  if (lado === 0) { // arriba
    x = Math.random() * canvas.width;
    y = -10;
    velX = 0;
    velY = speed;
  } else if (lado === 1) { // abajo
    x = Math.random() * canvas.width;
    y = canvas.height + 10;
    velX = 0;
    velY = -speed;
  } else if (lado === 2) { // izquierda
    x = -10;
    y = Math.random() * canvas.height;
    velX = speed;
    velY = 0;
  } else { // derecha
    x = canvas.width + 10;
    y = Math.random() * canvas.height;
    velX = -speed;
    velY = 0;
  }

  obstaculos.push({ x, y, velX, velY, radio: 10, color: 'hsl(0, 80%, 60%)' });
}

// 7. Función para detectar colisión entre dos círculos
function hayColision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distancia = Math.sqrt(dx * dx + dy * dy);
  return distancia < a.radio + b.radio;
}

// 8. Dibujar la GEM (bolita cyan con brillo)
function dibujarGem() {
  // Brillo exterior
  ctx.beginPath();
  ctx.arc(gem.x, gem.y, gem.radio + 6, 0, Math.PI * 2);
  ctx.fillStyle = 'hsla(185, 100%, 55%, 0.15)';
  ctx.fill();

  // Bolita principal
  ctx.beginPath();
  ctx.arc(gem.x, gem.y, gem.radio, 0, Math.PI * 2);
  ctx.fillStyle = gem.color;
  ctx.fill();
}

// 9. Dibujar obstáculos (círculos rojos)
function dibujarObstaculos() {
  obstaculos.forEach(function(obs) {
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.radio, 0, Math.PI * 2);
    ctx.fillStyle = obs.color;
    ctx.fill();
  });
}

// 10. Dibujar el puntaje encima del canvas
function dibujarPuntaje() {
  ctx.fillStyle = 'hsl(185, 100%, 70%)';
  ctx.font = 'bold 16px system-ui';
  ctx.fillText('Puntaje: ' + puntaje, 12, 24);
}

// 11. Loop principal del juego (se llama ~60 veces por segundo)
function loop() {
  // Limpiar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo oscuro
  ctx.fillStyle = 'hsl(220, 20%, 6%)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mover la GEM según velocidad
  gem.x += gem.velocidadX;
  gem.y += gem.velocidadY;

  // Rebote en los bordes
  if (gem.x - gem.radio < 0 || gem.x + gem.radio > canvas.width) {
    gem.velocidadX *= -1;
  }
  if (gem.y - gem.radio < 0 || gem.y + gem.radio > canvas.height) {
    gem.velocidadY *= -1;
  }

  // Mover obstáculos y eliminar los que salieron del canvas
  obstaculos = obstaculos.filter(function(obs) {
    obs.x += obs.velX;
    obs.y += obs.velY;
    // Mantener solo los que están cerca del canvas
    return obs.x > -50 && obs.x < canvas.width + 50 &&
           obs.y > -50 && obs.y < canvas.height + 50;
  });

  // Revisar colisiones
  for (let i = 0; i < obstaculos.length; i++) {
    if (hayColision(gem, obstaculos[i])) {
      terminarJuego();
      return;
    }
  }

  // Sumar puntaje cada frame
  puntaje++;
  textoPuntaje.textContent = 'Puntaje: ' + puntaje;

  // Cada 50 frames, crear un obstáculo nuevo
  if (puntaje % 50 === 0) {
    crearObstaculo();
  }

  // Dibujar todo
  dibujarObstaculos();
  dibujarGem();
  dibujarPuntaje();

  // Pedir el siguiente frame
  animFrameId = requestAnimationFrame(loop);
}

// 12. Iniciar el juego
function iniciarJuego() {
  // Resetear todo
  puntaje = 0;
  obstaculos = [];
  gem.x = canvas.width / 2;
  gem.y = canvas.height / 2;
  gem.velocidadX = 2.5;
  gem.velocidadY = 2;

  juegoActivo = true;
  btnIniciar.textContent = '🔄 Reiniciar';
  textoEstado.textContent = '¡Mueve el mouse o toca la pantalla para esquivar!';

  // Crear 4 obstáculos iniciales
  crearObstaculo();
  crearObstaculo();
  crearObstaculo();
  crearObstaculo();

  // Cancelar loop anterior si había uno
  if (animFrameId) cancelAnimationFrame(animFrameId);
  loop();
}

// 13. Terminar el juego
function terminarJuego() {
  juegoActivo = false;
  cancelAnimationFrame(animFrameId);

  // Mostrar pantalla de game over en el canvas
  ctx.fillStyle = 'hsla(220, 20%, 6%, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'hsl(0, 80%, 65%)';
  ctx.font = 'bold 28px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('💀 ¡PERDISTE!', canvas.width / 2, canvas.height / 2 - 20);

  ctx.fillStyle = 'hsl(185, 100%, 70%)';
  ctx.font = '18px system-ui';
  ctx.fillText('Puntaje final: ' + puntaje, canvas.width / 2, canvas.height / 2 + 15);

  ctx.fillStyle = 'hsl(0, 0%, 65%)';
  ctx.font = '14px system-ui';
  ctx.fillText('Dale a Reiniciar para intentar de nuevo', canvas.width / 2, canvas.height / 2 + 45);
  ctx.textAlign = 'left';

  textoEstado.textContent = '¡Perdiste! Puntaje: ' + puntaje;
  btnIniciar.textContent = '▶ Jugar de nuevo';

  console.log('[THE GEM] Game over. Puntaje: ' + puntaje);
}

// 14. Controlar la GEM con el mouse (escritorio)
canvas.addEventListener('mousemove', function(e) {
  if (!juegoActivo) return;

  // Obtener posición del mouse relativa al canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // La bolita se mueve hacia donde está el mouse
  const dx = mouseX - gem.x;
  const dy = mouseY - gem.y;
  gem.velocidadX = dx * 0.12;
  gem.velocidadY = dy * 0.12;
});

// 15. Controlar la GEM con el dedo (móvil)
canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  if (!juegoActivo) return;

  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;

  const dx = touchX - gem.x;
  const dy = touchY - gem.y;
  gem.velocidadX = dx * 0.12;
  gem.velocidadY = dy * 0.12;
}, { passive: false });

// 16. Botón iniciar
btnIniciar.addEventListener('click', function() {
  console.log('[THE GEM] Botón presionado — iniciando juego');
  iniciarJuego();
});

// 17. Dibujar pantalla inicial
ctx.fillStyle = 'hsl(220, 20%, 6%)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'hsl(185, 100%, 55%)';
ctx.font = 'bold 20px system-ui';
ctx.textAlign = 'center';
ctx.fillText('◆ Presiona JUGAR para empezar', canvas.width / 2, canvas.height / 2);
ctx.textAlign = 'left';
