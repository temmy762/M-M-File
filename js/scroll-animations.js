/**
 * Memories and More Photo Booths - Scroll Animations
 * Author: Cascade
 * Version: 1.0
 * 
 * This script handles scroll-based animations throughout the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize scroll to top button
    initScrollToTop();
});

/**
 * Initialize scroll animations for elements with .scroll-animate class
 */
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    // Check if elements are in viewport on page load
    checkScrollAnimations();
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        checkScrollAnimations();
    });
    
    /**
     * Check if elements are in viewport and add .active class
     */
    function checkScrollAnimations() {
        scrollElements.forEach(element => {
            // Get element position relative to viewport
            const elementTop = element.getBoundingClientRect().top;
            const elementHeight = element.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;
            
            // Define offset (when element should become visible)
            const offset = 100;
            
            // Check if element is in viewport
            if (elementTop < windowHeight - offset && elementTop > -elementHeight + offset) {
                element.classList.add('active');
            } else {
                // Optional: remove active class when element is out of viewport
                // Uncomment the line below to enable this behavior
                // element.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize navbar scroll effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });
        
        // Scroll to top when button is clicked
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Helper function to add scroll animations to elements
 * This can be called from other scripts to add animations dynamically
 * 
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animationType - Animation type (from-left, from-right, from-bottom, from-top, scale-in)
 */
function addScrollAnimation(selector, animationType) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        element.classList.add('scroll-animate');
        
        if (animationType) {
            element.classList.add(animationType);
        }
    });
}
