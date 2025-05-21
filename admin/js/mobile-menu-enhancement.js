/**
 * Memories and More Photo Booths Admin
 * Mobile Menu Enhancement Script
 * 
 * This script fixes mobile menu issues and improves section visibility
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    fixSectionVisibility();
    
    // Re-check on window resize
    window.addEventListener('resize', function() {
        checkMobileMenuState();
        fixSectionVisibility();
    });
});

/**
 * Initialize the mobile menu functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    if (mobileMenuToggle && sidebar) {
        // Log that we found the toggle button
        console.log("Mobile menu toggle found and initialized");
        
        // Ensure the toggle button works correctly with direct click handler
        mobileMenuToggle.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Mobile menu toggle clicked");
            
            // Toggle expanded class
            sidebar.classList.toggle('mobile-expanded');
        };
        
        // Close menu when clicking a navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('mobile-expanded');
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 992 && 
                sidebar.classList.contains('mobile-expanded') && 
                !sidebar.contains(e.target) && 
                e.target !== mobileMenuToggle && 
                !mobileMenuToggle.contains(e.target)) {
                
                sidebar.classList.remove('mobile-expanded');
            }
        });
    }
    
    checkMobileMenuState();
}

/**
 * Set correct menu state based on screen size
 */
function checkMobileMenuState() {
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebar) {
        if (window.innerWidth >= 992) {
            // On desktop
            sidebar.classList.remove('mobile-expanded');
        }
    }
}

/**
 * Fix section visibility issues
 */
function fixSectionVisibility() {
    // Get all sections and the active section
    const sections = document.querySelectorAll('.admin-section');
    let activeSection = document.querySelector('.admin-section.active');
    
    // If no active section, make the dashboard active
    if (!activeSection && sections.length > 0) {
        activeSection = document.getElementById('dashboard-section') || sections[0];
        activeSection.classList.add('active');
        
        // Update the nav link
        const navLinks = document.querySelectorAll('.admin-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + activeSection.id) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
    }
    
    if (activeSection) {
        // Force a redraw of the active section
        activeSection.style.display = 'none';
        void activeSection.offsetHeight; // Trigger a reflow
        
        // Ensure the active section has correct styles
        activeSection.style.display = 'block';
        activeSection.style.visibility = 'visible';
        activeSection.style.opacity = '1';
        activeSection.style.height = 'auto';
        activeSection.style.overflow = 'visible';
        activeSection.style.position = 'relative';
        activeSection.style.zIndex = '5';
        
        // Apply grid layout fixes for mobile
        if (window.innerWidth <= 991) {
            const dashboardStats = activeSection.querySelector('.dashboard-stats');
            if (dashboardStats) {
                dashboardStats.style.display = 'flex';
                dashboardStats.style.flexDirection = 'column';
            }
            
            const packageCards = activeSection.querySelector('.package-cards');
            if (packageCards) {
                packageCards.style.display = 'flex';
                packageCards.style.flexDirection = 'column';
            }
            
            const addonList = activeSection.querySelector('.addon-list');
            if (addonList) {
                addonList.style.display = 'flex';
                addonList.style.flexDirection = 'column';
            }
        }
        
        // Hide all non-active sections
        sections.forEach(section => {
            if (section !== activeSection) {
                section.style.display = 'none';
                section.style.visibility = 'hidden';
                section.style.opacity = '0';
                section.style.height = '0';
                section.style.overflow = 'hidden';
            }
        });
    }
}
