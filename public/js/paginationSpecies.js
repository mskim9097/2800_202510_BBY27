document.addEventListener("DOMContentLoaded", () => {
    const filterToggle = document.getElementById("filterToggle");
    const filterContainer = document.getElementById("filterContainer");
    const filterSelect = document.getElementById("filterType");
    const searchInput = document.getElementById("searchInput");
    const cards = Array.from(document.querySelectorAll("[data-type]")); // all cards
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");
  
    const itemsPerPage = 4;
    let currentPage = 1;
    let filteredCards = [...cards];
  
    filterToggle.addEventListener("click", () => {
      filterContainer.classList.toggle("hidden");
    });
  
    function applyFilters() {
      const selectedType = filterSelect.value.toLowerCase();
      const searchTerm = searchInput.value.toLowerCase();
  
      filteredCards = cards.filter((card) => {
        const type = card.dataset.type.toLowerCase();
        const text = card.innerText.toLowerCase();
  
        const matchesType = !selectedType || type === selectedType;
        const matchesSearch = text.includes(searchTerm);
  
        return matchesType && matchesSearch;
      });
  
      currentPage = 1;
      renderPage();
    }
  
    function renderPage() {
        // Hide all cards first
        cards.forEach((card) => (card.style.display = "none"));
      
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
      
        // Show only the filtered cards in the current page range
        filteredCards.forEach((card, index) => {
          if (index >= start && index < end) {
            card.style.display = "block";
          }
        });
      
        // Update pagination status
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage >= totalPages;
      }
      
  
    // Pagination buttons
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });
  
    nextPageBtn.addEventListener("click", () => {
      const maxPage = Math.ceil(filteredCards.length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderPage();
      }
    });
  
    // Filters
    filterSelect.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);
  
    // Initial render
    applyFilters(); // filters everything by default
  });
  