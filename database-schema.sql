-- Jeressar High School Database Schema
-- Run these SQL commands in your Supabase SQL editor to create the necessary tables

-- Enable Row Level Security (RLS) for security
-- This ensures data access is properly controlled

-- Contact Submissions Table
CREATE TABLE contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admission Applications Table
CREATE TABLE admission_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'under_review', 'approved', 'rejected', 'waitlisted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_submitted_at ON contact_submissions(submitted_at DESC);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

CREATE INDEX idx_admission_applications_email ON admission_applications(email);
CREATE INDEX idx_admission_applications_application_id ON admission_applications(application_id);
CREATE INDEX idx_admission_applications_submitted_at ON admission_applications(submitted_at DESC);
CREATE INDEX idx_admission_applications_status ON admission_applications(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at column
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admission_applications_updated_at 
    BEFORE UPDATE ON admission_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on both tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Allow public to insert data (for form submissions)
CREATE POLICY "Allow public to insert contact submissions" ON contact_submissions
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public to insert admission applications" ON admission_applications
    FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users can read data (for admin dashboard)
CREATE POLICY "Allow authenticated users to read contact submissions" ON contact_submissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read admission applications" ON admission_applications
    FOR SELECT TO authenticated USING (true);

-- Only authenticated users can update data (for status changes)
CREATE POLICY "Allow authenticated users to update contact submissions" ON contact_submissions
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update admission applications" ON admission_applications
    FOR UPDATE TO authenticated USING (true);

-- Create a view for application statistics (optional)
CREATE VIEW application_stats AS
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
    COUNT(CASE WHEN boarding_status = 'day' THEN 1 END) as day_applications
FROM admission_applications;

-- Create a view for contact statistics (optional)
CREATE VIEW contact_stats AS
SELECT 
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed,
    COUNT(CASE WHEN subject = 'admission' THEN 1 END) as admission_inquiries,
    COUNT(CASE WHEN subject = 'academic' THEN 1 END) as academic_inquiries,
    COUNT(CASE WHEN subject = 'fee' THEN 1 END) as fee_inquiries
FROM contact_submissions;

-- Grant permissions on views to authenticated users
GRANT SELECT ON application_stats TO authenticated;
GRANT SELECT ON contact_stats TO authenticated;