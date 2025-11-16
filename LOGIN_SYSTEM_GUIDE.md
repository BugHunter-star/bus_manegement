# Bus Management System - Login & Registration Flow

## 📋 Overview
Complete authentication system with student registration, admin approval, and multi-user login.

---

## 🔐 Login Credentials

### Student Login
- **Portal**: `index.html` (Main Page)
- **Requirements**: Must be approved by admin first
- **Test Account**: Register through student registration page and get approved

### Admin Login
- **Portal**: `admin_dashboard/admin_login.html`
- **Default Credentials**:
  - ID: `admin` | Password: `admin`
  - ID: `admin001` | Password: `admin123`

### Driver Login
- **Portal**: `driver_page/driver_login.html`
- **Default Credentials**:
  - ID: `driver` | Password: `driver`
  - ID: `driver001` | Password: `driver123`
  - ID: `driver002` | Password: `driver123`
  - ID: `driver003` | Password: `driver123`

---

## 📝 Student Registration & Approval Process

### Step 1: Student Registration
1. Go to `index.html`
2. Click "Register Here" button
3. Fill in registration form:
   - Student ID (xxx-xxx format, e.g., 125-017)
   - First Name
   - Last Name
   - Email
   - Phone Number
   - Password
4. Submit registration
5. Status: **Pending Approval**

### Step 2: Admin Approval
1. Admin logs in to `admin_dashboard/admin_login.html`
2. Navigate to "Approve Students" (use `admin_dashboard/approve_students.html`)
3. Review pending registrations
4. **Approve** or **Reject** students
5. Approved students can now login

### Step 3: Student Login
1. After approval, student can login at `index.html`
2. Enter Student ID and Password
3. Access student dashboard

---

## 🗂️ File Structure

```
bus_manegement/
├── index.html                          # Student Login Page
├── admin_dashboard/
│   ├── admin_login.html               # Admin Login Page
│   ├── home.html                      # Admin Dashboard
│   ├── manage_students.html           # Add/Edit Students (Direct Add)
│   └── approve_students.html          # Approve/Reject Registrations
├── driver_page/
│   ├── driver_login.html              # Driver Login Page
│   └── home.html                      # Driver Dashboard
├── student_page/
│   ├── student_register.html          # Student Registration Form
│   └── home.html                      # Student Dashboard
└── scripts/
    └── main.js                        # Authentication Logic
```

---

## 💾 Data Storage (localStorage)

### Keys Used:
1. **`cavendish_pending_registrations`**
   - Stores student registrations waiting for approval
   - Used by registration form and approval page

2. **`cavendish_students`**
   - Stores approved students
   - Used for student login authentication
   - Also stores students added directly by admin

3. **`cavendish_rejected_registrations`**
   - Stores rejected registrations for records
   - Keeps track of rejection reasons

---

## 🔄 Authentication Flow

### Student Authentication:
```
1. Student enters ID + Password
2. Check in `cavendish_students` (approved list)
3. If found → Login Success → Redirect to dashboard
4. If not found → Check if pending approval
5. If pending → Show "pending approval" message
6. If not in system → Show "invalid credentials"
```

### Admin/Driver Authentication:
```
1. User enters ID + Password
2. Check against hardcoded credentials in main.js
3. If valid → Store session data → Redirect to dashboard
4. If invalid → Show error message
```

---

## 📌 Key Features

### For Students:
✅ Self-registration with validation
✅ Student ID format: xxx-xxx (e.g., 125-017)
✅ Password confirmation
✅ Pending approval notification
✅ Secure login after approval

### For Admins:
✅ Review all pending registrations
✅ Approve or reject with reasons
✅ View approved/rejected history
✅ Direct student addition (manage_students.html)
✅ Edit/Delete approved students
✅ Statistics dashboard

### System Features:
✅ Duplicate ID prevention
✅ Real-time validation
✅ Responsive design
✅ Clear status indicators
✅ Data persistence across sessions

---

## 🚀 Quick Start Guide

1. **Test Student Registration:**
   ```
   - Open index.html
   - Click "Register Here"
   - Register with ID: 125-017
   - Use any name, email, phone, and password
   ```

2. **Approve Student:**
   ```
   - Go to admin_dashboard/admin_login.html
   - Login: admin / admin
   - Navigate to approve_students.html
   - Click "Approve" on pending student
   ```

3. **Login as Approved Student:**
   ```
   - Return to index.html
   - Enter Student ID: 125-017
   - Enter your password
   - Access student dashboard
   ```

---

## 🔧 Admin Functions

### Approve Students Page (`approve_students.html`)
- View pending registrations
- See student details (ID, name, email, phone, submission date)
- Approve registrations (moves to approved list)
- Reject with reason (moves to rejected list)
- Statistics: Pending, Approved Today, Rejected Today
- Filter by status: Pending / Approved / Rejected

### Manage Students Page (`manage_students.html`)
- Directly add students without registration process
- Edit existing students
- Delete students
- View all registered students in table
- Bypass approval process for quick additions

---

## 🎯 Important Notes

1. **Password Security**: Currently stored in plain text (for development). In production, passwords should be hashed.

2. **Admin Credentials**: Hardcoded in `main.js`. Should be moved to secure backend in production.

3. **Data Persistence**: Uses localStorage. Will be cleared if browser cache is cleared.

4. **Student ID Format**: Must be exactly 6 digits in xxx-xxx format (e.g., 125-017).

5. **Two Ways to Add Students**:
   - **Student Registration** → Requires admin approval
   - **Direct Admin Add** → Immediate access (no approval needed)

---

## 🐛 Troubleshooting

**Student can't login after registration:**
- Check if admin has approved the registration
- Verify credentials are correct
- Check browser console for errors

**Lost admin password:**
- Use default: `admin` / `admin`
- Check `main.js` for other hardcoded admin accounts

**Student ID not accepted:**
- Must be 6 digits in xxx-xxx format
- Example: 125-017 (not 125017 or 125-17)

---

## 📞 Support

For issues or questions, contact the system administrator at: admin@cavendish.ac.zm
