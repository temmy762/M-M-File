/**
 * Memories and More Photo Booths - Admin Dashboard
 * Package Manager Functionality
 */

// Run when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize package management
    initPackageManager();
    
    // Load initial data
    loadPackageData();
    loadAddonData();
    
    // Update dashboard counts
    updateDashboardCounts();
});

/**
 * Initialize the package manager
 */
function initPackageManager() {
    // Set up package save buttons
    document.querySelectorAll('.save-package').forEach(button => {
        button.addEventListener('click', function() {
            const packageType = this.getAttribute('data-package');
            savePackage(packageType);
        });
    });
    
    // Set up add-on save buttons
    document.querySelectorAll('.save-addon').forEach(button => {
        button.addEventListener('click', function() {
            const addonType = this.getAttribute('data-addon');
            saveAddon(addonType);
        });
    });
    
    // Set up publish buttons
    document.getElementById('publishPackages').addEventListener('click', function() {
        publishPackagesToWebsite();
    });
    
    document.getElementById('publishAddons').addEventListener('click', function() {
        publishAddonsToWebsite();
    });
}

/**
 * Load package data from localStorage or default values
 */
function loadPackageData() {
    // Get package data from localStorage or use defaults
    const packages = JSON.parse(localStorage.getItem('packageData')) || {
        silver: {
            name: "Silver Experience",
            subtitle: "Package #1",
            price: 445,
            features: [
                "2 Hours of Continuous Photo Booth Use",
                "Full Time Attendant",
                "Immediate Photo Strip Printouts",
                "Choice of B&W or Color Photos",
                "Unlimited Photo Booth Sessions",
                "Dye-Sub Prints (non-smudge, high quality)",
                "Online Viewing of Photos",
                "Digital Link with All Photos (no expiration)"
            ],
            featured: false
        },
        gold: {
            name: "Golden Moments",
            subtitle: "Package #2",
            price: 595,
            features: [
                "3 Hours of Continuous Photo Booth Use",
                "Full Time Attendant",
                "Immediate Photo Strip Printouts",
                "Choice of B&W or Color Photos",
                "Unlimited Photo Booth Sessions",
                "Dye-Sub Prints (non-smudge, high quality)",
                "Online Viewing of Photos",
                "Digital Link with All Photos (no expiration)",
                "Props Included",
                "Personalized Photo Strip Layout"
            ],
            featured: true
        },
        custom: {
            name: "Custom Package",
            subtitle: "Tailored to Your Needs",
            priceDisplay: "Custom Quote",
            description: "Need something specific for your event? We can create a custom package that perfectly fits your requirements.\n\nContact us to discuss your event details and we'll provide a personalized quote."
        }
    };
    
    // If it doesn't exist in localStorage, save default data
    if (!localStorage.getItem('packageData')) {
        localStorage.setItem('packageData', JSON.stringify(packages));
    }
    
    // Update form values with stored data
    updatePackageForms(packages);
}

/**
 * Update the package form fields with stored data
 */
function updatePackageForms(packages) {
    // Silver package form
    const silverForm = document.querySelector('#silver-package .package-form');
    if (silverForm && packages.silver) {
        silverForm.querySelector('.package-name').value = packages.silver.name;
        silverForm.querySelector('.package-subtitle').value = packages.silver.subtitle;
        silverForm.querySelector('.package-price').value = packages.silver.price;
        silverForm.querySelector('.package-features').value = packages.silver.features.join('\n');
        silverForm.querySelector('.package-featured').checked = packages.silver.featured;
    }
    
    // Gold package form
    const goldForm = document.querySelector('#gold-package .package-form');
    if (goldForm && packages.gold) {
        goldForm.querySelector('.package-name').value = packages.gold.name;
        goldForm.querySelector('.package-subtitle').value = packages.gold.subtitle;
        goldForm.querySelector('.package-price').value = packages.gold.price;
        goldForm.querySelector('.package-features').value = packages.gold.features.join('\n');
        goldForm.querySelector('.package-featured').checked = packages.gold.featured;
    }
    
    // Custom package form
    const customForm = document.querySelector('#custom-package .package-form');
    if (customForm && packages.custom) {
        customForm.querySelector('.package-name').value = packages.custom.name;
        customForm.querySelector('.package-subtitle').value = packages.custom.subtitle;
        customForm.querySelector('.package-price-display').value = packages.custom.priceDisplay;
        customForm.querySelector('.package-description').value = packages.custom.description;
    }
}

/**
 * Load add-on data from localStorage or default values
 */
function loadAddonData() {
    // Get add-on data from localStorage or use defaults
    const addons = JSON.parse(localStorage.getItem('addonData')) || {
        props: {
            name: "Props",
            icon: "fas fa-theater-masks",
            description: "Fun collection of hats, glasses, signs and more",
            price: 50,
            note: "Included in Package #2"
        },
        dvd: {
            name: "DVD of All Images",
            icon: "fas fa-compact-disc",
            description: "High-resolution digital copies of all photos",
            price: 50,
            note: ""
        },
        layouts: {
            name: "Personalized Photo Layouts",
            icon: "fas fa-palette",
            description: "Custom design with names, date, and event details",
            price: 50,
            note: "Included in Package #2"
        },
        scrapbook: {
            name: "Custom Scrapbook Service",
            icon: "fas fa-book",
            description: "Keepsake album with photos and guest messages",
            price: 75,
            note: ""
        }
    };
    
    // If it doesn't exist in localStorage, save default data
    if (!localStorage.getItem('addonData')) {
        localStorage.setItem('addonData', JSON.stringify(addons));
    }
    
    // Update form values with stored data
    updateAddonForms(addons);
}

/**
 * Update the add-on form fields with stored data
 */
function updateAddonForms(addons) {
    // Update each add-on form
    Object.keys(addons).forEach(addonKey => {
        const addon = addons[addonKey];
        const addonForm = document.querySelector(`.addon-edit-item:has(button[data-addon="${addonKey}"]) .addon-form`);
        
        if (addonForm) {
            addonForm.querySelector('.addon-name').value = addon.name;
            addonForm.querySelector('.addon-icon').value = addon.icon;
            addonForm.querySelector('.addon-description').value = addon.description;
            addonForm.querySelector('.addon-price').value = addon.price;
            addonForm.querySelector('.addon-note').value = addon.note;
        }
    });
}

/**
 * Save a package's data to localStorage
 */
function savePackage(packageType) {
    // Get existing package data
    let packages = JSON.parse(localStorage.getItem('packageData')) || {};
    
    // Get package form element
    const packageForm = document.querySelector(`#${packageType}-package .package-form`);
    
    if (packageType === 'custom') {
        packages.custom = {
            name: packageForm.querySelector('.package-name').value,
            subtitle: packageForm.querySelector('.package-subtitle').value,
            priceDisplay: packageForm.querySelector('.package-price-display').value,
            description: packageForm.querySelector('.package-description').value
        };
    } else {
        packages[packageType] = {
            name: packageForm.querySelector('.package-name').value,
            subtitle: packageForm.querySelector('.package-subtitle').value,
            price: parseFloat(packageForm.querySelector('.package-price').value),
            features: packageForm.querySelector('.package-features').value.split('\n'),
            featured: packageForm.querySelector('.package-featured').checked
        };
    }
    
    // Save to localStorage
    localStorage.setItem('packageData', JSON.stringify(packages));
    
    // Show success message
    const successMsg = document.getElementById('packageSuccessMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

/**
 * Save an add-on's data to localStorage
 */
function saveAddon(addonType) {
    // Get existing add-on data
    let addons = JSON.parse(localStorage.getItem('addonData')) || {};
    
    // Get add-on form element
    const addonForm = document.querySelector(`.addon-edit-item:has(button[data-addon="${addonType}"]) .addon-form`);
    
    addons[addonType] = {
        name: addonForm.querySelector('.addon-name').value,
        icon: addonForm.querySelector('.addon-icon').value,
        description: addonForm.querySelector('.addon-description').value,
        price: parseFloat(addonForm.querySelector('.addon-price').value),
        note: addonForm.querySelector('.addon-note').value
    };
    
    // Save to localStorage
    localStorage.setItem('addonData', JSON.stringify(addons));
    
    // Show success message
    const successMsg = document.getElementById('addonSuccessMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

/**
 * Publish packages to the website
 */
function publishPackagesToWebsite() {
    // Indicate that data has been published
    localStorage.setItem('packages_published', 'true');
    
    // Show success message
    const successMsg = document.getElementById('packageSuccessMessage');
    successMsg.textContent = 'Pricing packages published to website successfully!';
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.textContent = 'Pricing packages updated successfully!';
        successMsg.style.display = 'none';
    }, 3000);
}

/**
 * Publish add-ons to the website
 */
function publishAddonsToWebsite() {
    // Indicate that data has been published
    localStorage.setItem('addons_published', 'true');
    
    // Show success message
    const successMsg = document.getElementById('addonSuccessMessage');
    successMsg.textContent = 'Add-ons published to website successfully!';
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.textContent = 'Add-ons updated successfully!';
        successMsg.style.display = 'none';
    }, 3000);
}

/**
 * Update the dashboard stat counters
 */
function updateDashboardCounts() {
    // Update event count
    const eventLinks = JSON.parse(localStorage.getItem('eventLinks')) || [];
    if (document.getElementById('eventCount')) {
        document.getElementById('eventCount').textContent = eventLinks.length;
    }
    
    // Package count is fixed at 3
    if (document.getElementById('packageCount')) {
        document.getElementById('packageCount').textContent = '3';
    }
    
    // Add-on count is fixed at 4
    if (document.getElementById('addonCount')) {
        document.getElementById('addonCount').textContent = '4';
    }
}
