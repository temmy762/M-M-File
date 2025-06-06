/**
 * Gallery Filter Functionality
 * Handles category filtering and responsive adjustments
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery filtering
    initGalleryFilters();
    
    // Initialize gallery layout
    initGalleryLayout();
});

/**
 * Initialize gallery filter functionality
 */
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Add click event to each filter button
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter category
            const filterValue = btn.getAttribute('data-category');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === itemCategory) {
                    // Show items that match the filter
                    item.style.display = 'block';
                    
                    // Add fade-in animation
                    item.classList.add('fade-in');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        item.classList.remove('fade-in');
                    }, 500);
                } else {
                    // Hide items that don't match the filter
                    item.style.display = 'none';
                }
            });
            
            // Update layout after filtering
            setTimeout(updateGalleryLayout, 100);
        });
    });
    
    // Add fade-in animation class
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        .gallery-item.fade-in {
            animation: fadeIn 0.5s forwards;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize gallery layout
 */
function initGalleryLayout() {
    // Add native lazy loading to images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
    
    // Add image load event handlers
    galleryImages.forEach(img => {
        // Show loading state
        const galleryItem = img.closest('.gallery-item');
        galleryItem.classList.add('loading');
        
        // When image loads
        img.onload = function() {
            galleryItem.classList.remove('loading');
            galleryItem.classList.add('loaded');
        };
        
        // Handle image loading errors
        img.onerror = function() {
            galleryItem.classList.remove('loading');
            galleryItem.classList.add('error');
            
            // Replace with placeholder if needed
            this.src = 'images/placeholder.jpg';
        };
        
        // If image is already loaded
        if (img.complete) {
            galleryItem.classList.remove('loading');
            galleryItem.classList.add('loaded');
        }
    });
    
    // Initial layout update
    updateGalleryLayout();
    
    // Update layout on window resize
    window.addEventListener('resize', debounce(updateGalleryLayout, 200));
}

/**
 * Update gallery layout
 */
function updateGalleryLayout() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;
    
    // Handle featured items based on viewport width
    const viewportWidth = window.innerWidth;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Reset all items
    galleryItems.forEach(item => {
        item.classList.remove('featured');
    });
    
    // Add featured class to certain items on larger screens
    if (viewportWidth >= 992) {
        // Every 9th item starting with the first
        galleryItems.forEach((item, index) => {
            if ((index + 1) % 9 === 1) {
                item.classList.add('featured');
            }
        });
    }
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
