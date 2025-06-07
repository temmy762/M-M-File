// iPhone Gallery Image Fix - Ensures images display on all iOS devices
(function() {
    'use strict';

    // iOS Detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Force image display immediately
    function forceIOSImageDisplay() {
        const images = document.querySelectorAll('.gallery-card img, .card-image img');
        
        images.forEach((img, index) => {
            // Force critical CSS properties
            img.style.setProperty('display', 'block', 'important');
            img.style.setProperty('visibility', 'visible', 'important');
            img.style.setProperty('opacity', '1', 'important');
            img.style.setProperty('width', '100%', 'important');
            img.style.setProperty('height', 'auto', 'important');
            img.style.setProperty('object-fit', 'cover', 'important');
            img.style.setProperty('min-height', '180px', 'important');
            
            // Remove any hiding attributes
            img.removeAttribute('hidden');
            img.classList.remove('hidden', 'invisible');
            
            // iOS specific fixes
            if (isIOS) {
                img.style.setProperty('-webkit-transform', 'translateZ(0)', 'important');
                img.style.setProperty('transform', 'translateZ(0)', 'important');
                img.style.setProperty('-webkit-backface-visibility', 'hidden', 'important');
                img.style.setProperty('backface-visibility', 'hidden', 'important');
            }
            
            // Handle loading states
            if (!img.complete) {
                img.addEventListener('load', function() {
                    this.style.setProperty('display', 'block', 'important');
                    this.style.setProperty('visibility', 'visible', 'important');
                    this.style.setProperty('opacity', '1', 'important');
                });
                
                img.addEventListener('error', function() {
                    console.warn('Image failed to load:', this.src);
                    // Set a fallback background
                    this.style.setProperty('background-color', '#f8f9fa', 'important');
                    this.style.setProperty('min-height', '180px', 'important');
                    this.style.setProperty('display', 'block', 'important');
                });
            }
        });
    }

    // Create a style element with critical CSS for iOS
    function injectIOSCriticalCSS() {
        const style = document.createElement('style');
        style.id = 'ios-gallery-critical-css';
        style.textContent = `
            @media (max-width: 768px) {
                .gallery-card img,
                .card-image img {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    height: auto !important;
                    min-height: 180px !important;
                    max-width: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                    -webkit-transform: translateZ(0) !important;
                    transform: translateZ(0) !important;
                    -webkit-backface-visibility: hidden !important;
                    backface-visibility: hidden !important;
                }
                
                .card-image {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    overflow: hidden !important;
                    position: relative !important;
                    height: 180px !important;
                    width: 100% !important;
                }
            }
            
            @supports (-webkit-touch-callout: none) {
                .gallery-card img {
                    -webkit-perspective: 1000px !important;
                    perspective: 1000px !important;
                }
            }
        `;
        
        // Insert at the beginning of head for higher priority
        document.head.insertBefore(style, document.head.firstChild);
    }    // Image retry mechanism for failed loads
    function setupImageRetry() {
        const images = document.querySelectorAll('.gallery-card img');
        
        images.forEach(img => {
            let retryCount = 0;
            const maxRetries = 3;
            
            img.addEventListener('error', () => handleImageRetry(img, retryCount, maxRetries));
        });
    }
    
    function handleImageRetry(img, retryCount, maxRetries) {
        if (retryCount < maxRetries) {
            retryCount++;
            const src = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = src + '?retry=' + retryCount;
            }, 1000 * retryCount);
        }
    }

    // Intersection Observer for better mobile performance
    function setupMobileIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.setProperty('display', 'block', 'important');
                        img.style.setProperty('visibility', 'visible', 'important');
                        img.style.setProperty('opacity', '1', 'important');
                        
                        // Stop observing once image is visible
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });

            const images = document.querySelectorAll('.gallery-card img');
            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }    // Touch-friendly interactions for mobile
    function setupMobileTouchInteractions() {
        const cards = document.querySelectorAll('.gallery-card');
        
        cards.forEach(card => {
            let touchStartTime = 0;
            
            card.addEventListener('touchstart', (e) => handleTouchStart(card, e));
            card.addEventListener('touchend', (e) => handleTouchEnd(card, e, touchStartTime));
            card.addEventListener('touchcancel', () => handleTouchCancel(card));
        });
    }
    
    function handleTouchStart(card, e) {
        const touchStartTime = Date.now();
        card.style.transition = 'transform 0.1s ease';
        card.style.transform = 'scale(0.98)';
        card.dataset.touchStartTime = touchStartTime;
    }
    
    function handleTouchEnd(card, e, touchStartTime) {
        const touchDuration = Date.now() - parseInt(card.dataset.touchStartTime || '0');
        card.style.transform = '';
        
        // If quick tap, add visual feedback
        if (touchDuration < 200) {
            card.style.backgroundColor = '#f8f9fa';
            setTimeout(() => {
                card.style.backgroundColor = '';
            }, 200);
        }
    }
    
    function handleTouchCancel(card) {
        card.style.transform = '';
    }

    // Mobile-specific performance optimizations
    function optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Disable CSS transitions on mobile for better performance
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .gallery-card,
                    .card-image img,
                    .card-overlay {
                        transition: none !important;
                        animation: none !important;
                    }
                    
                    .gallery-card:hover {
                        transform: none !important;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
                    }
                    
                    .gallery-card:hover .card-image img {
                        transform: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize all fixes
    function initializeMobileFixes() {
        console.log('Initializing mobile gallery fixes...');
        
        // Inject critical CSS first
        injectIOSCriticalCSS();
        
        // Force image display immediately
        forceIOSImageDisplay();
        
        // Setup other optimizations
        setupImageRetry();
        setupMobileIntersectionObserver();
        setupMobileTouchInteractions();
        optimizeForMobile();
        
        // Re-apply fixes periodically
        setInterval(forceIOSImageDisplay, 2000);
    }

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMobileFixes);
    } else {
        initializeMobileFixes();
    }    // Also run on window load for safety
    window.addEventListener('load', function() {
        setTimeout(forceIOSImageDisplay, 100);
        setTimeout(forceIOSImageDisplay, 500);
        setTimeout(forceIOSImageDisplay, 1000);
    });

    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', function() {
        setTimeout(handleOrientationChange, 300);
    });
    
    function handleOrientationChange() {
        forceIOSImageDisplay();
        optimizeForMobile();
    }    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(forceIOSImageDisplay, 250);
    });

    // Debug function for troubleshooting
    window.GalleryIOSDebug = {
        forceDisplay: forceIOSImageDisplay,
        isIOS: isIOS,
        isSafari: isSafari,
        checkImages: function() {
            const images = document.querySelectorAll('.gallery-card img');
            console.log('Total images:', images.length);
            images.forEach((img, i) => {
                console.log(`Image ${i+1}:`, {
                    src: img.src,
                    complete: img.complete,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    displayed: getComputedStyle(img).display,
                    visible: getComputedStyle(img).visibility,
                    opacity: getComputedStyle(img).opacity
                });
            });
        }
    };

})();
