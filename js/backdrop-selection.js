document.addEventListener('DOMContentLoaded', function() {
    // Backdrop selection tabs functionality
    const backdropTabs = document.querySelectorAll('.backdrop-tab');
    const backdropOptions = document.querySelectorAll('.backdrop-option[data-category]');
    
    // Set the first tab as active by default
    if (backdropTabs.length > 0) {
        backdropTabs[0].classList.add('active');
        
        // Show backdrop options for the first category
        const firstCategory = backdropTabs[0].dataset.category;
        document.querySelectorAll(`.backdrop-option[data-category="${firstCategory}"]`).forEach(option => {
            option.classList.add('active');
        });
    }
    
    // Add click event listeners to tabs
    backdropTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            backdropTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all backdrop options
            backdropOptions.forEach(option => option.classList.remove('active'));
            
            // Show backdrop options for the selected category
            const category = this.dataset.category;
            document.querySelectorAll(`.backdrop-option[data-category="${category}"]`).forEach(option => {
                option.classList.add('active');
            });
        });
    });
    
    // Fix for backdrop images not displaying
    const backdropImages = document.querySelectorAll('.backdrop-image img');
    backdropImages.forEach(img => {
        // Add error handler to replace broken images
        img.onerror = function() {
            // Try lowercase version of the filename
            const originalSrc = this.src;
            const path = originalSrc.substring(0, originalSrc.lastIndexOf('/') + 1);
            const filename = originalSrc.substring(originalSrc.lastIndexOf('/') + 1);
            const lowercaseFilename = filename.toLowerCase();
            
            // Try with lowercase filename
            this.src = path + lowercaseFilename;
            
            // If that fails too, show a placeholder
            this.onerror = function() {
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'backdrop-placeholder';
                placeholderDiv.innerHTML = '<i class="fas fa-image"></i><p>Image<br>Coming Soon</p>';
                
                this.parentNode.appendChild(placeholderDiv);
                this.style.display = 'none';
            };
        };
    });
});
