const searchBox = document.getElementById('target');
const resultBox = document.createElement('div');
let suggestionClicked = false;

resultBox.classList.add('bg-white', 'border', 'rounded', 'p-2', 'mt-1');
searchBox.parentNode.appendChild(resultBox);
// search function to select searched species
searchBox.addEventListener('input', async () => {
    suggestionClicked = false;
    const query = searchBox.value.trim();
    if (query.length < 2) {
        resultBox.innerHTML = '';
        return;
    }

    // AI generated (line 17 - 22)
    const res = await fetch(`/quests/searchTarget?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    resultBox.innerHTML = data
        .map(species => `<div class="suggestion cursor-pointer hover:bg-gray-100 p-1">${species.speciesName}</div>`)
        .join('');

    document.querySelectorAll('.suggestion').forEach(item => {
        item.addEventListener('click', () => {
            searchBox.value = item.textContent;
            suggestionClicked = true;
            resultBox.innerHTML = '';
        });
    });
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    if (!suggestionClicked) {
        e.preventDefault();
        alert('Please select a species from the suggestion list.');
    }
});