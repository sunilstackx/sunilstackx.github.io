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


  // Array of colors for the binary rain to choose from
  const colors = [
    '#167B62', // Deep teal (from your earlier color)
    '#00FF41', // Matrix Green
    '#00E5FF', // Electric Cyan
    '#FF007F', // Neon Pink
    '#9D00FF', // Purple
    '#FFD700'  // Gold
  ];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    
    // Initialize drops with an y-coordinate and a specific color index
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = {
        y: Math.random() * -canvas.height, // Staggered start heights
        color: colors[Math.floor(Math.random() * colors.length)] // Assign random color
      };
    }
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function draw() {
    // Clear canvas gently with semi-transparent black to create a trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Pick '0' or '1' randomly
      const text = Math.random() > 0.5 ? '1' : '0';
      const x = i * fontSize;
      const y = drops[i].y;

      // Set the specific color assigned to this column
      ctx.fillStyle = drops[i].color;
      ctx.fillText(text, x, y);

      // Reset drop to the top with a new random color once it falls off screen
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i].y = 0;
        drops[i].color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        drops[i].y += fontSize;
      }
    }

    // Respect user's system preferences for reduced motion
    if (!reducedMotion.matches) {
      requestAnimationFrame(draw);
    }
  }

  // Start the animation loop
  draw();
}


  
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
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
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
