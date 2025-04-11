async function handleFormSubmit(event, options = {}) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('[type="submit"]');
    const originalButtonText = submitButton?.textContent;

    try {
        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
        }

        const formData = new FormData(form);
        const response = await fetch(form.action || form.dataset.action, {
            method: form.method || 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Custom success handler or default behavior
        if (options.onSuccess) {
            options.onSuccess(data, form);
        } else {
            alert(options.successMessage || 'Operation completed successfully');
            if (options.successRedirect) {
                window.location.href = options.successRedirect;
            }
        }

    } catch (error) {
        // Custom error handler or default behavior
        if (options.onError) {
            options.onError(error, form);
        } else {
            alert(options.errorMessage || 'An error occurred. Please try again.');
            console.error('Form submission error:', error);
        }
    } finally {
        // Restore button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
}

// Initialize for all forms with data-ajax-form attribute
document.querySelectorAll('form[data-ajax-form]').forEach(form => {
    form.addEventListener('submit', (e) => handleFormSubmit(e, {
        successRedirect: form.dataset.redirect,
        successMessage: form.dataset.successMessage,
        errorMessage: form.dataset.errorMessage
    }));
});