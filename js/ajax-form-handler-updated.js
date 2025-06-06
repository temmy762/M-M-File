/**
 * Memories and More Photo Booths - AJAX Form Handler
 * This script handles form submissions via AJAX without page reload or email client opening
 * Updated version with fixed PHP server URL
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AJAX form submission for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initAjaxForm(contactForm);
    }
    
    // Initialize AJAX form submission for quote form
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        initAjaxForm(quoteForm);
    }
    
    // Log startup message
    console.log('AJAX Form Handler initialized - Updated version');
});

/**
 * Initialize AJAX form submission
 * @param {HTMLFormElement} form - The form element to initialize
 */
function initAjaxForm(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Validate form before submission
        if (!validateForm(form)) {
            return false;
        }
        
        // Show loading indicator
        showFormLoading(form);
        
        // Get form data
        const formData = new FormData(form);
        
        // Get the PHP server URL - use localhost:8000 for PHP development server
        const phpServerUrl = 'http://localhost:8000/';
        const formHandlerUrl = phpServerUrl + 'form-handler.php';
        
        // Log the submission attempt
        console.log('Submitting form to:', formHandlerUrl);
        
        // Send AJAX request
        fetch(formHandlerUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            // Try to parse the JSON response
            return response.json().catch(error => {
                console.error('JSON parse error:', error);
                throw new Error('Could not parse server response as JSON. The PHP script might have errors.');
            });
        })
        .then(data => {
            console.log('Server response:', data); // Log response for debugging
            // Hide loading indicator
            hideFormLoading(form);
            
            if (data.success) {
                // Show success message
                showFormSuccess(form);
                
                // Clear form after successful submission
                form.reset();
            } else {
                // Show error message with any debug info if available
                let errorMsg = data.message || 'An error occurred. Please try again.';
                
                // Add debug info if available (for development only - remove in production)
                if (data.debug_info) {
                    console.warn('Debug info:', data.debug_info);
                    errorMsg += '\n\nDebug info: ' + 
                                (data.debug_info.last_error || 'No specific error details');
                }
                
                showFormError(form, errorMsg);
            }
        })
        .catch(error => {
            // Hide loading indicator
            hideFormLoading(form);
            
            console.error('Form submission error:', error);
            
            // Create a detailed error message for troubleshooting
            let errorDetails = error.toString();
            
            // Show detailed error message
            let errorMessage = 'An error occurred while submitting the form.';
            
            // Provide more specific error information
            if (error.message.includes('JSON')) {
                errorMessage = 'Server response error: The PHP script may have syntax errors or is not outputting valid JSON.';
            } else if (error.message.includes('status: 405')) {
                errorMessage = 'Server error 405 - Method Not Allowed. This happens when the server is configured to reject POST requests. Please make sure the PHP server is running at http://localhost:8000/.';
            } else if (error.message.includes('status')) {
                errorMessage = error.message;
            } else if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
                errorMessage = 'Network error: Could not connect to the server. Make sure the PHP server is running at http://localhost:8000/ using the start-php-server.bat file.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Connection error: Could not connect to the PHP server. Please start the PHP server by running the start-php-server.bat file.';
            }
            
            showFormError(form, errorMessage);
        });
    });
}

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required';
            
            // Remove existing error message if any
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                field.parentNode.removeChild(existingError);
            }
            
            field.parentNode.appendChild(errorMessage);
        } else {
            field.classList.remove('error');
            
            // Remove error message if exists
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                field.parentNode.removeChild(existingError);
            }
        }
    });
    
    return isValid;
}

/**
 * Show loading indicator on form
 * @param {HTMLFormElement} form - The form to show loading on
 */
function showFormLoading(form) {
    // Disable submit button and show loading
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
}

/**
 * Hide loading indicator on form
 * @param {HTMLFormElement} form - The form to hide loading on
 */
function hideFormLoading(form) {
    // Re-enable submit button and restore text
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
    }
}

/**
 * Show success message and hide form
 * @param {HTMLFormElement} form - The form to show success for
 */
function showFormSuccess(form) {
    // Hide the form
    form.style.display = 'none';
    
    // For multi-step form
    if (form.id === 'quoteForm' && window.showQuoteFormSuccess) {
        // Use the specialized function from form-steps.js if available
        window.showQuoteFormSuccess();
    } 
    // For all other forms including contact form
    else {
        // Hide progress steps if they exist (for forms with steps)
        const progressSteps = document.querySelector('.form-progress');
        if (progressSteps) {
            progressSteps.style.display = 'none';
        }
        
        // Find and show success message
        const successElement = document.querySelector('.form-success');
        if (successElement) {
            successElement.style.display = 'block';
            
            // Scroll to the success message
            successElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Show error message on form
 * @param {HTMLFormElement} form - The form to show error for
 * @param {string} message - Error message to display
 */
function showFormError(form, message) {
    // Check if error message element already exists
    let errorElement = form.querySelector('.form-error');
    
    // Create error element if it doesn't exist
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.style.backgroundColor = '#f8d7da';
        errorElement.style.color = '#721c24';
        errorElement.style.padding = '15px';
        errorElement.style.marginTop = '15px';
        errorElement.style.borderRadius = '5px';
        errorElement.style.border = '1px solid #f5c6cb';
        
        // Add error element after the last form group
        const lastFormGroup = form.querySelector('.form-group:last-of-type');
        if (lastFormGroup) {
            lastFormGroup.insertAdjacentElement('afterend', errorElement);
        } else {
            form.appendChild(errorElement);
        }
    }
    
    // Format the error message
    let formattedMessage = message.replace(/\n/g, '<br>');
    
    // Create close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.float = 'right';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.fontSize = '20px';
    closeButton.onclick = function() {
        errorElement.style.display = 'none';
    };
    
    // Clear previous content
    errorElement.innerHTML = '';
    
    // Add close button
    errorElement.appendChild(closeButton);
    
    // Add error message
    const messageContent = document.createElement('div');
    messageContent.innerHTML = formattedMessage;
    errorElement.appendChild(messageContent);
    
    // Add suggestion for user
    const suggestion = document.createElement('div');
    suggestion.innerHTML = '<br><small>If this error persists, please contact us directly at info@memoriesandmorephotobooths.com</small>';
    errorElement.appendChild(suggestion);
    
    // Add diagnostic info/link for certain errors
    if (message.includes('PHP server') || message.includes('405') || message.includes('connect')) {
        const diagnosticInfo = document.createElement('div');
        diagnosticInfo.innerHTML = '<br><strong>Technical Details:</strong> Forms need the PHP server running on port 8000.<br>' +
                                  '<a href="form-error-diagnostic.html" target="_blank">Run Form Diagnostic Tool</a>';
        errorElement.appendChild(diagnosticInfo);
    }
    
    errorElement.style.display = 'block';
    
    // Scroll to the error message
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Hide error after 20 seconds (longer time for user to read)
    setTimeout(() => {
        if (errorElement.style.display !== 'none') {
            errorElement.style.display = 'none';
        }
    }, 20000);
}
