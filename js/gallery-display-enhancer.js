/**
 * Gallery Display Enhancer
 * Improves visual presentation and user experience for image galleries
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery enhancements
    initGalleryDisplayEnhancements();
});

/**
 * Initialize all gallery display enhancements
 */
function initGalleryDisplayEnhancements() {
    // Add loading classes and states
    setupLoadingStates();
    
    // Apply visual enhancements to gallery items
    enhanceGalleryVisuals();
    
    // Setup dynamic image sizing for better visual presentation
    setupDynamicImageSizing();
    
    // Create staggered reveal animations
    setupStaggeredReveal();
    
    // Add touch-friendly interactions for mobile
    setupTouchInteractions();
    
    // Enhance gallery navigation
    enhanceGalleryNavigation();
}

/**
 * Setup loading states for all gallery items
 */
function setupLoadingStates() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        if (img) {
            // Add blur-up class for transition effect
            img.classList.add('blur-up');
            
            // Check if image is already loaded
            if (img.complete) {
                item.classList.add('loaded');
                img.classList.add('loaded');
            } else {
                // Add loaded class when image finishes loading
                img.addEventListener('load', function() {
                    // Slight delay for smoother transition
                    setTimeout(() => {
                        item.classList.add('loaded');
                        img.classList.add('loaded');
                    }, 100);
                });
                
                // Handle broken images
                img.addEventListener('error', function() {
                    item.classList.add('error');
                    // Replace with placeholder
                    this.src = 'images/placeholder.jpg';
                });
            }
        }
    });
}

/**
 * Apply visual enhancements to gallery items
 */
function enhanceGalleryVisuals() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Generate slight random variations for more natural look
        const randomScale = 1 + (Math.random() * 0.1 - 0.05); // 0.95 to 1.05
        const randomDelay = Math.random() * 0.2; // 0 to 0.2s
        
        // Apply subtle variations to avoid too uniform appearance
        item.style.setProperty('--item-scale', randomScale);
        item.style.setProperty('--item-delay', `${randomDelay}s`);
        
        // Add overlay content if it doesn't exist
        if (!item.querySelector('.gallery-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            
            // Get category from data attribute or default
            const category = item.getAttribute('data-category') || 'Photo';
            
            // Create overlay content
            overlay.innerHTML = `
                <div class="overlay-content">
                    <h3>${category}</h3>
                    <p>Click to view larger</p>
                </div>
            `;
            
            item.appendChild(overlay);
        }
    });
}

/**
 * Setup dynamic image sizing for better visual presentation
 */
function setupDynamicImageSizing() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create an element to detect container width changes
    const resizeDetector = document.createElement('div');
    resizeDetector.style.position = 'absolute';
    resizeDetector.style.width = '100%';
    resizeDetector.style.height = '0';
    resizeDetector.style.top = '0';
    resizeDetector.style.left = '0';
    resizeDetector.style.pointerEvents = 'none';
    
    document.querySelector('.masonry-gallery').appendChild(resizeDetector);
    
    // Create a ResizeObserver if supported
    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver(entries => {
            updateGalleryLayout();
        });
        
        resizeObserver.observe(resizeDetector);
    } else {
        // Fallback to window resize
        window.addEventListener('resize', function() {
            updateGalleryLayout();
        });
    }
    
    // Initial layout setup
    updateGalleryLayout();
}

/**
 * Update gallery layout based on current dimensions
 */
function updateGalleryLayout() {
    const gallery = document.querySelector('.masonry-gallery');
    
    if (!gallery) return;
    
    // Get current gallery width
    const galleryWidth = gallery.offsetWidth;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Decide on columns based on width
    let columns = 1;
    if (galleryWidth >= 1200) {
        columns = 4;
    } else if (galleryWidth >= 768) {
        columns = 3;
    } else if (galleryWidth >= 480) {
        columns = 2;
    }
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 767;
    
    // Apply dynamic sizing only for larger screens
    if (!isMobile) {
        // Feature different sized items for visual interest
        galleryItems.forEach((item, index) => {
            // Reset classes
            item.classList.remove('gallery-item-large', 'gallery-item-wide', 'gallery-item-tall');
            
            // Skip featured sizing if we have only 1 column
            if (columns === 1) return;
            
            // Add variation every few items for visual interest
            if (index % 7 === 0) {
                item.classList.add('gallery-item-large'); // Large item (2x2)
            } else if (index % 5 === 0) {
                item.classList.add('gallery-item-wide'); // Wide item (2x1)
            } else if (index % 9 === 0) {
                item.classList.add('gallery-item-tall'); // Tall item (1x2)
            }
        });
    }
}

/**
 * Setup staggered reveal animations for gallery items
 */
function setupStaggeredReveal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Only apply animations if not in reduced motion mode
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        galleryItems.forEach((item, index) => {
            // Set staggered delay
            const staggerDelay = 0.05 * (index % 10); // 0 to 0.45s
            item.style.transitionDelay = `${staggerDelay}s`;
            
            // Add animate class with delay
            setTimeout(() => {
                item.classList.add('animate');
            }, 100);
            
            // Remove delay after animation completes
            setTimeout(() => {
                item.style.transitionDelay = '0s';
            }, 1000);
        });
    }
}

/**
 * Setup touch-friendly interactions for mobile devices
 */
function setupTouchInteractions() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        // Add touch feedback
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        item.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
        
        item.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });
    });
}

/**
 * Enhance gallery navigation and filtering
 */
function enhanceGalleryNavigation() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Setup filtering
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    // Stagger the reveal of filtered items
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, Math.random() * 200);
                } else {
                    item.classList.remove('visible');
                    item.classList.add('hidden');
                }
            });
            
            // Update layout after filtering
            setTimeout(updateGalleryLayout, 300);
        });
    });
    
    // Initialize with all items visible
    galleryItems.forEach(item => {
        item.classList.add('visible');
    });
}
