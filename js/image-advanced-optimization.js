/**
 * Advanced Image Optimization
 * Handles image loading performance and visual enhancements
 */

// Polyfill for requestIdleCallback for better browser support
window.requestIdleCallback = window.requestIdleCallback || function(callback, options) {
    const start = Date.now();
    return setTimeout(function() {
        callback({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, options?.timeout || 1);
};

// Use a more efficient approach to improve loading speed
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptimizations);
} else {
    // DOM already loaded, run immediately
    initOptimizations();
}

function initOptimizations() {
    // Remove problematic images immediately
    requestAnimationFrame(fixProblemImages);
    
    // Run critical optimizations first
    requestIdleCallback(() => {
        initImageOptimization();
        optimizeForMobile();
    }, { timeout: 500 });
    
    // Use passive event listeners for better scrolling performance
    window.addEventListener('resize', debounce(function() {
        fixGridLayout();
        optimizeForMobile();
    }, 200), { passive: true });
}

/**
 * Remove problem images that aren't displaying
 */
function fixProblemImages() {
    // List of problematic images to remove
    const problemImages = [
        'images/duplicate4.jpg',
        'images/graduate.jpeg',
        'images/fateee.jpg',
        'images/wedd.jpg'
    ];
    
    // Find all gallery items with problematic images and remove them
    document.querySelectorAll('.gallery-item img').forEach(img => {
        const imageSrc = img.getAttribute('src');
        
        // Check if this is one of our problem images
        if (problemImages.includes(imageSrc)) {
            console.log('Removing problematic image:', imageSrc);
            
            // Get the gallery item containing this image and remove it
            const galleryItem = img.closest('.gallery-item');
            if (galleryItem) {
                // Add fade-out animation before removal
                galleryItem.style.opacity = '0';
                galleryItem.style.transform = 'scale(0.8)';
                galleryItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                
                // Remove after animation completes
                setTimeout(() => {
                    galleryItem.remove();
                    
                    // After removing, adjust the grid to fill gaps
                    setTimeout(fixGridLayout, 100);
                }, 300);
            }
        }
    });
}

/**
 * Initialize basic image optimization
 */
function initImageOptimization() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Apply basic optimizations to each gallery item
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;
        
        // Fix image display issues
        img.style.display = 'block';
        
        // Handle image errors
        img.addEventListener('error', function() {
            // Log error for debugging
            console.error('Image failed to load:', this.src);
            
            // Replace with placeholder
            this.src = 'images/placeholder.jpg';
            this.alt = 'Image unavailable';
        });
        
        // Add native lazy loading if supported
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
    
    // Apply grid equal sizing fix
    setTimeout(fixGridLayout, 100);
}

/**
 * Fix grid layout to ensure equal sizing of all gallery items
 */
function fixGridLayout() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid || galleryItems.length === 0) return;
    
    // Make sure all items have equal dimensions
    let itemHeight = 0;
    
    // Force equal height on all items
    galleryItems.forEach(item => {
        // Reset any previous inline styles
        item.style.height = '';
        item.style.width = '';
    });
    
    // Get the computed width of the first item after reset
    const firstItem = galleryItems[0];
    const computedStyle = window.getComputedStyle(firstItem);
    const itemWidth = parseInt(computedStyle.width, 10);
    
    // Set equal dimensions (square) for all items
    galleryItems.forEach(item => {
        item.style.height = `${itemWidth}px`;
        item.style.width = `${itemWidth}px`;
    });
    
    // Ensure images fill their containers properly
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(img => {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
    });
}

/**
 * Create srcset for responsive images
 */
function createResponsiveSrcset(img) {
    const imgSrc = img.src;
    if (!imgSrc) return;
    
    // Skip if already has srcset
    if (img.srcset) return;
    
    // Only apply to site images (not external)
    if (imgSrc.includes('/images/')) {
        const path = imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1);
        const filename = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
        const ext = filename.substring(filename.lastIndexOf('.'));
        const name = filename.substring(0, filename.lastIndexOf('.'));
        
        // Look for existing responsive versions or assume they'd follow naming convention
        // For example: image.jpg, image-small.jpg, image-large.jpg
        // Note: You would need to actually have these files for this to work
        const srcset = [
            `${path}${name}-small${ext} 480w`,
            `${imgSrc} 800w`,
            `${path}${name}-large${ext} 1200w`
        ].join(', ');
        
        // Add srcset and sizes attributes - note this is speculative
        // as the actual files would need to be prepared
        img.setAttribute('srcset', srcset);
        img.setAttribute('sizes', '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw');
    }
}

/**
 * Fallback lazy loading for browsers that don't support native lazy loading
 */
function lazyLoadImage(img) {
    // Skip if already loaded
    if (img.complete || img.loading === 'lazy') return;
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the data-src and load the image
                const target = entry.target;
                const dataSrc = target.getAttribute('data-src');
                
                if (dataSrc) {
                    target.src = dataSrc;
                }
                
                target.addEventListener('load', () => {
                    target.closest('.gallery-item').classList.add('loaded');
                });
                
                observer.unobserve(target);
            }
        });
    }, {
        rootMargin: '50px',
        threshold: 0.01
    });
    
    observer.observe(img);
}

/**
 * Optimize the gallery specifically for mobile devices
 */
function optimizeForMobile() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile || isTouchDevice) {
        // Optimize filter buttons for mobile
        optimizeFilterButtons();
        
        // Ensure image quality is appropriate for device
        optimizeImageQualityForDevice();
        
        // Handle viewport height issues on mobile (100vh problem)
        fixMobileViewportHeight();
    }
}

/**
 * Optimize filter buttons for mobile - vertical layout
 */
function optimizeFilterButtons() {
    // Vertical layout doesn't need scroll indicators
    // Just ensure proper spacing and touchability
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        // Ensure buttons have proper touch targets
        if (window.innerWidth < 576) {
            btn.style.minHeight = '44px';
        }
    });
}

/**
 * Optimize image quality based on device capabilities
 */
function optimizeImageQualityForDevice() {
    // Check device pixel ratio to determine screen quality
    const dpr = window.devicePixelRatio || 1;
    const lowPerformance = dpr < 2 || navigator.deviceMemory < 4;
    
    // If low performance device or low memory, optimize images
    if (lowPerformance) {
        document.documentElement.classList.add('low-performance-device');
    } else {
        document.documentElement.classList.remove('low-performance-device');
    }
}

/**
 * Fix 100vh issue on mobile browsers
 */
function fixMobileViewportHeight() {
    // Set gallery section height to visible viewport
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        const setHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setHeight();
        window.addEventListener('resize', debounce(setHeight, 100));
    }
}

/**
 * Adjust image quality based on network conditions
 */
function initNetworkAwareLoading() {
    // Check if Network Information API is available
    if (navigator.connection) {
        // Listen for network changes
        navigator.connection.addEventListener('change', adjustForNetworkQuality);
        // Initial adjustment
        adjustForNetworkQuality();
    }
}

/**
 * Adjust image quality based on current network conditions
 */
function adjustForNetworkQuality() {
    if (!navigator.connection) return;
    
    const connection = navigator.connection;
    const items = document.querySelectorAll('.gallery-item');
    
    // Check connection type and speed
    if (connection.saveData || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g') {
        
        // Apply low quality for slow connections
        document.documentElement.classList.add('low-quality-images');
        items.forEach(item => {
            item.classList.add('low-quality');
        });
    } else {
        // Remove low quality markers if connection improves
        document.documentElement.classList.remove('low-quality-images');
        items.forEach(item => {
            item.classList.remove('low-quality');
        });
    }
}

/**
 * Add enhanced hover effects for desktop devices
 */
function enhanceGalleryInteraction() {
    // Check if device supports hover
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    
    if (supportsHover) {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            item.classList.add('hover-enabled');
            
            // Track mouse position for dynamic lighting effect
            item.addEventListener('mousemove', function(e) {
                const bounds = this.getBoundingClientRect();
                const mouseX = e.clientX - bounds.left;
                const mouseY = e.clientY - bounds.top;
                
                const percentX = mouseX / bounds.width;
                const percentY = mouseY / bounds.height;
                
                // Apply dynamic lighting effect
                const img = this.querySelector('img');
                if (img) {
                    img.style.setProperty('--mouse-x', `${percentX * 100}%`);
                    img.style.setProperty('--mouse-y', `${percentY * 100}%`);
                }
            });
        });
    }
}
