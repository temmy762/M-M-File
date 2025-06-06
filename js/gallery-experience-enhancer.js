/**
 * Gallery Experience Enhancer
 * Advanced optimizations for gallery interaction and performance
 */

// Execute immediately for fastest loading
(function() {
  // Initialize as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryEnhancer);
  } else {
    initGalleryEnhancer();
  }
})();

/**
 * Initialize all gallery enhancements
 */
function initGalleryEnhancer() {
  // Apply loading states to all gallery items
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => item.classList.add('loading'));
  
  // Enhance images with loading and error handling
  enhanceGalleryImages();
  
  // Enhance filter buttons with smooth animations
  enhanceFilterButtons();
  
  // Apply responsive optimizations
  applyResponsiveOptimizations();
  
  // Add scroll-based loading animations
  initScrollAnimations();
  
  // Add window resize handler
  window.addEventListener('resize', debounce(applyResponsiveOptimizations, 200));
  
  // Log initialization
  console.log('Gallery enhancer initialized with', galleryItems.length, 'items');
}

/**
 * Enhance gallery images with better loading and error handling
 */
function enhanceGalleryImages() {
  const galleryImages = document.querySelectorAll('.gallery-item img');
  
  galleryImages.forEach((img, index) => {
    // Add loading attribute if not present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding attribute for better performance
    img.setAttribute('decoding', 'async');
    
    // Handle image loading
    img.addEventListener('load', function() {
      const galleryItem = this.closest('.gallery-item');
      if (galleryItem) {
        // Remove loading state when image loads
        galleryItem.classList.remove('loading');
        
        // Add loaded class for potential animations
        galleryItem.classList.add('loaded');
      }
    });
    
    // Handle image errors
    img.addEventListener('error', function() {
      console.error('Failed to load image:', this.src);
      
      // Replace with a fallback image
      this.src = 'images/logo.jpg';
      this.style.objectFit = 'contain';
      this.style.padding = '20px';
      this.style.backgroundColor = '#f8f8f8';
      
      // Remove loading state
      const galleryItem = this.closest('.gallery-item');
      if (galleryItem) {
        galleryItem.classList.remove('loading');
      }
    });
    
    // Prioritize first visible images
    if (index < 8) {
      img.setAttribute('importance', 'high');
    } else {
      img.setAttribute('importance', 'low');
    }
  });
}

/**
 * Enhance filter buttons with smooth animations
 */
function enhanceFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get selected category
      const category = this.getAttribute('data-category');
      
      // Filter gallery items with smooth animations
      filterGalleryItems(galleryItems, category);
    });
  });
}

/**
 * Filter gallery items with smooth animations
 */
function filterGalleryItems(items, category) {
  // Track visible items for layout adjustments
  let visibleCount = 0;
  
  items.forEach((item, index) => {
    const itemCategory = item.getAttribute('data-category');
    const shouldShow = category === 'all' || itemCategory === category;
    
    if (shouldShow) {
      // Increment visible count
      visibleCount++;
      
      // Show with delay based on position for cascade effect
      const delay = Math.min(index * 50, 300);
      
      // Set initial state if hidden
      if (item.style.display === 'none') {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.display = 'block';
      }
      
      // Animate in with delay
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      }, delay);
    } else {
      // Animate out and hide
      item.style.opacity = '0';
      item.style.transform = 'scale(0.9)';
      
      // Hide after animation completes
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    }
  });
  
  // Adjust layout if needed based on visible items
  setTimeout(() => {
    adjustGalleryLayout(visibleCount);
  }, 350);
}

/**
 * Adjust gallery layout based on visible items
 */
function adjustGalleryLayout(visibleCount) {
  const gallery = document.querySelector('.gallery-grid');
  if (!gallery) return;
  
  // Ensure proper layout with few items
  if (visibleCount <= 3 && window.innerWidth >= 992) {
    gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
  } else if (visibleCount <= 2 && window.innerWidth >= 768) {
    gallery.style.gridTemplateColumns = 'repeat(2, 1fr)';
  } else {
    // Reset to default responsive layout
    gallery.style.gridTemplateColumns = '';
  }
}

/**
 * Apply responsive optimizations based on screen size
 */
function applyResponsiveOptimizations() {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    // Apply optimizations based on device type
    if (isMobile) {
      // Show overlay by default on mobile
      const overlay = item.querySelector('.gallery-overlay');
      if (overlay) overlay.style.opacity = '1';
      
      // Disable hover animations on mobile
      item.classList.add('mobile-view');
    } else {
      // Enable hover animations on larger screens
      item.classList.remove('mobile-view');
      
      // Reset overlay opacity for hover effect
      const overlay = item.querySelector('.gallery-overlay');
      if (overlay) overlay.style.opacity = '';
    }
  });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
  // Use Intersection Observer if available
  if ('IntersectionObserver' in window) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe all gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
      observer.observe(item);
    });
  }
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
