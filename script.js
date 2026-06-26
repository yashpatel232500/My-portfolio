/**
 * FUTURISTIC PORTFOLIO SCRIPTS
 * Includes: Particle Canvas, Typewriter, Scroll Reveals, Active Nav, Certificate Lightbox, Card Glows
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION TOGGLE
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksList = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked (mobile)
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. TYPEWRITER EFFECT
    // ==========================================
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const words = JSON.parse(typewriterEl.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                currentText = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typewriterEl.textContent = currentText;

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at completion
                typeSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                // Pause before starting next word
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        
        // Start typewriter
        setTimeout(type, 800);
    }

    // ==========================================
    // 3. INTERACTIVE PARTICLE CANVAS BACKGROUND
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let mouse = {
            x: null,
            y: null,
            radius: 120
        };

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }
        
        window.addEventListener('resize', resizeCanvas);
        
        // Track Mouse
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        // Mouse leaves window
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            
            // Draw particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            
            // Update particle state
            update() {
                // Bounce off screen limits
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Check mouse collision / interaction
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius + this.size) {
                        // Push particles away slightly from cursor
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        
                        this.x -= forceDirectionX * force * 3;
                        this.y -= forceDirectionY * force * 3;
                    }
                }

                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;
                
                this.draw();
            }
        }

        // Initialize Particle Array
        function initParticles() {
            particlesArray = [];
            
            // Adjust particle count based on screen width (performance optimization)
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
            if (numberOfParticles > 120) numberOfParticles = 120; // Cap max particles
            if (numberOfParticles < 30) numberOfParticles = 30;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                
                // Random speeds
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                
                // Color choices: subtle cyan or subtle purple
                let color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(157, 78, 221, 0.3)';
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Connect nearby particles with lines
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Connect if close
                    if (distance < 110) {
                        opacityValue = 1 - (distance / 110);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        // Start
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        animate();
    }

    // ==========================================
    // 4. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once revealed
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================
    // 5. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinksArray = Array.from(navLinksList);

    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust threshold to match navbar height
            if (window.scrollY >= sectionTop - 120) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. GLASS CARD DYNAMIC GLOW (MOUSETRACKING)
    // ==========================================
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // ==========================================
    // 7. CERTIFICATE LIGHTBOX MODAL
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxIframe = document.getElementById('lightbox-iframe');
    const lightboxPdfLink = document.getElementById('lightbox-pdf-link');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const certCards = document.querySelectorAll('.cert-card');

    if (lightbox && closeBtn) {
        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.cert-title').textContent;
                const issuer = card.querySelector('.cert-issuer').textContent;
                const pdfPath = card.getAttribute('data-pdf');
                
                lightbox.classList.add('show');
                lightboxCaption.textContent = `${issuer} // ${title}`;
                
                if (pdfPath) {
                    // Set iframe source for PDF
                    lightboxIframe.src = pdfPath;
                    lightboxIframe.style.display = 'block';
                    lightboxImg.style.display = 'none';
                    
                    // Set download/view link
                    if (lightboxPdfLink) {
                        lightboxPdfLink.href = pdfPath;
                        lightboxPdfLink.style.display = 'inline-flex';
                    }
                } else {
                    // Fallback to image zoom
                    const img = card.querySelector('.cert-img');
                    if (img && lightboxImg) {
                        lightboxImg.src = img.src;
                        lightboxImg.style.display = 'block';
                    }
                    lightboxIframe.style.display = 'none';
                    if (lightboxPdfLink) {
                        lightboxPdfLink.style.display = 'none';
                    }
                }
                
                // Disable scrolling behind modal
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal function
        function closeLightbox() {
            lightbox.classList.remove('show');
            // Reset iframe source to stop background rendering
            if (lightboxIframe) {
                lightboxIframe.src = '';
            }
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        
        // Close when clicking outside the certificate wrapper
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    // ==========================================
    // 8. CURSOR GLOW TRAIL
    // ==========================================
    const cursorTrail = document.createElement('div');
    cursorTrail.id = 'cursor-trail';
    document.body.appendChild(cursorTrail);

    let trailX = 0, trailY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        trailX = e.clientX;
        trailY = e.clientY;
        cursorTrail.style.opacity = '1';
    });

    window.addEventListener('mouseout', () => {
        cursorTrail.style.opacity = '0';
    });

    function animateTrail() {
        currentX += (trailX - currentX) * 0.12;
        currentY += (trailY - currentY) * 0.12;
        cursorTrail.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // ==========================================
    // 9. ANIMATED SKILL BARS
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const targetPct = parseInt(bar.getAttribute('data-pct'), 10);
                    const pctLabel = bar.closest('.skill-item')?.querySelector('.skill-pct');

                    bar.style.width = targetPct + '%';

                    if (pctLabel) {
                        let count = 0;
                        const step = Math.ceil(targetPct / 60);
                        const counter = setInterval(() => {
                            count = Math.min(count + step, targetPct);
                            pctLabel.textContent = count + '%';
                            if (count >= targetPct) clearInterval(counter);
                        }, 20);
                    }

                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // ==========================================
    // 10. ROCKET BACK-TO-TOP BUTTON
    // ==========================================
    const rocketBtn = document.createElement('button');
    rocketBtn.id = 'rocket-btn';
    rocketBtn.setAttribute('aria-label', 'Back to top');
    rocketBtn.innerHTML = '🚀';
    document.body.appendChild(rocketBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            rocketBtn.classList.add('visible');
        } else {
            rocketBtn.classList.remove('visible');
        }
    });

    rocketBtn.addEventListener('click', () => {
        rocketBtn.classList.add('fired');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => rocketBtn.classList.remove('fired'), 700);
    });

    // ==========================================
    // 11. CONTACT FORM SUBMISSION HANDLER
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show sending status
            formStatus.textContent = 'TRANSMITTING SIGNAL...';
            formStatus.className = 'form-status font-mono text-cyan';
            
            // Simulate API Request (e.g. static endpoint / Formspree)
            setTimeout(() => {
                formStatus.textContent = 'SIGNAL ESTABLISHED. MESSAGE TRANSMITTED SUCCESSFULLY.';
                formStatus.className = 'form-status font-mono success';
                contactForm.reset();
                
                // Clear message after 5 seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            }, 1500);
        });
    }
});


// ==========================================
// 14. RESUME TOGGLE
// ==========================================
function toggleResume() {
    const viewer = document.getElementById('resumeViewer');
    const btn = document.getElementById('resumeToggleBtn');
    if (!viewer || !btn) return;

    const isOpen = viewer.classList.toggle('open');
    btn.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>Close CV`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>View CV`;

    if (isOpen) {
        setTimeout(() => {
            viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}