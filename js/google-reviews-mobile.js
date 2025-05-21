/*
   Memories and More Photo Booths - Google Reviews Mobile Enhancement
   Author: Cascade
   Version: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    
    // Function to update reviews per slide based on screen size
    function updateReviewsPerSlide() {
        const reviewsInstances = window.googleReviewsInstances || [];
        
        reviewsInstances.forEach(instance => {
            // On mobile, show only 1 review per slide
            if (window.innerWidth <= 768) {
                instance.reviewsPerSlide = 1;
            } else {
                instance.reviewsPerSlide = 3; // Default for desktop
            }
            
            // If reviews are already loaded, update the UI
            if (instance.reviewsData && instance.reviewsData.length > 0) {
                instance.updateReviewsUI();
            }
        });
    }
    
    // Initial setup
    updateReviewsPerSlide();
    
    // Update on window resize
    window.addEventListener('resize', function() {
        updateReviewsPerSlide();
    });
});
