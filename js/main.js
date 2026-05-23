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

// Download CV: clones the intro paragraph + CV column for the requested
// language into a hidden print-only container, then opens the browser's
// print dialog. The user picks "Save as PDF". Because the source is the
// live DOM, any future edits to intro.html automatically flow into the
// downloaded resume.
function downloadCV(lang) {
  const isHe = lang === 'he';
  const selCol = isHe ? '.col-he' : '.col-en';

  const introCol = document.querySelector('.intro-cols ' + selCol);
  const cvCol    = document.querySelector('.cv-block ' + selCol);
  if (!cvCol) return;

  const root = document.createElement('div');
  root.id = 'cv-print';
  if (isHe) root.classList.add('he');

  if (introCol) {
    const bio = introCol.cloneNode(true);
    bio.classList.add('cv-print-bio');
    root.appendChild(bio);
  }
  const cv = cvCol.cloneNode(true);
  cv.querySelectorAll('.dl-cv').forEach(el => el.remove());
  root.appendChild(cv);

  document.body.appendChild(root);
  document.body.classList.add('printing-cv');

  // Browsers use document.title as the default Save-as-PDF filename.
  const originalTitle = document.title;
  document.title = isHe ? 'Sharon-Barazani-CV-HE' : 'Sharon-Barazani-CV-EN';

  const cleanup = () => {
    document.body.classList.remove('printing-cv');
    document.title = originalTitle;
    if (root.parentNode) root.parentNode.removeChild(root);
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);

  // Slight delay so the print stylesheet is applied before the dialog opens.
  setTimeout(() => window.print(), 50);
  // Safety: if afterprint never fires (some Safari versions), clean up anyway.
  setTimeout(cleanup, 4000);
}

document.addEventListener('click', e => {
  const link = e.target.closest('.dl-cv');
  if (!link) return;
  e.preventDefault();
  downloadCV(link.dataset.lang);
});
