/**
 * Memories and More Photo Booths 
 * Package data manager - handles loading and displaying package data from the admin panel
 */

// Load package and add-on data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPackageData();
    loadAddonData();
});

// Load package data from localStorage
function loadPackageData() {
    // Check if packages have been published
    const packagesPublished = localStorage.getItem('packages_published') === 'true';
    
    // Only load packages if they've been published from the admin panel
    if (packagesPublished) {
        const packages = JSON.parse(localStorage.getItem('packageData'));
        
        if (packages) {
            // Update Silver Package
            if (packages.silver) {
                updatePackage('silver', packages.silver);
            }
            
            // Update Gold Package
            if (packages.gold) {
                updatePackage('gold', packages.gold);
                
                // Handle featured status
                const goldPackage = document.getElementById('gold-package');
                if (goldPackage) {
                    if (packages.gold.featured) {
                        if (!goldPackage.classList.contains('featured')) {
                            goldPackage.classList.add('featured');
                            
                            // Add the "Most Popular" tag if it doesn't exist
                            if (!goldPackage.querySelector('.package-tag')) {
                                const tagDiv = document.createElement('div');
                                tagDiv.className = 'package-tag';
                                tagDiv.textContent = 'Most Popular';
                                goldPackage.insertBefore(tagDiv, goldPackage.firstChild);
                            }
                        }
                    } else {
                        goldPackage.classList.remove('featured');
                        const packageTag = goldPackage.querySelector('.package-tag');
                        if (packageTag) {
                            packageTag.remove();
                        }
                    }
                }
            }
            
            // Update Silver featured status too (in case admin made it featured instead)
            const silverPackage = document.getElementById('silver-package');
            if (silverPackage && packages.silver) {
                if (packages.silver.featured) {
                    if (!silverPackage.classList.contains('featured')) {
                        silverPackage.classList.add('featured');
                        
                        // Add the "Most Popular" tag if it doesn't exist
                        if (!silverPackage.querySelector('.package-tag')) {
                            const tagDiv = document.createElement('div');
                            tagDiv.className = 'package-tag';
                            tagDiv.textContent = 'Most Popular';
                            silverPackage.insertBefore(tagDiv, silverPackage.firstChild);
                        }
                    }
                } else {
                    silverPackage.classList.remove('featured');
                    const packageTag = silverPackage.querySelector('.package-tag');
                    if (packageTag) {
                        packageTag.remove();
                    }
                }
            }
            
            // Update Custom Package
            if (packages.custom) {
                const customPackage = document.getElementById('custom-package');
                if (customPackage) {
                    // Update package name
                    const nameElement = customPackage.querySelector('.package-name h2');
                    if (nameElement) {
                        nameElement.textContent = packages.custom.name;
                    }
                    
                    // Update subtitle
                    const subtitleElement = customPackage.querySelector('.package-name p');
                    if (subtitleElement) {
                        subtitleElement.textContent = packages.custom.subtitle;
                    }
                    
                    // Update price display
                    const priceElement = customPackage.querySelector('.package-price h3');
                    if (priceElement) {
                        priceElement.textContent = packages.custom.priceDisplay;
                    }
                    
                    // Update description
                    const descriptionElement = document.getElementById('custom-description');
                    if (descriptionElement) {
                        // Split the description by newlines and create paragraphs
                        const paragraphs = packages.custom.description.split('\n\n');
                        let descriptionHtml = '';
                        
                        paragraphs.forEach(paragraph => {
                            if (paragraph.trim() !== '') {
                                descriptionHtml += `<p>${paragraph}</p>`;
                            }
                        });
                        
                        descriptionElement.innerHTML = descriptionHtml;
                    }
                }
            }
            
            // Also update the comparison table if it exists
            updateComparisonTable(packages);
        }
    }
}

// Update a standard package (Silver or Gold)
function updatePackage(packageId, packageData) {
    const packageElement = document.getElementById(`${packageId}-package`);
    
    if (packageElement) {
        // Update package name
        const nameElement = packageElement.querySelector('.package-name h2');
        if (nameElement) {
            nameElement.textContent = packageData.name;
        }
        
        // Update subtitle
        const subtitleElement = packageElement.querySelector('.package-name p');
        if (subtitleElement) {
            subtitleElement.textContent = packageData.subtitle;
        }
        
        // Update price
        const priceElement = packageElement.querySelector('.package-price h3');
        if (priceElement) {
            priceElement.textContent = `$${packageData.price}`;
        }
        
        // Update features
        const featuresElement = document.getElementById(`${packageId}-features`);
        if (featuresElement && packageData.features) {
            let featuresHtml = '';
            
            // Create HTML for each feature
            packageData.features.forEach(feature => {
                featuresHtml += `<li><i class="fas fa-check"></i> ${feature}</li>`;
            });
            
            featuresElement.innerHTML = featuresHtml;
        }
    }
}

// Update the comparison table with new data
function updateComparisonTable(packages) {
    const comparisonTable = document.querySelector('.comparison-table');
    if (comparisonTable) {
        // Update column headers with package names
        const headerRow = comparisonTable.querySelector('thead tr');
        if (headerRow) {
            const headerCells = headerRow.querySelectorAll('th');
            if (headerCells.length >= 3) {
                if (packages.silver && packages.silver.name) {
                    headerCells[1].textContent = packages.silver.name;
                }
                if (packages.gold && packages.gold.name) {
                    headerCells[2].textContent = packages.gold.name;
                }
            }
        }
        
        // Update prices in the last row
        const rows = comparisonTable.querySelectorAll('tbody tr');
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            const priceCells = lastRow.querySelectorAll('td');
            if (priceCells.length >= 3) {
                if (packages.silver && packages.silver.price) {
                    priceCells[1].textContent = `$${packages.silver.price}`;
                }
                if (packages.gold && packages.gold.price) {
                    priceCells[2].textContent = `$${packages.gold.price}`;
                }
            }
        }
    }
}

// Load add-on data from localStorage
function loadAddonData() {
    // Check if add-ons have been published
    const addonsPublished = localStorage.getItem('addons_published') === 'true';
    
    // Only load add-ons if they've been published from the admin panel
    if (addonsPublished) {
        const addons = JSON.parse(localStorage.getItem('addonData'));
        
        if (addons) {
            // Update each add-on
            Object.keys(addons).forEach(addonKey => {
                updateAddon(addonKey, addons[addonKey]);
            });
        }
    }
}

// Update an add-on item
function updateAddon(addonId, addonData) {
    const addonElement = document.getElementById(`addon-${addonId}`);
    
    if (addonElement) {
        // Update add-on icon
        const iconElement = addonElement.querySelector('.addon-icon i');
        if (iconElement) {
            // Remove all classes except the base fa class
            iconElement.className = addonData.icon;
        }
        
        // Update add-on name
        const nameElement = addonElement.querySelector('.addon-details h3');
        if (nameElement) {
            nameElement.textContent = addonData.name;
        }
        
        // Update add-on description
        const descriptionElement = addonElement.querySelector('.addon-details p');
        if (descriptionElement) {
            descriptionElement.textContent = addonData.description;
        }
        
        // Update add-on price
        const priceElement = addonElement.querySelector('.addon-price');
        if (priceElement) {
            priceElement.textContent = `$${addonData.price}`;
        }
        
        // Update or remove add-on note
        const noteElement = addonElement.querySelector('.addon-note');
        if (noteElement) {
            if (addonData.note && addonData.note.trim() !== '') {
                noteElement.textContent = addonData.note;
                noteElement.style.display = '';
            } else {
                noteElement.style.display = 'none';
            }
        } else if (addonData.note && addonData.note.trim() !== '') {
            // Create note element if it doesn't exist
            const newNoteElement = document.createElement('p');
            newNoteElement.className = 'addon-note';
            newNoteElement.textContent = addonData.note;
            addonElement.querySelector('.addon-details').appendChild(newNoteElement);
        }
    }
}
