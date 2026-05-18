/* ============================================
   ALRASMI - Main JavaScript (FIXED)
   Animations, Interactions, Counters, Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ SPLASH SCREEN ============
    const splashScreen = document.getElementById('splash-screen');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 3500);

    // ============ AOS INIT ============
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        delay: 0,
        anchorPlacement: 'top-bottom',
    });

    // ============ PARTICLES ============
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particlesContainer.appendChild(particle);
        }
    }

    // ============ NAVBAR SCROLL ============
    const mainNav = document.getElementById('main-nav');
    const topBar = document.getElementById('top-bar');
    const backToTop = document.getElementById('backToTop');

    function getTotalHeaderHeight() {
        const topBarH = topBar ? topBar.offsetHeight : 0;
        const navH = mainNav ? mainNav.offsetHeight : 70;
        return topBarH + navH;
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        updateActiveNav();
    });

    // ============ ACTIVE NAV LINK ============
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link-custom');
        const headerH = getTotalHeaderHeight();
        const scrollPos = window.scrollY + headerH + 50;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerH = getTotalHeaderHeight();
                const targetPos = target.offsetTop - headerH;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });

                closeMobileMenu();
            }
        });
    });

    // ============ MOBILE MENU ============
    const hamburgerToggle = document.getElementById('hamburgerToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        hamburgerToggle.classList.add('active');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        hamburgerToggle.classList.remove('active');
    }

    if (hamburgerToggle) hamburgerToggle.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ============ LANGUAGE SELECTOR ============
    const langToggle = document.getElementById('langToggle');
    const langDropdown = document.getElementById('langDropdown');

    if (langToggle) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
    }

    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-selector')) {
            langDropdown.classList.remove('active');
        }
    });

    // ============ STATS COUNTER ============
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (target === 0) {
                el.textContent = '0';
            } else if (target >= 1000) {
                el.textContent = Math.floor(current).toLocaleString() + '+';
            } else {
                el.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsCounted) {
                    statsCounted = true;
                    statNumbers.forEach((el, index) => {
                        setTimeout(() => animateCounter(el), index * 200);
                    });
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ============ SERVICE MODAL ============
    window.openServiceModal = function (index) {
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        const title = document.getElementById('serviceModalTitle');
        const body = document.getElementById('serviceModalBody');

        const lang = getCurrentLanguage();
        const t = translations[lang] || translations['ar'];

        const services = [
            { title: t.svc1_title, body: t.svc1_modal },
            { title: t.svc2_title, body: t.svc2_modal },
            { title: t.svc3_title, body: t.svc3_modal },
            { title: t.svc4_title, body: t.svc4_modal },
            { title: t.svc5_title, body: t.svc5_modal },
            { title: t.svc6_title, body: t.svc6_modal },
        ];

        if (services[index]) {
            title.textContent = services[index].title;
            body.textContent = services[index].body;
            modal.show();
        }
    };

    // ============ CONTACT FORM ============
     window.handleContactSubmit = function (e) {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('input[type="text"]').value || '';
        const email = form.querySelector('input[type="email"]').value || '';
        const phone = form.querySelector('input[type="tel"]').value || '';
        const serviceText = form.querySelector('select').selectedOptions[0].text || '';
        const message = form.querySelector('textarea').value || '';

        // بناء رسالة واتساب بكل بيانات النموذج
        let waMessage = 'مرحباً، أنا ' + name + '\n';
        waMessage += '📧 البريد الإلكتروني: ' + email + '\n';
        waMessage += '📱 رقم الهاتف: ' + phone + '\n';
        if (serviceText) waMessage += '📋 الخدمة: ' + serviceText + '\n';
        if (message) waMessage += '💬 الرسالة: ' + message + '\n';
        waMessage += '\n_أرسلت من نموذج موقع الرسمي_';

        const waUrl = 'https://wa.me/971567559910?text=' + encodeURIComponent(waMessage);
        window.open(waUrl, '_blank');
        form.reset();
    };

    // ============ COOKIE BANNER ============
    const cookieBanner = document.getElementById('cookieBanner');

    if (!localStorage.getItem('alrasmi_cookies_accepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }

    window.closeCookieBanner = function () {
        cookieBanner.classList.remove('active');
        localStorage.setItem('alrasmi_cookies_accepted', 'true');
    };

    // ============ BACK TO TOP ============
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ HERO PARALLAX ============
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            }
        });
    }

    // ============ SERVICE CARD HOVER ============
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ============ WHATSAPP CHAT POPUP ============
    let whatsappPopupShown = false;
    function showWhatsAppPopup() {
        if (whatsappPopupShown || localStorage.getItem('alrasmi_wa_popup')) return;
        whatsappPopupShown = true;
        localStorage.setItem('alrasmi_wa_popup', 'true');

        const popup = document.createElement('div');
        popup.style.cssText = 'position:fixed;bottom:100px;right:24px;z-index:9997;' +
            'background:linear-gradient(145deg,#0F2242,#0A1628);' +
            'border:1px solid rgba(212,175,55,0.3);border-radius:16px;' +
            'padding:20px;max-width:300px;box-shadow:0 10px 40px rgba(0,0,0,0.5);' +
            'animation:fadeInUp 0.5s ease;';

        const lang = getCurrentLanguage();
        const messages = {
            ar: { title: 'هل تحتاج مساعدة؟', msg: 'تواصل معنا عبر واتساب للحصول على استشارة مجانية وفورية!' },
            en: { title: 'Need Help?', msg: 'Chat with us on WhatsApp for a free instant consultation!' },
            hi: { title: 'मदद चाहिए?', msg: 'WhatsApp पर हमसे चैट करें और मुफ्त तत्काल परामर्श प्राप्त करें!' },
            bn: { title: 'সাহায্য দরকার?', msg: 'বিনামূল্যে তাৎক্ষণিক পরামর্শের জন্য WhatsApp এ আমাদের সাথে চ্যাট করুন!' }
        };

        const m = messages[lang] || messages['ar'];
        popup.innerHTML =
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:rgba(37,211,102,0.15);display:flex;align-items:center;justify-content:center;">' +
            '<i class="fab fa-whatsapp" style="color:#25D366;font-size:1.3rem;"></i></div>' +
            '<h6 style="margin:0;font-weight:700;color:var(--gold-primary);font-size:0.95rem;">' + m.title + '</h6></div>' +
            '<p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin-bottom:14px;line-height:1.6;">' + m.msg + '</p>' +
            '<div style="display:flex;gap:8px;">' +
            '<a href="https://wa.me/971567559910" target="_blank" style="flex:1;text-align:center;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:8px 16px;border-radius:25px;text-decoration:none;font-size:0.85rem;font-weight:600;">' +
            '<i class="fab fa-whatsapp me-1"></i> WhatsApp</a>' +
            '<button onclick="this.parentElement.parentElement.remove()" style="background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.5);padding:8px 14px;border-radius:25px;font-size:0.8rem;cursor:pointer;">' +
            '<i class="fas fa-times"></i></button></div>';

        document.body.appendChild(popup);

        setTimeout(function () {
            if (popup.parentElement) {
                popup.style.opacity = '0';
                popup.style.transform = 'translateY(20px)';
                popup.style.transition = 'all 0.5s ease';
                setTimeout(function () { popup.remove(); }, 500);
            }
        }, 15000);
    }

    setTimeout(showWhatsAppPopup, 10000);

    // ============ KEYBOARD NAVIGATION ============
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            langDropdown.classList.remove('active');
        }
    });

    // ============ FORM INPUT ANIMATION ============
    document.querySelectorAll('.form-control-custom').forEach(function (input) {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });

    // ============ LAZY IMAGE FADE-IN ============
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });
        if (img.complete) img.style.opacity = '1';
    });

    // ============ CONSOLE BRANDING ============
    console.log(
        '%c ALRASMI - الرسمي ',
        'background: linear-gradient(135deg, #D4AF37, #C5A028); color: #0A1628; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
    );
    console.log('%c Government Services Across Four Emirates ', 'color: #D4AF37; font-size: 12px;');

});
