/**
 * ARCANA Multimedia Agency - Core Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initIntersectionObserver();
  initLoginForm();
  initContactForm();
  initVideoControls();
  checkSession();
});

/* ==========================================================================
   1. CONTROLES DEL VIDEO (quienes-somos.html)
   ========================================================================== */
function initVideoControls() {
  const video = document.getElementById('promo-video');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnMute = document.getElementById('btnMute');
  const btnFullscreen = document.getElementById('btnFullscreen');

  if (!video) return;

  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
      } else {
        video.pause();
        btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i> Reproducir';
      }
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        btnMute.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Mute';
      } else {
        btnMute.innerHTML = '<i class="fa-solid fa-volume-high"></i> Sonido';
      }
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE11 */
        video.msRequestFullscreen();
      }
    });
  }
}

/* ==========================================================================
   2. SISTEMA DE LOGIN Y CONTROL DE SESIÓN
   ========================================================================== */
const VALID_EMAIL = "hola@arcanaagency.com";
const VALID_PIN = "1234";

function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const emailInput = document.getElementById('email');
  const pinInput = document.getElementById('pin');

  pinInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const emailError = document.getElementById('emailError');
    const pinError = document.getElementById('pinError');

    const emailValue = emailInput.value.trim().toLowerCase();
    const pinValue = pinInput.value.trim();

    // Validar correo
    if (emailValue !== VALID_EMAIL) {
      showError(emailInput, emailError, 'Correo no registrado');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Validar PIN
    if (pinValue !== VALID_PIN) {
      showError(pinInput, pinError, 'PIN incorrecto');
      isValid = false;
    } else {
      clearError(pinInput, pinError);
    }

    if (isValid) {
      // Guardar datos en localStorage y marcar que la sesión acaba de iniciar
      localStorage.setItem('arcana_user', emailValue);
      localStorage.setItem('arcana_is_logged', 'true');
      localStorage.setItem('arcana_just_logged', 'true'); // Bandera de inicio reciente
      window.location.href = 'index.html';
    }
  });
}

function checkSession() {
  const isLogged = localStorage.getItem('arcana_is_logged');
  const userEmail = localStorage.getItem('arcana_user');
  const justLogged = localStorage.getItem('arcana_just_logged');

  const sessionBanner = document.getElementById('sessionBanner');
  const sessionBannerText = document.getElementById('sessionBannerText');
  const btnLogout = document.getElementById('btnLogout');
  const loginNavBtn = document.querySelector('.btn-login-nav');

  if (isLogged === 'true') {
    // Mantener el botón de navegación actualizado a "Bienvenido (Salir)"
    if (loginNavBtn) {
      loginNavBtn.textContent = 'Bienvenido (Salir)';
      loginNavBtn.href = '#';
      loginNavBtn.title = `Conectado como ${userEmail}. Haz clic para cerrar sesión.`;
      
      loginNavBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm('¿Deseas cerrar la sesión actual?')) {
          logout();
        }
      };
    }

    // Mostrar el cartel superior solo si el usuario acaba de iniciar sesión
    if (justLogged === 'true' && sessionBanner && sessionBannerText) {
      sessionBannerText.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Has iniciado sesión con éxito como <strong>${userEmail}</strong>!`;
      sessionBanner.style.display = 'block';

      if (btnLogout) {
        btnLogout.addEventListener('click', logout);
      }

      // Ocultar el cartel automáticamente después de 3 segundos (3000 ms)
      setTimeout(() => {
        sessionBanner.style.display = 'none';
        localStorage.removeItem('arcana_just_logged'); // Limpiar la bandera para que no vuelva a aparecer al recargar
      }, 3000);
    } else {
      // Si ya estaba conectado de antes y recarga la página, el banner permanece oculto
      if (sessionBanner) {
        sessionBanner.style.display = 'none';
      }
    }
  } else {
    // Si no hay sesión, asegurar que el botón sea el de Iniciar Sesión original
    if (loginNavBtn) {
      loginNavBtn.textContent = 'Iniciar Sesión';
      loginNavBtn.href = 'login.html';
      loginNavBtn.onclick = null;
    }
    if (sessionBanner) {
      sessionBanner.style.display = 'none';
    }
  }
}

function logout() {
  localStorage.removeItem('arcana_is_logged');
  localStorage.removeItem('arcana_user');
  localStorage.removeItem('arcana_just_logged');
  window.location.reload();
}

/* ==========================================================================
   3. MENÚ MÓVIL RESPONSIVO
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   4. INTERSECTION OBSERVER (Animaciones Fade-In)
   ========================================================================== */
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   5. VALIDACIÓN Y LÓGICA DE FORMULARIO DE CONTACTO
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const fullNameInput = document.getElementById('fullName');
  const contactEmailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('message');
  const successBox = document.getElementById('formSuccessMessage');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fullNameError = document.getElementById('fullNameError');
    if (fullNameInput.value.trim().length < 3) {
      showError(fullNameInput, fullNameError, 'Por favor, ingrese su nombre completo');
      isValid = false;
    } else {
      clearError(fullNameInput, fullNameError);
    }

    const contactEmailError = document.getElementById('contactEmailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(contactEmailInput.value.trim())) {
      showError(contactEmailInput, contactEmailError, 'Ingrese un correo electrónico válido');
      isValid = false;
    } else {
      clearError(contactEmailInput, contactEmailError);
    }

    const messageError = document.getElementById('messageError');
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError, 'El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (isValid) {
      contactForm.reset();
      if (successBox) {
        successBox.style.display = 'block';
        setTimeout(() => {
          successBox.style.display = 'none';
        }, 6000);
      }
    }
  });
}

/* Funciones Auxiliares de Error */
function showError(input, errorElement, message) {
  input.style.borderColor = '#ff5555';
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function clearError(input, errorElement) {
  input.style.borderColor = 'var(--border-color)';
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}