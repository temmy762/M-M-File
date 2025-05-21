/**
 * Memories and More Photo Booths - Admin Dashboard
 * Main admin functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize main features
    initializeNavigation();
    setupModalFunctionality();
    loadPackageData();
    loadAddonData();
    loadSettings();
    updateDashboardCounts();
    
    // Event listeners for package forms
    document.getElementById('savePackageSilver').addEventListener('click', function(e) {
        e.preventDefault();
        savePackage('silver');
    });
    
    document.getElementById('savePackageGold').addEventListener('click', function(e) {
        e.preventDefault();
        savePackage('gold');
    });
    
    document.getElementById('savePackageCustom').addEventListener('click', function(e) {
        e.preventDefault();
        savePackage('custom');
    });
    
    document.getElementById('publishPackages').addEventListener('click', function(e) {
        e.preventDefault();
        publishPackagesToWebsite();
    });
    
    // Event listeners for addon forms
    document.querySelectorAll('.addon-save-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const addonType = this.getAttribute('data-addon');
            saveAddon(addonType);
        });
    });
    
    document.getElementById('publishAddons').addEventListener('click', function(e) {
        e.preventDefault();
        publishAddonsToWebsite();
    });
    
    // Settings form submission
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showLogoutConfirmation();
    });
});

/**
 * Initialize navigation between sections
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    // Make first section active by default
    if (sections.length > 0 && !document.querySelector('.admin-section.active')) {
        sections[0].classList.add('active');
        sections[0].style.display = 'block'; // Ensure it's displayed
        sections[0].style.visibility = 'visible'; // Make sure it's visible
        
        if (navLinks.length > 0) {
            navLinks[0].parentElement.classList.add('active');
        }
        
        // Hide all other sections to avoid display issues
        for(let i = 1; i < sections.length; i++) {
            sections[i].classList.remove('active');
            sections[i].style.display = 'none';
            sections[i].style.visibility = 'hidden'; // Explicitly hide
            sections[i].style.opacity = '0'; // Make fully transparent
        }
    }
    
    // Enhanced mobile menu toggle with animation support
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            
            // Toggle expanded class
            sidebar.classList.toggle('mobile-expanded');
            
            // Animate hamburger icon
            const bars = this.querySelectorAll('.bar');
            if (bars.length >= 3) {
                if (sidebar.classList.contains('mobile-expanded')) {
                    // X shape for close
                    bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
                } else {
                    // Reset to hamburger
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const isMobile = window.innerWidth < 992;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href
            const targetId = this.getAttribute('href');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none'; // Ensure other sections are hidden
            });
            
            // Show the target section
            const targetSection = document.querySelector(targetId);
            targetSection.classList.add('active');
            targetSection.style.display = 'block'; // Ensure target section is visible
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Close mobile menu if open and on mobile device
            if (isMobile && sidebar.classList.contains('mobile-expanded')) {
                sidebar.classList.remove('mobile-expanded');
            }
            
            // Update dashboard stats when switching to dashboard
            if (targetId === '#dashboard-section') {
                updateDashboardCounts();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth < 992;
        if (newIsMobile !== isMobile && sidebar) {
            if (newIsMobile) {
                sidebar.classList.remove('collapsed');
            } else {
                sidebar.classList.remove('mobile-expanded');
            }
        }
    });
}

/**
 * Setup modal functionality
 */
function setupModalFunctionality() {
    const modal = document.getElementById('confirmModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelAction = document.getElementById('cancelAction');
    
    if (closeModal) {
        // Close modal when clicking the X
        closeModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (cancelAction) {
        // Close modal when clicking Cancel
        cancelAction.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}
    
    // Settings form submission
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

/**
 * Show logout confirmation
 */
function showLogoutConfirmation() {
    // Show confirmation modal
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmAction = document.getElementById('confirmAction');
    
    if (!modal || !modalTitle || !modalMessage || !confirmAction) {
        console.error('Modal elements not found');
        return;
    }
    
    modalTitle.textContent = 'Confirm Logout';
    modalMessage.textContent = 'Are you sure you want to logout?';
    
    modal.classList.add('active');
    
    // Set up confirm action
    confirmAction.onclick = function() {
        // Refresh the page as simple logout
        window.location.reload();
    };
}

/**
 * Update dashboard counts
 */
function updateDashboardCounts() {
    const packageCount = document.getElementById('packageCount');
    const addonCount = document.getElementById('addonCount');
    const eventCount = document.getElementById('eventCount');
    
    if (packageCount) {
        // Get package data
        const packages = JSON.parse(localStorage.getItem('packageData')) || {};
        // Count packages (excluding custom which is always present)
        let count = Object.keys(packages).filter(key => key !== 'custom').length;
        packageCount.textContent = count;
    }
    
    if (addonCount) {
        // Get addon data
        const addons = JSON.parse(localStorage.getItem('addonData')) || {};
        addonCount.textContent = Object.keys(addons).length;
    }
    
    if (eventCount) {
        // Get event data (for now just use a placeholder)
        const events = JSON.parse(localStorage.getItem('eventData')) || [];
        eventCount.textContent = events.length || '0';
    }
}
