-- Jeressar High School - Complete Database Schema
-- Run this entire script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CONTACT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL CHECK (subject IN ('admission', 'academic', 'fee', 'visit', 'complaint', 'other')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMISSION APPLICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admission_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    application_id VARCHAR(20) UNIQUE NOT NULL,
    
    -- Student Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    
    -- Program Selection
    program VARCHAR(20) NOT NULL CHECK (program IN ('o-level', 'a-level')),
    boarding_status VARCHAR(20) NOT NULL CHECK (boarding_status IN ('day', 'boarding')),
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    
    -- Previous Education
    previous_school VARCHAR(200) NOT NULL,
    last_class VARCHAR(50) NOT NULL,
    academic_achievements TEXT,
    
    -- Parent/Guardian Information
    parent_name VARCHAR(200) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    parent_email VARCHAR(255),
    parent_occupation VARCHAR(100),
    
    -- Additional Information
    special_needs TEXT,
    declaration_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'under_review', 'approved', 'rejected', 'waitlisted')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_subject ON contact_submissions(subject);

-- Admission applications indexes
CREATE INDEX IF NOT EXISTS idx_admission_applications_email ON admission_applications(email);
CREATE INDEX IF NOT EXISTS idx_admission_applications_application_id ON admission_applications(application_id);
CREATE INDEX IF NOT EXISTS idx_admission_applications_submitted_at ON admission_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_admission_applications_status ON admission_applications(status);
CREATE INDEX IF NOT EXISTS idx_admission_applications_program ON admission_applications(program);

-- =============================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admission_applications_updated_at ON admission_applications;
CREATE TRIGGER update_admission_applications_updated_at 
    BEFORE UPDATE ON admission_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =============================================
-- Enable RLS on both tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "contact_submissions_insert_policy" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_select_policy" ON contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_update_policy" ON contact_submissions;

DROP POLICY IF EXISTS "admission_applications_insert_policy" ON admission_applications;
DROP POLICY IF EXISTS "admission_applications_select_policy" ON admission_applications;
DROP POLICY IF EXISTS "admission_applications_update_policy" ON admission_applications;

-- CONTACT SUBMISSIONS POLICIES
-- Allow anyone (including anonymous) to insert contact submissions
CREATE POLICY "contact_submissions_insert_policy" ON contact_submissions
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated users to read all contact submissions
CREATE POLICY "contact_submissions_select_policy" ON contact_submissions
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to update contact submissions
CREATE POLICY "contact_submissions_update_policy" ON contact_submissions
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ADMISSION APPLICATIONS POLICIES
-- Allow anyone (including anonymous) to insert admission applications
CREATE POLICY "admission_applications_insert_policy" ON admission_applications
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow authenticated users to read all admission applications
CREATE POLICY "admission_applications_select_policy" ON admission_applications
    FOR SELECT 
    TO authenticated
    USING (true);

-- Allow authenticated users to update admission applications
CREATE POLICY "admission_applications_update_policy" ON admission_applications
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- GRANT PERMISSIONS
-- =============================================
-- Grant permissions to anon role (for form submissions)
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON admission_applications TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant permissions to authenticated role (for admin dashboard)
GRANT ALL ON contact_submissions TO authenticated;
GRANT ALL ON admission_applications TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- UTILITY VIEWS FOR STATISTICS
-- =============================================
CREATE OR REPLACE VIEW contact_statistics AS
SELECT 
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_submissions,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_submissions,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_submissions,
    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_submissions,
    COUNT(CASE WHEN subject = 'admission' THEN 1 END) as admission_inquiries,
    COUNT(CASE WHEN subject = 'academic' THEN 1 END) as academic_inquiries,
    COUNT(CASE WHEN subject = 'fee' THEN 1 END) as fee_inquiries,
    COUNT(CASE WHEN submitted_at >= CURRENT_DATE THEN 1 END) as today_submissions,
    COUNT(CASE WHEN submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_submissions
FROM contact_submissions;

CREATE OR REPLACE VIEW admission_statistics AS
SELECT 
    COUNT(*) as total_applications,
    COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending_review,
    COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
    COUNT(CASE WHEN status = 'waitlisted' THEN 1 END) as waitlisted,
    COUNT(CASE WHEN program = 'o-level' THEN 1 END) as o_level_applications,
    COUNT(CASE WHEN program = 'a-level' THEN 1 END) as a_level_applications,
    COUNT(CASE WHEN boarding_status = 'boarding' THEN 1 END) as boarding_applications,
    COUNT(CASE WHEN boarding_status = 'day' THEN 1 END) as day_applications,
    COUNT(CASE WHEN submitted_at >= CURRENT_DATE THEN 1 END) as today_applications,
    COUNT(CASE WHEN submitted_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_applications
FROM admission_applications;

-- Grant view permissions
GRANT SELECT ON contact_statistics TO authenticated;
GRANT SELECT ON admission_statistics TO authenticated;

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================
-- Function to generate unique application IDs
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    new_id TEXT;
    counter INTEGER := 1;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    LOOP
        sequence_part := LPAD(counter::TEXT, 4, '0');
        new_id := 'JHS' || year_part || sequence_part;
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM admission_applications WHERE application_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
        
        -- Safety check to prevent infinite loop
        IF counter > 9999 THEN
            RAISE EXCEPTION 'Unable to generate unique application ID';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TEST DATA VALIDATION
-- =============================================
-- Insert test data to verify everything works
DO $$
BEGIN
    -- Test contact submission
    INSERT INTO contact_submissions (first_name, last_name, email, phone, subject, message)
    VALUES ('Test', 'User', 'test@example.com', '+256700000000', 'other', 'Test message for database setup');
    
    -- Test admission application
    INSERT INTO admission_applications (
        application_id, first_name, last_name, date_of_birth, gender,
        program, boarding_status, email, phone, address,
        previous_school, last_class, parent_name, parent_phone, declaration_accepted
    ) VALUES (
        generate_application_id(), 'Test', 'Student', '2005-01-01', 'male',
        'o-level', 'day', 'teststudent@example.com', '+256700000001', 'Test Address, Soroti',
        'Test Primary School', 'Primary 7', 'Test Parent', '+256700000002', true
    );
    
    RAISE NOTICE 'Test data inserted successfully!';
END $$;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Show table structures
SELECT 'CONTACT SUBMISSIONS TABLE' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'contact_submissions' 
ORDER BY ordinal_position;

SELECT 'ADMISSION APPLICATIONS TABLE' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'admission_applications' 
ORDER BY ordinal_position;

-- Show RLS policies
SELECT 'ROW LEVEL SECURITY POLICIES' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'admission_applications')
ORDER BY tablename, policyname;

-- Show statistics
SELECT 'CONTACT STATISTICS' as info;
SELECT * FROM contact_statistics;

SELECT 'ADMISSION STATISTICS' as info;
SELECT * FROM admission_statistics;

-- Clean up test data
DELETE FROM contact_submissions WHERE email = 'test@example.com';
DELETE FROM admission_applications WHERE email = 'teststudent@example.com';

SELECT 'DATABASE SETUP COMPLETED SUCCESSFULLY!' as status;