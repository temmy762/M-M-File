/**
 * Memories and More Photo Booths - Sections Fix
 * Author: Cascade
 * Version: 1.1
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fix Why Choose Us section
    fixFeatureCards();
    
    // Fix Services Overview section
    fixServiceCards();
});

/**
 * Fix feature cards in the Why Choose Us section
 */
function fixFeatureCards() {
    const featureCards = document.querySelectorAll('.features-grid .feature-card');
    
    if (featureCards.length > 0) {
        // Make all feature cards visible
        featureCards.forEach(card => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.transform = 'none';
            
            // Add active class
            setTimeout(() => {
                card.classList.add('active');
            }, 100);
        });
        
        // Make sure the features grid is visible
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid) {
            featuresGrid.style.opacity = '1';
            featuresGrid.style.visibility = 'visible';
        }
        
        console.log('Feature cards fix applied');
    }
}

/**
 * Fix service cards in the Perfect for Every Occasion section
 */
function fixServiceCards() {
    const serviceCards = document.querySelectorAll('.services-grid .service-card');
    
    if (serviceCards.length > 0) {
        // Make all service cards visible
        serviceCards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.transform = 'none';
            
            // Add active class with staggered delay
            setTimeout(() => {
                card.classList.add('active');
            }, 100 + (index * 50));
        });
        
        // Make sure the services grid is visible
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.opacity = '1';
            servicesGrid.style.visibility = 'visible';
        }
        
        console.log('Service cards fix applied');
    }
}
