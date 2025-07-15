// =====================
// Contact Page JavaScript
// =====================
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMap();
});

// =====================
// Contact Form Handling (AJAX)
// =====================
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Use browser validation
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            // Set dynamic subject
            const name = form.querySelector('[name="name"]').value;
            const email = form.querySelector('[name="email"]').value;
            const subjectField = form.querySelector('[name="_subject"]');
            if (subjectField) {
                subjectField.value = `New Contact from ${name} (${email})`;
            }
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    showMessage('Your message was sent successfully!', 'success');
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    showMessage('There was an error sending your message. Please try again.', 'error');
                }
            })
            .catch(() => {
                showMessage('There was an error sending your message. Please try again.', 'error');
            });
        });
        // Remove validation warnings on input
        Array.from(form.elements).forEach(el => {
            el.addEventListener('input', () => {
                if (form.classList.contains('was-validated')) {
                    form.classList.remove('was-validated');
                }
            });
        });
    }
}

function showMessage(message, type) {
    // Remove any existing alert
    const oldAlert = document.querySelector('.contact-alert');
    if (oldAlert) oldAlert.remove();
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible contact-alert fade show`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form);
}

// =====================
// Google Map Initialization
// =====================
function initializeMap() {
    if (typeof google !== 'undefined') {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            const location = { lat: 19.0760, lng: 72.8777 };
            const map = new google.maps.Map(mapElement, {
                zoom: 15,
                center: location,
            });
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: 'Indrayani Naturals'
            });
        }
    }
}

// =====================
// Smooth Scroll for Anchor Links
// =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}); 