/*
   Memories and More Photo Booths - Main JavaScript
   Author: Cascade
   Version: 1.0
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initScrollToTop();
    initCarousels();
    initFaqAccordion();
    initGalleryFilter();
    
    // Initialize animations
    initAnimations();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Change navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll to top button
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (scrollBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('active');
            } else {
                scrollBtn.classList.remove('active');
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Carousel functionality
function initCarousels() {
    // Initialize backdrop carousel
    initCarousel('.backdrop-carousel', '.backdrop-slide');
    
    // Initialize testimonial carousel
    initCarousel('.testimonial-carousel', '.testimonial-slide');
    
    // Initialize video slider
    initCarousel('.video-slider', '.video-slide');
}

function initCarousel(carouselSelector, slideSelector) {
    const carousel = document.querySelector(carouselSelector);
    
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll(slideSelector);
    const prevBtn = carousel.parentElement.querySelector('.prev-btn');
    const nextBtn = carousel.parentElement.querySelector('.next-btn');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Set first slide as active
    slides[0].classList.add('active');
    
    // Previous button click
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        });
    }
    
    // Next button click
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        });
    }
    
    // Auto slide (optional)
    let autoSlide = setInterval(function() {
        if (nextBtn) {
            nextBtn.click();
        }
    }, 5000);
    
    // Pause auto slide on hover
    carousel.addEventListener('mouseenter', function() {
        clearInterval(autoSlide);
    });
    
    carousel.addEventListener('mouseleave', function() {
        autoSlide = setInterval(function() {
            if (nextBtn) {
                nextBtn.click();
            }
        }, 5000);
    });
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Gallery filter functionality
function initGalleryFilter() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (categoryTabs.length === 0 || galleryItems.length === 0) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize animations
function initAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-card');
    
    if (animatedElements.length === 0) return;
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }
    
    // Add active class to elements in viewport
    function checkAnimations() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkAnimations);
    
    // Check on page load
    checkAnimations();
}

// Lightbox functionality for gallery
if (typeof lightbox !== 'undefined') {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': 'Image %1 of %2',
        'fadeDuration': 300
    });
}
