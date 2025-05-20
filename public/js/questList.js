const container = document.getElementById('speciesContainer');
const loading = document.getElementById('loading');

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

container.addEventListener('scroll', () => {
    if (isLoading || currentIndex >= questData.length) return;

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
        isLoading = true;
        if (currentIndex >= questData.length) return;

        loading.classList.remove('hidden');
        setTimeout(() => {
            renderNextBatch();
            loading.classList.add('hidden');
            isLoading = false;
        }, 800);
    }
});