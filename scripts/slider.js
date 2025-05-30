// =========================================================
//  SLIDER + GLOBAL NAVIGATION
// ---------------------------------------------------------
//  • Handles ←/→ navigation & indicator bar
//  • Lazily triggers heavy D3 renders (map / heatmap / scatter)
//    once their slide first comes into view
// =========================================================
/* globals drawMap, drawCorrelationHeatmap, drawScatter */

let currentSlide = 0;
const totalSlides = 10;

export function nextSlide () {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlide();
  }
}
export function prevSlide () {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlide();
  }
}

window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

function updateSlide () {
  const container = document.querySelector('.slider-container');
  container.style.transform = `translateX(-${currentSlide * 100}vw)`;

  // arrows + indicator bars
  document.getElementById('leftArrow').style.display  = currentSlide === 0             ? 'none' : 'block';
  document.getElementById('rightArrow').style.display = currentSlide === totalSlides-1 ? 'none' : 'block';
  document.querySelectorAll('.nav-indicator .bar')
    .forEach((bar, i) => bar.classList.toggle('active', i === currentSlide));

  // click prompt only on very first intro slide
  document.getElementById('clickPrompt').style.display = currentSlide === 0 ? 'block' : 'none';

  // ---------- lazy‑load heavy charts only once ----------
  if (currentSlide === 2 && !window._mapDrawn) {
    drawMap();
    window._mapDrawn = true;
  }
  if (currentSlide === 4 && !window._heatmapDrawn) {
    const file = document.getElementById('correlation-select').value;
    drawCorrelationHeatmap(file);
    window._heatmapDrawn = true;
  }
  if (currentSlide === 5 && !window._playerDrawn) {
    drawPlayer();
    window._playerDrawn = true;
  }
  if ((currentSlide === 4 || currentSlide === 8) && !window.scatterDrawn) {
    drawScatter();
    window.scatterDrawn = true;
  }
  

}

// =========================================================
//  DOM READY — BOOT EVERYTHING
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  // initial render
  updateSlide();

  // dropdown used by heatmap
  document.getElementById('correlation-select')?.addEventListener('change', e => drawCorrelationHeatmap(e.target.value));

  // keyboard navigation
  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':          e.preventDefault(); nextSlide(); break;
      case 'ArrowLeft':
      case 'PageUp':     prevSlide(); break;
    }
  });
  document.getElementById('rightArrow')
    .addEventListener('click', nextSlide);

  document.getElementById('leftArrow')
    .addEventListener('click', prevSlide);
});
