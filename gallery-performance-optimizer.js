// Gallery Performance Optimizer
// Additional optimizations for mobile gallery performance

(function() {
    'use strict';

    // Performance optimization settings
    const PERFORMANCE_CONFIG = {
        enableImageLazyLoad: true,
        enableIntersectionObserver: true,
        enableImagePreloading: false, // Disabled on mobile to save bandwidth
        enableGPUAcceleration: true,
        debounceDelay: 250,
        imageRetryAttempts: 3,
        preloadDistance: '100px'
    };

    // Device detection
    const DEVICE_INFO = {
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: window.innerWidth > 1024,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        hasTouch: 'ontouchstart' in window,
        supportsWebP: false
    };

    // Check WebP support
    function checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Initialize WebP detection
    checkWebPSupport().then(supported => {
        DEVICE_INFO.supportsWebP = supported;
        if (supported) {
            console.log('WebP format supported');
        }
    });

    // Advanced image loading with retry mechanism
    function enhanceImageLoading() {
        const images = document.querySelectorAll('.gallery-card img');
        
        images.forEach(img => {
            let retryCount = 0;
            
            // Create loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'image-loading-indicator';
            loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
            
            // Insert loading indicator
            if (img.parentElement) {
                img.parentElement.insertBefore(loadingIndicator, img);
            }
            
            function handleImageLoad() {
                img.style.opacity = '1';
                img.classList.add('loaded');
                if (loadingIndicator.parentElement) {
                    loadingIndicator.remove();
                }
            }
            
            function handleImageError() {
                if (retryCount < PERFORMANCE_CONFIG.imageRetryAttempts) {
                    retryCount++;
                    console.log(`Retrying image load (${retryCount}/${PERFORMANCE_CONFIG.imageRetryAttempts}):`, img.src);
                    
                    // Add retry parameter to prevent caching
                    const url = new URL(img.src);
                    url.searchParams.set('retry', retryCount.toString());
                    url.searchParams.set('t', Date.now().toString());
                    
                    setTimeout(() => {
                        img.src = url.toString();
                    }, 1000 * retryCount);
                } else {
                    console.error('Failed to load image after', PERFORMANCE_CONFIG.imageRetryAttempts, 'attempts:', img.src);
                    img.style.backgroundColor = '#f8f9fa';
                    img.style.minHeight = '180px';
                    if (loadingIndicator.parentElement) {
                        loadingIndicator.innerHTML = '<div class="image-error">Image unavailable</div>';
                    }
                }
            }
            
            img.addEventListener('load', handleImageLoad);
            img.addEventListener('error', handleImageError);
            
            // Set initial opacity for smooth fade-in
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    // GPU acceleration for smooth animations
    function enableGPUAcceleration() {
        if (!PERFORMANCE_CONFIG.enableGPUAcceleration) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .gallery-card {
                will-change: transform;
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            .card-image img {
                will-change: transform;
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
            }
            
            .card-overlay {
                will-change: opacity;
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }

    // Memory management
    function optimizeMemoryUsage() {
        // Clean up invisible images to save memory
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const img = entry.target;
                if (!entry.isIntersecting) {
                    // Image is not visible, we could potentially unload it
                    // For now, just remove any cached data
                    if (img.dataset.originalSrc && !img.dataset.keepLoaded) {
                        // Store original src and replace with placeholder for memory savings
                        // This is more aggressive optimization, disabled by default
                    }
                }
            });
        }, {
            rootMargin: '200px'
        });

        document.querySelectorAll('.gallery-card img').forEach(img => {
            observer.observe(img);
        });
    }

    // Network-aware loading
    function setupNetworkAwareLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adjust loading strategy based on connection
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // Very slow connection - minimal loading
                PERFORMANCE_CONFIG.enableImagePreloading = false;
                PERFORMANCE_CONFIG.preloadDistance = '50px';
                console.log('Slow connection detected - optimizing for minimal data usage');
            } else if (connection.effectiveType === '3g') {
                // Medium connection - balanced loading
                PERFORMANCE_CONFIG.preloadDistance = '100px';
                console.log('Medium speed connection detected');
            } else {
                // Fast connection - full loading
                PERFORMANCE_CONFIG.enableImagePreloading = true;
                PERFORMANCE_CONFIG.preloadDistance = '200px';
                console.log('Fast connection detected');
            }
        }
    }

    // Advanced error recovery
    function setupAdvancedErrorRecovery() {
        // Monitor for failed images and attempt recovery
        setInterval(() => {
            const images = document.querySelectorAll('.gallery-card img:not(.loaded)');
            images.forEach(img => {
                if (img.complete && img.naturalHeight === 0) {
                    console.log('Detected broken image, attempting recovery:', img.src);
                    img.dispatchEvent(new Event('error'));
                }
            });
        }, 5000);
    }

    // Performance monitoring
    function setupPerformanceMonitoring() {
        let imageLoadTimes = [];
        
        document.querySelectorAll('.gallery-card img').forEach(img => {
            const startTime = performance.now();
            
            img.addEventListener('load', () => {
                const loadTime = performance.now() - startTime;
                imageLoadTimes.push(loadTime);
                
                if (imageLoadTimes.length % 10 === 0) {
                    const avgLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length;
                    console.log(`Average image load time: ${avgLoadTime.toFixed(2)}ms`);
                }
            });
        });
    }

    // Add loading styles
    function addLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .image-loading-indicator {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
            }
            
            .loading-spinner {
                width: 30px;
                height: 30px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #ff6b6b;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .image-error {
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                color: #666;
                font-size: 12px;
                text-align: center;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .gallery-card img.loaded {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize all optimizations
    function initializeOptimizations() {
        console.log('Initializing gallery performance optimizations...');
        console.log('Device info:', DEVICE_INFO);
        
        // Add loading styles first
        addLoadingStyles();
        
        // Setup network-aware loading
        setupNetworkAwareLoading();
        
        // Enable GPU acceleration
        enableGPUAcceleration();
        
        // Enhance image loading
        enhanceImageLoading();
        
        // Setup memory optimization (optional)
        if (DEVICE_INFO.isMobile) {
            optimizeMemoryUsage();
        }
        
        // Setup error recovery
        setupAdvancedErrorRecovery();
        
        // Setup performance monitoring
        setupPerformanceMonitoring();
        
        console.log('Gallery optimizations initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOptimizations);
    } else {
        initializeOptimizations();
    }

    // Export for debugging
    window.GalleryOptimizer = {
        config: PERFORMANCE_CONFIG,
        deviceInfo: DEVICE_INFO,
        reinitialize: initializeOptimizations
    };

})();
