// Jeressar High School - Main JavaScript File
// Premium animations and interactions for school website

class JeressarHighSchool {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupScrollAnimations();
        this.initializeTypewriter();
        this.setupFormValidation();
        this.initializeCarousels();
        this.setupResponsiveImages();
        this.setupTouchOptimizations();
    }

    setupEventListeners() {
        // Enhanced Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (mobileMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking on menu links
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    initializeAnimations() {
        // Initialize Anime.js animations
        if (typeof anime !== 'undefined') {
            // Hero section entrance animation
            anime.timeline({
                easing: 'easeOutExpo',
                duration: 1000
            })
            .add({
                targets: '.hero-title',
                opacity: [0, 1],
                translateY: [50, 0],
                delay: 500
            })
            .add({
                targets: '.hero-subtitle',
                opacity: [0, 1],
                translateY: [30, 0],
                delay: 200
            }, '-=800')
            .add({
                targets: '.hero-buttons .btn',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100)
            }, '-=600');

            // Card hover animations
            document.querySelectorAll('.card-hover').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    anime({
                        targets: card,
                        scale: 1.05,
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: '0 20px 40px rgba(0, 128, 255, 0.2)',
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    anime({
                        targets: card,
                        scale: 1,
                        rotateX: 0,
                        rotateY: 0,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                });
            });
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Stagger animation for multiple elements
                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.querySelectorAll('.stagger-item');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate-in');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initializeTypewriter() {
        // Initialize Typed.js for hero text
        if (typeof Typed !== 'undefined') {
            const heroTitle = document.querySelector('.hero-typewriter');
            if (heroTitle) {
                new Typed('.hero-typewriter', {
                    strings: [
                        'Shaping Tomorrow\'s Leaders',
                        'God our Hope',
                        'Building Future Innovators'
                    ],
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
            }
        }
    }

    setupFormValidation() {
        // Real-time form validation
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            this.removeFieldError(field);
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validate all fields
        let isFormValid = true;
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                this.showFormSuccess(form);
                form.reset();
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;
            }, 2000);
        } else {
            this.showFormError(form, 'Please correct the errors above');
        }
    }

    showFormSuccess(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you soon.</p>
        `;
        
        form.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    showFormError(form, message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.innerHTML = `
            <div class="error-icon">✗</div>
            <p>${message}</p>
        `;
        
        form.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }

    initializeCarousels() {
        // Initialize Splide carousels
        if (typeof Splide !== 'undefined') {
            // Testimonials carousel
            const testimonialCarousel = document.querySelector('.testimonial-carousel');
            if (testimonialCarousel) {
                new Splide(testimonialCarousel, {
                    type: 'loop',
                    perPage: 1,
                    autoplay: true,
                    interval: 5000,
                    arrows: false,
                    pagination: true,
                    gap: '2rem'
                }).mount();
            }

            // Image gallery carousel
            const imageCarousel = document.querySelector('.image-carousel');
            if (imageCarousel) {
                new Splide(imageCarousel, {
                    type: 'loop',
                    perPage: 3,
                    perMove: 1,
                    autoplay: true,
                    interval: 4000,
                    gap: '1rem',
                    breakpoints: {
                        768: {
                            perPage: 1
                        },
                        1024: {
                            perPage: 2
                        }
                    }
                }).mount();
            }
        }
    }

    setupResponsiveImages() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Responsive image sizing
        const responsiveImages = document.querySelectorAll('.responsive-img');
        responsiveImages.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        });
    }

    setupTouchOptimizations() {
        // Touch-friendly interactions
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Add touch feedback to buttons
            const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .premium-card');
            buttons.forEach(button => {
                button.addEventListener('touchstart', () => {
                    button.classList.add('touch-active');
                });
                
                button.addEventListener('touchend', () => {
                    setTimeout(() => {
                        button.classList.remove('touch-active');
                    }, 150);
                });
            });
        }

        // Prevent zoom on double tap for iOS
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize scroll performance
        let ticking = false;
        const updateScrollPosition = () => {
            const scrollTop = window.pageYOffset;
            const nav = document.querySelector('nav');
            
            if (scrollTop > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JeressarHighSchool();
});

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .animate-on-scroll.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .stagger-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease-out;
    }

    .stagger-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .form-success, .form-error {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        animation: slideIn 0.3s ease-out;
    }

    .form-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .form-error {
        background: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .success-icon, .error-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .field-error {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    input.error, textarea.error {
        border-color: #dc3545;
    }

    input.valid, textarea.valid {
        border-color: #28a745;
    }
`;
document.head.appendChild(style);