// ===================================
// Global Variables
// ===================================
let studentMap, adminMap, driverMap;
let busMarkers = [];
let isOnTrip = false;

// ===================================
// Cavendish University Zambia Coordinates
// ===================================
const CAVENDISH_LOCATIONS = {
    glassCampus: { lat: -15.3875, lng: 28.3228, name: "Glass Campus" },
    medicalCampus: { lat: -15.4167, lng: 28.2833, name: "Medical Campus" },
    lusakaCenter: { lat: -15.4167, lng: 28.2833, name: "Lusaka City Center" }
};

// ===================================
// Sample Bus Data
// ===================================
const SAMPLE_BUSES = [
    { 
        id: "001", 
        driver: "John Mwamba", 
        route: "Glass Campus", 
        status: "active",
        lat: -15.3900,
        lng: 28.3200,
        eta: "5 minutes",
        campus: "glass"
    },
    { 
        id: "002", 
        driver: "Mary Phiri", 
        route: "Medical Campus", 
        status: "active",
        lat: -15.4100,
        lng: 28.2900,
        eta: "12 minutes",
        campus: "medical"
    },
    { 
        id: "003", 
        driver: "David Banda", 
        route: "Express Route", 
        status: "active",
        lat: -15.3950,
        lng: 28.3100,
        eta: "8 minutes",
        campus: "glass"
    }
];

// ===================================
// Student Login Page Functions
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('studentLoginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleStudentLogin);
    }

    // Forgot password handler
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Please contact the admin at admin@cavendish.ac.zm to reset your password.');
        });
    }
});

function handleStudentLogin(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    
    // Basic validation (in production, this would authenticate with a backend)
    if (studentId && password) {
        // Store student info in session storage
        sessionStorage.setItem('studentId', studentId);
        sessionStorage.setItem('userType', 'student');
        
        // Redirect to student dashboard
        window.location.href = 'student_page/home.html';
    } else {
        alert('Please enter both Student ID and Password');
    }
}

// ===================================
// Student Page Initialization
// ===================================
function initStudentPage() {
    console.log('Initializing Student Page...');
    
    // Initialize the map
    initStudentMap();
    
    // Setup navigation
    setupNavigation();
    
    // Setup campus filter
    setupCampusFilter();
    
    // Setup complaint form
    setupComplaintForm();
    
    // Setup header icons
    setupHeaderIcons();
    
    // Load active buses
    loadActiveBuses();
}

function initStudentMap() {
    try {
        // Initialize map centered on Lusaka
        studentMap = L.map('busMap').setView([CAVENDISH_LOCATIONS.lusakaCenter.lat, CAVENDISH_LOCATIONS.lusakaCenter.lng], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(studentMap);
        
        // Add campus markers
        addCampusMarkers(studentMap);
        
        // Add bus markers
        updateBusMarkers(studentMap, SAMPLE_BUSES);
        
        // Setup map controls
        document.getElementById('refreshMapBtn')?.addEventListener('click', () => {
            updateBusMarkers(studentMap, SAMPLE_BUSES);
            showNotification('Map refreshed successfully!');
        });
        
        document.getElementById('centerMapBtn')?.addEventListener('click', () => {
            studentMap.setView([CAVENDISH_LOCATIONS.lusakaCenter.lat, CAVENDISH_LOCATIONS.lusakaCenter.lng], 13);
        });
        
    } catch (error) {
        console.error('Error initializing student map:', error);
    }
}

// ===================================
// Admin Page Initialization
// ===================================
function initAdminPage() {
    console.log('Initializing Admin Page...');
    
    // Initialize the map
    initAdminMap();
    
    // Setup navigation
    setupNavigation();
    
    // Setup header icons
    setupHeaderIcons();
    
    // Setup complaint filters
    setupComplaintFilters();
    
    // Setup driver monitoring
    setupDriverMonitoring();
}

function initAdminMap() {
    try {
        adminMap = L.map('adminMap').setView([CAVENDISH_LOCATIONS.lusakaCenter.lat, CAVENDISH_LOCATIONS.lusakaCenter.lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(adminMap);
        
        addCampusMarkers(adminMap);
        updateBusMarkers(adminMap, SAMPLE_BUSES);
        
        document.getElementById('refreshAdminMapBtn')?.addEventListener('click', () => {
            updateBusMarkers(adminMap, SAMPLE_BUSES);
            showNotification('Fleet map updated!');
        });
        
        document.getElementById('centerAdminMapBtn')?.addEventListener('click', () => {
            adminMap.setView([CAVENDISH_LOCATIONS.lusakaCenter.lat, CAVENDISH_LOCATIONS.lusakaCenter.lng], 13);
        });
        
    } catch (error) {
        console.error('Error initializing admin map:', error);
    }
}

// ===================================
// Driver Page Initialization
// ===================================
function initDriverPage() {
    console.log('Initializing Driver Page...');
    
    // Initialize the map
    initDriverMap();
    
    // Setup navigation
    setupNavigation();
    
    // Setup header icons
    setupHeaderIcons();
    
    // Setup trip management
    setupTripManagement();
    
    // Setup forms
    setupDriverForms();
}

function initDriverMap() {
    try {
        driverMap = L.map('driverMap').setView([CAVENDISH_LOCATIONS.lusakaCenter.lat, CAVENDISH_LOCATIONS.lusakaCenter.lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(driverMap);
        
        addCampusMarkers(driverMap);
        
        // Add driver's current location
        const driverLocation = L.marker([CAVENDISH_LOCATIONS.glassCampus.lat, CAVENDISH_LOCATIONS.glassCampus.lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#1e3361;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;border:3px solid white;'>🚌</div>",
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(driverMap);
        
        driverLocation.bindPopup('<b>Your Location</b><br>Bus #001');
        
        document.getElementById('updateLocationBtn')?.addEventListener('click', () => {
            showNotification('Location updated successfully!');
        });
        
        document.getElementById('centerDriverMapBtn')?.addEventListener('click', () => {
            driverMap.setView([CAVENDISH_LOCATIONS.glassCampus.lat, CAVENDISH_LOCATIONS.glassCampus.lng], 14);
        });
        
    } catch (error) {
        console.error('Error initializing driver map:', error);
    }
}

// ===================================
// Map Helper Functions
// ===================================
function addCampusMarkers(map) {
    // Glass Campus marker
    L.marker([CAVENDISH_LOCATIONS.glassCampus.lat, CAVENDISH_LOCATIONS.glassCampus.lng], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#4caf50;width:20px;height:20px;border-radius:50%;border:3px solid white;'></div>",
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map).bindPopup('<b>Glass Campus</b><br>Cavendish University');
    
    // Medical Campus marker
    L.marker([CAVENDISH_LOCATIONS.medicalCampus.lat, CAVENDISH_LOCATIONS.medicalCampus.lng], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:#2196f3;width:20px;height:20px;border-radius:50%;border:3px solid white;'></div>",
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map).bindPopup('<b>Medical Campus</b><br>Cavendish University');
}

function updateBusMarkers(map, buses) {
    // Clear existing markers
    busMarkers.forEach(marker => map.removeLayer(marker));
    busMarkers = [];
    
    // Add new markers
    buses.forEach(bus => {
        const marker = L.marker([bus.lat, bus.lng], {
            icon: L.divIcon({
                className: 'custom-div-icon',
                html: `<div style='background-color:#1e3361;width:35px;height:35px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3);'>🚌</div>`,
                iconSize: [35, 35],
                iconAnchor: [17, 17]
            })
        }).addTo(map);
        
        marker.bindPopup(`
            <b>Bus #${bus.id}</b><br>
            Driver: ${bus.driver}<br>
            Route: ${bus.route}<br>
            Status: ${bus.status}<br>
            ETA: ${bus.eta}
        `);
        
        busMarkers.push(marker);
    });
}

// ===================================
// Navigation Setup
// ===================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const page = this.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Handle page-specific logic
                handlePageNavigation(page);
            }
        });
    });
}

function handlePageNavigation(page) {
    console.log('Navigating to:', page);
    
    // Hide all dynamic sections
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
        complaintForm.classList.add('hidden');
    }
    
    // Show specific sections based on page
    if (page === 'complaints' && complaintForm) {
        complaintForm.classList.remove('hidden');
    }
    
    showNotification(`Navigated to ${page.replace('-', ' ')}`);
}

// ===================================
// Header Icons Setup
// ===================================
function setupHeaderIcons() {
    const notificationIcon = document.getElementById('notificationIcon');
    const settingsIcon = document.getElementById('settingsIcon');
    const profileIcon = document.getElementById('profileIcon');
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            alert('Notifications:\n- New bus schedule available\n- System maintenance tonight\n- Update your profile');
        });
    }
    
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => {
            alert('Settings panel - Coming soon!');
        });
    }
    
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            alert('Profile settings - Coming soon!');
        });
    }
}

// ===================================
// Student Page Specific Functions
// ===================================
function setupCampusFilter() {
    const campusSelect = document.getElementById('campusSelect');
    const routeFilter = document.getElementById('routeFilter');
    
    if (campusSelect) {
        campusSelect.addEventListener('change', function() {
            const campus = this.value;
            filterBusesByCampus(campus);
            showNotification(`Showing buses for ${campus || 'all campuses'}`);
        });
    }
    
    if (routeFilter) {
        routeFilter.addEventListener('change', function() {
            showNotification(`Filtered by route: ${this.options[this.selectedIndex].text}`);
        });
    }
}

function filterBusesByCampus(campus) {
    if (!campus) {
        updateBusMarkers(studentMap, SAMPLE_BUSES);
        loadActiveBuses();
        return;
    }
    
    const filteredBuses = SAMPLE_BUSES.filter(bus => bus.campus === campus);
    updateBusMarkers(studentMap, filteredBuses);
    loadActiveBuses(filteredBuses);
}

function loadActiveBuses(buses = SAMPLE_BUSES) {
    const busList = document.getElementById('activeBusList');
    if (!busList) return;
    
    busList.innerHTML = buses.map(bus => `
        <div class="bus-item">
            <div class="bus-info">
                <h4>Bus #${bus.id} - ${bus.route}</h4>
                <p>Driver: ${bus.driver} | ETA: ${bus.eta}</p>
            </div>
            <span class="bus-status ${bus.status}">On Route</span>
        </div>
    `).join('');
}

function setupComplaintForm() {
    const complaintForm = document.getElementById('studentComplaintForm');
    
    if (complaintForm) {
        complaintForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('complaintType').value;
            const busNumber = document.getElementById('busNumber').value;
            const description = document.getElementById('complaintDescription').value;
            
            // In production, this would send to a backend
            console.log('Complaint submitted:', { type, busNumber, description });
            
            showNotification('Complaint submitted successfully! We will review it shortly.');
            this.reset();
        });
    }
}

// ===================================
// Admin Page Specific Functions
// ===================================
function setupComplaintFilters() {
    const complaintStatusFilter = document.getElementById('complaintStatusFilter');
    
    if (complaintStatusFilter) {
        complaintStatusFilter.addEventListener('change', function() {
            const status = this.value;
            filterComplaints(status);
        });
    }
}

function filterComplaints(status) {
    const rows = document.querySelectorAll('#complaintsTableBody tr');
    
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge && statusBadge.classList.contains(status)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
    
    showNotification(`Showing ${status === 'all' ? 'all' : status} complaints`);
}

function setupDriverMonitoring() {
    const campusFilter = document.getElementById('campusFilterAdmin');
    const statusFilter = document.getElementById('statusFilter');
    
    if (campusFilter) {
        campusFilter.addEventListener('change', function() {
            showNotification(`Filtered by campus: ${this.options[this.selectedIndex].text}`);
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            showNotification(`Filtered by status: ${this.options[this.selectedIndex].text}`);
        });
    }
}

// Global functions for complaint actions
function viewComplaint(id) {
    alert(`Viewing complaint ${id}\n\nDetailed view would be displayed here in production.`);
}

function resolveComplaint(id) {
    if (confirm(`Mark complaint ${id} as resolved?`)) {
        showNotification(`Complaint ${id} has been marked as resolved.`);
        // In production, update the backend and refresh the table
    }
}

// ===================================
// Driver Page Specific Functions
// ===================================
function setupTripManagement() {
    const toggleTripBtn = document.getElementById('toggleTripBtn');
    const tripStatus = document.getElementById('tripStatus');
    const statusDescription = document.getElementById('statusDescription');
    
    if (toggleTripBtn) {
        toggleTripBtn.addEventListener('click', function() {
            isOnTrip = !isOnTrip;
            
            if (isOnTrip) {
                this.textContent = 'End Trip';
                this.style.background = '#f44336';
                tripStatus.textContent = 'On Route';
                tripStatus.className = 'bus-status active';
                statusDescription.textContent = 'You are currently on route. Location is being tracked.';
                showNotification('Trip started! Drive safely.');
            } else {
                this.textContent = 'Start Trip';
                this.style.background = '';
                tripStatus.textContent = 'Not On Route';
                tripStatus.className = 'bus-status idle';
                statusDescription.textContent = 'You are currently not on a route. Start a trip to begin tracking.';
                showNotification('Trip ended successfully.');
            }
        });
    }
}

function setupDriverForms() {
    const tripForm = document.getElementById('tripForm');
    const issueReportForm = document.getElementById('issueReportForm');
    
    if (tripForm) {
        tripForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const route = document.getElementById('routeSelect').value;
            const departureTime = document.getElementById('departureTime').value;
            const passengers = document.getElementById('estimatedPassengers').value;
            const notes = document.getElementById('routeNotes').value;
            
            console.log('Trip started:', { route, departureTime, passengers, notes });
            
            showNotification('Trip confirmed and started!');
            isOnTrip = true;
            
            const toggleBtn = document.getElementById('toggleTripBtn');
            if (toggleBtn) {
                toggleBtn.textContent = 'End Trip';
                toggleBtn.style.background = '#f44336';
            }
            
            this.reset();
        });
    }
    
    if (issueReportForm) {
        issueReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const issueType = document.getElementById('issueType').value;
            const description = document.getElementById('issueDescription').value;
            const urgent = document.getElementById('urgentIssue').checked;
            
            console.log('Issue reported:', { issueType, description, urgent });
            
            showNotification('Issue report submitted. Admin has been notified.');
            this.reset();
        });
    }
}

// ===================================
// Utility Functions
// ===================================
function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1e3361;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Cavendish Bus Management System - JavaScript Loaded');