// Hero title: scale each word so they all fill the same horizontal width
// at their natural letter-spacing (like the Wix original).
function fitHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const lines = title.querySelectorAll('.line');
  if (!lines.length) return;
  const target = title.clientWidth;

  lines.forEach(line => {
    line.style.fontSize = '';            // reset to base size from CSS
    line.style.display = 'inline-block'; // measure natural width
  });

  lines.forEach(line => {
    const baseSize = parseFloat(getComputedStyle(line).fontSize);
    const natural = line.getBoundingClientRect().width;
    if (natural > 0) {
      line.style.fontSize = (baseSize * target / natural) + 'px';
    }
    line.style.display = 'block';
  });
}

// Run once now, again after web fonts load (so measurement is accurate),
// and on resize.
fitHeroTitle();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitHeroTitle);
}
window.addEventListener('resize', fitHeroTitle);
