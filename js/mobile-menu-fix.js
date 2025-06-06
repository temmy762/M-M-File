/**
 * Mobile Menu Fix - Ensures the toggle button works correctly on all devices
 */

// Execute immediately when loaded
(function() {
    // Fix mobile menu toggle as soon as possible
    fixMobileMenuToggle();
    
    // Also run on DOMContentLoaded to ensure all elements are available
    document.addEventListener('DOMContentLoaded', fixMobileMenuToggle);
    
    // Add window load event to catch any late-loading issues
    window.addEventListener('load', fixMobileMenuToggle);
})();

/**
 * Fix mobile menu toggle functionality
 */
function fixMobileMenuToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    // Remove any existing event listeners (to prevent duplicates)
    const newNavToggle = navToggle.cloneNode(true);
    navToggle.parentNode.replaceChild(newNavToggle, navToggle);
    
    // Add new event listener with proper functionality
    newNavToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle active class on the button
        this.classList.toggle('active');
        
        // Toggle active class on the menu
        navMenu.classList.toggle('active');
        
        // Log for debugging
        console.log('Mobile menu toggle clicked, menu active:', navMenu.classList.contains('active'));
    });
    
    // Add touch event for better mobile response
    newNavToggle.addEventListener('touchend', function(e) {
        e.preventDefault();
        
        // Trigger click event
        this.click();
    }, { passive: false });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !newNavToggle.contains(e.target)) {
            
            navMenu.classList.remove('active');
            newNavToggle.classList.remove('active');
        }
    });
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            newNavToggle.classList.remove('active');
        });
    });
}
