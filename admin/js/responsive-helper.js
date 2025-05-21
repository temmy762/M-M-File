/**
 * Memories and More Photo Booths - Admin Dashboard Responsive Helpers
 * Enhances the responsiveness of the dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    initResponsiveFeatures();
    setupAccessibilityFeatures();
    handleWelcomeMessageVisibility();
    fixMobileMenuToggle();
    initDashboardVisibility();
    // Execute after a short delay to ensure all other scripts have run
    setTimeout(ensureActiveSectionVisible, 100);
    
    // Also add event listener for resize to ensure sections remain visible
    window.addEventListener('resize', debounce(function() {
        ensureActiveSectionVisible();
    }, 250));
    
    // Force check for active section visibility after a longer delay
    setTimeout(function() {
        const activeSection = document.querySelector('.admin-section.active');
        if (!activeSection || window.getComputedStyle(activeSection).display === 'none') {
            initDashboardVisibility();
        }
    }, 500);
});

/**
 * Initialize responsive features
 */
function initResponsiveFeatures() {
    // Fix for package cards and add-on items on different screen sizes
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            adjustCardSizes();
        }
    });

    // Observe the body element for size changes
    resizeObserver.observe(document.body);
    
    // Initial adjustment
    adjustCardSizes();
    
    // Handle orientation change explicitly
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustCardSizes, 300); // Wait for the orientation change to complete
    });
}

/**
 * Adjust card sizes based on available space
 */
function adjustCardSizes() {
    const windowWidth = window.innerWidth;
    const packageCards = document.querySelectorAll('.package-edit-card');
    const addonItems = document.querySelectorAll('.addon-edit-item');
    
    // Adjust package cards
    if (packageCards.length > 0) {
        if (windowWidth < 768) {
            // Mobile: 1 column
            packageCards.forEach(card => {
                card.style.minHeight = 'auto';
            });
        } else if (windowWidth < 992) {
            // Tablet: 2 columns with equal heights in each row
            equalizeHeights(packageCards, 2);
        } else {
            // Desktop: 3 columns with equal heights in each row
            equalizeHeights(packageCards, 3);
        }
    }
    
    // Adjust add-on items
    if (addonItems.length > 0) {
        if (windowWidth < 768) {
            // Mobile: 1 column
            addonItems.forEach(item => {
                item.style.minHeight = 'auto';
            });
        } else if (windowWidth < 992) {
            // Tablet: 2 columns with equal heights in each row
            equalizeHeights(addonItems, 2);
        } else {
            // Desktop: Equal heights in each row
            equalizeHeights(addonItems, 2);
        }
    }
}

/**
 * Equalize heights of items in rows
 */
function equalizeHeights(items, columnsPerRow) {
    // Reset heights
    items.forEach(item => {
        item.style.minHeight = 'auto';
    });
    
    // Create rows
    const rows = [];
    for (let i = 0; i < items.length; i += columnsPerRow) {
        rows.push(Array.from(items).slice(i, i + columnsPerRow));
    }
    
    // Set equal heights in each row
    rows.forEach(row => {
        const maxHeight = Math.max(...row.map(item => item.offsetHeight));
        row.forEach(item => {
            item.style.minHeight = maxHeight + 'px';
        });
    });
}

/**
 * Setup accessibility features
 */
function setupAccessibilityFeatures() {
    // Add focus styles to improve keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
    
    // Add keyboard support for checkbox toggles
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.checked = !this.checked;
            }
        });
    });
}

// Add a function to handle smooth scrolling when a section becomes active
function smoothScrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        if (window.innerWidth < 768) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Handle welcome message visibility and styling based on screen size
 */
function handleWelcomeMessageVisibility() {
    const welcomeMessage = document.querySelector('.dashboard-welcome');
    if (!welcomeMessage) return;
    
    const isDesktop = window.innerWidth >= 992;
    
    if (isDesktop) {
        // Enhance the desktop welcome message with more professional styling
        welcomeMessage.classList.add('desktop-welcome');
        
        // If we haven't already enhanced the welcome message
        if (!welcomeMessage.querySelector('.welcome-header')) {
            // Get any dashboard stats if available
            const eventCount = document.getElementById('eventCount')?.textContent || '0';
            const packageCount = document.getElementById('packageCount')?.textContent || '3';
            const addonCount = document.getElementById('addonCount')?.textContent || '4';
              // Create enhanced welcome message
            welcomeMessage.innerHTML = `
                <div class="welcome-header">
                    <h3>Welcome to Memories and More Admin</h3>
                    <p>Manage your photo booth services efficiently</p>
                </div>
                <div class="welcome-stats">
                    <div class="stat-item">
                        <i class="fas fa-tags"></i>
                        <span class="stat-number">${packageCount}</span>
                        <span class="stat-label">Packages</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-plus-circle"></i>
                        <span class="stat-number">${addonCount}</span>
                        <span class="stat-label">Add-ons</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-calendar-check"></i>
                        <span class="stat-number">${eventCount}</span>
                        <span class="stat-label">Events</span>
                    </div>
                </div>
                <div class="welcome-actions">
                    <button class="welcome-btn packages-btn"><i class="fas fa-tags"></i> Manage Packages</button>
                    <button class="welcome-btn addons-btn"><i class="fas fa-plus-circle"></i> Manage Add-ons</button>
                </div>
            `;
            
            // Add click event listeners for the buttons
            const packageBtn = welcomeMessage.querySelector('.packages-btn');
            if (packageBtn) {
                packageBtn.addEventListener('click', function() {
                    navigateToSection('#packages-section');
                });
            }
            
            const addonsBtn = welcomeMessage.querySelector('.addons-btn');
            if (addonsBtn) {
                addonsBtn.addEventListener('click', function() {
                    navigateToSection('#addons-section');
                });
            }
        }
    } else {
        // Reset to simple welcome message for mobile
        welcomeMessage.classList.remove('desktop-welcome');
        
        // Only reset if it has our enhanced content
        if (welcomeMessage.querySelector('.welcome-header')) {
            welcomeMessage.innerHTML = `
                <h3>Welcome to the Memories and More Photo Booths Admin Dashboard</h3>
                <p>Use the sidebar navigation to manage your website content.</p>
            `;
        }
    }
    
    // Set up listener for window resize to update welcome message
    window.addEventListener('resize', debounce(function() {
        handleWelcomeMessageVisibility();
    }, 250));
}

/**
 * Fix mobile menu toggle button to ensure it's clickable
 */
function fixMobileMenuToggle() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (mobileMenuToggle && sidebar) {
        // Ensure the toggle button is clickable by adding a higher z-index
        mobileMenuToggle.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Toggle sidebar visibility
            sidebar.classList.toggle('mobile-expanded');
            
            // Toggle hamburger menu animation
            const bars = this.querySelectorAll('.bar');
            if (sidebar.classList.contains('mobile-expanded')) {
                // X shape for close
                if (bars.length >= 3) {
                    bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
                }
            } else {
                // Reset to hamburger
                if (bars.length >= 3) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('mobile-expanded') && 
                !sidebar.contains(event.target) && 
                event.target !== mobileMenuToggle &&
                !mobileMenuToggle.contains(event.target)) {
                
                sidebar.classList.remove('mobile-expanded');
                
                // Reset hamburger icon
                const bars = mobileMenuToggle.querySelectorAll('.bar');
                if (bars.length >= 3) {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    }
}

/**
 * Simple debounce function to limit event handling frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait between executions
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Navigate to a specific section of the dashboard
 * @param {string} sectionId - The ID of the section to navigate to
 */
function navigateToSection(sectionId) {
    // Find the corresponding navigation link
    const navLink = document.querySelector(`.admin-nav a[href="${sectionId}"]`);
    
    if (navLink) {
        // Simulate a click on the navigation link
        navLink.click();
    } else {
        // Fallback in case the navigation link isn't found
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none'; // Ensure other sections are hidden
        });
        
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block'; // Force display of the target section
        }
        
        // Close mobile menu if it's open
        const sidebar = document.querySelector('.admin-sidebar');
        if (sidebar && window.innerWidth < 992) {
            sidebar.classList.remove('mobile-expanded');
        }
    }
}

/**
 * Ensure active section is visible, especially on mobile
 */
function ensureActiveSectionVisible() {
    // Find active section
    const activeSection = document.querySelector('.admin-section.active');
    
    // If no active section, activate the dashboard
    if (!activeSection) {
        const dashboard = document.querySelector('#dashboard-section');
        if (dashboard) {
            dashboard.classList.add('active');
            dashboard.style.display = 'block';
            
            // Also update the nav link
            const dashboardLink = document.querySelector('.admin-nav a[href="#dashboard-section"]');
            if (dashboardLink) {
                dashboardLink.parentElement.classList.add('active');
            }
        }
        return;
    }
    
    // Ensure active section is visible with proper display properties
    activeSection.style.display = 'block';
    activeSection.style.visibility = 'visible';
    activeSection.style.opacity = '1';
    
    // Make other sections invisible
    document.querySelectorAll('.admin-section:not(.active)').forEach(section => {
        section.style.display = 'none';
    });
    
    // Update the corresponding navigation link
    const sectionId = activeSection.id;
    const navLink = document.querySelector(`.admin-nav a[href="#${sectionId}"]`);
    if (navLink) {
        // Clear other active links
        document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
        // Set this link as active
        navLink.parentElement.classList.add('active');
    }
}

/**
 * Set up initial dashboard section visibility
 * This function runs on page load to ensure the dashboard is visible
 */
function initDashboardVisibility() {
    // Check if the dashboard section exists
    const dashboardSection = document.getElementById('dashboard-section');
    if (!dashboardSection) return;
    
    // Ensure dashboard is visible with all necessary styles
    dashboardSection.classList.add('active');
    dashboardSection.style.display = 'block';
    dashboardSection.style.visibility = 'visible';
    dashboardSection.style.opacity = '1';
    dashboardSection.style.position = 'relative';
    dashboardSection.style.zIndex = '5';
    
    // Force parent container to be visible if it exists
    const adminContent = document.querySelector('.admin-content');
    if (adminContent) {
        adminContent.style.display = 'block';
        adminContent.style.minHeight = '100vh';
    }

    // Update the corresponding nav link
    const dashboardLink = document.querySelector('.admin-nav a[href="#dashboard-section"]');
    if (dashboardLink) {
        dashboardLink.parentElement.classList.add('active');
    }
    
    // Make sure other sections are hidden
    document.querySelectorAll('.admin-section:not(#dashboard-section)').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Force the browser to redraw the dashboard section
    setTimeout(() => {
        if (dashboardSection) {
            dashboardSection.style.display = 'none';
            void dashboardSection.offsetHeight; // Force reflow
            dashboardSection.style.display = 'block';
        }
    }, 50);
}
