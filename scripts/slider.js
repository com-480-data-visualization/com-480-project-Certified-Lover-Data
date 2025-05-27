// =========================================================
//  SLIDER.JS  –  handles page navigation & lazy‑loading
// =========================================================
/* global drawMap, drawCorrelationHeatmap, drawScatter */
(function () {
  let currentSlide = 0;
  const totalSlides = 10;

  // ------------------------------------------------------------------
  //  expose helpers so inline onclick="nextSlide()" still works
  // ------------------------------------------------------------------
  window.nextSlide = function () {
    if (currentSlide < totalSlides - 1) {
      currentSlide += 1;
      updateSlide();
    }
  };
  window.prevSlide = function () {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateSlide();
    }
  };

  // ------------------------------------------------------------------
  //  main update routine – translates slider & toggles UI bits
  // ------------------------------------------------------------------
   function updateSlide() {
    const container = document.querySelector('.slider-container');
    container.style.transform = `translateX(-${currentSlide * 100}vw)`;

    document.getElementById('leftArrow').style.display  = currentSlide === 0             ? 'none' : 'block';
    document.getElementById('rightArrow').style.display = currentSlide === totalSlides-1 ? 'none' : 'block';

    document.querySelectorAll('.nav-indicator .bar')
      .forEach((bar,i)=> bar.classList.toggle('active', i === currentSlide));

    // click prompt only on first real slide
    document.getElementById("clickPrompt").style.display = currentSlide === 0 ? "block":"none";

    // you can hook your drawMap / drawHeatmap / drawScatter when hitting their new indices:
    if (currentSlide === 2 && !window.mapDrawn) {
      drawMap(); window.mapDrawn = true;
    }
    if (currentSlide === 4 && !window.scatterDrawn) {
    drawScatter();
    window.scatterDrawn = true;
  }
    if (currentSlide === 6 && !window.heatmapDrawn) {
      drawCorrelationHeatmap(document.getElementById("correlation-select").value);
      window.heatmapDrawn = true;
    }
    if (currentSlide === 8 && !window.scatterDrawn) {
      drawScatter(); window.scatterDrawn = true;
    }
  }

  // ------------------------------------------------------------------
  //  initial boot once DOM is ready
  // ------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    updateSlide();

    // re‑render heat‑map when user changes the genre dropdown
    const select = document.getElementById('correlation-select');
    if (select) {
      select.addEventListener('change', e => drawCorrelationHeatmap(e.target.value));
    }

    // ← / → / PgUp / PgDn / Space keyboard shortcuts
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ': e.preventDefault(); window.nextSlide(); break;
        case 'ArrowLeft':
        case 'PageUp':   window.prevSlide(); break;
      }
    });
  });
})();
