# 🚀 Supabase Setup Guide for Bus Management System

This guide will walk you through setting up Supabase for the Cavendish University Bus Management System.

## 📋 Table of Contents
1. [Create Supabase Account](#1-create-supabase-account)
2. [Create a New Project](#2-create-a-new-project)
3. [Database Schema Setup](#3-database-schema-setup)
4. [Configure Row Level Security (RLS)](#4-configure-row-level-security-rls)
5. [Get API Keys](#5-get-api-keys)
6. [Integration with Your Application](#6-integration-with-your-application)

---

## 1. Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using:
   - GitHub account (recommended)
   - Email and password
4. Verify your email if required

---

## 2. Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `cavendish-bus-management`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose the closest region to Zambia (e.g., `eu-central-1` or `af-south-1`)
   - **Pricing Plan**: Free tier is sufficient to start
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

---

## 3. Database Schema Setup

### Step 1: Access SQL Editor
1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 2: Create Tables

Copy and paste the following SQL queries one by one:

#### A. Create Students Table
```sql
-- Students registration table
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_date TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
```

#### B. Create Admins Table
```sql
-- Admins table
CREATE TABLE admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_admins_admin_id ON admins(admin_id);
CREATE INDEX idx_admins_email ON admins(email);
```

#### C. Create Drivers Table
```sql
-- Drivers table
CREATE TABLE drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash TEXT NOT NULL,
    bus_number VARCHAR(20),
    license_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_drivers_driver_id ON drivers(driver_id);
CREATE INDEX idx_drivers_email ON drivers(email);
```

#### D. Create Complaints Table
```sql
-- Complaints table
CREATE TABLE complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    complaint_type VARCHAR(50) NOT NULL CHECK (complaint_type IN ('bus_delay', 'driver_behavior', 'route_issue', 'safety_concern', 'other')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    bus_number VARCHAR(20),
    driver_name VARCHAR(255),
    complaint_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_date TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES admins(id),
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_complaints_student_id ON complaints(student_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_date ON complaints(complaint_date);
```

#### E. Create Bus Tracking Table
```sql
-- Bus tracking table (for real-time location updates)
CREATE TABLE bus_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    current_lat DECIMAL(10, 8),
    current_lng DECIMAL(11, 8),
    route VARCHAR(100),
    status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('idle', 'on_route', 'arrived', 'maintenance')),
    eta_minutes INTEGER,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_bus_tracking_bus_number ON bus_tracking(bus_number);
CREATE INDEX idx_bus_tracking_driver_id ON bus_tracking(driver_id);
CREATE INDEX idx_bus_tracking_status ON bus_tracking(status);
```

#### F. Create Audit Log Table
```sql
-- Audit log for tracking important actions
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'admin', 'driver')),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### Step 3: Create Triggers for Updated_at

```sql
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Insert Default Admin Account

```sql
-- Insert a default admin account (change password in production!)
INSERT INTO admins (admin_id, full_name, email, password_hash, role)
VALUES ('ADMIN001', 'System Administrator', 'admin@cavendish.ac.zm', 'admin123', 'super_admin');

-- Note: In production, you should hash passwords properly
```

---

## 4. Configure Row Level Security (RLS)

Row Level Security ensures users can only access their own data.

### Step 1: Enable RLS

```sql
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create Policies

```sql
-- Students: Can read their own data
CREATE POLICY "Students can view own data" ON students
    FOR SELECT USING (auth.uid() = id);

-- Students: Can update their own data
CREATE POLICY "Students can update own data" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Admins: Can view all students
CREATE POLICY "Admins can view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.id = auth.uid()
        )
    );

-- Admins: Can update all students
CREATE POLICY "Admins can update all students" ON students
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.id = auth.uid()
        )
    );

-- Public: Allow registration (INSERT)
CREATE POLICY "Allow public registration" ON students
    FOR INSERT WITH CHECK (true);

-- Complaints: Students can view their own
CREATE POLICY "Students can view own complaints" ON complaints
    FOR SELECT USING (student_id = auth.uid());

-- Complaints: Students can create complaints
CREATE POLICY "Students can create complaints" ON complaints
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- Complaints: Admins can view all
CREATE POLICY "Admins can view all complaints" ON complaints
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins WHERE admins.id = auth.uid()
        )
    );

-- Bus tracking: Public read access (for real-time updates)
CREATE POLICY "Public can view bus locations" ON bus_tracking
    FOR SELECT USING (true);

-- Bus tracking: Drivers can update their bus
CREATE POLICY "Drivers can update own bus" ON bus_tracking
    FOR UPDATE USING (driver_id = auth.uid());
```

---

## 5. Get API Keys

### Step 1: Navigate to API Settings
1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings

### Step 2: Copy Your Keys
You'll need these two keys:

1. **Project URL**: 
   - Example: `https://xyzcompany.supabase.co`
   - Copy this entire URL

2. **anon/public Key**: 
   - This is your public API key
   - Starts with `eyJ...`
   - Copy this entire key

3. **service_role Key** (Optional, for admin operations):
   - This is your private API key
   - **⚠️ Never expose this in client-side code!**
   - Only use in secure server environments

### Step 3: Save Your Keys Securely
Create a file to store your keys (don't commit this to Git!):

```
SUPABASE_URL=your_project_url_here
SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 6. Integration with Your Application

### Step 1: Include Supabase JavaScript Client

Add this to the `<head>` section of your HTML files:

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Step 2: Create Supabase Configuration File

I'll create a separate configuration file for you: `scripts/supabase-config.js`

---

## 🎯 Next Steps

After completing this setup:

1. ✅ Verify all tables are created in Supabase dashboard
2. ✅ Test the connection by running sample queries
3. ✅ Update your application code to use Supabase
4. ✅ Test student registration
5. ✅ Test admin login and approval
6. ✅ Test complaint submission

---

## 📞 Troubleshooting

### Issue: Can't connect to Supabase
- Check your API URL and keys are correct
- Ensure you're using HTTPS
- Check browser console for errors

### Issue: RLS policies blocking access
- Verify policies are set up correctly
- Use Supabase dashboard to test queries
- Check authentication state

### Issue: CORS errors
- Supabase automatically handles CORS for your domain
- Ensure you're using the correct project URL

---

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Add `.env` or config files to `.gitignore`

2. **Use environment variables** for keys in production

3. **Hash passwords** before storing (use bcrypt or similar)

4. **Validate all inputs** on client and server side

5. **Use RLS policies** to protect data access

6. **Enable 2FA** on your Supabase account

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need Help?** Check the Supabase community forums or Discord for support.
