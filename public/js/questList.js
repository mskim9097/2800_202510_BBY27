document.addEventListener('DOMContentLoaded', () => {
  const difficultyFilter = document.getElementById('difficultyFilter');
  const timeFilter = document.getElementById('timeFilter');
  const creatorFilter = document.getElementById('creatorFilter');
  const pageButtons = document.querySelectorAll('.page-btn');
  const searchInput = document.getElementById('search');

  const updatePage = (page = 1) => {
    const difficulty = difficultyFilter.value;
    const time = timeFilter.value;
    const creator = creatorFilter.value;
    const search = searchInput.value;

    const params = new URLSearchParams();
    if (difficulty) params.append('difficulty', difficulty);
    if (time) params.append('time', time);
    if (creator) params.append('creator', creator);
    if (search) params.append('search', search);
    params.append('page', page);

    window.location.href = `/quests?${params.toString()}`;
  };

  [difficultyFilter, timeFilter, creatorFilter].forEach(filter => {
    filter.addEventListener('change', () => updatePage(1));
  });

  pageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const page = button.dataset.page;
      updatePage(page);
    });
  });

  // Handle search submit on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updatePage(1);
    }
  });
});
document.getElementById('filterToggle').addEventListener('click', () => {
  const filters = document.getElementById('filtersContainer');
  filters.classList.toggle('hidden');
});
