// =====================
// Animation on Scroll
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Initial check for elements in view
    handleScrollAnimations();
});

// =====================
// Initialize Animations
// =====================
function initAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
        const animationType = element.getAttribute('data-animate');
        element.classList.add('animate-on-scroll');
        
        // Add delay if specified
        const delay = element.getAttribute('data-delay');
        if (delay) {
            element.style.animationDelay = `${delay}ms`;
        }
    });
}

// =====================
// Handle Scroll Animations
// =====================
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// =====================
// Hover Animations
// =====================
document.addEventListener('mouseover', function(e) {
    const target = e.target;
    
    // Add hover-lift to cards
    if (target.closest('.card')) {
        target.closest('.card').classList.add('hover-lift');
    }
    
    // Add hover-scale to buttons
    if (target.closest('.btn')) {
        target.closest('.btn').classList.add('hover-scale');
    }
});

document.addEventListener('mouseout', function(e) {
    const target = e.target;
    
    // Remove hover-lift from cards
    if (target.closest('.card')) {
        target.closest('.card').classList.remove('hover-lift');
    }
    
    // Remove hover-scale from buttons
    if (target.closest('.btn')) {
        target.closest('.btn').classList.remove('hover-scale');
    }
}); 