// JavaScript Document

/*

TemplateMo 599 ChillZone Fashion

https://templatemo.com/tm-599-chillzone-fashion

*/

 // Hero Carousel - Card Flip Effect
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        let slideInterval;
        let isAnimating = false;

        function showSlide(index) {
            if (isAnimating || index === currentSlide) return;
            isAnimating = true;

            const prevIndex = currentSlide;
            
            console.log('Transitioning from slide', prevIndex, 'to slide', index);
            
            // Flip the current slide out
            slides[prevIndex].classList.add('flipped');
            slides[prevIndex].classList.remove('active');
            indicators[prevIndex].classList.remove('active');

            // Reset all slides that aren't the new active one
            slides.forEach((slide, i) => {
                if (i !== index && i !== prevIndex) {
                    slide.classList.remove('flipped', 'active');
                }
            });

            // After flip animation, activate new slide
            setTimeout(() => {
                slides[prevIndex].classList.remove('flipped');
                slides[index].classList.add('active');
                indicators[index].classList.add('active');
                currentSlide = index;
                isAnimating = false;
                console.log('Transition complete, now on slide', currentSlide);
            }, 600); // Half of the 1200ms duration
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Start automatic slideshow
        if (slides.length > 0) {
            console.log('Found', slides.length, 'slides');
            // Initialize first slide
            slides[0].classList.add('active');
            
            startSlideShow();
            
            // Manual navigation via indicators
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    stopSlideShow();
                    showSlide(index);
                    startSlideShow(); // Restart automatic slideshow
                });
            });

            // Pause on hover
            const carousel = document.querySelector('.hero-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', stopSlideShow);
                carousel.addEventListener('mouseleave', startSlideShow);
            }
        } else {
            console.log('No slides found!');
        }

        // Video Carousel - Card Flip Effect (Streamable Iframes)
        const videoSlides = document.querySelectorAll('.video-slide');
        const videoIndicators = document.querySelectorAll('.video-indicator');
        let currentVideoSlide = 0;
        let videoSlideInterval;
        let isVideoAnimating = false;
        let videoMutedStates = [false, false, false]; // Track mute state for each video

        function showVideoSlide(index) {
            if (isVideoAnimating || index === currentVideoSlide) return;
            isVideoAnimating = true;

            const prevIndex = currentVideoSlide;
            
            // Pause previous video by reloading without autoplay and with muted
            const prevIframe = document.getElementById(`video-${prevIndex}`);
            if (prevIframe) {
                let prevSrc = prevIframe.src;
                prevSrc = prevSrc.replace('autoplay=1', 'autoplay=0');
                prevSrc = prevSrc.replace('muted=0', 'muted=1');
                prevIframe.src = prevSrc;
            }
            
            // Flip the current slide out
            videoSlides[prevIndex].classList.remove('active');
            videoIndicators[prevIndex].classList.remove('active');

            // Reset all slides that aren't the new active one
            videoSlides.forEach((slide, i) => {
                if (i !== index && i !== prevIndex) {
                    slide.classList.remove('active');
                    const iframe = document.getElementById(`video-${i}`);
                    if (iframe) {
                        let src = iframe.src;
                        src = src.replace('autoplay=1', 'autoplay=0');
                        src = src.replace('muted=0', 'muted=1');
                        iframe.src = src;
                    }
                }
            });

            // Activate new slide and enable autoplay with sound
            videoSlides[index].classList.add('active');
            videoIndicators[index].classList.add('active');
            
            const newIframe = document.getElementById(`video-${index}`);
            if (newIframe) {
                let newSrc = newIframe.src;
                newSrc = newSrc.replace('autoplay=0', 'autoplay=1');
                newSrc = newSrc.replace('muted=1', 'muted=0');
                newIframe.src = newSrc;
            }
            
            // Update navigation title based on current video
            const videoTitle = videoSlides[index].querySelector('.video-info h3').textContent;
            const navTitle = document.querySelector('.video-nav-title');
            if (navTitle) {
                navTitle.textContent = videoTitle;
            }
            
            currentVideoSlide = index;
            isVideoAnimating = false;
        }

        function nextVideoSlide() {
            const nextIndex = (currentVideoSlide + 1) % videoSlides.length;
            showVideoSlide(nextIndex);
        }

        function prevVideoSlide() {
            const prevIndex = (currentVideoSlide - 1 + videoSlides.length) % videoSlides.length;
            showVideoSlide(prevIndex);
        }

        function startVideoSlideShow() {
            // Videos will auto-advance when they finish
        }

        function stopVideoSlideShow() {
            clearInterval(videoSlideInterval);
        }

        // Video control functions
        function toggleMute(videoIndex) {
            const iframe = document.getElementById(`video-${videoIndex}`);
            const muteBtn = document.getElementById(`mute-btn-${videoIndex}`);
            
            if (iframe) {
                videoMutedStates[videoIndex] = !videoMutedStates[videoIndex];
                const newSrc = iframe.src.replace(/muted=\d/, `muted=${videoMutedStates[videoIndex] ? 1 : 0}`);
                iframe.src = newSrc;
                
                muteBtn.textContent = videoMutedStates[videoIndex] ? '🔇' : '🔊';
            }
        }

        function restartVideo(videoIndex) {
            const iframe = document.getElementById(`video-${videoIndex}`);
            if (iframe) {
                // Reload the iframe to restart the video
                const currentSrc = iframe.src;
                iframe.src = currentSrc;
            }
        }

        function toggleFullscreen(videoIndex) {
            const iframe = document.getElementById(`video-${videoIndex}`);
            if (iframe) {
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                }
            }
        }

        // Listen for Streamable video end events
        window.addEventListener('message', (event) => {
            if (event.data && event.data.event === 'ended') {
                console.log('Video ended, advancing to next slide');
                nextVideoSlide();
            }
        });

        // Make functions globally accessible
        window.toggleMute = toggleMute;
        window.restartVideo = restartVideo;
        window.toggleFullscreen = toggleFullscreen;
        window.nextVideoSlide = nextVideoSlide;
        window.prevVideoSlide = prevVideoSlide;

        // Start video carousel
        if (videoSlides.length > 0) {
            console.log('Found', videoSlides.length, 'video slides');
            
            // Initialize navigation title with first video title
            const firstVideoTitle = videoSlides[0].querySelector('.video-info h3').textContent;
            const navTitle = document.querySelector('.video-nav-title');
            if (navTitle) {
                navTitle.textContent = firstVideoTitle;
            }
            
            // Manual navigation via indicators
            videoIndicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    showVideoSlide(index);
                });
            });

            // Videos will auto-advance when they finish via postMessage
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Navbar scroll effect and scroll spy
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            const scrollY = window.pageYOffset;
            const navHeight = navbar.offsetHeight;
            
            // Navbar background on scroll
            if (scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Scroll spy for active navigation
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - navHeight - 10;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
            
            // Special case for home when at the very top
            if (scrollY < 100) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#home') {
                        link.classList.add('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('resize', updateActiveNav); // Update on resize
        updateActiveNav(); // Call on load

        // Category filter
        const tabButtons = document.querySelectorAll('.tab-btn');
        const collectionCards = document.querySelectorAll('.collection-card');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active button
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter cards
                collectionCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.animation = 'fadeInUp 0.6s ease forwards';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Get navbar height dynamically (it changes on medium screens)
                    const navHeight = navbar.offsetHeight;
                    let offsetTop;
                    
                    // If scrolling to home, go to top
                    if (targetId === '#home') {
                        offsetTop = 0;
                    } else {
                        // For all other sections, position them right at the top of viewport
                        // just below the navbar to completely hide previous content
                        offsetTop = target.offsetTop - navHeight;
                    }
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-content');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Contact form handling
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);
                
                // Animate submit button
                const submitBtn = contactForm.querySelector('.form-submit');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
                submitBtn.disabled = true;
                
                // Simulate sending (replace with actual API call)
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent! ✓';
                    submitBtn.style.background = '#4CAF50';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.style.opacity = '';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            });
        }

        // Form input animations
        const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'translateY(-2px)';
            });
            input.addEventListener('blur', () => {
                input.parentElement.style.transform = '';
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.featured-container, .contact-content').forEach(el => {
            observer.observe(el);
        });