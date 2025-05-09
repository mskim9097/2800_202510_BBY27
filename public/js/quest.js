const toggle = document.getElementById('enableQuantity');
    const quantityInput = document.getElementById('quantityInput');

    toggle.addEventListener('change', () => {
        quantityInput.disabled = !toggle.checked;
    });