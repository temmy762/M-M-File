/**
 * Gallery Alignment Handler
 * Ensures perfect alignment of gallery items
 */

// Execute immediately for fastest alignment
(function() {
  // Initialize as soon as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlignmentHandler);
  } else {
    initAlignmentHandler();
  }
})();

/**
 * Initialize alignment handler
 */
function initAlignmentHandler() {
  // Initial alignment
  alignGalleryItems();
  
  // Handle window resize
  window.addEventListener('resize', debounce(alignGalleryItems, 200));
  
  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(alignGalleryItems, 300);
  });
  
  // Handle after images load
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('load', function() {
      alignGalleryItems();
    });
  });
  
  // Handle after filter changes
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Wait for filter animation to complete
      setTimeout(alignGalleryItems, 400);
    });
  });
}

/**
 * Align gallery items for perfect grid
 */
function alignGalleryItems() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;
  
  // Get computed style of the grid
  const computedStyle = window.getComputedStyle(galleryGrid);
  const gridGap = parseInt(computedStyle.gap || computedStyle.gridGap || '10', 10);
  
  // Get the number of columns based on screen size
  const columns = getColumnCount();
  
  // Calculate item width based on container width and columns
  const containerWidth = galleryGrid.clientWidth;
  const itemWidth = (containerWidth - (gridGap * (columns - 1))) / columns;
  
  // Apply consistent dimensions to all items
  galleryItems.forEach(item => {
    // Reset any previous inline styles
    item.style.width = '';
    item.style.height = '';
    
    // Apply new dimensions
    item.style.width = `${itemWidth}px`;
    item.style.height = `${itemWidth}px`;
    
    // Ensure image fills container properly
    const img = item.querySelector('img');
    if (img) {
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
    }
  });
  
  // Ensure overlay is properly positioned
  document.querySelectorAll('.gallery-overlay').forEach(overlay => {
    overlay.style.width = '100%';
    overlay.style.bottom = '0';
    overlay.style.left = '0';
  });
}

/**
 * Get current column count based on screen size
 */
function getColumnCount() {
  const width = window.innerWidth;
  if (width >= 992) return 4; // Desktop and large desktop: 4 columns (1fr 1fr 1fr 1fr)
  return 2; // Mobile and tablet: 2 columns as requested
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
