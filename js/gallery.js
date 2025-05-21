/**
 * Memories and More Photo Booths - Gallery Functions
 * Author: Cascade
 * Version: 1.0
 * 
 * This script handles gallery functionality including filtering and lightbox integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery filtering
    initGalleryFilter();
    
    // Initialize masonry layout if Masonry library is loaded
    initMasonryLayout();
    
    // Add scroll animations to gallery items
    addGalleryAnimations();
});

/**
 * Initialize gallery category filtering
 */
function initGalleryFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (categoryTabs.length && galleryItems.length) {
        // Add click event to each category tab
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get category from data attribute
                const category = this.getAttribute('data-category');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    // If "all" category is selected or item belongs to selected category
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        
                        // Add animation when item appears
                        setTimeout(() => {
                            item.classList.add('active');
                        }, 50);
                    } else {
                        item.classList.remove('active');
                        
                        // Delay hiding to allow for animation
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Re-initialize masonry layout after filtering
                if (typeof Masonry !== 'undefined') {
                    setTimeout(initMasonryLayout, 500);
                }
            });
        });
        
        // Activate the first tab by default
        if (categoryTabs[0]) {
            categoryTabs[0].click();
        }
    }
}

/**
 * Initialize masonry layout for gallery
 */
function initMasonryLayout() {
    const masonryGallery = document.querySelector('.masonry-gallery');
    
    if (masonryGallery && typeof Masonry !== 'undefined') {
        const masonry = new Masonry(masonryGallery, {
            itemSelector: '.gallery-item',
            columnWidth: '.gallery-sizer',
            percentPosition: true,
            transitionDuration: '0.3s'
        });
        
        // Initialize layout after images are loaded
        imagesLoaded(masonryGallery, function() {
            masonry.layout();
        });
    }
}

/**
 * Add scroll animations to gallery items
 */
function addGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Add scroll-animate class
        item.classList.add('scroll-animate');
        
        // Add different animation types based on position
        if (index % 3 === 0) {
            item.classList.add('from-left');
        } else if (index % 3 === 1) {
            item.classList.add('from-bottom');
        } else {
            item.classList.add('from-right');
        }
    });
}

/**
 * Initialize lightbox for gallery items
 * This is automatically called by lightbox-plus-jquery.min.js if included
 */
function initLightbox() {
    // Configure lightbox options if lightbox is loaded
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 300,
            'wrapAround': true,
            'albumLabel': 'Image %1 of %2',
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'positionFromTop': 100
        });
    }
}
