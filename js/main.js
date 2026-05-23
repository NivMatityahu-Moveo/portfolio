// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Split each hero-title line into per-letter spans so flex justify-content
// distributes them evenly — each line then occupies the same visual width.
document.querySelectorAll('.hero-title .line').forEach(line => {
  const text = line.textContent;
  line.textContent = '';
  for (const ch of text) {
    const s = document.createElement('span');
    s.textContent = ch;
    line.appendChild(s);
  }
});
