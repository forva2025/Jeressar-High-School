// Jeressar High School - Supabase Client Configuration
// Complete database integration for contact and admission forms

class JeressarSupabaseClient {
    constructor() {
        // TODO: Replace with your actual Supabase credentials
        this.supabaseUrl = 'https://ixhdhhexjvacfyrjzwhc.supabase.co'; // e.g., 'https://your-project-id.supabase.co'
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aGRoaGV4anZhY2Z5cmp6d2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTU1MzUsImV4cCI6MjA3NDk3MTUzNX0.qR4QsbwqtzkSfBF1MzDvrwVfhNIMAklMjkd4R3fUSJw'; // Your anon/public key
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🔄 Initializing Supabase client...');
            
            // Load Supabase client from CDN if not already loaded
            if (typeof supabase === 'undefined') {
                await this.loadSupabaseScript();
            }
            
            // Validate credentials
            if (this.supabaseUrl === 'YOUR_SUPABASE_URL' || this.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
                throw new Error('Please update your Supabase credentials in supabase-client.js');
            }
            
            // Initialize Supabase client
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            this.isInitialized = true;
            
            console.log('✅ Supabase client initialized successfully');
            console.log('🔗 Connected to:', this.supabaseUrl);
            
            // Test connection
            await this.testConnection();
            
        } catch (error) {
            console.error('❌ Error initializing Supabase:', error);
            this.showInitializationError(error.message);
        }
    }

    loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            console.log('📦 Loading Supabase client library...');
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                console.log('✅ Supabase library loaded');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Supabase library'));
            document.head.appendChild(script);
        });
    }

    async testConnection() {
        try {
            console.log('🧪 Testing database connection...');
            
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .select('count')
                .limit(1);
            
            if (error) {
                console.warn('⚠️ Connection test warning:', error.message);
            } else {
                console.log('✅ Database connection successful');
            }
        } catch (error) {
            console.warn('⚠️ Connection test failed:', error.message);
        }
    }

    showInitializationError(message) {
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'supabase-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            color: #991b1b;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #fecaca;
            max-width: 400px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        errorDiv.innerHTML = `
            <strong>Database Configuration Error</strong><br>
            ${message}<br>
            <small>Please check the browser console for details.</small>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => errorDiv.remove(), 10000);
    }

    // =============================================
    // CONTACT FORM SUBMISSION
    // =============================================
    async submitContactForm(formData) {
        try {
            if (!this.isInitialized) {
                throw new Error('Supabase client not initialized');
            }

            console.log('📝 Submitting contact form...');
            console.log('📊 Form data:', formData);

            // Prepare contact data
            const contactData = {
                first_name: formData.firstName?.trim(),
                last_name: formData.lastName?.trim(),
                email: formData.email?.trim().toLowerCase(),
                phone: formData.phone?.trim() || null,
                subject: formData.subject,
                message: formData.message?.trim(),
                submitted_at: new Date().toISOString(),
                status: 'new'
            };

            // Validate required fields
            const requiredFields = ['first_name', 'last_name', 'email', 'subject', 'message'];
            for (const field of requiredFields) {
                if (!contactData[field]) {
                    throw new Error(`Missing required field: ${field.replace('_', ' ')}`);
                }
            }

            console.log('🔄 Inserting into database...');
            
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .insert([contactData])
                .select();

            if (error) {
                console.error('❌ Database error:', error);
                throw error;
            }

            console.log('✅ Contact form submitted successfully:', data[0]);
            
            return {
                success: true,
                data: data[0],
                message: 'Your message has been sent successfully!'
            };

        } catch (error) {
            console.error('❌ Contact form submission error:', error);
            
            let userMessage = 'There was an error submitting your message. Please try again.';
            
            if (error.message.includes('row-level security')) {
                userMessage = 'Database security error. Please contact the administrator.';
            } else if (error.message.includes('Missing required field')) {
                userMessage = error.message;
            }
            
            return {
                success: false,
                error: error.message,
                userMessage: userMessage
            };
        }
    }

    // =============================================
    // ADMISSION FORM SUBMISSION
    // =============================================
    async submitAdmissionForm(formData) {
        try {
            if (!this.isInitialized) {
                throw new Error('Supabase client not initialized');
            }

            console.log('🎓 Submitting admission application...');
            console.log('📊 Form data:', formData);

            // Generate unique application ID
            const applicationId = await this.generateApplicationId();
            
            // Prepare admission data
            const admissionData = {
                application_id: applicationId,
                
                // Student Information
                first_name: formData.firstName?.trim(),
                last_name: formData.lastName?.trim(),
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                
                // Program Selection
                program: formData.program,
                boarding_status: formData.boardingStatus,
                
                // Contact Information
                email: formData.email?.trim().toLowerCase(),
                phone: formData.phone?.trim(),
                address: formData.address?.trim(),
                
                // Previous Education
                previous_school: formData.previousSchool?.trim(),
                last_class: formData.lastClass?.trim(),
                academic_achievements: formData.academicAchievements?.trim() || null,
                
                // Parent/Guardian Information
                parent_name: formData.parentName?.trim(),
                parent_phone: formData.parentPhone?.trim(),
                parent_email: formData.parentEmail?.trim().toLowerCase() || null,
                parent_occupation: formData.parentOccupation?.trim() || null,
                
                // Additional Information
                special_needs: formData.specialNeeds?.trim() || null,
                declaration_accepted: formData.declaration === 'on' || formData.declaration === true,
                
                // Metadata
                submitted_at: new Date().toISOString(),
                status: 'pending_review'
            };

            // Validate required fields
            const requiredFields = [
                'first_name', 'last_name', 'date_of_birth', 'gender',
                'program', 'boarding_status', 'email', 'phone', 'address',
                'previous_school', 'last_class', 'parent_name', 'parent_phone'
            ];
            
            for (const field of requiredFields) {
                if (!admissionData[field]) {
                    throw new Error(`Missing required field: ${field.replace('_', ' ')}`);
                }
            }

            // Validate declaration
            if (!admissionData.declaration_accepted) {
                throw new Error('You must accept the declaration to submit the application');
            }

            console.log('🔄 Inserting application into database...');
            
            const { data, error } = await this.supabase
                .from('admission_applications')
                .insert([admissionData])
                .select();

            if (error) {
                console.error('❌ Database error:', error);
                throw error;
            }

            console.log('✅ Admission application submitted successfully:', data[0]);
            
            return {
                success: true,
                data: data[0],
                applicationId: applicationId,
                message: `Application submitted successfully! Your Application ID is: ${applicationId}`
            };

        } catch (error) {
            console.error('❌ Admission form submission error:', error);
            
            let userMessage = 'There was an error submitting your application. Please try again.';
            
            if (error.message.includes('row-level security')) {
                userMessage = 'Database security error. Please contact the administrator.';
            } else if (error.message.includes('Missing required field')) {
                userMessage = error.message;
            } else if (error.message.includes('declaration')) {
                userMessage = error.message;
            }
            
            return {
                success: false,
                error: error.message,
                userMessage: userMessage
            };
        }
    }

    // =============================================
    // UTILITY FUNCTIONS
    // =============================================
    async generateApplicationId() {
        try {
            // Use the database function to generate unique ID
            const { data, error } = await this.supabase.rpc('generate_application_id');
            
            if (error || !data) {
                // Fallback to client-side generation
                const year = new Date().getFullYear();
                const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                return `JHS${year}${randomNum}`;
            }
            
            return data;
        } catch (error) {
            console.warn('⚠️ Using fallback application ID generation');
            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `JHS${year}${randomNum}`;
        }
    }

    // =============================================
    // ADMIN FUNCTIONS (for authenticated users)
    // =============================================
    async getContactSubmissions(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .select('*')
                .order('submitted_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching contact submissions:', error);
            return { success: false, error: error.message };
        }
    }

    async getAdmissionApplications(limit = 50) {
        try {
            const { data, error } = await this.supabase
                .from('admission_applications')
                .select('*')
                .order('submitted_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching admission applications:', error);
            return { success: false, error: error.message };
        }
    }

    async updateContactStatus(id, status) {
        try {
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating contact status:', error);
            return { success: false, error: error.message };
        }
    }

    async updateApplicationStatus(id, status) {
        try {
            const { data, error } = await this.supabase
                .from('admission_applications')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating application status:', error);
            return { success: false, error: error.message };
        }
    }

    async getStatistics() {
        try {
            const [contactStats, admissionStats] = await Promise.all([
                this.supabase.from('contact_statistics').select('*').single(),
                this.supabase.from('admission_statistics').select('*').single()
            ]);

            return {
                success: true,
                data: {
                    contacts: contactStats.data,
                    admissions: admissionStats.data
                }
            };
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize the Supabase client
console.log('🚀 Loading Jeressar High School Supabase Client...');
const jeressarSupabaseClient = new JeressarSupabaseClient();

// Export for global use
window.supabaseClient = jeressarSupabaseClient;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JeressarSupabaseClient;
}