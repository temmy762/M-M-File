/**
 * Image Loading Optimizer
 * Enhances image loading performance across the Memories and More Photo Booths website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize image optimization
    initImageOptimization();
});

/**
 * Initialize all image optimization techniques
 */
function initImageOptimization() {
    // Apply lazy loading to all images
    setupLazyLoading();
    
    // Add image error handling
    setupImageErrorHandling();
    
    // Optimize gallery and booth images specifically
    optimizeGalleryImages();
    optimizeBoothImages();
    
    // Add appropriate image sizing
    setSuitableImageSizes();
}

/**
 * Setup lazy loading for images
 */
function setupLazyLoading() {
    // Get all images that don't already have loading="lazy"
    const images = document.querySelectorAll('img:not([loading="lazy"])');
    
    // Add native lazy loading attribute
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.classList.add('lazy-load');
        
        // Add intersection observer for more control
        observeImage(img);
    });
}

/**
 * Observe image visibility to load when needed
 * @param {HTMLElement} img - The image element to observe
 */
function observeImage(img) {
    // Create intersection observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When image is visible
            if (entry.isIntersecting) {
                const image = entry.target;
                
                // If image has data-src, use it
                if (image.dataset.src) {
                    image.src = image.dataset.src;
                }
                
                // Add loaded class for fade-in effect
                setTimeout(() => {
                    image.classList.add('loaded');
                }, 100);
                
                // Stop observing after loading
                observer.unobserve(image);
            }
        });
    }, { rootMargin: '200px 0px' }); // Start loading when image is 200px from viewport
    
    observer.observe(img);
}

/**
 * Handle image loading errors
 */
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add error handler if not already present
        if (!img.getAttribute('onerror')) {
            img.onerror = function() {
                // Apply fallback styling
                this.style.display = 'none';
                const parent = this.parentElement;
                parent.classList.add('image-error');
                
                // Try loading a smaller version if available
                if (this.src.includes('.jpg') || this.src.includes('.jpeg') || this.src.includes('.png')) {
                    // Try an alternative source
                    const fallbackSrc = 'images/image-placeholder.jpg';
                    
                    // Only set fallback if it's different from current src
                    if (this.src !== fallbackSrc) {
                        this.src = fallbackSrc;
                        this.style.display = 'block';
                    }
                }
            };
        }
    });
}

/**
 * Optimize gallery images specifically
 */
function optimizeGalleryImages() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        // Set appropriate size based on viewport
        if (window.innerWidth <= 480) {
            img.style.maxHeight = '250px';
        } else if (window.innerWidth <= 768) {
            img.style.maxHeight = '200px';
        }
        
        // Add fade-in effect
        img.style.opacity = '0';
        img.onload = function() {
            this.style.opacity = '1';
        };
    });
}

/**
 * Optimize booth page images
 */
function optimizeBoothImages() {
    const boothImages = document.querySelectorAll('.booth-image img');
    
    boothImages.forEach(img => {
        // Ensure proper sizing
        if (window.innerWidth <= 480) {
            img.style.maxHeight = '300px';
        } else if (window.innerWidth <= 768) {
            img.style.maxHeight = '350px';
        } else if (window.innerWidth <= 992) {
            img.style.maxHeight = '400px';
        }
        
        // Add placeholder until loaded
        const parent = img.parentElement;
        parent.style.backgroundColor = '#f0f0f0';
        
        // Show image when loaded
        img.style.opacity = '0';
        img.onload = function() {
            this.style.opacity = '1';
            parent.style.backgroundColor = 'transparent';
        };
    });
}

/**
 * Set suitable image sizes based on viewport
 */
function setSuitableImageSizes() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust image quality on mobile
    if (isMobile) {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach(img => {
            // If original source exists, use it
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }
            
            // Create smaller source if it's a large image
            if (img.src.includes('.jpg') || img.src.includes('.jpeg') || img.src.includes('.png')) {
                // We'll use the original since we don't have access to resize the images on the server
                // In a real implementation, you would point to smaller versions here
            }
        });
    }
}

// Add window resize handler to adjust image sizes on viewport changes
window.addEventListener('resize', debounce(function() {
    setSuitableImageSizes();
    optimizeGalleryImages();
    optimizeBoothImages();
}, 250));

/**
 * Debounce function to prevent excessive function calls
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
