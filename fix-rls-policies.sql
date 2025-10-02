-- Fix Row Level Security Policies for Jeressar High School
-- Run this SQL in your Supabase SQL Editor to fix the RLS policy issues

-- First, let's drop the existing policies and recreate them correctly
DROP POLICY IF EXISTS "Allow public to insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public to insert admission applications" ON admission_applications;
DROP POLICY IF EXISTS "Allow authenticated users to read contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read admission applications" ON admission_applications;
DROP POLICY IF EXISTS "Allow authenticated users to update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update admission applications" ON admission_applications;

-- Disable RLS temporarily to recreate policies
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;

-- Create new policies that work correctly

-- Allow anyone (including anonymous users) to insert contact submissions
CREATE POLICY "Enable insert for anonymous users" ON contact_submissions
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone (including anonymous users) to insert admission applications  
CREATE POLICY "Enable insert for anonymous users" ON admission_applications
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to read all contact submissions
CREATE POLICY "Enable read for authenticated users" ON contact_submissions
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Allow authenticated users to read all admission applications
CREATE POLICY "Enable read for authenticated users" ON admission_applications
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Allow authenticated users to update contact submissions
CREATE POLICY "Enable update for authenticated users" ON contact_submissions
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Allow authenticated users to update admission applications
CREATE POLICY "Enable update for authenticated users" ON admission_applications
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Grant necessary permissions to anon role for insertions
GRANT INSERT ON contact_submissions TO anon;
GRANT INSERT ON admission_applications TO anon;

-- Grant permissions to authenticated role for full access
GRANT ALL ON contact_submissions TO authenticated;
GRANT ALL ON admission_applications TO authenticated;

-- Also grant usage on sequences (for auto-generated IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Verify the policies are working
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('contact_submissions', 'admission_applications')
ORDER BY tablename, policyname;