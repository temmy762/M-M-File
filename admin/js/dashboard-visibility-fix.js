/**
 * Force dashboard section visibility on page load
 * This ensures the admin dashboard content is shown immediately
 */
document.addEventListener('DOMContentLoaded', function() {
    // Force display the dashboard section on initial load
    forceShowDashboard();
    
    // Also add event listeners to nav links to ensure sections display correctly
    addSectionVisibilityListeners();
});

/**
 * Forces the dashboard section to be visible
 */
function forceShowDashboard() {
    // Get all sections
    const sections = document.querySelectorAll('.admin-section');
    
    // First hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show the dashboard section specifically
    const dashboardSection = document.getElementById('dashboard-section');
    if (dashboardSection) {
        // Force display with all necessary properties
        dashboardSection.classList.add('active');
        dashboardSection.style.display = 'block';
        dashboardSection.style.visibility = 'visible';
        dashboardSection.style.opacity = '1';
        
        // Activate the corresponding navigation link
        const dashboardLink = document.querySelector('.admin-nav a[href="#dashboard-section"]');
        if (dashboardLink) {
            const navItems = document.querySelectorAll('.admin-nav li');
            navItems.forEach(item => item.classList.remove('active'));
            dashboardLink.parentElement.classList.add('active');
        }
    }
}

/**
 * Add event listeners to navigation links to ensure sections display correctly
 */
function addSectionVisibilityListeners() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Force a reflow of the section to ensure it displays
                setTimeout(() => {
                    targetSection.style.display = 'none';
                    void targetSection.offsetHeight; // Force reflow
                    targetSection.style.display = 'block';
                }, 10);
            }
        });
    });
}
