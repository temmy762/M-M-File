/**
 * Simple Mobile Admin Menu
 * A direct, minimal approach to mobile menu functionality
 */

// Run immediately when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    var mobileMenuToggle = document.getElementById('mobileMenuToggle');
    var sidebar = document.querySelector('.admin-sidebar');
    var navLinks = document.querySelectorAll('.admin-nav a');
    
    // Mobile menu toggle
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('mobile-expanded');
        });
    }
    
    // Close menu when clicking a link (on mobile)
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                sidebar.classList.remove('mobile-expanded');
            }
        });
    });
    
    // Handle section visibility
    function showActiveSection() {
        // Get all sections
        var sections = document.querySelectorAll('.admin-section');
        var activeSection = document.querySelector('.admin-section.active');
        
        // If no active section, default to dashboard
        if (!activeSection && sections.length > 0) {
            activeSection = document.getElementById('dashboard-section') || sections[0];
            activeSection.classList.add('active');
        }
        
        if (activeSection) {
            // Hide all sections
            sections.forEach(function(section) {
                section.style.display = 'none';
            });
            
            // Show active section
            activeSection.style.display = 'block';
        }
    }
    
    // Setup navigation
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(function(navLink) {
                navLink.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get target section ID
            var targetId = this.getAttribute('href');
            
            // Hide all sections
            var sections = document.querySelectorAll('.admin-section');
            sections.forEach(function(section) {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            
            // Show target section
            var targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
            }
        });
    });
    
    // Initial setup
    showActiveSection();
});
