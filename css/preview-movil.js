// ================================================
// THE GEM — Landing Page
// preview-movil.js — Muestra la página dentro de un
// marco tipo celular, para verla "como se vería en móvil"
// sin salir de la página ni abrir las devtools.
// ================================================

document.addEventListener('DOMContentLoaded', function () {
  const btnAbrir  = document.getElementById('btn-preview-movil');
  const btnCerrar = document.getElementById('btn-cerrar-preview');
  const btnRotar  = document.getElementById('btn-rotar-preview');
  const overlay   = document.getElementById('preview-movil-overlay');
  const marco     = document.getElementById('preview-movil-marco');
  const iframe    = document.getElementById('preview-movil-iframe');

  if (!btnAbrir || !overlay) return; // por seguridad, si algo falta no rompe la página

  let horizontal = false;

  // Abrir vista previa
  btnAbrir.addEventListener('click', function () {
    // Carga la página actual dentro del iframe (sin recargar la página real)
    iframe.src = window.location.href;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden'; // evita scroll de fondo mientras está abierto
  });

  // Cerrar vista previa
  btnCerrar.addEventListener('click', cerrarPreview);

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) cerrarPreview();
  });

  // Cerrar si se hace clic fuera del marco (en el fondo oscuro)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) cerrarPreview();
  });

  // Rotar el marco (vertical <-> horizontal)
  btnRotar.addEventListener('click', function () {
    horizontal = !horizontal;
    marco.classList.toggle('horizontal', horizontal);
  });

  function cerrarPreview() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    iframe.src = ''; // libera el iframe para no seguir corriendo el juego de fondo
  }

  console.log('[THE GEM] Vista previa móvil lista ✅');
});
