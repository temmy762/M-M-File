/**
 * Memories and More Photo Booths - Image Fallback Handler
 * This script ensures images load correctly with fallbacks when needed
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check all booth images and apply fallbacks if needed
    handleBoothImageFallbacks();
});

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
            const boothHeading = img.closest('.booth-content')?.querySelector('h2')?.textContent;
            
            // Apply appropriate fallback based on booth type
            if (boothHeading === 'White Booth') {
                // Fallback for White Booth
                this.src = 'images/image-19.png'; // Use another existing image as fallback
            } else if (boothHeading === 'Enclosed Booth') {
                // Fallback for Enclosed Booth
                this.src = 'images/image-1.png';
            } else {
                // Default fallback
                this.src = 'images/image-11.png';
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
