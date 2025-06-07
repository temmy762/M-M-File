/**
 * Mobile Booth Image Fix Script
 * Ensures booth images display properly on mobile devices
 */

// Execute immediately for any images that might load before DOMContentLoaded
(function() {
    fixMobileImages();
})();

// Run again on DOMContentLoaded to catch any remaining issues
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixMobileImages, 100);
    setTimeout(fixMobileImages, 500);
    setTimeout(fixMobileImages, 1000);
});

// Run on window load as final catch
window.addEventListener('load', function() {
    setTimeout(fixMobileImages, 100);
});

function fixMobileImages() {
    // Only run on mobile devices
    if (window.innerWidth <= 768) {
        console.log('Fixing mobile booth images...');
        
        const boothImages = document.querySelectorAll('.booth-image img');
        const boothContainers = document.querySelectorAll('.booth-image');
        
        // Fix booth image containers
        boothContainers.forEach(container => {
            container.style.display = 'block';
            container.style.width = '100%';
            container.style.height = '250px';
            container.style.overflow = 'hidden';
            container.style.borderRadius = '15px';
            container.style.backgroundColor = '#f0f0f0';
            container.style.visibility = 'visible';
            container.style.position = 'relative';
        });
        
        // Fix booth images
        boothImages.forEach(img => {
            // Force display and visibility
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '15px';
            img.style.position = 'relative';
            img.style.zIndex = '1';
            
            // Remove any transform or transition that might be hiding the image
            img.style.transform = 'none';
            img.style.transition = 'none';
            
            // If image failed to load, try to reload it
            if (!img.complete || img.naturalWidth === 0) {
                const originalSrc = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = originalSrc;
                }, 50);
            }
            
            console.log('Fixed image:', img.src);
        });
        
        // Fix booth content layout
        const boothContent = document.querySelectorAll('.booth-content');
        boothContent.forEach(content => {
            content.style.display = 'block';
            content.style.gridTemplateColumns = '1fr';
            content.style.gap = '1rem';
            content.style.padding = '1.5rem';
        });
        
        console.log(`Fixed ${boothImages.length} booth images for mobile`);
    }
}

// Add resize event listener to reapply fixes if needed
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (window.innerWidth <= 768) {
            fixMobileImages();
        }
    }, 250);
});
