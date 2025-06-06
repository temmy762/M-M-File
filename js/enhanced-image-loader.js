/**
 * Enhanced Image Loader
 * Specialized script to significantly reduce image load time
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced image loading
    enhancedImageLoading();
});

/**
 * Main function to optimize image loading
 */
function enhancedImageLoading() {
    // Replace high-quality images with low-res versions initially
    downgradeInitialImageQuality();
    
    // Implement aggressive lazy loading with IntersectionObserver
    implementEnhancedLazyLoading();
    
    // Prioritize visible images (above the fold)
    prioritizeVisibleImages();
    
    // Enable background loading for non-critical images
    backgroundLoadNonCriticalImages();
    
    // Setup responsive image loading based on viewport and connection
    setupResponsiveImageLoading();
}

/**
 * Downgrade initial image quality for faster first load
 */
function downgradeInitialImageQuality() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        // Store original high-quality source
        img.setAttribute('data-high-quality-src', img.src);
        
        // Only replace with low-res version if not already loaded
        if (!img.complete) {
            // Reduced quality by default
            let lowQualitySrc = img.src;
            
            // Add a query parameter to potentially trigger a lower quality version
            // Note: This works if you have server-side image processing or a CDN
            // that supports image optimization via URL parameters
            if (lowQualitySrc.includes('?')) {
                lowQualitySrc += '&quality=low';
            } else {
                lowQualitySrc += '?quality=low';
            }
            
            // Set low quality source
            img.src = lowQualitySrc;
            
            // Set loading attribute for native lazy loading
            img.loading = 'lazy';
            
            // Add low-quality indicator class
            img.classList.add('low-quality-image');
        }
    });
}

/**
 * Enhanced lazy loading implementation with IntersectionObserver
 */
function implementEnhancedLazyLoading() {
    // Skip if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) return;
    
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load high quality version when in viewport
                if (img.classList.contains('low-quality-image') && img.hasAttribute('data-high-quality-src')) {
                    const highQualitySrc = img.getAttribute('data-high-quality-src');
                    
                    // Create a new image to preload
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        // Replace with high quality version only after it's loaded
                        img.src = highQualitySrc;
                        img.classList.remove('low-quality-image');
                        img.classList.add('high-quality-image');
                    };
                    
                    // Start loading high quality version
                    tempImg.src = highQualitySrc;
                }
                
                // Stop observing after loading
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading 200px before entering viewport
        threshold: 0.01 // Trigger when even 1% of the image is visible
    });
    
    // Observe all gallery images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        lazyImageObserver.observe(img);
    });
}

/**
 * Prioritize loading of visible images (above the fold)
 */
function prioritizeVisibleImages() {
    const viewportHeight = window.innerHeight;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const img = item.querySelector('img');
        
        // If image is in viewport (above the fold)
        if (rect.top < viewportHeight) {
            if (img) {
                // Remove lazy loading for above-fold images
                img.removeAttribute('loading');
                
                // Set high priority for critical images
                img.fetchPriority = 'high';
                
                // Load high quality version immediately
                if (img.hasAttribute('data-high-quality-src')) {
                    img.src = img.getAttribute('data-high-quality-src');
                }
            }
        }
    });
}

/**
 * Load non-critical images in the background with low priority
 */
function backgroundLoadNonCriticalImages() {
    const viewportHeight = window.innerHeight;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleLoad = window.requestIdleCallback || 
        function(callback) {
            setTimeout(callback, 200);
        };
    
    galleryItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const img = item.querySelector('img');
        
        // If image is below the fold
        if (rect.top >= viewportHeight && img) {
            // Set lowest priority for background loading
            img.fetchPriority = 'low';
            
            // Delay loading by staggered amount (100ms per image)
            scheduleLoad(() => {
                // Do nothing, just ensure the browser schedules this at the lowest priority
            }, { timeout: 1000 + (index * 100) });
        }
    });
}

/**
 * Adjust image loading based on network conditions and viewport
 */
function setupResponsiveImageLoading() {
    // Check for Network Information API
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        // Handle slow connections
        if (connection.saveData || 
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g') {
            
            // For slow connections, aggressively reduce quality
            document.querySelectorAll('.gallery-item img').forEach(img => {
                // Add blur effect to make low-res images look smoother
                img.style.filter = 'blur(2px)';
                
                // Remove blur when high quality version is loaded
                img.addEventListener('load', function() {
                    if (this.classList.contains('high-quality-image')) {
                        this.style.filter = 'none';
                    }
                });
            });
        }
    }
    
    // For small screens, load even smaller images if possible
    if (window.innerWidth <= 480) {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            let src = img.getAttribute('data-high-quality-src') || img.src;
            
            // Add width parameter for potential server-side resizing
            if (src.includes('?')) {
                src += '&width=480';
            } else {
                src += '?width=480';
            }
            
            img.setAttribute('data-high-quality-src', src);
        });
    }
}

// Add event listeners for dynamic loading
window.addEventListener('scroll', debounce(function() {
    // Check for new images that might need loading
    prioritizeVisibleImages();
}, 200));

window.addEventListener('resize', debounce(function() {
    // Recalculate responsive loading on resize
    setupResponsiveImageLoading();
}, 200));

// Listen for network changes
if ('connection' in navigator && 'addEventListener' in navigator.connection) {
    navigator.connection.addEventListener('change', function() {
        setupResponsiveImageLoading();
    });
}

/**
 * Utility function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}
