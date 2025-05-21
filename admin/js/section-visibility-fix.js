/**
 * Fix for Admin Dashboard Section Visibility
 * This script ensures sections are properly displayed and fixes the black space issue
 */

(function() {
    // Run this script immediately to fix any visibility issues
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure dashboard is loaded first and forced to display
        forceDisplayInitialSection();
        
        // Set a shorter timeout to fix black space issue
        setTimeout(fixDashboardVisibility, 10);
        
        // Run again after a longer delay to ensure it catches any delayed rendering issues
        setTimeout(fixDashboardVisibility, 300);
        
        // Run once more after all resources are loaded
        window.addEventListener('load', fixDashboardVisibility);
        
        // Also fix on any resize event
        window.addEventListener('resize', fixDashboardVisibility);
    });
      /**
     * Main function to fix section visibility issues
     */
    function fixDashboardVisibility() {
        const sections = document.querySelectorAll('.admin-section');
        const activeSection = document.querySelector('.admin-section.active');
        
        // If no active section, activate the dashboard
        if (!activeSection && sections.length > 0) {
            sections[0].classList.add('active');
            sections[0].style.display = 'block';
            sections[0].style.visibility = 'visible';
            sections[0].style.opacity = '1';
            
            // Update the nav link if possible
            const navLink = document.querySelector('.admin-nav a[href="#' + sections[0].id + '"]');
            if (navLink) {
                navLink.parentElement.classList.add('active');
            }
        } 
        // If there's an active section, ensure it's visible
        else if (activeSection) {
            activeSection.style.display = 'block';
            activeSection.style.visibility = 'visible';
            activeSection.style.opacity = '1';
            
            // Hide all other sections
            sections.forEach(section => {
                if (section !== activeSection) {
                    section.style.display = 'none';
                }
            });
        }
    }
    
    /**
     * Force the display of the initial section with extra measures
     * to overcome the black space issue
     */
    function forceDisplayInitialSection() {
        // First, try to get the dashboard section specifically
        const dashboardSection = document.getElementById('dashboard-section');
        
        if (dashboardSection) {
            // Ensure all sections are reset first
            document.querySelectorAll('.admin-section').forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });
            
            // Force the dashboard to be visible with all necessary styles
            dashboardSection.classList.add('active');
            dashboardSection.style.display = 'block';
            dashboardSection.style.visibility = 'visible';
            dashboardSection.style.opacity = '1';
            dashboardSection.style.position = 'relative';
            dashboardSection.style.zIndex = '5';
            
            // Ensure the parent containers are also visible
            const adminMain = document.querySelector('.admin-main');
            const adminContent = document.querySelector('.admin-content');
            
            if (adminMain) adminMain.style.display = 'block';
            if (adminContent) adminContent.style.display = 'block';
            
            // Update the corresponding nav link
            const dashboardLink = document.querySelector('.admin-nav a[href="#dashboard-section"]');
            if (dashboardLink && dashboardLink.parentElement) {
                document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
                dashboardLink.parentElement.classList.add('active');
            }
        }
    }
})();
