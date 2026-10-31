// ============================================================
// JACarrascoDelCid.dev — comportamiento
// ------------------------------------------------------------
// Indice:
//   1. Menú móvil (abrir, cerrar, cerrar al tocar fuera)
//   2. Animaciones al hacer scroll
//   3. Ventanas modales (email, teléfono y Cuéntame tu proyecto)
//   4. Año automático del pie
// ============================================================
// ===== Menú móvil =====
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
menuBtn.addEventListener('click', () => navList.classList.toggle('abierto'));
navList.addEventListener('click', () => navList.classList.remove('abierto'));

// Cierra el menú móvil al pulsar en cualquier parte fuera de él
document.addEventListener('click', (evento) => {
  const enElMenu = navList.contains(evento.target);
  const enElBoton = menuBtn.contains(evento.target) || evento.target === menuBtn;
  if (!enElMenu && !enElBoton) navList.classList.remove('abierto');
});

// ===== Animaciones al hacer scroll =====
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('visible');
    observador.unobserve(entrada.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.animar').forEach((el) => observador.observe(el));

// (El desplazamiento suave al pulsar "Sobre mí" usa el scroll-behavior
// nativo del navegador; no se anima a mano para mantener la respuesta
// rápida que se siente mejor.)

// ===== Ventanas modales: "copiar email" y "Cuéntame tu proyecto" =====
const EMAIL = 'delcid.dev@gmail.com';
const TELEFONO = '+34 666 111 162';
let popAbierta = null; // la modal que esté visible ahora mismo (o ninguna)

function cerrarPop() {
  if (popAbierta) { popAbierta.remove(); popAbierta = null; }
}

// Crea la ventana modal con el mismo look para las dos y devuelve sus piezas
function crearPop(contenido) {
  cerrarPop();
  const pop = document.createElement('div');
  pop.className = 'email-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'true');
  pop.innerHTML =
    '<div class="email-pop__box">' +
    '  <button type="button" class="email-pop__close" aria-label="Cerrar">✕</button>' +
    contenido +
    '</div>';
  document.body.appendChild(pop);
  popAbierta = pop;
  pop.querySelector('.email-pop__close').addEventListener('click', cerrarPop);
  return pop;
}

const ICONO_COPIAR =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

const ICONO_OK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

const ICONO_CARTA =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

const ICONO_TELEFONO =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

// Fila tipo "pill" con un texto, su icono opcional y su botoncito de copiar
function filaCopiar(texto, icono) {
  return (
      '  <div class="email-pop__row">' +
      (icono
        ? '    <span class="email-pop__icon" aria-hidden="true">' + icono + '</span>'
        : '') +
      '    <span class="email-pop__dir">' + texto + '</span>' +
      '    <button type="button" class="email-pop__copy" aria-label="Copiar" title="Copiar">' +
      ICONO_COPIAR +
      '    </button>' +
      '  </div>');
}

// Copia el texto al portapapeles (con respaldo para navegadores antiguos)
function prepararCopiar(pop, texto) {
  const copiar = pop.querySelector('.email-pop__copy');
  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const campo = document.createElement('textarea');
      campo.value = texto;
      document.body.appendChild(campo);
      campo.select();
      document.execCommand('copy');
      campo.remove();
    }
    copiar.classList.add('is-ok');
    copiar.innerHTML = ICONO_OK;
    copiar.setAttribute('title', '¡Copiado!');
    setTimeout(cerrarPop, 1500);
  });
}

// Modal 1: al pulsar "Enviar un email"
function abrirEmailPop() {
  const pop = crearPop(
      '  <p class="email-pop__title">Escríbeme a</p>' +
      filaCopiar(EMAIL, null));
  prepararCopiar(pop, EMAIL);
}

// Modal 2: al pulsar "Cuéntame tu proyecto" — la info del apartado de Hablemos
function abrirContactoPop() {
  const pop = crearPop(
      '  <h3 class="contacto-pop__head">¡Hablemos!</h3>' +
      '  <p class="contacto-pop__txt">¿Tienes un proyecto entre manos o necesitas experiencia en desarrollo iOS? Cuéntame qué necesitas y busquemos la mejor manera de hacerlo realidad.</p>' +
      filaCopiar(EMAIL, ICONO_CARTA) +
      '  <div class="email-pop__row">' +
      '    <span class="email-pop__icon" aria-hidden="true">' + ICONO_TELEFONO + '</span>' +
      '    <span class="email-pop__dir">' + TELEFONO + '</span>' +
      '  </div>');
  prepararCopiar(pop, EMAIL);
}

// Modal 3: al pulsar el icono de teléfono de la cabecera
function abrirTelefonoPop() {
  const pop = crearPop(
      '  <p class="email-pop__title">Llámame al</p>' +
      filaCopiar(TELEFONO, ICONO_TELEFONO));
  prepararCopiar(pop, TELEFONO);
}

document.querySelectorAll('.js-email').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault(); // que no arranque el gestor de correo directamente
    if (popAbierta) { cerrarPop(); return; } // segundo clic = cerrar
    abrirEmailPop();
  });
});

document.querySelectorAll('.js-contacto').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault(); // con la modal no hace falta saltar a la sección
    if (popAbierta) { cerrarPop(); return; } // segundo clic = cerrar
    abrirContactoPop();
  });
});

document.querySelectorAll('.js-tel').forEach((enlace) => {
  enlace.addEventListener('click', (evento) => {
    evento.preventDefault(); // mostramos la modal en vez de llamar directamente
    if (popAbierta) { cerrarPop(); return; } // segundo clic = cerrar
    abrirTelefonoPop();
  });
});

// Cerrar la ventana con Escape o al hacer clic en el fondo atenuado
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') cerrarPop();
});
document.addEventListener('click', (evento) => {
  if (popAbierta && evento.target === popAbierta) cerrarPop();
});

// ===== Año automático en el pie =====
document.getElementById('anio').textContent = new Date().getFullYear();
