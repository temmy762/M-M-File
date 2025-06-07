// Mobile-First Gallery JavaScript
(function() {
    'use strict';

    // DOM Elements
    let filterButtons = [];
    let galleryCards = [];
    let loadMoreButton = null;
    let currentFilter = 'all';
    let visibleCards = 8; // Start with 8 cards on mobile
    let totalCards = 0;

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeGallery();
        setupEventListeners();
        setupImageErrorHandling();
        setupMobileOptimizations();
        
        // Add some delay to ensure images load properly on mobile
        setTimeout(function() {
            forceImageDisplay();
        }, 100);
    });

    function initializeGallery() {
        // Get DOM elements
        filterButtons = document.querySelectorAll('.filter-btn');
        galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
        loadMoreButton = document.getElementById('loadMoreBtn');
        totalCards = galleryCards.length;

        // Set initial visible cards based on screen size
        updateVisibleCardsCount();
        
        // Show initial cards
        showCards();
        
        // Update load more button
        updateLoadMoreButton();

        console.log('Gallery initialized with', totalCards, 'total cards');
    }

    function updateVisibleCardsCount() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            visibleCards = 6; // Mobile: show 6 initially
        } else if (screenWidth < 1024) {
            visibleCards = 8; // Tablet: show 8 initially
        } else {
            visibleCards = 12; // Desktop: show 12 initially
        }
    }

    function setupEventListeners() {
        // Filter button events
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                setActiveFilter(filter);
                filterGallery(filter);
            });
        });

        // Load more button event
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', function() {
                loadMoreCards();
            });
        }

        // Window resize event
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateVisibleCardsCount();
                showCards();
                updateLoadMoreButton();
                forceImageDisplay();
            }, 250);
        });

        // Scroll event for lazy loading optimization
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                checkVisibleImages();
            }, 100);
        });
    }

    function setupImageErrorHandling() {
        const images = document.querySelectorAll('.gallery-card img');
        
        images.forEach(img => {
            // Force image display
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
              // Add error handling
            img.addEventListener('error', handleImageError);
            
            function handleImageError() {
                console.warn('Failed to load image:', this.src);
                // Try to reload the image once
                if (!this.hasAttribute('data-retry')) {
                    this.setAttribute('data-retry', 'true');
                    const originalSrc = this.src;
                    setTimeout(() => {
                        this.src = originalSrc + '?retry=' + Date.now();
                    }, 1000);
                }
            }

            // Add load success handling
            img.addEventListener('load', function() {
                this.style.display = 'block';
                this.style.visibility = 'visible';
                this.style.opacity = '1';
                this.parentElement.classList.add('image-loaded');
            });

            // Force attributes for mobile compatibility
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
        });
    }

    function setupMobileOptimizations() {
        // Add mobile-specific optimizations
        if (window.innerWidth <= 768) {
            // Reduce animation duration on mobile for better performance
            const style = document.createElement('style');
            style.textContent = `
                .gallery-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                }
                .card-image img {
                    transition: transform 0.3s ease !important;
                }
                .card-overlay {
                    transition: opacity 0.2s ease !important;
                }
            `;
            document.head.appendChild(style);

            // Disable hover effects on touch devices
            if ('ontouchstart' in window) {
                document.body.classList.add('touch-device');
                
                // Add touch-specific styles
                const touchStyle = document.createElement('style');
                touchStyle.textContent = `
                    .touch-device .gallery-card:hover {
                        transform: none !important;
                        box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
                    }
                    .touch-device .gallery-card:hover .card-image img {
                        transform: none !important;
                    }
                    .touch-device .card-overlay {
                        opacity: 0 !important;
                    }
                `;
                document.head.appendChild(touchStyle);
            }
        }
    }

    function forceImageDisplay() {
        // Force all images to display properly, especially on mobile
        const images = document.querySelectorAll('.gallery-card img');
        images.forEach(img => {
            img.style.setProperty('display', 'block', 'important');
            img.style.setProperty('visibility', 'visible', 'important');
            img.style.setProperty('opacity', '1', 'important');
            img.style.setProperty('max-width', '100%', 'important');
            img.style.setProperty('height', 'auto', 'important');
            img.style.setProperty('object-fit', 'cover', 'important');
            
            // Remove any potential hiding classes
            img.classList.remove('hidden', 'invisible');
            img.removeAttribute('hidden');
        });
    }

    function checkVisibleImages() {
        // Check which images are in viewport and ensure they're displayed
        const images = document.querySelectorAll('.gallery-card img');
        const viewportHeight = window.innerHeight;
        
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Image is in viewport
                img.style.setProperty('display', 'block', 'important');
                img.style.setProperty('visibility', 'visible', 'important');
                img.style.setProperty('opacity', '1', 'important');
            }
        });
    }

    function setActiveFilter(filter) {
        currentFilter = filter;
        
        // Update button states
        filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }    function filterGallery(filter) {
        // Reset visible cards count when filtering
        updateVisibleCardsCount();
        
        // Animate out cards first
        galleryCards.forEach((card, index) => {
            card.classList.add('fade-out');
            
            setTimeout(() => animateFilteredCard(card, filter), index * 50);
        });

        // Show filtered cards after animation
        setTimeout(showFilteredCards, 500);
    }
    
    function animateFilteredCard(card, filter) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden', 'fade-out');
            card.classList.add('fade-in');
        } else {
            card.classList.add('hidden');
            card.classList.remove('fade-in', 'fade-out');
        }
    }
    
    function showFilteredCards() {
        showCards();
        updateLoadMoreButton();
        forceImageDisplay();
    }    function showCards() {
        const filteredCards = getFilteredCards();
        
        filteredCards.forEach((card, index) => {
            if (index < visibleCards) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                
                // Stagger the animation
                setTimeout(() => animateCardIn(card), index * 100);
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });

        // Force image display after showing cards
        setTimeout(forceImageDisplay, 100);
    }
    
    function animateCardIn(card) {
        card.classList.add('fade-in');
    }

    function getFilteredCards() {
        return galleryCards.filter(card => {
            if (currentFilter === 'all') return true;
            return card.getAttribute('data-category') === currentFilter;
        });
    }

    function loadMoreCards() {
        const filteredCards = getFilteredCards();
        const increment = window.innerWidth < 768 ? 4 : 8; // Load fewer on mobile
        const currentlyVisible = visibleCards;
          visibleCards = Math.min(visibleCards + increment, filteredCards.length);
        
        // Show newly loaded cards
        for (let i = currentlyVisible; i < visibleCards; i++) {
            if (filteredCards[i]) {
                filteredCards[i].style.display = 'block';
                filteredCards[i].classList.remove('hidden');
                
                // Animate in with delay
                setTimeout(() => animateNewCard(filteredCards[i]), (i - currentlyVisible) * 150);
            }
        }

        updateLoadMoreButton();
        
        // Force image display for newly loaded cards
        setTimeout(forceImageDisplay, 200);
        
        // Smooth scroll to first new card on mobile
        if (window.innerWidth <= 768 && filteredCards[currentlyVisible]) {
            setTimeout(() => scrollToNewCard(filteredCards[currentlyVisible]), 500);
        }
    }
    
    function animateNewCard(card) {
        card.classList.add('fade-in');
    }
      function scrollToNewCard(card) {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    function updateLoadMoreButton() {
        if (!loadMoreButton) return;
        
        const filteredCards = getFilteredCards();
        
        if (visibleCards >= filteredCards.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'inline-flex';
            loadMoreButton.innerHTML = `
                <i class="fas fa-plus"></i>
                Load More Events (${filteredCards.length - visibleCards} remaining)
            `;
        }
    }

    // GSAP Animations (if GSAP is loaded)
    function initializeGSAPAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Hero section animation
            gsap.from('.hero-content > *', {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power2.out'
            });

            gsap.from('.hero-stats .stat', {
                duration: 1,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                delay: 0.5,
                ease: 'power2.out'
            });

            // Filter buttons animation
            gsap.from('.filter-btn', {
                duration: 0.8,
                y: 30,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.filter-section',
                    start: 'top 80%'
                }
            });

            // Gallery cards animation
            gsap.from('.gallery-card', {
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: 'top 80%'
                }
            });
        }
    }

    // Mobile-specific touch handling
    function setupTouchHandling() {
        if ('ontouchstart' in window) {
            galleryCards.forEach(card => {
                let touchStartY = 0;
                
                card.addEventListener('touchstart', function(e) {
                    touchStartY = e.touches[0].clientY;
                });
                
                card.addEventListener('touchend', function(e) {
                    const touchEndY = e.changedTouches[0].clientY;
                    const touchDiff = touchStartY - touchEndY;
                    
                    // If minimal vertical movement, treat as tap
                    if (Math.abs(touchDiff) < 10) {
                        // Add touch feedback
                        this.style.transform = 'scale(0.98)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 150);
                    }
                });
            });
        }
    }

    // Error recovery for mobile
    function setupErrorRecovery() {
        // Retry image loading on mobile if there are issues
        setTimeout(function() {
            const images = document.querySelectorAll('.gallery-card img');
            images.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    console.log('Retrying image load:', img.src);
                    const src = img.src;
                    img.src = '';
                    setTimeout(() => {
                        img.src = src;
                    }, 100);
                }
            });
        }, 2000);
    }

    // Initialize additional features when page is fully loaded
    window.addEventListener('load', function() {
        initializeGSAPAnimations();
        setupTouchHandling();
        setupErrorRecovery();
        
        // Final image display force
        setTimeout(forceImageDisplay, 500);
    });

    // Expose functions for debugging
    window.GalleryDebug = {
        forceImageDisplay: forceImageDisplay,
        filterGallery: filterGallery,
        loadMoreCards: loadMoreCards,
        getFilteredCards: getFilteredCards,
        currentFilter: () => currentFilter,
        visibleCards: () => visibleCards,
        totalCards: () => totalCards
    };

})();
