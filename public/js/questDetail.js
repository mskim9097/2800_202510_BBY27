document.addEventListener('DOMContentLoaded', () => {
  const editBtn = document.getElementById('editBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const editButtons = document.getElementById('editButtons');
  const editIndicators = document.querySelectorAll('.edit-indicator');

  const inputs = document.querySelectorAll('.species-title, .species-view');
  const originalValues = {};

  inputs.forEach((input, index) => {
    originalValues[index] = input.value;
  });

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      inputs.forEach((input) => {
        input.disabled = false;
        input.classList.add('editable-field-background');
      });
      editBtn.style.display = 'none';
      editButtons.style.display = 'inline-block';
      editIndicators.forEach((icon) => (icon.style.display = 'inline'));
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      inputs.forEach((input, index) => {
        input.disabled = true;
        input.value = originalValues[index];
        input.classList.remove('editable-field-background');
      });

      const originalSpeciesName = document.getElementById(
        'originalSpeciesName'
      );
      const targetNameSpan = document.getElementById('targetName');

      targetNameSpan.textContent = originalSpeciesName.value;

      editBtn.style.display = 'inline-block';
      editButtons.style.display = 'none';
      editIndicators.forEach((icon) => (icon.style.display = 'none'));
    });
  }
});
