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

// Download CV: build a PDF from the live intro content so any future edits
// to intro.html automatically appear in the downloaded resume.
function downloadCV(lang) {
  if (!window.html2pdf) return;
  const isHe = lang === 'he';
  const selCol = isHe ? '.col-he' : '.col-en';

  const introCol = document.querySelector('.intro-cols ' + selCol);
  const cvCol    = document.querySelector('.cv-block ' + selCol);
  if (!cvCol) return;

  const wrap = document.createElement('div');
  wrap.style.cssText =
    'width:794px;padding:40px 48px;box-sizing:border-box;' +
    'color:#111;background:#fff;font-size:13px;line-height:1.6;' +
    'font-family:' + (isHe ? "'Heebo','Assistant',sans-serif" : "'Work Sans',sans-serif") + ';' +
    (isHe ? 'direction:rtl;text-align:right;' : '');

  if (introCol) {
    const bio = introCol.cloneNode(true);
    bio.style.marginBottom = '24px';
    wrap.appendChild(bio);
    const hr = document.createElement('hr');
    hr.style.cssText = 'border:none;border-top:1px solid #ccc;margin:24px 0;';
    wrap.appendChild(hr);
  }

  const cv = cvCol.cloneNode(true);
  cv.querySelectorAll('.dl-cv').forEach(el => el.remove());
  wrap.appendChild(cv);

  // Attach offscreen — html2canvas needs the element rendered in the DOM
  // with real dimensions, otherwise the resulting PDF comes out blank.
  const stage = document.createElement('div');
  stage.style.cssText = 'position:fixed;left:-10000px;top:0;';
  stage.appendChild(wrap);
  document.body.appendChild(stage);

  const filename = isHe ? 'Sharon-Barazani-CV-HE.pdf' : 'Sharon-Barazani-CV-EN.pdf';
  window.html2pdf().set({
    margin: 10,
    filename: filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(wrap).save().then(() => {
    document.body.removeChild(stage);
  }).catch(err => {
    console.error('CV download failed', err);
    document.body.removeChild(stage);
  });
}

document.addEventListener('click', e => {
  const link = e.target.closest('.dl-cv');
  if (!link) return;
  e.preventDefault();
  downloadCV(link.dataset.lang);
});
