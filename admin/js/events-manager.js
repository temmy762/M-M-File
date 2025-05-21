/**
 * Memories and More Photo Booths - Event Links Manager
 * Manages SmugMug event links for the admin dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize events manager
    initEventsManager();
});

/**
 * Initialize the events manager
 */
function initEventsManager() {
    // Load existing events
    loadEvents();
    
    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', function() {
        showEventForm();
    });
    
    // Cancel event button
    document.getElementById('cancelEventBtn').addEventListener('click', function() {
        hideEventForm();
    });
    
    // Event form submission
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvent();
    });
    
    // Search functionality
    document.getElementById('searchEvents').addEventListener('input', function() {
        filterEvents();
    });
    
    // Filter functionality
    document.getElementById('filterEvents').addEventListener('change', function() {
        filterEvents();
    });
}

/**
 * Load events from local storage
 */
function loadEvents() {
    const events = getEvents();
    const eventsList = document.getElementById('eventsList');
    const noEvents = document.getElementById('noEvents');
    
    // Clear existing events
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
        // Show no events message
        noEvents.style.display = 'block';
        return;
    }
    
    // Hide no events message
    noEvents.style.display = 'none';
    
    // Sort events by date (newest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add events to the table
    events.forEach((event, index) => {
        const row = document.createElement('tr');
        
        // Check if event is expired
        const isExpired = event.expiry && new Date(event.expiry) < new Date();
        if (isExpired) {
            row.classList.add('expired');
        }
        
        row.innerHTML = `
            <td>${event.title}</td>
            <td>${formatDate(event.date)}</td>
            <td><a href="${event.slug}" target="_blank">${truncateText(event.slug, 30)}</a></td>
            <td>${event.password ? '●●●●●●' : 'None'}</td>
            <td>${event.expiry ? formatDate(event.expiry) : 'Never'}</td>
            <td class="actions">
                <button type="button" class="view-btn" title="View Event Link" data-index="${index}">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button type="button" class="edit-btn" title="Edit Event" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn" title="Delete Event" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        eventsList.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionListeners();
}

/**
 * Add event listeners to table action buttons
 */
function addActionListeners() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            const events = getEvents();
            const event = events[index];
            
            // Open event link in new tab
            window.open(event.slug, '_blank');
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            editEvent(index);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            confirmDeleteEvent(index);
        });
    });
}

/**
 * Show the event form
 */
function showEventForm() {
    document.querySelector('.event-form-container').style.display = 'block';
    document.getElementById('eventTitle').focus();
    
    // Clear form
    document.getElementById('eventForm').reset();
    document.getElementById('eventForm').removeAttribute('data-edit-index');
}

/**
 * Hide the event form
 */
function hideEventForm() {
    document.querySelector('.event-form-container').style.display = 'none';
    document.getElementById('eventForm').reset();
    document.getElementById('eventForm').removeAttribute('data-edit-index');
}

/**
 * Save an event
 */
function saveEvent() {
    const form = document.getElementById('eventForm');
    const editIndex = form.getAttribute('data-edit-index');
    
    // Get form values
    const event = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        slug: document.getElementById('eventSlug').value,
        password: document.getElementById('eventPassword').value,
        expiry: document.getElementById('eventExpiry').value || null,
        createdAt: new Date().toISOString()
    };
    
    // Get existing events
    const events = getEvents();
    
    if (editIndex !== null && editIndex !== undefined) {
        // Update existing event
        events[editIndex] = {
            ...events[editIndex],
            ...event,
            updatedAt: new Date().toISOString()
        };
    } else {
        // Add new event
        events.push(event);
    }
    
    // Save events
    saveEvents(events);
    
    // Hide form
    hideEventForm();
    
    // Reload events
    loadEvents();
}

/**
 * Edit an event
 */
function editEvent(index) {
    const events = getEvents();
    const event = events[index];
    
    // Populate form
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventSlug').value = event.slug;
    document.getElementById('eventPassword').value = event.password || '';
    document.getElementById('eventExpiry').value = event.expiry || '';
    
    // Set edit index
    document.getElementById('eventForm').setAttribute('data-edit-index', index);
    
    // Show form
    showEventForm();
}

/**
 * Confirm delete event
 */
function confirmDeleteEvent(index) {
    const events = getEvents();
    const event = events[index];
    
    // Show confirmation modal
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmAction = document.getElementById('confirmAction');
    
    modalTitle.textContent = 'Confirm Delete';
    modalMessage.textContent = `Are you sure you want to delete the event "${event.title}"?`;
    
    modal.classList.add('active');
    
    // Set up confirm action
    confirmAction.onclick = function() {
        deleteEvent(index);
        modal.classList.remove('active');
    };
}

/**
 * Delete an event
 */
function deleteEvent(index) {
    const events = getEvents();
    
    // Remove event
    events.splice(index, 1);
    
    // Save events
    saveEvents(events);
    
    // Reload events
    loadEvents();
}

/**
 * Filter events based on search and filter
 */
function filterEvents() {
    const searchTerm = document.getElementById('searchEvents').value.toLowerCase();
    const filterValue = document.getElementById('filterEvents').value;
    const rows = document.querySelectorAll('#eventsList tr');
    const noEvents = document.getElementById('noEvents');
    
    let visibleCount = 0;
    
    rows.forEach(row => {
        const title = row.cells[0].textContent.toLowerCase();
        const date = row.cells[1].textContent.toLowerCase();
        const link = row.cells[2].textContent.toLowerCase();
        const expiry = row.cells[4].textContent.toLowerCase();
        
        // Check if matches search term
        const matchesSearch = title.includes(searchTerm) || 
                             date.includes(searchTerm) || 
                             link.includes(searchTerm);
        
        // Check if matches filter
        let matchesFilter = true;
        if (filterValue === 'active') {
            matchesFilter = !row.classList.contains('expired');
        } else if (filterValue === 'expired') {
            matchesFilter = row.classList.contains('expired');
        }
        
        // Show/hide row
        if (matchesSearch && matchesFilter) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show/hide no events message
    if (visibleCount === 0) {
        noEvents.style.display = 'block';
        noEvents.textContent = 'No matching events found.';
    } else {
        noEvents.style.display = 'none';
    }
}

/**
 * Get events from local storage
 */
function getEvents() {
    return JSON.parse(localStorage.getItem('mmph_events')) || [];
}

/**
 * Save events to local storage
 */
function saveEvents(events) {
    localStorage.setItem('mmph_events', JSON.stringify(events));
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}
