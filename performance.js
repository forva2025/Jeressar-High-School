// Jeressar High School - Performance Optimization Script
// Advanced performance enhancements without altering existing pages

(function() {
    'use strict';

    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        }
    });
    
    if ('PerformanceObserver' in window) {
        performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }

    // Image lazy loading optimization
    function optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
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
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
        }
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            './resources/hero-education.jpg',
            './resources/school-crest.png',
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=Roboto:wght@300;400;500;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
                link.onload = function() {
                    this.rel = 'stylesheet';
                };
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            } else if (resource.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                link.as = 'image';
            }
            
            document.head.appendChild(link);
        });
    }

    // Optimize animations for performance
    function optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }

        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(el => {
                if (document.hidden) {
                    el.style.animationPlayState = 'paused';
                } else {
                    el.style.animationPlayState = 'running';
                }
            });
        });
    }

    // Resource hints for external CDNs
    function addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    // Optimize third-party scripts loading
    function optimizeThirdPartyScripts() {
        // Load non-critical scripts after page load
        window.addEventListener('load', () => {
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js'
            ];

            scripts.forEach((src, index) => {
                setTimeout(() => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    document.head.appendChild(script);
                }, index * 100);
            });
        });
    }

    // Critical CSS inlining
    function inlineCriticalCSS() {
        const criticalCSS = `
            .hero-image { background-attachment: scroll; }
            .nav-blur { backdrop-filter: blur(10px); }
            .card-hover { transition: all 0.3s ease; }
            .btn-primary { background: linear-gradient(135deg, #0080FF 0%, #003366 100%); }
            .animate-on-scroll { opacity: 0; transform: translateY(30px); }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Service Worker registration
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }

    // Initialize performance optimizations
    function init() {
        // Run immediately
        inlineCriticalCSS();
        addResourceHints();
        preloadCriticalResources();
        optimizeAnimations();
        registerServiceWorker();

        // Run after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                optimizeImages();
                optimizeThirdPartyScripts();
            });
        } else {
            optimizeImages();
            optimizeThirdPartyScripts();
        }
    }

    // Start optimizations
    init();

    // Export for manual triggering if needed
    window.JeressarPerformance = {
        optimizeImages,
        preloadCriticalResources,
        optimizeAnimations
    };

})();