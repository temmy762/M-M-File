/**
 * Simple Mobile Menu Toggle
 * A direct, simplified script to ensure the mobile menu toggle works
 */

// Execute immediately
(function() {
    // Run as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileToggle);
    } else {
        initMobileToggle();
    }
    
    // Also run after window loads to be sure
    window.addEventListener('load', initMobileToggle);
    
    function initMobileToggle() {
        // Get the toggle button
        var toggleButton = document.getElementById('mobileMenuToggle');
        var sidebar = document.querySelector('.admin-sidebar');
        
        if (toggleButton && sidebar) {
            // Remove any existing listeners
            var newToggle = toggleButton.cloneNode(true);
            if (toggleButton.parentNode) {
                toggleButton.parentNode.replaceChild(newToggle, toggleButton);
            }
            
            // Add new direct click listener
            newToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle the class
                if (sidebar.classList.contains('mobile-expanded')) {
                    sidebar.classList.remove('mobile-expanded');
                } else {
                    sidebar.classList.add('mobile-expanded');
                }
                
                console.log('Mobile menu toggled:', sidebar.classList.contains('mobile-expanded'));
            });
            
            // Make the button highly visible
            newToggle.style.zIndex = '9999';
            newToggle.style.position = 'relative';
            newToggle.style.display = 'block';
            
            console.log('Mobile menu toggle initialized');
        } else {
            console.error('Mobile menu elements not found');
        }
    }
})();
