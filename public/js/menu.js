// Ai generated code (all of menu.js) - ChatGPT 4 Turbo
const btn = document.getElementById('dropdownButton');
const menu = document.getElementById('dropdownMenu');

btn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

// Optional: close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!btn.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add('hidden');
  }
});
