# Cavendish Bus Management System

A comprehensive, mobile-responsive web application for managing and tracking university buses at Cavendish University Zambia.

## 🚀 Features

### Student Portal
- **Live Bus Tracking**: Real-time GPS tracking of all university buses
- **Route Information**: View available routes and schedules
- **Complaint Submission**: Submit and track complaints about bus services
- **Campus Selection**: Filter buses by Glass Campus or Medical Campus
- **Mobile-Friendly Interface**: Optimized for smartphones and tablets

### Driver Portal
- **Trip Management**: Start and end trips with detailed logging
- **Route Navigation**: Interactive maps with current location tracking
- **Schedule Management**: View and manage daily driving schedules
- **Issue Reporting**: Report vehicle problems or route issues
- **Real-time Updates**: Update location and status during trips

### Admin Dashboard
- **Fleet Monitoring**: Overview of all active buses and their locations
- **Driver Management**: Monitor driver activities and assignments
- **Complaint Management**: Review and resolve student complaints
- **Analytics**: View statistics and generate reports
- **Route Administration**: Manage and optimize bus routes

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile Portrait** (320px - 767px)
- **Mobile Landscape** (All orientations)

### Mobile Features
- Touch-optimized navigation
- Swipe gestures for menu control
- Bottom navigation bar for quick access
- Responsive tables with card-style layout
- Optimized map controls for touch devices
- Safe area support for notched devices

## 🎨 Design Highlights

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Consistent Branding**: University colors (#1e3361, #14213f)
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark Mode Ready**: CSS variables for easy theme switching
- **Performance Optimized**: Fast loading with lazy-loaded images

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Roboto)
- **Responsive**: CSS Grid, Flexbox, Media Queries

## 📂 Project Structure

```
bus_manegement/
├── index.html              # Main login page
├── admin_dashboard/
│   └── home.html          # Admin dashboard interface
├── driver_page/
│   └── home.html          # Driver portal interface
├── student_page/
│   └── home.html          # Student portal interface
├── css/
│   └── styles.css         # Main stylesheet (mobile-responsive)
├── scripts/
│   └── main.js            # JavaScript functionality
├── assets/
│   └── images/            # Logo and images
└── README.md              # This file
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/BugHunter-star/bus_manegement.git
   cd bus_manegement
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - For development, use a local server (e.g., Live Server in VS Code)

3. **Login Credentials** (Demo)
   - Student ID: Any text
   - Password: Any text
   - Navigate to admin or driver portals via the login page

## 📱 Mobile Testing

To test the mobile responsiveness:

1. **Browser DevTools**
   - Press F12 in Chrome/Firefox
   - Toggle device toolbar (Ctrl+Shift+M)
   - Test various device sizes

2. **Physical Devices**
   - Access via local network IP
   - Test on iOS and Android devices
   - Check landscape and portrait orientations

## 🎯 Key Improvements Made

### CSS Enhancements
- ✅ Comprehensive media queries for all screen sizes
- ✅ Touch-friendly button sizes (44px minimum)
- ✅ Responsive tables with mobile card layout
- ✅ Improved spacing and padding for mobile
- ✅ Smooth transitions and animations
- ✅ Custom scrollbar styling
- ✅ Print-friendly styles

### JavaScript Enhancements
- ✅ Mobile menu with swipe gestures
- ✅ Bottom navigation for mobile devices
- ✅ Responsive map handling with resize events
- ✅ Touch event handling
- ✅ Form validation
- ✅ Notification system
- ✅ Debounced resize handlers

### HTML Improvements
- ✅ Proper viewport meta tags
- ✅ Apple mobile web app support
- ✅ Theme color for browser UI
- ✅ Semantic HTML structure
- ✅ Accessible form labels
- ✅ Data attributes for mobile tables

## 🔧 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## 🚀 Future Enhancements

- [ ] Backend integration (Node.js/PHP)
- [ ] Real-time WebSocket updates
- [ ] Push notifications
- [ ] Offline mode with Service Workers
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] PDF report generation

## 📄 License

© 2025 Cavendish University Zambia. All rights reserved.

## 👨‍💻 Development

For development inquiries or contributions, please contact the IT department at Cavendish University Zambia.

---

**Note**: This is a demonstration project. For production use, implement proper authentication, database integration, and security measures.
# theme colors 
# 1e3361
# 14213f
# white

