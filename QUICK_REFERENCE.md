# 🚀 Supabase Quick Reference Card

Print or save this for quick reference while setting up!

---

## 🔑 MY SUPABASE CREDENTIALS

**Project Name:** `cavendish-bus-management`

**Project URL:** 
```
_____________________________________________
(Paste your URL here after creating project)
```

**Anon/Public Key:**
```
_____________________________________________
_____________________________________________
_____________________________________________
(Paste your anon key here)
```

**Database Password:**
```
_____________________________________________
(Write your database password - keep secure!)
```

---

## ⚡ Quick Commands

### In Browser Console (F12)
```javascript
// Test Supabase connection
supabaseClient.from('students').select('count')

// Check if configured
isSupabaseConfigured()

// Get dashboard stats
getDashboardStats()
```

### Test Accounts

**Default Admin:**
- Admin ID: `ADMIN001`
- Password: `admin123`

**Test Student (after you create):**
- Student ID: Your test ID
- Password: Your test password

---

## 📊 Database Tables Quick Reference

| Table Name      | Purpose                  | Key Fields                    |
|-----------------|--------------------------|-------------------------------|
| `students`      | Student registrations    | student_id, status, email     |
| `admins`        | Admin accounts           | admin_id, role                |
| `drivers`       | Driver information       | driver_id, bus_number         |
| `complaints`    | Student complaints       | student_id, status, priority  |
| `bus_tracking`  | Real-time GPS            | bus_number, lat, lng          |
| `audit_logs`    | Activity tracking        | user_id, action, created_at   |

---

## 🔄 Common Status Values

### Student Status
- `pending` - Waiting for approval
- `approved` - Can login
- `rejected` - Registration denied

### Complaint Status
- `pending` - New complaint
- `in_progress` - Being addressed
- `resolved` - Fixed
- `closed` - Completed

### Bus Status
- `idle` - Not moving
- `on_route` - Active trip
- `arrived` - At destination
- `maintenance` - Under repair

---

## 🎯 Must-Do Steps (30 mins total)

### 1. Supabase Setup (15 min)
- [ ] Go to supabase.com
- [ ] Create account
- [ ] Create project: `cavendish-bus-management`
- [ ] Save URL and API key above
- [ ] Run ALL SQL queries from setup guide

### 2. Configure App (5 min)
- [ ] Open `scripts/supabase-config.js`
- [ ] Update SUPABASE_URL (line 6)
- [ ] Update SUPABASE_ANON_KEY (line 7)
- [ ] Save file

### 3. Test (10 min)
- [ ] Register test student
- [ ] Check Supabase table
- [ ] Login as admin
- [ ] Approve student
- [ ] Student login works

---

## 🔍 Debugging Checklist

When something doesn't work:

1. **Check Browser Console (F12)**
   - Look for red error messages
   - Note the error text

2. **Verify Credentials**
   - URL starts with `https://`
   - Key starts with `eyJ`
   - No typos

3. **Check Supabase Dashboard**
   - Project is active (not paused)
   - Tables exist
   - RLS is enabled

4. **Test Connection**
   ```javascript
   supabaseClient.from('students').select('count')
   ```
   Should return `{ count: number }`

---

## 📱 Pages Updated

| Page                              | What It Does                      |
|-----------------------------------|-----------------------------------|
| `student_register.html`           | Register → Supabase               |
| `admin_login.html`                | Admin auth via Supabase           |
| `approve_students.html`           | Fetch & approve from Supabase     |

---

## 🔐 Security Notes

- ✅ RLS enabled on all tables
- ✅ Students see only own data
- ✅ Admins see all data
- ⚠️ Change admin password after setup
- ⚠️ Don't commit API keys to Git
- ⚠️ Use password hashing in production

---

## 💡 Pro Tips

1. **Keep Supabase dashboard open** while testing
2. **Use Table Editor** to verify data
3. **Check SQL Editor** for query results
4. **Enable Replication** for real-time features
5. **Read error messages** carefully
6. **Test one feature at a time**

---

## 🆘 Emergency Fixes

### "Cannot connect to Supabase"
→ Check credentials in supabase-config.js

### "RLS policy violation"
→ Re-run RLS policy SQL queries

### "Table doesn't exist"
→ Re-run table creation SQL queries

### "Registration not working"
→ Check browser console for errors

### "Admin can't see students"
→ Verify RLS policies are created

---

## 📞 Where to Get Help

1. **Your Documentation**
   - `SUPABASE_SETUP_GUIDE.md` - Full setup
   - `IMPLEMENTATION_GUIDE.md` - Integration
   - `SUPABASE_CHECKLIST.md` - Step-by-step

2. **Browser Console**
   - F12 → Console tab
   - Shows all errors

3. **Supabase Dashboard**
   - Logs → See API calls
   - SQL Editor → Test queries
   - Table Editor → View data

4. **Supabase Docs**
   - https://supabase.com/docs

---

## ✅ Success Criteria

You know it's working when:

✅ Student registers → data in Supabase
✅ Admin logs in successfully
✅ Admin sees pending list
✅ Admin approves → status changes
✅ Approved student can login
✅ No console errors

---

## 🎓 SQL Queries Location

All SQL queries are in: **SUPABASE_SETUP_GUIDE.md**

Run them in this order:
1. Create Tables (6 tables)
2. Create Indexes
3. Create Triggers
4. Insert Default Admin
5. Enable RLS
6. Create Policies

---

## 🔄 Data Flow at a Glance

```
Student Register → Supabase (pending)
                      ↓
                Admin Dashboard
                      ↓
                Admin Approves
                      ↓
              Supabase (approved)
                      ↓
              Student Can Login
```

---

## 📁 Files You Need to Know

**Created for you:**
- `scripts/supabase-config.js` ← Configure here
- `SUPABASE_SETUP_GUIDE.md` ← Read this first
- `IMPLEMENTATION_GUIDE.md` ← Integration guide
- `SUPABASE_CHECKLIST.md` ← Track progress

**Updated for you:**
- `student_register.html` ← Now uses Supabase
- `admin_login.html` ← Now uses Supabase
- `approve_students.html` ← Now uses Supabase

---

## ⏱️ Time Estimates

| Task                    | Time      |
|-------------------------|-----------|
| Read setup guide        | 5 min     |
| Create Supabase account | 5 min     |
| Run SQL queries         | 10 min    |
| Update config file      | 2 min     |
| Test registration       | 3 min     |
| Test approval           | 3 min     |
| **TOTAL**               | **30 min** |

---

## 🎯 Your Mission

1. ✅ Set up Supabase (follow SUPABASE_SETUP_GUIDE.md)
2. ✅ Configure credentials (update supabase-config.js)
3. ✅ Test the system (use SUPABASE_CHECKLIST.md)
4. ✅ Celebrate success! 🎉

---

**Ready? Start with: SUPABASE_SETUP_GUIDE.md**

**Good luck! 🚀**
