// ============================================================
//   MEDIA‑GRID.JS → GSAP parallax hover used in slide 2‑2
// ============================================================
/* global gsap */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.mwg_effect000');
    if (!root) return;

    let oldX = 0, oldY = 0, dx = 0, dy = 0;
    root.addEventListener('mousemove', e => {
      dx = e.clientX - oldX;
      dy = e.clientY - oldY;
      oldX = e.clientX;
      oldY = e.clientY;
    });

    root.querySelectorAll('.media').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const img = el.querySelector('img');
        const tl  = gsap.timeline({ onComplete: () => tl.kill() }).timeScale(1.2);
        tl.to(img, { x: dx*0.5, y: dy*0.5, duration:0.6, ease:'power3.out', yoyo:true, repeat:1 });
        tl.fromTo(img, { rotate:0 }, { rotate:(Math.random()-0.5)*30, duration:0.4, ease:'power1.inOut', yoyo:true, repeat:1 }, '<');
      });
    });
  });
})();
