(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initFadeAnimations() {
        const fadeElements = document.querySelectorAll('.fade-up');
        const staggerChildren = document.querySelectorAll('.stagger-children > *');

        if (prefersReducedMotion) {
            fadeElements.forEach((el) => el.classList.add('visible'));
            staggerChildren.forEach((child) => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                if (entry.target.classList.contains('stagger-children')) {
                    Array.from(entry.target.children).forEach((child, i) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, i * 80 + 80);
                    });
                }

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        fadeElements.forEach((el) => observer.observe(el));
    }

    function initFaqAccordion() {
        document.querySelectorAll('.faq-question').forEach((question) => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                if (!answer || !icon) return;

                answer.classList.toggle('active');
                const isActive = answer.classList.contains('active');
                icon.classList.toggle('ri-add-line', !isActive);
                icon.classList.toggle('ri-subtract-line', isActive);
            });
        });
    }

    function initMobileMenu() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (!mobileBtn || !navLinks) return;

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    function initHeaderScrollState() {
        const siteHeader = document.querySelector('header');
        if (!siteHeader) return;

        window.addEventListener('scroll', () => {
            siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    function initThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        const body = document.body;
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('i');

        function updateIcon() {
            if (body.classList.contains('light-theme')) {
                icon.className = 'ri-moon-line'; // In light mode, show moon to switch to dark
            } else {
                icon.className = 'ri-sun-line'; // In dark mode, show sun to switch to light
            }
        }

        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            updateIcon();
            localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
        });

        // Initialize from local storage or default
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.remove('light-theme');
        } else if (savedTheme === 'light') {
            body.classList.add('light-theme');
        }

        updateIcon();
    }


    function initProjectModal() {
        const modal = document.getElementById('projectModal');
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');

        function openProject(_thumbUrl, title, desc, fullUrl) {
            if (!modal || !modalImg || !modalTitle || !modalDesc) return;

            modal.classList.add('show');
            modalImg.src = fullUrl;
            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal || !modalImg) return;

            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                modalImg.src = '';
            }, 300);
        }

        window.openProject = openProject;
        window.closeModal = closeModal;

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    function init() {
        initFadeAnimations();
        initFaqAccordion();
        initMobileMenu();
        initHeaderScrollState();
        initThemeToggle();
        initProjectModal();
    }


    init();
})();
