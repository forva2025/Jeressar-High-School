# Supabase Integration Setup Guide

This guide will help you connect the Jeressar High School website to Supabase database for storing form submissions.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. Basic understanding of database concepts

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `jeressar-high-school`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Project API Key** (anon/public key)

## Step 3: Configure the Website

1. Open `supabase-config.js` in your website files
2. Replace the placeholder values:

```javascript
// Replace these with your actual Supabase project credentials
this.supabaseUrl = 'https://your-project-id.supabase.co'; // Your Project URL
this.supabaseKey = 'your-anon-key-here'; // Your anon/public key
```

## Step 4: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `database-schema.sql`
3. Paste it into the SQL Editor
4. Click **Run** to execute the SQL commands

This will create:
- `contact_submissions` table for contact form data
- `admission_applications` table for admission form data
- Proper indexes for performance
- Row Level Security (RLS) policies for data protection
- Helpful views for statistics

## Step 5: Test the Integration

1. Upload your website files to your web server
2. Visit the contact page and submit a test message
3. Visit the admissions page and submit a test application
4. Check your Supabase dashboard:
   - Go to **Table Editor**
   - Select `contact_submissions` or `admission_applications`
   - Verify your test data appears

## Step 6: View Submitted Data

### Using Supabase Dashboard
1. Go to **Table Editor** in your Supabase dashboard
2. Select the table you want to view:
   - `contact_submissions` - for contact form submissions
   - `admission_applications` - for admission applications
3. Browse, filter, and export data as needed

### Using SQL Queries
You can also run custom queries in the **SQL Editor**:

```sql
-- Get all contact submissions from today
SELECT * FROM contact_submissions 
WHERE DATE(submitted_at) = CURRENT_DATE
ORDER BY submitted_at DESC;

-- Get admission applications by status
SELECT first_name, last_name, email, application_id, status, submitted_at
FROM admission_applications 
WHERE status = 'pending_review'
ORDER BY submitted_at DESC;

-- Get application statistics
SELECT * FROM application_stats;

-- Get contact statistics  
SELECT * FROM contact_stats;
```

## Security Features

The integration includes several security features:

1. **Row Level Security (RLS)**: Prevents unauthorized access to data
2. **Input Validation**: Client-side and server-side validation
3. **Anon Key Usage**: Only allows inserting data, not reading (for public forms)
4. **Authenticated Access**: Admin functions require authentication

## Data Structure

### Contact Submissions Table
- `id`: Unique identifier
- `first_name`, `last_name`: Contact person's name
- `email`: Contact email address
- `phone`: Phone number (optional)
- `subject`: Inquiry category
- `message`: Message content
- `submitted_at`: Submission timestamp
- `status`: Processing status (new, in_progress, resolved, closed)

### Admission Applications Table
- `id`: Unique identifier
- `application_id`: Human-readable application ID (e.g., JHS20240001)
- Student information (name, DOB, gender)
- Program selection (O-Level/A-Level, boarding status)
- Contact information
- Previous education details
- Parent/guardian information
- Special needs information
- `submitted_at`: Submission timestamp
- `status`: Application status (pending_review, under_review, approved, rejected, waitlisted)

## Troubleshooting

### Forms Not Submitting
1. Check browser console for JavaScript errors
2. Verify Supabase credentials in `supabase-config.js`
3. Ensure database tables are created correctly
4. Check network connectivity to Supabase

### Data Not Appearing
1. Verify RLS policies are set correctly
2. Check if you're looking at the right table
3. Refresh the Supabase dashboard
4. Check for any SQL errors in the browser console

### Common Errors
- **"Failed to fetch"**: Usually a network or CORS issue
- **"Invalid API key"**: Check your anon key is correct
- **"Row Level Security"**: Ensure RLS policies are properly configured

## Next Steps

1. **Email Notifications**: Set up email notifications for new submissions using Supabase Edge Functions
2. **Admin Dashboard**: Create an admin interface to manage submissions
3. **Data Export**: Set up automated data exports or reports
4. **Analytics**: Add analytics to track form conversion rates

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the Supabase documentation at [docs.supabase.com](https://docs.supabase.com)
3. Check the form validation and ensure all required fields are filled

## Security Best Practices

1. **Never expose your service role key** in client-side code
2. **Use RLS policies** to control data access
3. **Validate data** both client-side and server-side
4. **Monitor your usage** to prevent abuse
5. **Backup your data** regularly

---

**Note**: This integration uses Supabase's free tier, which includes:
- Up to 50,000 monthly active users
- Up to 500MB database space
- Up to 1GB file storage
- Up to 2GB bandwidth

For higher usage, consider upgrading to a paid plan.