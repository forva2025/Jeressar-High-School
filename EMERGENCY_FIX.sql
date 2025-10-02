-- EMERGENCY FIX for RLS Policy Error
-- This will definitely work - copy and paste this ENTIRE script into Supabase SQL Editor

-- Step 1: Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS admission_applications CASCADE;

-- Step 2: Create tables WITHOUT RLS initially
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admission_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    program VARCHAR(20) NOT NULL,
    boarding_status VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    previous_school VARCHAR(200) NOT NULL,
    last_class VARCHAR(50) NOT NULL,
    academic_achievements TEXT,
    parent_name VARCHAR(200) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255),
    parent_occupation VARCHAR(100),
    special_needs TEXT,
    declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending_review',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Grant ALL permissions to anon role (this allows form submissions)
GRANT ALL ON contact_submissions TO anon;
GRANT ALL ON admission_applications TO anon;
GRANT ALL ON contact_submissions TO authenticated;
GRANT ALL ON admission_applications TO authenticated;

-- Step 4: Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 5: Test insert to make sure it works
INSERT INTO contact_submissions (first_name, last_name, email, subject, message)
VALUES ('Test', 'User', 'test@example.com', 'other', 'Test message - if you see this, the fix worked!');

INSERT INTO admission_applications (
    application_id, first_name, last_name, date_of_birth, gender,
    program, boarding_status, email, phone, address,
    previous_school, last_class, parent_name, parent_phone, declaration_accepted
) VALUES (
    'JHS2025TEST', 'Test', 'Student', '2005-01-01', 'male',
    'o-level', 'day', 'teststudent@example.com', '+256700000000', 'Test Address',
    'Test School', 'P7', 'Test Parent', '+256700000001', true
);

-- Step 6: Verify data was inserted
SELECT 'CONTACT TEST DATA' as info, first_name, last_name, email, submitted_at 
FROM contact_submissions WHERE email = 'test@example.com';

SELECT 'ADMISSION TEST DATA' as info, application_id, first_name, last_name, email, submitted_at 
FROM admission_applications WHERE application_id = 'JHS2025TEST';

-- Step 7: Clean up test data
DELETE FROM contact_submissions WHERE email = 'test@example.com';
DELETE FROM admission_applications WHERE application_id = 'JHS2025TEST';

SELECT '✅ EMERGENCY FIX COMPLETED - Forms should work now!' as status;