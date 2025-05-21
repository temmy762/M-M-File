/*
   Memories and More Photo Booths - GSAP Animations
   Author: Cascade
   Version: 1.0
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations if GSAP is available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize all animations
        initHeroAnimations();
        initSectionAnimations();
        initFeatureAnimations();
        initGalleryAnimations();
        initTestimonialAnimations();
    }
});

// Hero section animations
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    
    if (!heroContent) return;
    
    // Create timeline for hero animations
    const heroTl = gsap.timeline();
    
    heroTl.from('.hero h1', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    })
    .from('.hero h2', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-buttons .btn', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5');
    
    // Subtle zoom effect on hero background
    gsap.to('.hero-background img', {
        scale: 1.1,
        duration: 10,
        ease: 'none',
        repeat: -1,
        yoyo: true
    });
}

// Section animations
function initSectionAnimations() {
    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Animate section descriptions
    gsap.utils.toArray('.section-description').forEach(desc => {
        gsap.from(desc, {
            scrollTrigger: {
                trigger: desc,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    });
}

// Feature card animations
function initFeatureAnimations() {
    // Animate feature cards
    gsap.utils.toArray('.feature-card, .service-card, .spec-item, .addon-item').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            onComplete: () => {
                card.classList.add('active');
            }
        });
    });
    
    // Animate pricing cards
    gsap.utils.toArray('.pricing-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'back.out(1.2)'
        });
    });
}

// Gallery animations
function initGalleryAnimations() {
    // Animate gallery items
    gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1 % 0.5, // Stagger but reset after every 5 items
            ease: 'power3.out'
        });
    });
}

// Testimonial animations
function initTestimonialAnimations() {
    // Animate testimonial slides
    gsap.utils.toArray('.testimonial-content').forEach(content => {
        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

// FAQ accordion animations
function initFaqAnimations() {
    // Animate FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });
}

// Booth showcase animations
const boothShowcase = document.querySelectorAll('.booth-content');
if (boothShowcase.length > 0) {
    boothShowcase.forEach(content => {
        const image = content.querySelector('.booth-image');
        const details = content.querySelector('.booth-details');
        
        if (image && details) {
            gsap.from(image, {
                scrollTrigger: {
                    trigger: content,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: content.classList.contains('reverse') ? 50 : -50,
                duration: 1,
                ease: 'power3.out'
            });
            
            gsap.from(details, {
                scrollTrigger: {
                    trigger: content,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                x: content.classList.contains('reverse') ? -50 : 50,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
    });
}

// CTA section animations
const ctaSections = document.querySelectorAll('.cta-section, .get-quote');
if (ctaSections.length > 0) {
    ctaSections.forEach(section => {
        gsap.from(section.querySelector('h2'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelector('p'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
        
        // Fix for buttons disappearing - changed from opacity: 0 to opacity: 1
        // and removed the y transform to prevent buttons from disappearing
        gsap.from(section.querySelectorAll('.btn, .cta-buttons .btn-primary, .cta-buttons .btn-secondary'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            ease: 'power3.out'
        });
    });
}

// Form animations
const formSteps = document.querySelectorAll('.form-step');
if (formSteps.length > 0) {
    formSteps.forEach(step => {
        if (step.classList.contains('active')) {
            gsap.from(step.querySelectorAll('.form-group'), {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.5,
                ease: 'power3.out',
                delay: 0.2
            });
        }
    });
}

// Parallax effect on certain sections
const parallaxSections = document.querySelectorAll('.page-header, .cta-section, .get-quote');
if (parallaxSections.length > 0) {
    parallaxSections.forEach(section => {
        gsap.to(section, {
            backgroundPosition: `50% ${window.innerHeight / 2}px`,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}
