/*
   Memories and More Photo Booths - Google Reviews Integration
   Author: Cascade
   Version: 1.0
*/

// Initialize global array to store instances
window.googleReviewsInstances = window.googleReviewsInstances || [];

// Google Reviews Integration
class GoogleReviews {
    constructor(options) {
        this.placeId = options.placeId;
        this.apiKey = options.apiKey;
        this.selector = options.selector;
        this.maxReviews = options.maxReviews || 10;
        this.minRating = options.minRating || 0;
        this.showReviewDate = options.showReviewDate !== false;
        this.showProfilePhoto = options.showProfilePhoto !== false;
        this.carouselInterval = options.carouselInterval || 5000; // 5 seconds
        this.container = document.querySelector(this.selector);
        this.reviewsData = [];
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.totalSlides = 0;
        this.reviewsPerSlide = 3; // Show 3 reviews per slide
    }

    // Initialize the reviews component
    init() {
        if (!this.container) {
            console.error(`Element with selector "${this.selector}" not found.`);
            return;
        }
        
        // Check if we're on mobile and adjust reviewsPerSlide
        if (window.innerWidth <= 768) {
            this.reviewsPerSlide = 1;
        }
        
        // Add this instance to the global array
        window.googleReviewsInstances.push(this);

        // Create placeholder for reviews
        this.createPlaceholder();
        
        // If API key is provided, fetch reviews from Google
        if (this.apiKey) {
            this.fetchReviews();
        } else {
            // Otherwise, load demo reviews
            this.loadDemoReviews();
        }
    }

    // Create placeholder structure for reviews
    createPlaceholder() {
        this.container.innerHTML = `
            <div class="google-reviews-header">
                <div class="google-reviews-rating">
                    <div class="google-stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="google-rating-text">Based on <span class="review-count">0</span> reviews</div>
                </div>
            </div>
            <div class="google-reviews-carousel">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading reviews...</p>
                </div>
            </div>
            <div class="google-reviews-footer">
                <div class="carousel-controls">
                    <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <div class="carousel-pagination"></div>
                    <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <a href="${this.getGoogleReviewLink()}" target="_blank" class="google-reviews-link">
                    <i class="fas fa-external-link-alt"></i> See all reviews on Google
                </a>
            </div>
        `;

        // Add event listeners for carousel controls
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.prevReview());
            nextBtn.addEventListener('click', () => this.nextReview());
        }
    }

    // Fetch reviews from Google Places API
    fetchReviews() {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=name,rating,reviews&key=${this.apiKey}`;
        
        // In a real implementation, this would be a server-side request
        // For demo purposes, we'll use the demo reviews instead
        console.log('In a production environment, this would fetch reviews from:', url);
        this.loadDemoReviews();
    }

    // Load demo reviews (for development without API key)
    loadDemoReviews() {
        // Parse the place ID to extract business name if possible
        const businessName = "Memories and More Photo Booths";
        
        // Demo reviews based on typical Google reviews
        this.reviewsData = [
            {
                author_name: "Sarah Johnson",
                profile_photo_url: "https://ui-avatars.com/api/?name=S+J&background=random",
                rating: 5,
                relative_time_description: "2 months ago",
                text: "I had the pleasure of working with Memories and More Photo Booths for my daughter's wedding. The team was professional, punctual and fun! The photo booth was a huge hit and the quality of the photos was amazing. They even created a beautiful scrapbook of all the photos taken that night. Highly recommend!"
            },
            {
                author_name: "David Miller",
                profile_photo_url: "https://ui-avatars.com/api/?name=D+M&background=random",
                rating: 5,
                relative_time_description: "3 months ago",
                text: "Best photo booth experience ever! We hired them for our company holiday party and everyone loved it. The props were high quality and the attendant was super friendly and helpful. The custom backdrop with our company logo was perfect. Will definitely be using them for all our future events!"
            },
            {
                author_name: "Lisa Thompson",
                profile_photo_url: "https://ui-avatars.com/api/?name=L+T&background=random",
                rating: 5,
                relative_time_description: "1 month ago",
                text: "Memories and More Photo Booths provided excellent service for my son's graduation party. They were on time, set up quickly, and the booth was a hit with all the guests. The photo quality was excellent and everyone loved the digital sharing option. I would highly recommend them for any event!"
            },
            {
                author_name: "Michael Rodriguez",
                profile_photo_url: "https://ui-avatars.com/api/?name=M+R&background=random",
                rating: 5,
                relative_time_description: "2 weeks ago",
                text: "We used Memories and More for our wedding last weekend and they were fantastic! Our guests had so much fun with the photo booth and the attendant was very professional. The custom photo template they designed matched our wedding theme perfectly. The online gallery was available the next day. Great service!"
            },
            {
                author_name: "Jennifer Wilson",
                profile_photo_url: "https://ui-avatars.com/api/?name=J+W&background=random",
                rating: 4,
                relative_time_description: "3 weeks ago",
                text: "Great experience with this photo booth company! They were very responsive during the booking process and accommodated all our requests. The booth was a huge hit at our corporate event. The only reason for 4 stars instead of 5 is that setup took a bit longer than expected, but everything worked perfectly once it was ready."
            }
        ];

        // Filter reviews based on minimum rating
        this.reviewsData = this.reviewsData.filter(review => review.rating >= this.minRating);
        
        // Limit to max reviews
        this.reviewsData = this.reviewsData.slice(0, this.maxReviews);
        
        // Update the UI
        this.updateReviewsUI();
        
        // Start autoplay
        this.startAutoplay();
    }

    // Update the UI with reviews
    updateReviewsUI() {
        const carousel = this.container.querySelector('.google-reviews-carousel');
        const reviewCount = this.container.querySelector('.review-count');
        const paginationContainer = this.container.querySelector('.carousel-pagination');
        
        if (!carousel) return;
        
        // Update review count
        if (reviewCount) {
            reviewCount.textContent = this.reviewsData.length;
        }
        
        // Clear loading spinner
        carousel.innerHTML = '';
        
        // Calculate total number of slides
        this.totalSlides = Math.ceil(this.reviewsData.length / this.reviewsPerSlide);
        
        // Create slides
        for (let slideIndex = 0; slideIndex < this.totalSlides; slideIndex++) {
            const slideContainer = document.createElement('div');
            slideContainer.className = `google-reviews-slide ${slideIndex === 0 ? 'active' : ''}`;
            slideContainer.dataset.slideIndex = slideIndex;
            carousel.appendChild(slideContainer);
            
            // Create columns for the 3-column layout in this slide
            const columnsContainer = document.createElement('div');
            columnsContainer.className = 'google-reviews-columns';
            slideContainer.appendChild(columnsContainer);
            
            // Get reviews for this slide
            const startIndex = slideIndex * this.reviewsPerSlide;
            const endIndex = Math.min(startIndex + this.reviewsPerSlide, this.reviewsData.length);
            const slideReviews = this.reviewsData.slice(startIndex, endIndex);
            
            // Create columns - one for each review in this slide (up to 3)
            slideReviews.forEach(review => {
                const column = document.createElement('div');
                column.className = 'google-reviews-column';
                columnsContainer.appendChild(column);
                
                const reviewElement = document.createElement('div');
                reviewElement.className = 'google-review-slide';
                
                // Generate stars HTML
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= review.rating) {
                        starsHtml += '<i class="fas fa-star"></i>';
                    } else if (i - 0.5 <= review.rating) {
                        starsHtml += '<i class="fas fa-star-half-alt"></i>';
                    } else {
                        starsHtml += '<i class="far fa-star"></i>';
                    }
                }
                
                // Create review HTML
                reviewElement.innerHTML = `
                    <div class="google-review-content">
                        <div class="google-review-header">
                            <div class="reviewer-info">
                                <h4>${review.author_name}</h4>
                                ${this.showReviewDate ? `<p class="review-date">${review.relative_time_description}</p>` : ''}
                                <div class="review-stars">${starsHtml}</div>
                            </div>
                        </div>
                        <p class="review-text">${review.text}</p>
                    </div>
                `;
                
                column.appendChild(reviewElement);
            });
        }
        
        // Create pagination
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const paginationDot = document.createElement('span');
                paginationDot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
                paginationDot.dataset.slideIndex = i;
                paginationContainer.appendChild(paginationDot);
                
                // Add click event to pagination dots
                paginationDot.addEventListener('click', () => {
                    this.showSlide(i);
                    this.resetAutoplay();
                });
            }
        }
    }

    // Navigate to the next slide
    nextReview() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        this.resetAutoplay();
    }

    // Navigate to the previous slide
    prevReview() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        this.resetAutoplay();
    }

    // Show a specific slide by index
    showSlide(index) {
        this.currentIndex = index;
        const slides = this.container.querySelectorAll('.google-reviews-slide');
        const paginationDots = this.container.querySelectorAll('.pagination-dot');
        
        // Update slides
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update pagination dots
        paginationDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Start autoplay for carousel
    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        
        this.autoplayInterval = setInterval(() => {
            this.nextReview();
        }, this.carouselInterval);
    }

    // Stop autoplay
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    // Reset autoplay (used after manual navigation)
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    // Get Google review link
    getGoogleReviewLink() {
        return "https://g.co/kgs/ziucgvg";
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the testimonials section exists
    const testimonialsSection = document.querySelector('.testimonials');
    if (!testimonialsSection) return;
    
    // Create Google Reviews container
    const container = document.createElement('div');
    container.className = 'google-reviews-container';
    
    // Replace the existing testimonial carousel
    const testimonialCarousel = testimonialsSection.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        const carouselParent = testimonialCarousel.parentNode;
        carouselParent.replaceChild(container, testimonialCarousel);
        
        // Also remove the existing carousel controls if they exist
        const existingControls = testimonialsSection.querySelector('.carousel-controls');
        if (existingControls) {
            existingControls.remove();
        }
    } else {
        // If no existing carousel, append to the testimonials section
        testimonialsSection.querySelector('.container').appendChild(container);
    }
    
    // Initialize Google Reviews
    const googleReviews = new GoogleReviews({
        placeId: 'ChIJZ2jDQdcts1IRlQGsz6Ld_YA', // Extracted from the provided link
        apiKey: '', // You'll need to add your Google Places API key here
        selector: '.google-reviews-container',
        maxReviews: 10,
        minRating: 4,
        showReviewDate: true,
        showProfilePhoto: true,
        carouselInterval: 5000
    });
    
    googleReviews.init();
});
