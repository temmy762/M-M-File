document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxImg = document.createElement('img');
    const lightboxClose = document.createElement('span');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    
    lightboxContent.appendChild(lightboxImg);
    lightboxContent.appendChild(lightboxClose);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.event-gallery-item .gallery-zoom');
    
    // Add click event to each gallery item
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the image source
            const imgSrc = this.closest('.event-gallery-item').querySelector('img').src;
            
            // Set the lightbox image source
            lightboxImg.src = imgSrc;
            
            // Show the lightbox
            lightbox.classList.add('active');
        });
    });
    
    // Close lightbox when clicking the close button
    lightboxClose.addEventListener('click', function() {
        lightbox.classList.remove('active');
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // Close lightbox when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
});
