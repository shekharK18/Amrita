document.addEventListener('DOMContentLoaded', () => {
  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Dot follows mouse position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = 	ranslate(px, px);
  });

  // Interactive element hover: expand dot and glow gold
  const interactives = document.querySelectorAll('a, button, .portfolio-card, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 	ranslate(px, px) scale(1.6);
      dot.style.background = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 	ranslate(px, px) scale(1);
      dot.style.background = 'var(--crimson)';
    });
  });

  // Hide when leaving window
  document.body.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });
  document.body.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });
});