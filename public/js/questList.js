const container = document.getElementById('speciesContainer');
const loading = document.getElementById('loading');
const difficultyFilter = document.getElementById('difficultyFilter');
const timeFilter = document.getElementById('timeFilter');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

let currentIndex = 0;
const batchSize = 5;
let isLoading = false;
let isScrollAttached = true;
let debounceTimer = null;
let isRendering = false;

// create card
async function createCard(quest) {
  const species = await fetch(
    `/species/selectTarget?id=${quest.speciesId}`
  ).then((res) => res.json());

  const card = document.createElement('div');
  card.className = 'min-w-[250px] bg-white rounded-xl shadow flex-shrink-0';

  let completedText = '';
  if (quest.questAcceptedBy && quest.questAcceptedBy.length > 0) {
    completedText = '<p class="text-sm font-semibold text-green-600 mt-1">Completed</p>';
  } else {
    completedText = '<p class="text-sm font-semibold text-red-600 mt-1">Not Accepted</p>';
  }

  card.innerHTML = `
    <img src="${species.speciesImage}" alt="${species.speciesName}" class="w-full h-40 object-cover rounded-t-xl">
    <div class="p-3">
      <h2 class="text-lg font-bold text-green-700">${quest.questTitle}</h2>
      <p class="italic text-gray-600">${quest.questMission}</p>
      <p class="mt-2 text-gray-700 text-sm">Target: ${species.speciesName}</p>
      <p class="mt-2 text-gray-700 text-sm">Time: ${quest.questTimeOfDay} | Difficulty: ${quest.questDifficulty}</p>
      ${completedText}
      <a href="/quests/${quest._id}" class="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded">View Details</a>
    </div>`;
  return card;
}

// AI generated to integrate scrolling and search/filter
// (But search/filter is my own. just for integratation).

// render function for next scrolling
async function renderNextBatch() {
  const end = Math.min(currentIndex + batchSize, questData.length);
  for (let i = currentIndex; i < end; i++) {
    const card = await createCard(questData[i]);
    container.appendChild(card);
  }
  currentIndex = end;
}

// function to render filtered results
async function renderFilteredResults(filteredList) {
  if (isRendering) return;
  isRendering = true;
  container.innerHTML = '';
  for (const quest of filteredList) {
    const card = await createCard(quest);
    container.appendChild(card);
  }
  isRendering = false;
}

// filter and search
function filterQuest() {
  const selectedDifficulty = difficultyFilter.value.toLowerCase();
  const selectedTime = timeFilter.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();
  const selectedStatus = statusFilter.value.toLowerCase();

  const isFiltering = selectedDifficulty || selectedTime || searchTerm || selectedStatus;

  if (isFiltering && isScrollAttached) {
    container.removeEventListener('scroll', scrollHandler);
    isScrollAttached = false;
  }

  if (!isFiltering && !isScrollAttached) {
    container.innerHTML = '';
    currentIndex = 0;
    renderNextBatch();
    container.addEventListener('scroll', scrollHandler);
    isScrollAttached = true;
    return;
  }

  const filtered = questData.filter((q) => {
    const difficulty = q.questDifficulty.toLowerCase();
    const time = q.questTimeOfDay.toLowerCase();
    const title = q.questTitle.toLowerCase();
    const mission = q.questMission.toLowerCase();
    const isCompleted = q.questAcceptedBy && q.questAcceptedBy.length > 0;

    return (
      (!selectedDifficulty || difficulty === selectedDifficulty) &&
      (!selectedTime || time === selectedTime) &&
      (title.includes(searchTerm) || mission.includes(searchTerm)) &&
      (!selectedStatus || 
       (selectedStatus === "completed" && isCompleted) || 
       (selectedStatus === "notaccepted" && !isCompleted))
    );
  });

  renderFilteredResults(filtered);
}

// AI generated.
// function to give some delay when searching and filtering
function debounceFilterQuest() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    filterQuest();
  }, 300);
}

function scrollHandler() {
  if (isLoading || currentIndex >= questData.length) return;

  if (
    container.scrollLeft + container.clientWidth >=
    container.scrollWidth - 100
  ) {
    isLoading = true;
    loading.classList.remove('hidden');
    setTimeout(async () => {
      await renderNextBatch();
      loading.classList.add('hidden');
      isLoading = false;
    }, 500);
  }
}

difficultyFilter.addEventListener('change', debounceFilterQuest);
timeFilter.addEventListener('change', debounceFilterQuest);
searchInput.addEventListener('input', debounceFilterQuest);
statusFilter.addEventListener('change', debounceFilterQuest);

renderNextBatch();
container.addEventListener('scroll', scrollHandler);
