document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editButtons = document.getElementById('editButtons');

    const inputs = document.querySelectorAll('.species-title, .species-view');

    const originalValues = {};

    inputs.forEach(function(input, index) {
        originalValues[index] = input.value;
    });
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            inputs.forEach(function(input) {
                input.disabled = false;
            });
            editBtn.style.display = 'none';
            editButtons.style.display = 'inline-block';
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            inputs.forEach(function(input, index) {
                input.disabled = true;
                input.value = originalValues[index]; // 원래 값으로 되돌리기
            });
            editBtn.style.display = 'inline-block';
            editButtons.style.display = 'none';
        });
    }
});