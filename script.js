// ===== SIN CITY - AC/DC TRIBUTE BAND =====
// Stiff Upper Lip Edition

document.addEventListener('DOMContentLoaded', () => {

    // ===== LANGUAGE SYSTEM =====
    let currentLang = localStorage.getItem('sincity-lang') || 'it';

    const langBtns = document.querySelectorAll('.lang-btn');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('sincity-lang', lang);

        // Update button states
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update all translatable elements
        document.querySelectorAll('[data-it][data-en]').forEach(el => {
            el.textContent = el.dataset[lang];
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-it][data-placeholder-en]').forEach(el => {
            el.placeholder = el.dataset[`placeholder${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
        });

        // Update cookie modal language
        const cmIt = document.getElementById('cookie-modal-it');
        const cmEn = document.getElementById('cookie-modal-en');
        if (cmIt && cmEn) {
            cmIt.style.display = lang === 'it' ? 'block' : 'none';
            cmEn.style.display = lang === 'en' ? 'block' : 'none';
        }
    }

    // Initialize language
    setLanguage(currentLang);

    // Language button click handlers
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // ===== NAVIGATION =====
    const navbar = document.getElementById('navbar');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    // Mobile menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== COUNTDOWN TIMER =====
    const showDates = [
        new Date('2026-05-29T21:00:00+02:00'),
        new Date('2026-06-06T21:00:00+02:00'),
        new Date('2026-10-17T21:00:00+02:00'),
        new Date('2027-01-09T21:00:00+01:00')
    ];

    const countdownEl = document.getElementById('countdown');

    function getNextShow() {
        const now = new Date();
        for (const date of showDates) {
            if (date > now) return date;
        }
        return null;
    }

    function updateCountdown() {
        const nextShow = getNextShow();
        if (!nextShow) {
            if (countdownEl) countdownEl.classList.add('hidden');
            return;
        }

        const now = new Date();
        const diff = nextShow - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
    }

    if (countdownEl) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in effect to elements
    const fadeElements = document.querySelectorAll(
        '.about-layout, .gallery-item, .show-item, .contact-info, .contact-form, .video-embed-container, .rider-card, .countdown-wrapper'
    );

    fadeElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });

    // ===== GALLERY ITEMS STAGGER =====
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.gallery-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, i * 100);
                });
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const galleryMosaic = document.querySelector('.gallery-mosaic');
    if (galleryMosaic) {
        const galleryItems = galleryMosaic.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        galleryObserver.observe(galleryMosaic);
    }

    // ===== CONTACT FORM (Formspree) =====
    const FORMSPREE_URL = 'https://formspree.io/f/xojbldrz';
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!name || !email || !message) {
                showMessage(
                    currentLang === 'it'
                        ? 'Compila tutti i campi obbligatori'
                        : 'Please fill in all required fields',
                    'error'
                );
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage(
                    currentLang === 'it'
                        ? 'Inserisci un indirizzo email valido'
                        : 'Please enter a valid email address',
                    'error'
                );
                return;
            }

            // Disable button while sending
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'it' ? 'Invio...' : 'Sending...';

            try {
                const response = await fetch(FORMSPREE_URL, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showMessage(
                        currentLang === 'it'
                            ? 'Messaggio inviato! Ti risponderemo presto.'
                            : 'Message sent! We\'ll get back to you soon.',
                        'success'
                    );
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    const errorMsg = data.errors
                        ? data.errors.map(err => err.message).join(', ')
                        : (currentLang === 'it' ? 'Errore nell\'invio. Riprova.' : 'Sending failed. Please try again.');
                    showMessage(errorMsg, 'error');
                }
            } catch (err) {
                showMessage(
                    currentLang === 'it'
                        ? 'Errore di connessione. Riprova piu\' tardi.'
                        : 'Connection error. Please try again later.',
                    'error'
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = currentLang === 'it' ? 'Invia' : 'Send';
            }
        });
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;

        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 5000);
    }

    // ===== SUBTLE PARALLAX ON HERO =====
    const hero = document.querySelector('.hero');
    const heroLogo = document.querySelector('.hero-logo');

    if (hero && heroLogo) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroLogo.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }

    // ===== LOGO HOVER EFFECT =====
    if (heroLogo) {
        heroLogo.addEventListener('mouseenter', () => {
            heroLogo.style.filter = 'drop-shadow(0 0 80px rgba(207, 181, 59, 0.6))';
        });

        heroLogo.addEventListener('mouseleave', () => {
            heroLogo.style.filter = '';
        });
    }

    // ===== SHOW ITEMS HOVER =====
    const showItems = document.querySelectorAll('.show-item');
    showItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const date = item.querySelector('.show-date .day');
            if (date) {
                date.style.transform = 'scale(1.1)';
                date.style.transition = 'transform 0.3s ease';
            }
        });

        item.addEventListener('mouseleave', () => {
            const date = item.querySelector('.show-date .day');
            if (date) {
                date.style.transform = 'scale(1)';
            }
        });
    });

    // ===== GALLERY LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    // Build array of full-size image sources
    const gallerySrcs = [];
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) gallerySrcs.push({ src: img.src, alt: img.alt });
    });

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = gallerySrcs[index].src;
        lightboxImg.alt = gallerySrcs[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + gallerySrcs.length) % gallerySrcs.length;
        lightboxImg.src = gallerySrcs[currentIndex].src;
        lightboxImg.alt = gallerySrcs[currentIndex].alt;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % gallerySrcs.length;
        lightboxImg.src = gallerySrcs[currentIndex].src;
        lightboxImg.alt = gallerySrcs[currentIndex].alt;
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    if (lightbox) {
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // ===== COOKIE BANNER & MODAL =====
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieMore = document.getElementById('cookie-more');
    const cookieModal = document.getElementById('cookie-modal');
    const cookieModalClose = document.getElementById('cookie-modal-close');
    const cookieModalOverlay = document.getElementById('cookie-modal-overlay');
    const cookieModalAccept = document.getElementById('cookie-modal-accept');
    const cookiePolicyLink = document.getElementById('cookie-policy-link');
    const cookieModalIt = document.getElementById('cookie-modal-it');
    const cookieModalEn = document.getElementById('cookie-modal-en');

    function updateCookieModalLang() {
        if (cookieModalIt && cookieModalEn) {
            cookieModalIt.style.display = currentLang === 'it' ? 'block' : 'none';
            cookieModalEn.style.display = currentLang === 'en' ? 'block' : 'none';
        }
    }

    function acceptCookies() {
        localStorage.setItem('sincity-cookies-accepted', '1');
        cookieBanner.classList.remove('visible');
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openCookieModal() {
        updateCookieModalLang();
        cookieModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCookieModal() {
        cookieModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cookieBanner && !localStorage.getItem('sincity-cookies-accepted')) {
        cookieBanner.classList.add('visible');
    }

    if (cookieAccept) cookieAccept.addEventListener('click', acceptCookies);
    if (cookieModalAccept) cookieModalAccept.addEventListener('click', acceptCookies);
    if (cookieMore) cookieMore.addEventListener('click', openCookieModal);
    if (cookieModalClose) cookieModalClose.addEventListener('click', closeCookieModal);
    if (cookieModalOverlay) cookieModalOverlay.addEventListener('click', closeCookieModal);

    if (cookiePolicyLink) {
        cookiePolicyLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCookieModal();
        });
    }

    // ===== CONSOLE BRANDING =====
    console.log('%c SIN CITY ',
        'background: linear-gradient(90deg, #CD7F32, #CFB53B); color: #0D0D0D; font-size: 24px; font-weight: bold; padding: 10px 20px;'
    );
    console.log('%c AC/DC Tribute Band ',
        'color: #CFB53B; font-size: 14px; font-style: italic;'
    );
    console.log('%c "For Those About To Rock, We Salute You" ',
        'color: #8B5A2B; font-size: 12px;'
    );

});
