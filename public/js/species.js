document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editButtons = document.getElementById('editButtons');

    const inputs = document.querySelectorAll('.species-title, .species-view');
    const originalValues = {};

    const imageUploadSection = document.getElementById('imageUploadSection');
    const imageInput = document.getElementById('speciesImageInput');
    const previewImage = document.getElementById('previewImage');

    const originalImageSrc = previewImage ? previewImage.src : null;

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
        });
        editBtn.style.display = 'inline-block';
        editButtons.style.display = 'none';

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