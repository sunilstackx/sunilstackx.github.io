// Mobile navigation and page year.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Gentle binary rain across the screen, kept behind the page content.
const canvas = document.querySelector('#binary-rain');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fontSize = 16;
  let columns = 0;
  let drops = [];
  let frame = 0;

  function resizeRain() {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * scale);
    canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    columns = Math.ceil(window.innerWidth / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -window.innerHeight / fontSize);
  }

  function drawRain() {
    if (reducedMotion.matches) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = `${fontSize}px 'DM Mono', monospace`;
    ctx.fillStyle = 'rgba(22, 123, 98, 0.30)';
    for (let i = 0; i < drops.length; i++) {
      const digit = Math.random() > 0.5 ? '1' : '0';
      ctx.fillText(digit, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.985) drops[i] = 0;
      drops[i] += 0.28;
    }
    frame = window.requestAnimationFrame(drawRain);
  }

  resizeRain();
  if (!reducedMotion.matches) drawRain();
  window.addEventListener('resize', resizeRain, { passive: true });
  reducedMotion.addEventListener('change', () => {
    window.cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (!reducedMotion.matches) drawRain();
  });
}
