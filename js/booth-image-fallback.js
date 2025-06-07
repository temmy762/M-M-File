/**
 * Memories and More Photo Booths - Enhanced Image Fallback Handler
 * This script ensures images load correctly with fallbacks when needed
 * and fixes specific booth image loading issues
 */

// Execute immediately to fix images that might load before DOMContentLoaded
(function() {
    // Try to fix images immediately
    fixBoothImages();
})();

// Also run on DOMContentLoaded to ensure all elements are available
document.addEventListener('DOMContentLoaded', function() {
    // Fix booth images and set up fallbacks
    fixBoothImages();
    handleBoothImageFallbacks();
});

/**
 * Fix booth images by directly setting correct sources
 */
function fixBoothImages() {
    // Get all booth images in the new gallery theme structure
    const boothImages = document.querySelectorAll('.booth-image img');
    
    boothImages.forEach(imgElement => {
        // Find the booth heading
        const boothContent = imgElement.closest('.booth-content');
        const heading = boothContent?.querySelector('h2')?.textContent;
        
        // Apply correct image based on booth type
        if (heading === 'Open-Air Style Booth') {
            imgElement.src = 'images/image-10.jpeg';
            imgElement.setAttribute('alt', 'Open-Air Style Photo Booth');
        } else if (heading === 'Enclosed Booth') {
            imgElement.src = 'images/image-2.jpeg';
            imgElement.setAttribute('alt', 'Enclosed Photo Booth');
        } else if (heading === 'Elegant Design') {
            imgElement.src = 'images/image-6.jpeg';
            imgElement.setAttribute('alt', 'Elegant Design Photo Booth');
        }
        
        // Ensure image is visible
        imgElement.style.display = 'block';
        imgElement.style.maxWidth = '100%';
        imgElement.style.height = 'auto';
    });
}

/**
 * Handle fallbacks for booth images if they don't load properly
 */
function handleBoothImageFallbacks() {
    // Get all booth images
    const boothImages = document.querySelectorAll('.booth-image img');
    
    // Set up fallbacks for each image
    boothImages.forEach(img => {
        // Store the original source
        const originalSrc = img.getAttribute('src');
        
        // Handle error if the image fails to load
        img.onerror = function() {
            console.log(`Image failed to load: ${originalSrc}`);
            
            // Check which booth type this is
            const boothContent = img.closest('.booth-content');
            const boothHeading = boothContent?.querySelector('h2')?.textContent;
            
            // Apply appropriate fallback based on booth type
            if (boothHeading === 'Open-Air Style Booth') {
                this.src = 'images/image-8.jpeg';
            } else if (boothHeading === 'Enclosed Booth') {
                this.src = 'images/image-4.jpeg';
            } else if (boothHeading === 'Elegant Design') {
                this.src = 'images/image-7.jpeg';
            } else {
                // Default fallback
                this.src = 'images/logo.jpg';
            }
            
            // If the fallback also fails, use a generic image
            this.onerror = function() {
                this.src = 'images/logo.jpg';
                this.style.padding = '20px';
                this.style.background = '#f0f0f0';
                this.onerror = null; // Prevent infinite loop
            };
        };
    });
}
