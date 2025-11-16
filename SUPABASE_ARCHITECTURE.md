# 📊 Supabase Data Flow & Architecture

This document visualizes how data flows through your Bus Management System with Supabase.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAVENDISH BUS MANAGEMENT SYSTEM              │
└─────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐        ┌───────────────┐        ┌───────────────┐
│   STUDENTS    │        │    ADMINS     │        │    DRIVERS    │
│               │        │               │        │               │
│ • Register    │        │ • Login       │        │ • Login       │
│ • Login       │        │ • Approve     │        │ • Update GPS  │
│ • Complain    │        │ • Manage      │        │ • View Route  │
│ • Track Bus   │        │ • Respond     │        │               │
└───────┬───────┘        └───────┬───────┘        └───────┬───────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────┐
                    │  Supabase Client    │
                    │  (JavaScript SDK)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   SUPABASE CLOUD    │
                    │                     │
                    │  • PostgreSQL DB    │
                    │  • Authentication   │
                    │  • Real-time API    │
                    │  • Row Security     │
                    └─────────────────────┘
```

---

## 🔄 Student Registration Flow

```
STEP 1: Student Visits Registration Page
┌──────────────────────────────────────┐
│  student_register.html               │
│                                      │
│  [Student Registration Form]         │
│  • Student ID: 001123456             │
│  • Name: John Banda                  │
│  • Email: john@example.com           │
│  • Phone: +260971234567              │
│  • Password: ********                │
│                                      │
│         [Register Button]            │
└──────────────┬───────────────────────┘
               │
               │ Form Submit
               ▼
STEP 2: JavaScript Processes Data
┌──────────────────────────────────────┐
│  JavaScript Event Handler            │
│                                      │
│  1. Validate form inputs             │
│  2. Create registration object       │
│  3. Call registerStudent()           │
└──────────────┬───────────────────────┘
               │
               │ Calls Function
               ▼
STEP 3: Supabase Function Called
┌──────────────────────────────────────┐
│  registerStudent()                   │
│  (supabase-config.js)                │
│                                      │
│  supabaseClient                      │
│    .from('students')                 │
│    .insert([studentData])            │
└──────────────┬───────────────────────┘
               │
               │ HTTP POST Request
               ▼
STEP 4: Supabase Processes Request
┌──────────────────────────────────────┐
│  SUPABASE CLOUD                      │
│                                      │
│  1. Receive request                  │
│  2. Validate data                    │
│  3. Check RLS policies               │
│  4. Insert into 'students' table     │
│  5. Set status = 'pending'           │
│  6. Generate UUID                    │
│  7. Set timestamps                   │
└──────────────┬───────────────────────┘
               │
               │ Returns Result
               ▼
STEP 5: Success Response
┌──────────────────────────────────────┐
│  { success: true, data: {...} }      │
│                                      │
│  Student sees:                       │
│  ✅ "Registration successful!"       │
│  "Pending admin approval"            │
└──────────────────────────────────────┘
```

---

## 🔐 Admin Approval Flow

```
STEP 1: Admin Logs In
┌──────────────────────────────────────┐
│  admin_login.html                    │
│                                      │
│  Admin ID: ADMIN001                  │
│  Password: admin123                  │
│                                      │
│  loginAdmin() → Supabase             │
└──────────────┬───────────────────────┘
               │
               ▼
STEP 2: Admin Navigates to Approve Page
┌──────────────────────────────────────┐
│  approve_students.html               │
│                                      │
│  Calls: getPendingStudents()         │
└──────────────┬───────────────────────┘
               │
               │ Query Database
               ▼
┌──────────────────────────────────────┐
│  Supabase Query                      │
│                                      │
│  SELECT * FROM students              │
│  WHERE status = 'pending'            │
│  ORDER BY registration_date DESC     │
└──────────────┬───────────────────────┘
               │
               │ Returns List
               ▼
STEP 3: Display Pending Students
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │
│  │ John Banda - 001123456         │  │
│  │ john@example.com               │  │
│  │ Registered: Nov 16, 2025       │  │
│  │ [Approve] [Reject]             │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Mary Phiri - 001234567         │  │
│  │ mary@example.com               │  │
│  │ Registered: Nov 15, 2025       │  │
│  │ [Approve] [Reject]             │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
               │
               │ Admin clicks "Approve"
               ▼
STEP 4: Update Student Status
┌──────────────────────────────────────┐
│  updateStudentStatus()               │
│                                      │
│  UPDATE students                     │
│  SET status = 'approved',            │
│      approved_date = NOW(),          │
│      approved_by = admin_id          │
│  WHERE id = student_uuid             │
└──────────────┬───────────────────────┘
               │
               │ Database Updated
               ▼
STEP 5: Student Can Now Login
┌──────────────────────────────────────┐
│  ✅ Status changed to 'approved'     │
│  ✅ Student can now login            │
│  ✅ Access to student portal         │
└──────────────────────────────────────┘
```

---

## 🗄️ Database Table Relationships

```
┌─────────────────────┐
│     ADMINS          │
│─────────────────────│
│ id (PK)            │◄────────┐
│ admin_id (unique)  │         │
│ full_name          │         │
│ email              │         │
│ password_hash      │         │
│ role               │         │
└─────────────────────┘         │
                                │
                                │ approved_by (FK)
┌─────────────────────┐         │
│     STUDENTS        │         │
│─────────────────────│         │
│ id (PK)            │─────────┘
│ student_id (unique)│◄────────┐
│ full_name          │         │
│ email              │         │
│ phone              │         │
│ password_hash      │         │
│ status             │         │ student_id (FK)
│ approved_by (FK)   │         │
└─────────────────────┘         │
         │                      │
         │                      │
         │ student_id (FK)      │
         │                      │
         ▼                      │
┌─────────────────────┐         │
│    COMPLAINTS       │         │
│─────────────────────│         │
│ id (PK)            │         │
│ student_id (FK)    │─────────┘
│ student_name       │
│ complaint_type     │
│ title              │
│ description        │
│ status             │
│ priority           │
│ resolved_by (FK)   │───────┐
└─────────────────────┘       │
                              │
                              └──► Links to ADMINS
┌─────────────────────┐
│     DRIVERS         │
│─────────────────────│
│ id (PK)            │◄────────┐
│ driver_id (unique) │         │
│ full_name          │         │
│ email              │         │
│ phone              │         │
│ bus_number         │         │
│ license_number     │         │ driver_id (FK)
└─────────────────────┘         │
                                │
┌─────────────────────┐         │
│   BUS_TRACKING      │         │
│─────────────────────│         │
│ id (PK)            │         │
│ bus_number         │         │
│ driver_id (FK)     │─────────┘
│ current_lat        │
│ current_lng        │
│ route              │
│ status             │
│ eta_minutes        │
│ last_updated       │
└─────────────────────┘

┌─────────────────────┐
│    AUDIT_LOGS       │
│─────────────────────│
│ id (PK)            │
│ user_id            │  (Can reference any user type)
│ user_type          │  ('student', 'admin', 'driver')
│ action             │
│ description        │
│ ip_address         │
│ created_at         │
└─────────────────────┘
```

---

## 🔒 Row Level Security (RLS) Flow

```
USER REQUEST
     │
     ▼
┌─────────────────────────────────┐
│  Supabase receives request      │
│  with auth credentials          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Check RLS Policies             │
│                                 │
│  IF user = student:             │
│    ✓ Can read own data          │
│    ✓ Can insert complaints      │
│    ✗ Cannot read other students │
│                                 │
│  IF user = admin:               │
│    ✓ Can read all data          │
│    ✓ Can update all data        │
│    ✓ Can approve/reject         │
│                                 │
│  IF user = driver:              │
│    ✓ Can update own bus         │
│    ✓ Can read routes            │
│    ✗ Cannot access student data │
└────────────┬────────────────────┘
             │
             ▼
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────┐     ┌─────────┐
│ ALLOW   │     │ DENY    │
│ Access  │     │ Access  │
└─────────┘     └─────────┘
```

---

## 📡 Real-time Updates Flow

```
┌─────────────────────┐
│  DRIVER APP         │
│  Updates GPS        │
└──────────┬──────────┘
           │
           │ updateBusLocation()
           ▼
┌─────────────────────┐
│  SUPABASE           │
│  bus_tracking table │
│  (location updated) │
└──────────┬──────────┘
           │
           │ Real-time broadcast
           ├──────────────────┬──────────────────┐
           ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│ STUDENT APP 1    │  │ STUDENT APP 2│  │ ADMIN DASH   │
│ Map auto-updates │  │ Map updates  │  │ Bus monitor  │
└──────────────────┘  └──────────────┘  └──────────────┘
```

---

## 🎯 Key API Endpoints Used

### Student Operations
```javascript
// Register
POST /rest/v1/students
Body: { student_id, full_name, email, phone, password_hash }

// Login
GET /rest/v1/students?student_id=eq.123&password_hash=eq.xyz
Returns: Student object

// Get own complaints
GET /rest/v1/complaints?student_id=eq.{uuid}
Returns: Array of complaints
```

### Admin Operations
```javascript
// Get pending students
GET /rest/v1/students?status=eq.pending
Returns: Array of pending students

// Approve student
PATCH /rest/v1/students?id=eq.{uuid}
Body: { status: 'approved', approved_date, approved_by }

// Get all complaints
GET /rest/v1/complaints
Returns: Array of all complaints
```

### Bus Tracking
```javascript
// Update location
POST /rest/v1/bus_tracking
Body: { bus_number, driver_id, current_lat, current_lng, ... }

// Get all buses
GET /rest/v1/bus_tracking?status=in.(on_route,idle)
Returns: Array of active buses

// Subscribe to changes
REALTIME /realtime/v1
Channel: bus_tracking_channel
```

---

## 📊 Data Flow Summary

```
REGISTRATION → PENDING → APPROVAL → ACTIVE STUDENT
     │            │          │            │
     │            │          │            ├─► Can Login
     │            │          │            ├─► View Buses
     │            │          │            ├─► Submit Complaints
     │            │          │            └─► Track Location
     │            │          │
     │            │          └─► Admin Action
     │            │
     │            └─► Visible to Admin
     │
     └─► Stored in Supabase
```

---

## 🔧 Function Call Flow

```
HTML PAGE
    │
    └─► Event Listener (onClick, onSubmit)
            │
            └─► JavaScript Handler
                    │
                    └─► supabase-config.js Function
                            │
                            └─► Supabase Client Method
                                    │
                                    └─► Supabase API
                                            │
                                            └─► PostgreSQL Database
                                                    │
                                                    └─► Response
                                                            │
                                                            └─► Update UI
```

---

## 💡 Best Practices

1. **Always check authentication** before sensitive operations
2. **Use RLS policies** instead of client-side checks
3. **Validate inputs** on both client and server
4. **Handle errors gracefully** with try-catch blocks
5. **Log important actions** in audit_logs table
6. **Subscribe to real-time** for dynamic data
7. **Use transactions** for complex operations
8. **Index frequently queried columns**

---

This architecture ensures:
- ✅ Secure data access
- ✅ Real-time updates
- ✅ Scalable design
- ✅ Easy maintenance
- ✅ Audit trail
- ✅ Role-based access control
