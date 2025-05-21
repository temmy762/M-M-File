/**
 * Inject a reliable mobile menu toggle
 */
(function() {
    // Create an observer to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        // Check if our mobile menu toggle exists
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (toggleBtn && sidebar) {
            // Remove any previous handlers by cloning
            const oldToggle = toggleBtn;
            const newToggle = oldToggle.cloneNode(true);
            if (oldToggle.parentNode) {
                oldToggle.parentNode.replaceChild(newToggle, oldToggle);
            }
            
            // Add a very direct click handler
            newToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('mobile-expanded');
                return false;
            });
            
            // Style the button to ensure it's clickable
            newToggle.style.cursor = 'pointer';
            newToggle.style.zIndex = '9999';
            newToggle.style.position = 'relative';
            
            // Add inline click handler as another backup
            newToggle.setAttribute('onclick', "document.querySelector('.admin-sidebar').classList.toggle('mobile-expanded'); return false;");
            
            // Stop watching once we've fixed the toggle
            observer.disconnect();
        }
    });
    
    // Start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
    
    // Also set up a direct handler when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (toggleBtn && sidebar) {
            toggleBtn.onclick = function(e) {
                e.preventDefault();
                sidebar.classList.toggle('mobile-expanded');
                return false;
            };
        }
    });
})();
