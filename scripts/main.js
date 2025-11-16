// ===================================
// Global Variables
// ===================================
let studentMap, adminMap, driverMap;
let busMarkers = [];
let isOnTrip = false;
let touchStartX = 0;
let touchEndX = 0;

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
// Login Page Functions
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Student Login
    const studentLoginForm = document.getElementById('studentLoginForm');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', handleStudentLogin);
    }

    // Admin Login
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Driver Login
    const driverLoginForm = document.getElementById('driverLoginForm');
    if (driverLoginForm) {
        driverLoginForm.addEventListener('submit', handleDriverLogin);
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
    
    // Validate inputs
    if (!studentId || !password) {
        alert('Please enter both Student ID and Password');
        return;
    }
    
    // Get approved students from localStorage
    const approvedStudents = localStorage.getItem('cavendish_students');
    const students = approvedStudents ? JSON.parse(approvedStudents) : [];
    
    // Find student with matching ID and password
    const student = students.find(s => s.studentId === studentId && s.password === password);
    
    if (student) {
        // Store student info in session storage
        sessionStorage.setItem('studentId', student.studentId);
        sessionStorage.setItem('studentName', `${student.firstName} ${student.lastName}`);
        sessionStorage.setItem('studentEmail', student.email);
        sessionStorage.setItem('userType', 'student');
        
        // Redirect to student dashboard
        window.location.href = 'student_page/home.html';
    } else {
        // Check if student is pending approval
        const pendingStudents = localStorage.getItem('cavendish_pending_registrations');
        const pending = pendingStudents ? JSON.parse(pendingStudents) : [];
        const isPending = pending.some(s => s.studentId === studentId);
        
        if (isPending) {
            alert('Your registration is pending admin approval. Please wait for approval before logging in.');
        } else {
            alert('Invalid Student ID or Password. Please check your credentials and try again.');
        }
    }
}

// ===================================
// Admin Login Handler
// ===================================
function handleAdminLogin(e) {
    e.preventDefault();
    
    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!adminId || !password) {
        alert('Please enter both Admin ID and Password');
        return;
    }
    
    // Default admin credentials (in production, this should be in a secure backend)
    const defaultAdmins = [
        { id: 'admin001', password: 'admin123', name: 'System Administrator' },
        { id: 'admin', password: 'admin', name: 'Default Admin' }
    ];
    
    // Check credentials
    const admin = defaultAdmins.find(a => a.id === adminId && a.password === password);
    
    if (admin) {
        // Store admin info in session storage
        sessionStorage.setItem('adminId', admin.id);
        sessionStorage.setItem('adminName', admin.name);
        sessionStorage.setItem('userType', 'admin');
        
        // Redirect to admin dashboard
        window.location.href = 'home.html';
    } else {
        alert('Invalid Admin ID or Password. Please check your credentials and try again.');
    }
}

// ===================================
// Driver Login Handler
// ===================================
function handleDriverLogin(e) {
    e.preventDefault();
    
    const driverId = document.getElementById('driverId').value;
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!driverId || !password) {
        alert('Please enter both Driver ID and Password');
        return;
    }
    
    // Default driver credentials (in production, this should be in a secure backend)
    const defaultDrivers = [
        { id: 'driver001', password: 'driver123', name: 'John Mwamba' },
        { id: 'driver002', password: 'driver123', name: 'Mary Phiri' },
        { id: 'driver003', password: 'driver123', name: 'David Banda' },
        { id: 'driver', password: 'driver', name: 'Test Driver' }
    ];
    
    // Check credentials
    const driver = defaultDrivers.find(d => d.id === driverId && d.password === password);
    
    if (driver) {
        // Store driver info in session storage
        sessionStorage.setItem('driverId', driver.id);
        sessionStorage.setItem('driverName', driver.name);
        sessionStorage.setItem('userType', 'driver');
        
        // Redirect to driver dashboard
        window.location.href = 'home.html';
    } else {
        alert('Invalid Driver ID or Password. Please check your credentials and try again.');
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
        
        // Handle responsive map resizing
        handleMapResize(studentMap);
        
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
        
        // Handle responsive map resizing
        handleMapResize(adminMap);
        
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
        
        // Handle responsive map resizing
        handleMapResize(driverMap);
        
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
        font-size: 14px;
        line-height: 1.4;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===================================
// Mobile Menu Management
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (!mobileMenuToggle || !sidebar || !mobileOverlay) return;
    
    // Toggle menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu(true);
    });
    
    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        toggleMobileMenu(false);
    });
    
    // Close menu when clicking nav items (except logout)
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (!this.href || this.href.includes('#')) {
                setTimeout(() => toggleMobileMenu(false), 300);
            }
        });
    });
    
    // Swipe to close menu
    sidebar.addEventListener('touchstart', handleTouchStart, false);
    sidebar.addEventListener('touchend', handleTouchEnd, false);
}

function toggleMobileMenu(open) {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    if (open) {
        sidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        body.classList.add('no-scroll');
    } else {
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    // Swipe left to close menu
    if (touchStartX - touchEndX > 50) {
        toggleMobileMenu(false);
    }
}

// ===================================
// Mobile Bottom Navigation
// ===================================
function initMobileBottomNav() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const page = this.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                
                // Update active state
                mobileNavItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Also update sidebar nav
                const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');
                sidebarNavItems.forEach(nav => {
                    if (nav.getAttribute('data-page') === page) {
                        nav.click();
                    }
                });
            }
        });
    });
}

// ===================================
// Responsive Map Handling
// ===================================
function handleMapResize(map) {
    if (!map) return;
    
    // Add resize event listener
    window.addEventListener('resize', debounce(function() {
        map.invalidateSize();
    }, 250));
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Form Validation
// ===================================
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Remove existing error messages
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('error');
        
        // Check if empty
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            const errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            input.parentElement.appendChild(errorMsg);
        }
    });
    
    return isValid;
}

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize mobile bottom navigation
    initMobileBottomNav();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Lazy load images if any
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

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