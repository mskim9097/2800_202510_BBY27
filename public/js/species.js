document.addEventListener('DOMContentLoaded', () => {
  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const editButtons = document.getElementById('editButtons');
  const editIndicators = document.querySelectorAll('.edit-indicator');
  const imageEditIndicator = document.getElementById('editImageIndicator');

  const inputs = document.querySelectorAll('.species-title, .species-view');
  const originalValues = {};

  const imageUploadSection = document.getElementById('imageUploadSection');
  const imageInput = document.getElementById('speciesImageInput');
  const previewImage = document.getElementById('previewImage');

  const originalImageSrc = previewImage ? previewImage.src : null;

  inputs.forEach(function (input, index) {
    originalValues[index] = input.value;
  });

  if (editBtn) {
    editBtn.addEventListener('click', function () {
      inputs.forEach(function (input) {
        input.disabled = false;
        input.classList.add('editable-field-background');
      });
      editBtn.style.display = 'none';
      editButtons.style.display = 'inline-block';
      editIndicators.forEach((icon) => (icon.style.display = 'inline'));
      if (imageEditIndicator) imageEditIndicator.style.display = 'block';

      if (imageUploadSection) {
        imageUploadSection.style.display = 'block';
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      inputs.forEach(function (input, index) {
        input.disabled = true;
        input.value = originalValues[index];
        input.classList.remove('editable-field-background');
      });
      editBtn.style.display = 'inline-block';
      editButtons.style.display = 'none';
      editIndicators.forEach((icon) => (icon.style.display = 'none'));
      if (imageEditIndicator) imageEditIndicator.style.display = 'none';

      if (imageUploadSection) {
        imageUploadSection.style.display = 'none';
      }
      if (imageInput) {
        imageInput.value = '';
      }
      if (previewImage && originalImageSrc) {
        previewImage.src = originalImageSrc;
      }
    });
  }

  if (imageInput && previewImage) {
    imageInput.addEventListener('change', function () {
      const file = imageInput.files[0];
      if (file) {
        previewImage.src = URL.createObjectURL(file);
      }
    });
  }
});
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

  const res = await fetch(
    `/species/searchTarget?q=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  // Check for an exact match
  const match = data.some(
    (species) =>
      species.speciesScientificName.toLowerCase() === query.toLowerCase()
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
    warningBox.textContent =
      'This species already exists! Submission prevented.';
    searchBox.classList.add('border-red-500', 'text-red-600');
  }
});
// AI assist end
