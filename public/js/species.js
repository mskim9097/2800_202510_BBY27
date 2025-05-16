
// Code used from the quest.js file, but modified with ChatGPT to accomodate the species search
// Chat helped create the color change and preventing the form from submitting, as well as
// creating warning text below the search box
const searchBox = document.getElementById('speciesScientificName');
const warningBox = document.createElement('div');
let speciesExists = false;

// Style for the warning message
warningBox.classList.add('text-red-600', 'mt-1', 'font-semibold');

// Add it after the input box
searchBox.parentNode.appendChild(warningBox);

searchBox.addEventListener('input', async () => {
    const query = searchBox.value.trim();
    speciesExists = false;
    warningBox.textContent = '';
    searchBox.classList.remove('border-red-500', 'text-red-600');

    if (query.length < 2) return;

    const res = await fetch(`/species/searchTarget?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    // Check for an exact match
    const match = data.some(
        species => species.speciesScientificName.toLowerCase() === query.toLowerCase()
    );

    if (match) {
        speciesExists = true;
        warningBox.textContent = 'This species already exists!';
        searchBox.classList.add('border-red-500', 'text-red-600');
    }
});

// Prevent form submission if duplicate
document.querySelector('form').addEventListener('submit', (e) => {
    if (speciesExists) {
        e.preventDefault();
        warningBox.textContent = 'This species already exists! Submission prevented.';
        searchBox.classList.add('border-red-500', 'text-red-600');
    }
});
// AI assist end
