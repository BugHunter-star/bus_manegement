# ✅ Supabase Integration Checklist

Follow this checklist to successfully integrate Supabase with your Bus Management System.

## 📋 Pre-Setup (5-10 minutes)

- [ ] Read [SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)
- [ ] Have a Gmail or GitHub account ready for Supabase signup
- [ ] Have a text editor ready to save your API keys

---

## 🚀 Phase 1: Supabase Account Setup (10 minutes)

### Step 1: Create Account
- [ ] Go to [https://supabase.com](https://supabase.com)
- [ ] Click "Start your project"
- [ ] Sign up with GitHub or email
- [ ] Verify your email (check spam folder)

### Step 2: Create Project
- [ ] Click "New Project"
- [ ] Enter project name: `cavendish-bus-management`
- [ ] Create a strong database password
- [ ] **SAVE PASSWORD IN A SAFE PLACE** 📝
- [ ] Select region closest to Zambia: `eu-central-1` or `af-south-1`
- [ ] Click "Create new project"
- [ ] Wait 2-3 minutes for provisioning

### Step 3: Save Your Credentials
- [ ] Go to Settings (gear icon) → API
- [ ] Copy **Project URL** (looks like: `https://xxxxx.supabase.co`)
- [ ] Copy **anon/public Key** (starts with `eyJ...`)
- [ ] Save both in a text file temporarily

---

## 💾 Phase 2: Database Setup (15 minutes)

### Step 1: Access SQL Editor
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New query"

### Step 2: Create Tables (Run each query separately)
- [ ] Run **Students Table** query (from SUPABASE_SETUP_GUIDE.md)
- [ ] Verify: Go to "Table Editor" → should see `students` table
- [ ] Run **Admins Table** query
- [ ] Verify: Should see `admins` table
- [ ] Run **Drivers Table** query
- [ ] Verify: Should see `drivers` table
- [ ] Run **Complaints Table** query
- [ ] Verify: Should see `complaints` table
- [ ] Run **Bus Tracking Table** query
- [ ] Verify: Should see `bus_tracking` table
- [ ] Run **Audit Logs Table** query
- [ ] Verify: Should see `audit_logs` table

### Step 3: Create Triggers
- [ ] Run **update_updated_at function** query
- [ ] Run all **CREATE TRIGGER** statements

### Step 4: Insert Default Admin
- [ ] Run **Insert default admin** query
- [ ] Verify: Go to Table Editor → admins → should see 1 row
- [ ] Default admin: ID = `ADMIN001`, Password = `admin123`

---

## 🔒 Phase 3: Security Setup (10 minutes)

### Step 1: Enable RLS
- [ ] Run all **ALTER TABLE ... ENABLE ROW LEVEL SECURITY** queries

### Step 2: Create Policies
- [ ] Run all **CREATE POLICY** statements
- [ ] Verify: Go to Database → Policies
- [ ] Should see multiple policies for each table

---

## 🔌 Phase 4: Application Integration (5 minutes)

### Step 1: Update Configuration File
- [ ] Open `scripts/supabase-config.js` in your code editor
- [ ] Find line: `const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';`
- [ ] Replace with your actual Project URL
- [ ] Find line: `const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';`
- [ ] Replace with your actual anon key
- [ ] Save the file

### Step 2: Verify Files Are Updated
- [ ] `student_page/student_register.html` - Has Supabase script tag
- [ ] `admin_dashboard/admin_login.html` - Has Supabase script tag
- [ ] `admin_dashboard/approve_students.html` - Has Supabase script tag
- [ ] All files include `<script src="../scripts/supabase-config.js"></script>`

---

## 🧪 Phase 5: Testing (15 minutes)

### Test 1: Student Registration
- [ ] Open `student_page/student_register.html` in browser
- [ ] Fill out registration form with test data:
  - Student ID: `001` + `123456`
  - Name: Your name
  - Email: test@example.com
  - Phone: +260971234567
  - Password: test123
- [ ] Click "Register"
- [ ] Should see success message
- [ ] Go to Supabase → Table Editor → students
- [ ] Should see your test registration with `status = 'pending'`

**✅ If you see the data in Supabase, registration is working!**

### Test 2: Admin Login
- [ ] Open `admin_dashboard/admin_login.html` in browser
- [ ] Enter credentials:
  - Admin ID: `ADMIN001`
  - Password: `admin123`
- [ ] Click "Login"
- [ ] Should redirect to admin dashboard

**✅ If you're redirected to dashboard, admin login is working!**

### Test 3: Approve Student
- [ ] In admin dashboard, click "Approve Registrations"
- [ ] Should see the test student you registered
- [ ] Click "Approve" button
- [ ] Should see success message
- [ ] Go to Supabase → Table Editor → students
- [ ] Find your test student
- [ ] `status` should now be `'approved'`
- [ ] `approved_date` should be filled

**✅ If status changed to 'approved', the approval system is working!**

### Test 4: Student Login After Approval
- [ ] Open `index.html` (student login page)
- [ ] Login with the test student credentials
- [ ] Should be able to login successfully

**✅ If student can login after approval, the full flow is working!**

---

## 🐛 Troubleshooting

### Issue: "Supabase is not configured"
- [ ] Check `scripts/supabase-config.js`
- [ ] Verify SUPABASE_URL and SUPABASE_ANON_KEY are replaced
- [ ] Make sure there are no typos in the URLs/keys

### Issue: "Failed to fetch" or "Network error"
- [ ] Check your internet connection
- [ ] Verify Supabase project is active (not paused)
- [ ] Open browser console (F12) and check for errors

### Issue: "Row Level Security policy violation"
- [ ] Verify all RLS policies are created
- [ ] Check policies in Supabase Dashboard → Database → Policies
- [ ] Re-run the policy creation queries

### Issue: Data not appearing in tables
- [ ] Check browser console for JavaScript errors
- [ ] Verify Supabase credentials are correct
- [ ] Test Supabase connection:
  ```javascript
  // Paste in browser console
  supabaseClient.from('students').select('count')
    .then(r => console.log('Connection OK:', r))
  ```

---

## 🎯 Success Criteria

You've successfully integrated Supabase when:

- ✅ Students can register and data appears in Supabase
- ✅ Admin can login with credentials
- ✅ Admin can see pending registrations from Supabase
- ✅ Admin can approve/reject students
- ✅ Approved students can login
- ✅ All data persists across page refreshes

---

## 📊 Next Steps After Integration

Once everything is working:

1. **Change Default Admin Password**
   - [ ] Go to Supabase → Table Editor → admins
   - [ ] Update the password for ADMIN001

2. **Add More Features**
   - [ ] Implement complaint system
   - [ ] Add bus tracking
   - [ ] Enable real-time updates

3. **Production Preparation**
   - [ ] Implement proper password hashing (bcrypt)
   - [ ] Add email notifications
   - [ ] Set up backup system
   - [ ] Create additional admin accounts

4. **Documentation**
   - [ ] Document your database schema
   - [ ] Create user guides
   - [ ] Write deployment instructions

---

## 🆘 Need Help?

If you're stuck:
1. Check browser console (F12) for errors
2. Review Supabase logs in dashboard
3. Re-read [SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)
4. Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
5. Visit Supabase documentation: https://supabase.com/docs

---

## 📝 Notes

- Keep your Supabase credentials secure
- Don't commit API keys to Git
- Test each feature thoroughly before moving to production
- Back up your database regularly

---

**Estimated Total Time: 45-60 minutes**

Good luck! 🚀
