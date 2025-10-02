// Supabase Configuration for Jeressar High School
// This file handles the connection to Supabase database

class SupabaseClient {
    constructor() {
        // Replace these with your actual Supabase project credentials
        this.supabaseUrl = 'https://pprjaisodqcwpozqqsmq.supabase.co'; // e.g., 'https://your-project.supabase.co'
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcmphaXNvZHFjd3BvenFxc21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODQxNzksImV4cCI6MjA3NDk2MDE3OX0.A0_LRSuogcxln5VbTJApHuyRRwJ80RfeuY71lSad0dE'; // Your public anon key
        this.supabase = null;
        this.init();
    }

    async init() {
        try {
            // Load Supabase client from CDN
            if (typeof supabase === 'undefined') {
                await this.loadSupabaseScript();
            }
            
            // Initialize Supabase client
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            console.log('Supabase client initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    }

    loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Contact form submission
    async submitContactForm(formData) {
        try {
            const contactData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone || null,
                subject: formData.subject,
                message: formData.message,
                submitted_at: new Date().toISOString(),
                status: 'new'
            };

            const { data, error } = await this.supabase
                .from('contact_submissions')
                .insert([contactData])
                .select();

            if (error) {
                throw error;
            }

            console.log('Contact form submitted successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error submitting contact form:', error);
            return { success: false, error: error.message };
        }
    }

    // Admissions form submission
    async submitAdmissionForm(formData) {
        try {
            const admissionData = {
                // Student Information
                first_name: formData.firstName,
                last_name: formData.lastName,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                
                // Program Selection
                program: formData.program,
                boarding_status: formData.boardingStatus,
                
                // Contact Information
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                
                // Previous Education
                previous_school: formData.previousSchool,
                last_class: formData.lastClass,
                academic_achievements: formData.academicAchievements || null,
                
                // Parent/Guardian Information
                parent_name: formData.parentName,
                parent_phone: formData.parentPhone,
                parent_email: formData.parentEmail || null,
                parent_occupation: formData.parentOccupation || null,
                
                // Additional Information
                special_needs: formData.specialNeeds || null,
                declaration_accepted: formData.declaration === 'on',
                
                // Metadata
                submitted_at: new Date().toISOString(),
                status: 'pending_review',
                application_id: this.generateApplicationId()
            };

            const { data, error } = await this.supabase
                .from('admission_applications')
                .insert([admissionData])
                .select();

            if (error) {
                throw error;
            }

            console.log('Admission form submitted successfully:', data);
            return { success: true, data, applicationId: admissionData.application_id };
        } catch (error) {
            console.error('Error submitting admission form:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate unique application ID
    generateApplicationId() {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `JHS${year}${randomNum}`;
    }

    // Get all contact submissions (for admin use)
    async getContactSubmissions(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .select('*')
                .order('submitted_at', { ascending: false })
                .limit(limit);

            if (error) {
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching contact submissions:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all admission applications (for admin use)
    async getAdmissionApplications(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('admission_applications')
                .select('*')
                .order('submitted_at', { ascending: false })
                .limit(limit);

            if (error) {
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error fetching admission applications:', error);
            return { success: false, error: error.message };
        }
    }

    // Update submission status
    async updateContactStatus(id, status) {
        try {
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error updating contact status:', error);
            return { success: false, error: error.message };
        }
    }

    // Update application status
    async updateApplicationStatus(id, status) {
        try {
            const { data, error } = await this.supabase
                .from('admission_applications')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            return { success: true, data };
        } catch (error) {
            console.error('Error updating application status:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize Supabase client
const supabaseClient = new SupabaseClient();

// Export for use in other files
window.supabaseClient = supabaseClient;