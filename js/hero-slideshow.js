/**
 * Memories and More Photo Booths - Hero Slideshow
 * Author: Cascade
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero slideshow
    initHeroSlideshow();
    
    // Initialize smooth scroll for the scroll indicator
    initSmoothScroll();
});

/**
 * Initialize the hero slideshow with automatic transitions
 */
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;
    
    let currentSlide = 0;
    const slideInterval = 5000; // Change slide every 5 seconds
    
    // Function to change slide
    function changeSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide or back to first slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new current slide
        slides[currentSlide].classList.add('active');
    }
    
    // Set interval for automatic slide change
    setInterval(changeSlide, slideInterval);
    
    // Add manual navigation if needed
    // This can be expanded to include arrow buttons or dots
}

/**
 * Initialize smooth scroll for the scroll indicator
 */
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Get the height of the hero section
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            // Scroll to the section after the hero
            window.scrollTo({
                top: heroHeight - 50, // Subtract navbar height
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Add parallax effect to hero section (optional enhancement)
 */
function initParallaxEffect() {
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < window.innerHeight) {
            // Move content slightly up as user scrolls down
            heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            
            // Adjust opacity for fade-out effect
            heroContent.style.opacity = 1 - (scrollPosition / (window.innerHeight / 2));
        }
    });
}

// Initialize parallax effect if desired
// Uncomment the line below to enable
// initParallaxEffect();
