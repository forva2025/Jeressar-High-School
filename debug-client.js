// DEBUG VERSION - Enhanced error reporting for troubleshooting
// Temporarily replace supabase-client.js with this file to get detailed error info

class DebugSupabaseClient {
    constructor() {
        // Your credentials - update these!
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🔧 DEBUG MODE: Starting Supabase initialization...');
            
            // Check credentials
            if (this.supabaseUrl === 'YOUR_SUPABASE_URL' || this.supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
                throw new Error('❌ CREDENTIALS NOT UPDATED! Please update supabaseUrl and supabaseKey in debug-client.js');
            }
            
            console.log('✅ Credentials appear to be updated');
            console.log('🔗 URL:', this.supabaseUrl);
            console.log('🔑 Key (first 20 chars):', this.supabaseKey.substring(0, 20) + '...');
            
            // Load Supabase library
            if (typeof supabase === 'undefined') {
                console.log('📦 Loading Supabase library...');
                await this.loadSupabaseScript();
                console.log('✅ Supabase library loaded');
            }
            
            // Initialize client
            console.log('🔄 Creating Supabase client...');
            this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
            this.isInitialized = true;
            console.log('✅ Supabase client created successfully');
            
            // Test connection
            await this.debugConnection();
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showDebugError(error.message);
        }
    }

    loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Supabase library'));
            document.head.appendChild(script);
        });
    }

    async debugConnection() {
        try {
            console.log('🧪 Testing database connection...');
            
            // Test 1: Basic connection
            const { data: basicTest, error: basicError } = await this.supabase
                .from('contact_submissions')
                .select('count')
                .limit(1);
            
            if (basicError) {
                console.error('❌ Basic connection test failed:', basicError);
                console.log('📋 Error details:', {
                    message: basicError.message,
                    details: basicError.details,
                    hint: basicError.hint,
                    code: basicError.code
                });
                
                if (basicError.message.includes('relation') && basicError.message.includes('does not exist')) {
                    console.log('🚨 TABLES NOT FOUND! Run EMERGENCY_FIX.sql in Supabase SQL Editor');
                }
            } else {
                console.log('✅ Basic connection successful');
            }
            
            // Test 2: Insert permission test
            console.log('🧪 Testing insert permissions...');
            const testData = {
                first_name: 'Debug',
                last_name: 'Test',
                email: 'debug@test.com',
                subject: 'other',
                message: 'Debug test message',
                submitted_at: new Date().toISOString(),
                status: 'new'
            };
            
            const { data: insertTest, error: insertError } = await this.supabase
                .from('contact_submissions')
                .insert([testData])
                .select();
            
            if (insertError) {
                console.error('❌ Insert permission test failed:', insertError);
                console.log('📋 Insert error details:', {
                    message: insertError.message,
                    details: insertError.details,
                    hint: insertError.hint,
                    code: insertError.code
                });
                
                if (insertError.message.includes('row-level security')) {
                    console.log('🚨 RLS POLICY ERROR! Run EMERGENCY_FIX.sql to fix permissions');
                }
                if (insertError.message.includes('permission denied')) {
                    console.log('🚨 PERMISSION DENIED! Anon role needs INSERT permissions');
                }
            } else {
                console.log('✅ Insert permission test successful!');
                console.log('📊 Inserted data:', insertTest[0]);
                
                // Clean up test data
                await this.supabase
                    .from('contact_submissions')
                    .delete()
                    .eq('email', 'debug@test.com');
                console.log('🧹 Test data cleaned up');
            }
            
        } catch (error) {
            console.error('❌ Connection debug failed:', error);
        }
    }

    showDebugError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #fee2e2; color: #991b1b;
            padding: 16px; border-radius: 8px; border: 1px solid #fecaca; max-width: 500px;
            z-index: 10000; font-family: Arial, sans-serif; font-size: 14px;
        `;
        errorDiv.innerHTML = `
            <strong>🔧 DEBUG MODE - Database Error</strong><br>
            ${message}<br>
            <small>Check browser console for detailed logs.</small>
        `;
        document.body.appendChild(errorDiv);
    }

    async submitContactForm(formData) {
        try {
            console.log('🔧 DEBUG: Starting contact form submission...');
            console.log('📊 Form data received:', formData);
            
            if (!this.isInitialized) {
                throw new Error('Supabase client not initialized');
            }

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

            console.log('🔄 Prepared data for database:', contactData);
            console.log('🎯 Attempting database insert...');

            const { data, error } = await this.supabase
                .from('contact_submissions')
                .insert([contactData])
                .select();

            if (error) {
                console.error('❌ DATABASE INSERT FAILED:', error);
                console.log('📋 Detailed error information:');
                console.log('  Message:', error.message);
                console.log('  Details:', error.details);
                console.log('  Hint:', error.hint);
                console.log('  Code:', error.code);
                
                // Specific error diagnosis
                if (error.message.includes('row-level security')) {
                    console.log('🚨 DIAGNOSIS: Row Level Security policy blocking insert');
                    console.log('💡 SOLUTION: Run EMERGENCY_FIX.sql in Supabase SQL Editor');
                } else if (error.message.includes('permission denied')) {
                    console.log('🚨 DIAGNOSIS: Permission denied for anon role');
                    console.log('💡 SOLUTION: Grant INSERT permissions to anon role');
                } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
                    console.log('🚨 DIAGNOSIS: Table does not exist');
                    console.log('💡 SOLUTION: Run EMERGENCY_FIX.sql to create tables');
                }
                
                throw error;
            }

            console.log('✅ Contact form submitted successfully!');
            console.log('📊 Returned data:', data[0]);
            
            return {
                success: true,
                data: data[0],
                message: 'Your message has been sent successfully!'
            };

        } catch (error) {
            console.error('❌ Contact form submission error:', error);
            
            return {
                success: false,
                error: error.message,
                userMessage: error.message.includes('row-level security') 
                    ? 'Database security error. Please contact the administrator.'
                    : 'There was an error submitting your message. Please try again.'
            };
        }
    }

    async submitAdmissionForm(formData) {
        try {
            console.log('🔧 DEBUG: Starting admission form submission...');
            console.log('📊 Form data received:', formData);
            
            // Similar debug logic for admission form
            const applicationId = `JHS${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            
            const admissionData = {
                application_id: applicationId,
                first_name: formData.firstName?.trim(),
                last_name: formData.lastName?.trim(),
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                program: formData.program,
                boarding_status: formData.boardingStatus,
                email: formData.email?.trim().toLowerCase(),
                phone: formData.phone?.trim(),
                address: formData.address?.trim(),
                previous_school: formData.previousSchool?.trim(),
                last_class: formData.lastClass?.trim(),
                academic_achievements: formData.academicAchievements?.trim() || null,
                parent_name: formData.parentName?.trim(),
                parent_phone: formData.parentPhone?.trim(),
                parent_email: formData.parentEmail?.trim().toLowerCase() || null,
                parent_occupation: formData.parentOccupation?.trim() || null,
                special_needs: formData.specialNeeds?.trim() || null,
                declaration_accepted: formData.declaration === 'on' || formData.declaration === true,
                submitted_at: new Date().toISOString(),
                status: 'pending_review'
            };

            console.log('🔄 Prepared admission data:', admissionData);

            const { data, error } = await this.supabase
                .from('admission_applications')
                .insert([admissionData])
                .select();

            if (error) {
                console.error('❌ ADMISSION INSERT FAILED:', error);
                console.log('📋 Detailed error information:', error);
                throw error;
            }

            console.log('✅ Admission form submitted successfully!');
            console.log('📊 Returned data:', data[0]);
            
            return {
                success: true,
                data: data[0],
                applicationId: applicationId,
                message: `Application submitted successfully! Your Application ID is: ${applicationId}`
            };

        } catch (error) {
            console.error('❌ Admission form submission error:', error);
            
            return {
                success: false,
                error: error.message,
                userMessage: error.message.includes('row-level security') 
                    ? 'Database security error. Please contact the administrator.'
                    : 'There was an error submitting your application. Please try again.'
            };
        }
    }
}

// Initialize debug client
console.log('🔧 LOADING DEBUG CLIENT...');
const debugClient = new DebugSupabaseClient();
window.supabaseClient = debugClient;

console.log('🔧 DEBUG MODE ACTIVE - Check console for detailed logs');