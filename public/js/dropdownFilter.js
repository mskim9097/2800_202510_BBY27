document.addEventListener('DOMContentLoaded', () => {
  const filterToggle = document.getElementById('filterToggle');
  const filterContainer = document.getElementById('filterContainer');
  const filterSelect = document.getElementById('filterType');
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('[data-type]');
  filterToggle.addEventListener('click', () => {
    filterContainer.classList.toggle('hidden');
  });

  function filterSpecies() {
    const selectedType = filterSelect.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    cards.forEach((card) => {
      const type = card.dataset.type.toLowerCase();
      const text = card.innerText.toLowerCase();

      const matchesType = !selectedType || type === selectedType;
      const matchesSearch = text.includes(searchTerm);

      card.style.display = matchesType && matchesSearch ? 'block' : 'none';
    });
  }

  filterSelect.addEventListener('change', filterSpecies);
  searchInput.addEventListener('input', filterSpecies);
});
