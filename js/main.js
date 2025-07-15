// =====================
// Utility Functions
// =====================
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

// =====================
// Spice of the Day
// =====================
function initializeSpiceOfTheDay() {
    try {
        const spices = [
            { id: "cinnamon", name: "Cinnamon", description: "Sweet and woody spice from the inner bark of trees.", origin: "Sri Lanka, India", uses: "Baking, desserts, curries, and hot beverages", funFact: "Cinnamon was once more valuable than gold in ancient trade.", image: "images/spices/cinnamon.jpg" },
            { id: "turmeric", name: "Turmeric", description: "Bright yellow spice with earthy flavor.", origin: "India, Southeast Asia", uses: "Curries, rice dishes, and traditional medicine", funFact: "Known as 'Indian saffron' due to its vibrant color.", image: "images/spices/turmeric.jpg" },
            { id: "cardamom", name: "Cardamom", description: "Aromatic spice with a complex flavor profile.", origin: "India, Guatemala", uses: "Desserts, coffee, and savory dishes", funFact: "One of the world's most expensive spices.", image: "images/spices/cardamom.jpg" }
        ];
        const randomSpice = spices[Math.floor(Math.random() * spices.length)];
        const elements = {
            name: getElement('.spice-name'),
            description: getElement('.spice-description'),
            origin: getElement('.spice-origin'),
            uses: getElement('.spice-uses'),
            funFact: getElement('.spice-fun-fact'),
            image: getElement('.spice-image')
        };
        if (Object.values(elements).some(el => !el)) {
            console.warn('Some spice elements not found');
            return;
        }
        elements.name.textContent = randomSpice.name;
        elements.description.textContent = randomSpice.description;
        elements.origin.textContent = randomSpice.origin;
        elements.uses.textContent = randomSpice.uses;
        elements.funFact.textContent = randomSpice.funFact;
        elements.image.src = randomSpice.image;
    } catch (error) {
        console.error('Error initializing spice of the day:', error);
    }
}

// =====================
// Form Validation
// =====================
function initializeForms() {
    try {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const handleSubmit = (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            };
            form.addEventListener('submit', handleSubmit);
            // Cleanup function
            return () => {
                form.removeEventListener('submit', handleSubmit);
            };
        });
    } catch (error) {
        console.error('Error initializing forms:', error);
    }
}

// =====================
// Smooth Scroll
// =====================
function initializeSmoothScroll() {
    try {
        const handleClick = function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', handleClick);
        });
        // Cleanup function
        return () => {
            anchors.forEach(anchor => {
                anchor.removeEventListener('click', handleClick);
            });
        };
    } catch (error) {
        console.error('Error initializing smooth scroll:', error);
    }
}

// =====================
// Animations
// =====================
function initializeAnimations() {
    try {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        // Cleanup function
        return () => {
            observer.disconnect();
        };
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

// =====================
// Loading Animation
// =====================
function initializeLoading() {
    try {
        const loading = document.querySelector('.loading');
        if (!loading) return;
        const hideLoading = () => {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        };
        const loadingTimeout = setTimeout(hideLoading, 2000);
        // Cleanup function
        return () => {
            clearTimeout(loadingTimeout);
        };
    } catch (error) {
        console.error('Error initializing loading:', error);
    }
}

// =====================
// Card Animation on Scroll
// =====================
function handleCardAnimations() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const productCards = document.querySelectorAll('.product-card');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    window.addEventListener('load', () => {
        recipeCards.forEach(card => { observer.observe(card); });
        productCards.forEach(card => { observer.observe(card); });
    });
}

// =====================
// Theme Toggle
// =====================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// =====================
// Hero Image Rotation
// =====================
function initHeroImageRotation() {
    const heroImages = document.querySelectorAll('.hero-image');
    const leftArrow = document.querySelector('.hero-arrow-left');
    const rightArrow = document.querySelector('.hero-arrow-right');
    let currentIndex = 0;

    // Set background-image from data-src and hide <img> visually
    heroImages.forEach(img => {
        const src = img.getAttribute('data-src');
        img.style.backgroundImage = `url('${src}')`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
        img.style.backgroundRepeat = 'no-repeat';
        img.style.position = 'absolute';
        img.style.top = 0;
        img.style.left = 0;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.opacity = img.classList.contains('active') ? '1' : '0';
        img.style.transition = 'opacity 1s';
        img.style.zIndex = 0;
        img.setAttribute('aria-hidden', 'true');
    });

    function showImage(index) {
        heroImages.forEach((img, idx) => {
            img.classList.toggle('active', idx === index);
            img.style.opacity = idx === index ? '1' : '0';
        });
        currentIndex = index;
    }

    function nextImage() {
        showImage((currentIndex + 1) % heroImages.length);
    }

    function prevImage() {
        showImage((currentIndex - 1 + heroImages.length) % heroImages.length);
    }

    if (heroImages.length > 0) {
        if (leftArrow && rightArrow) {
            leftArrow.addEventListener('click', function() {
                prevImage();
            });
            rightArrow.addEventListener('click', function() {
                nextImage();
            });
        }
    }
}

// =====================
// Cards Animation on Scroll
// =====================
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    const animateOnScroll = () => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                card.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// =====================
// Modal Functionality (if any)
// =====================
// ... (keep modal code grouped here if present)

// =====================
// DOMContentLoaded Initialization
// =====================
document.addEventListener('DOMContentLoaded', function() {
    initializeSpiceOfTheDay();
    initializeForms();
    initializeSmoothScroll();
    initializeAnimations();
    initializeLoading();
    handleCardAnimations();
    initializeThemeToggle();
    initHeroImageRotation();
    initializeCards();
    // ...add more initializations as needed
}); 