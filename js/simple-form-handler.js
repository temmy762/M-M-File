/**
 * Simple Form Handler for Memories and More Photo Booths
 * This script handles form submissions via AJAX with minimal complexity
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Handle form submission
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    
    const form = event.target;
    
    // Check form validity first
    if (!validateForm(form)) {
        return false;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Get form data
    const formData = new FormData(form);
    
    // Determine API endpoint - use PHP development server if on localhost
    const isLocalDev = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const endpoint = isLocalDev ? 'http://localhost:8000/simple-form-handler.php' : 'simple-form-handler.php';
    
    // Send form data via fetch API
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server returned error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Hide loading state
        setLoadingState(false);
        
        if (data.success) {
            // Show success message and hide form
            showSuccess();
        } else {
            // Show error message
            showAlert('error', data.message || 'There was an error submitting the form. Please try again.');
        }
    })
    .catch(error => {
        // Hide loading state
        setLoadingState(false);
        
        // Show appropriate error message based on error type
        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            showAlert('error', 'Cannot connect to the server. Please make sure the PHP server is running.');
        } else {
            showAlert('error', 'There was a problem submitting the form: ' + error.message);
        }
        
        console.error('Form submission error:', error);
    });
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
function validateForm(form) {
    // Reset previous error messages
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(el => el.textContent = '');
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Check each required field
    requiredFields.forEach(field => {
        const errorContainer = field.nextElementSibling;
        
        // Check if field is empty
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            if (errorContainer && errorContainer.classList.contains('field-error')) {
                errorContainer.textContent = 'This field is required';
            }
        } 
        // Check email field format
        else if (field.type === 'email' && !isValidEmail(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorContainer && errorContainer.classList.contains('field-error')) {
                errorContainer.textContent = 'Please enter a valid email address';
            }
        }
        else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * Set form loading state
 * @param {boolean} isLoading - Whether form is in loading state
 */
function setLoadingState(isLoading) {
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoading = submitButton.querySelector('.button-loading');
    
    if (isLoading) {
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline-block';
    } else {
        submitButton.disabled = false;
        buttonText.style.display = 'inline-block';
        buttonLoading.style.display = 'none';
    }
}

/**
 * Show alert message
 * @param {string} type - Alert type: 'error' or 'success'
 * @param {string} message - Message to display
 */
function showAlert(type, message) {
    const alertElement = document.getElementById('formAlert');
    
    // Set alert type class
    alertElement.className = 'form-alert';
    alertElement.classList.add(type === 'error' ? 'alert-error' : 'alert-success');
    
    // Set message
    alertElement.innerHTML = message;
    
    // Show alert
    alertElement.style.display = 'block';
    
    // Scroll to alert
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Show success message and hide form
 */
function showSuccess() {
    // Hide the form
    document.getElementById('contactForm').style.display = 'none';
    
    // Show success message
    const successElement = document.getElementById('formSuccess');
    successElement.style.display = 'block';
    
    // Scroll to success message
    successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
