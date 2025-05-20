const container = document.getElementById('speciesContainer');
const loading = document.getElementById('loading');
const difficultyFilter = document.getElementById('difficultyFilter');
const timeFilter = document.getElementById('timeFilter');
const searchInput = document.getElementById('searchInput');

let currentIndex = 0;
const batchSize = 5;
let isLoading = false;

async function renderNextBatch() {
    const end = Math.min(currentIndex + batchSize, questData.length);
    for (let i = currentIndex; i < end; i++) {
        const quest = questData[i];
        const species = await fetch(`/species/selectTarget?id=${quest.speciesId}`).then(res => res.json());
        const card = document.createElement('div');
        card.className = "min-w-[250px] bg-white rounded-xl shadow flex-shrink-0";

        card.setAttribute('data-difficulty', quest.questDifficulty.toLowerCase());
        card.setAttribute('data-time', quest.questTimeOfDay.toLowerCase());
        card.setAttribute('data-title', quest.questTitle.toLowerCase());
        card.setAttribute('data-mission', quest.questMission.toLowerCase());
        card.setAttribute('data-target', species.speciesName.toLowerCase());
        card.innerHTML = `
            <img src="${species.speciesImage}" alt="Species Image" class="w-full h-40 object-cover rounded-t-xl">
            <div class="p-3">
                <h2 class="text-lg font-bold text-green-700">${quest.questTitle}</h2>
                <p class="italic text-gray-600">${quest.questMission}</p>
                <p class="mt-2 text-gray-700 text-sm">
                    Target: ${species.speciesName}
                </p>
                <p class="mt-2 text-gray-700 text-sm">
                    Time: ${quest.questTimeOfDay} | Difficulty: ${quest.questDifficulty}
                </p>
                <a href="/quests/${quest._id}" class="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded">
                    View Details
                </a>
            </div>`;
        container.appendChild(card);
    }
    currentIndex = end;
}

renderNextBatch();

container.addEventListener('scroll', scrollHandler);

function scrollHandler() {
    if (isLoading || currentIndex >= questData.length) return;

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
        isLoading = true;

        loading.classList.remove('hidden');
        setTimeout(() => {
            renderNextBatch();
            loading.classList.add('hidden');
            isLoading = false;
        }, 800);
    }
}

function filterQuest() {
    const selectedDifficulty = difficultyFilter.value.toLowerCase();
    const selectedTime = timeFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll('[data-difficulty]');

    cards.forEach(card => {
        const difficulty = card.dataset.difficulty.toLowerCase();
        const time = card.dataset.time.toLowerCase();
        const text = card.innerText.toLowerCase();

        const matchesDifficulty = !selectedDifficulty || difficulty === selectedDifficulty;
        const matchesTime = !selectedTime || time === selectedTime;
        const matchesSearch = text.includes(searchTerm);

        const visible = matchesDifficulty && matchesTime && matchesSearch;
        card.style.display = visible ? 'block' : 'none';
    });


    const isFiltering = selectedDifficulty || selectedTime || searchTerm;
    if (isFiltering) {
        container.removeEventListener('scroll', scrollHandler);
    } else {
        container.addEventListener('scroll', scrollHandler);
    }
}
difficultyFilter.addEventListener('change', filterQuest);
timeFilter.addEventListener('change', filterQuest);
searchInput.addEventListener('input', filterQuest);
