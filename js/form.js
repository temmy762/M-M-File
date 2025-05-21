/*
   Memories and More Photo Booths - Form JavaScript
   Author: Cascade
   Version: 1.0
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize multi-step form
    initMultiStepForm();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize backdrop selection
    initBackdropSelection();
});

// Multi-step form functionality
function initMultiStepForm() {
    const form = document.getElementById('quoteForm');
    
    if (!form) return;
    
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = form.querySelectorAll('.next-step');
    const prevButtons = form.querySelectorAll('.prev-step');
    
    let currentStep = 0;
    
    // Next button click
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Validate current step
            if (validateStep(currentStep)) {
                // Hide current step
                steps[currentStep].classList.remove('active');
                progressSteps[currentStep].classList.add('completed');
                
                // Show next step
                currentStep++;
                steps[currentStep].classList.add('active');
                progressSteps[currentStep].classList.add('active');
                
                // Scroll to top of form
                scrollToForm();
            }
        });
    });
    
    // Previous button click
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide current step
            steps[currentStep].classList.remove('active');
            progressSteps[currentStep].classList.remove('active');
            
            // Show previous step
            currentStep--;
            steps[currentStep].classList.add('active');
            
            // Scroll to top of form
            scrollToForm();
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate final step
        if (validateStep(currentStep)) {
            // Show success message
            const formContainer = form.parentElement;
            const successMessage = formContainer.querySelector('.form-success');
            
            if (successMessage) {
                form.style.display = 'none';
                document.querySelector('.form-progress').style.display = 'none';
                successMessage.style.display = 'block';
                
                // Scroll to success message
                scrollToForm();
            }
            
            // In a real implementation, you would send the form data to the server here
            // For demonstration purposes, we're just showing the success message
        }
    });
    
    // Validate form step
    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                
                // Add error message if it doesn't exist
                if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
            } else {
                field.classList.remove('error');
                
                // Remove error message if it exists
                if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                    field.parentNode.removeChild(field.nextElementSibling);
                }
            }
        });
        
        return isValid;
    }
    
    // Scroll to top of form
    function scrollToForm() {
        const formTop = form.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
            top: formTop,
            behavior: 'smooth'
        });
    }
    
    // Remove error class on input
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            
            // Remove error message if it exists
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                this.parentNode.removeChild(this.nextElementSibling);
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
        });
        
        return isValid;
    });
    
    // Remove error class on input
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            
            // Remove error message if it exists
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                this.parentNode.removeChild(this.nextElementSibling);
            }
        });
    });
}

// Package selection functionality
const packageOptions = document.querySelectorAll('.package-option input[type="radio"]');
if (packageOptions.length > 0) {
    packageOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Remove selected class from all packages
            document.querySelectorAll('.package-label').forEach(label => {
                label.classList.remove('selected');
            });
            
            // Add selected class to chosen package
            if (this.checked) {
                this.parentElement.querySelector('.package-label').classList.add('selected');
                
                // If Silver package is selected, enable Props and Custom Layout add-ons
                if (this.value === 'Silver Experience') {
                    document.getElementById('addon1').disabled = false;
                    document.getElementById('addon2').disabled = false;
                    document.getElementById('addon1').parentElement.classList.remove('disabled');
                    document.getElementById('addon2').parentElement.classList.remove('disabled');
                } else {
                    // For other packages, these add-ons are included or not applicable
                    document.getElementById('addon1').disabled = true;
                    document.getElementById('addon2').disabled = true;
                    document.getElementById('addon1').checked = false;
                    document.getElementById('addon2').checked = false;
                    document.getElementById('addon1').parentElement.classList.add('disabled');
                    document.getElementById('addon2').parentElement.classList.add('disabled');
                }
            }
        });
    });
}

// Initialize backdrop selection functionality
function initBackdropSelection() {
    // Backdrop category tabs
    const backdropTabs = document.querySelectorAll('.backdrop-tab');
    const backdropOptions = document.querySelectorAll('.backdrop-option');
    
    if (!backdropTabs.length || !backdropOptions.length) return;
    
    backdropTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            backdropTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter backdrops
            if (category === 'all') {
                backdropOptions.forEach(option => {
                    option.style.display = 'block';
                });
            } else {
                backdropOptions.forEach(option => {
                    if (option.getAttribute('data-category') === category) {
                        option.style.display = 'block';
                    } else if (!option.hasAttribute('data-category')) {
                        // Always show the 'No Preference' option
                        option.style.display = 'block';
                    } else {
                        option.style.display = 'none';
                    }
                });
            }
        });
    });
}
