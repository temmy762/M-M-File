document.addEventListener('DOMContentLoaded', function() {
    // Multi-step form functionality
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Initialize form
    let currentStep = 1;
    updateFormProgress(currentStep);
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the current step element
            const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            
            // Validate current step (if needed)
            if (validateStep(currentStepElement)) {
                // Move to next step
                currentStep++;
                updateFormProgress(currentStep);
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            updateFormProgress(currentStep);
        });
    });
    
    // Form submission visual handling only (AJAX submission is handled by ajax-form-handler.js)
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        // We're not adding a submit event handler here anymore
        // because ajax-form-handler.js will handle the actual submission
        // This prevents double handling of the form submission
        
        // Initialize success message display functionality that can be called from elsewhere
        window.showQuoteFormSuccess = function() {
            const formSuccess = document.querySelector('.form-success');
            if (formSuccess) {
                quoteForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
    
    // Update form progress
    function updateFormProgress(step) {
        // Hide all steps
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
        });
        
        // Show current step
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update progress indicators
        progressSteps.forEach(progressStep => {
            const stepNumber = parseInt(progressStep.dataset.step);
            
            if (stepNumber < step) {
                progressStep.classList.add('completed');
                progressStep.classList.remove('active');
            } else if (stepNumber === step) {
                progressStep.classList.add('active');
                progressStep.classList.remove('completed');
            } else {
                progressStep.classList.remove('active', 'completed');
            }
        });
    }
    
    // Validate form step
    function validateStep(stepElement) {
        // Get all required fields in current step
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;
        
        // Check if all required fields are filled
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message if it doesn't exist
                let errorMessage = field.parentNode.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.appendChild(errorMessage);
                }
            } else {
                field.classList.remove('error');
                
                // Remove error message if it exists
                const errorMessage = field.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
        
        // If step is not valid, show a message
        if (!isValid) {
            const errorAlert = document.createElement('div');
            errorAlert.className = 'error-alert';
            errorAlert.textContent = 'Please fill in all required fields';
            
            // Remove existing error alerts
            const existingAlerts = stepElement.querySelectorAll('.error-alert');
            existingAlerts.forEach(alert => alert.remove());
            
            // Add new error alert
            stepElement.prepend(errorAlert);
            
            // Remove error alert after 3 seconds
            setTimeout(() => {
                errorAlert.remove();
            }, 3000);
        }
        
        return isValid;
    }
});
