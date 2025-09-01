// Car Service Booking System with Local Storage
class CarServiceBooking {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('carServiceBookings')) || [];
        this.initEmailJS();
        this.init();
    }

    initEmailJS() {
        // Initialize EmailJS with your public key
        emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
    }

    init() {
        this.setupEventListeners();
        this.displayRecentBookings();
        this.setupAnimations();
        this.setMinDateTime();
    }

    setupEventListeners() {
        const form = document.getElementById('enquiryForm');
        const newBookingBtn = document.getElementById('newBooking');
        
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        newBookingBtn.addEventListener('click', () => this.resetForm());
        
        // Auto-save form data
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.autoSaveForm());
        });
        
        // Load saved form data
        this.loadSavedFormData();
    }

    setMinDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60); // Minimum 1 hour from now
        const minDateTime = now.toISOString().slice(0, 16);
        document.getElementById('preferredTime').min = minDateTime;
    }

    autoSaveForm() {
        const formData = this.getFormData();
        localStorage.setItem('tempBookingData', JSON.stringify(formData));
    }

    loadSavedFormData() {
        const savedData = JSON.parse(localStorage.getItem('tempBookingData'));
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const element = document.getElementById(key);
                if (element && savedData[key]) {
                    element.value = savedData[key];
                }
            });
        }
    }

    getFormData() {
        return {
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            customerEmail: document.getElementById('customerEmail').value,
            serviceType: document.getElementById('serviceType').value,
            carModel: document.getElementById('carModel').value,
            address: document.getElementById('address').value,
            preferredTime: document.getElementById('preferredTime').value,
            additionalNotes: document.getElementById('additionalNotes').value
        };
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.submit-btn');
        this.showLoading(submitBtn);
        
        const formData = this.getFormData();
        
        // Send to both email and WhatsApp
        Promise.all([
            this.sendEmailNotification(formData),
            this.sendWhatsAppMessage(formData)
        ])
        .then(() => {
            const booking = {
                id: Date.now(),
                ...formData,
                bookingDate: new Date().toISOString(),
                status: 'pending'
            };
            
            this.bookings.unshift(booking);
            if (this.bookings.length > 10) {
                this.bookings = this.bookings.slice(0, 10);
            }
            
            localStorage.setItem('carServiceBookings', JSON.stringify(this.bookings));
            localStorage.removeItem('tempBookingData');
            
            this.showSuccessMessage();
            this.hideLoading(submitBtn);
        })
        .catch((error) => {
            console.error('Notification sending failed:', error);
            this.showErrorMessage('Failed to send booking request. Please try again.');
            this.hideLoading(submitBtn);
        });
    }

    showLoading(btn) {
        btn.classList.add('loading');
        btn.disabled = true;
    }

    hideLoading(btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }

    async sendEmailNotification(formData) {
        const emailParams = {
            to_email: 'hussainwasim827@gmail.com', // Your Gmail address
            customer_name: formData.customerName,
            customer_phone: formData.customerPhone,
            customer_email: formData.customerEmail || 'Not provided',
            service_type: this.getServiceName(formData.serviceType),
            car_model: formData.carModel || 'Not specified',
            address: formData.address,
            preferred_time: new Date(formData.preferredTime).toLocaleString(),
            additional_notes: formData.additionalNotes || 'None',
            booking_date: new Date().toLocaleString()
        };

        return emailjs.send(
            'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
            emailParams
        );
    }

    showSuccessMessage() {
        const form = document.getElementById('enquiryForm');
        const successMsg = document.getElementById('successMessage');
        
        // Update success message to mention WhatsApp
        const successContent = successMsg.querySelector('p');
        if (successContent) {
            successContent.textContent = 'We\'ll contact you shortly via email and WhatsApp to confirm your service appointment.';
        }
        
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.classList.add('fade-in');
    }

    sendWhatsAppMessage(formData) {
        return new Promise((resolve) => {
            const phoneNumber = '918770419429'; // Your WhatsApp number (with country code, no +)
            
            const message = `🚗 *NEW CAR SERVICE BOOKING*

` +
                `👤 *Customer:* ${formData.customerName}
` +
                `📞 *Phone:* ${formData.customerPhone}
` +
                `✉️ *Email:* ${formData.customerEmail || 'Not provided'}

` +
                `🔧 *Service:* ${this.getServiceName(formData.serviceType)}
` +
                `🚙 *Car Model:* ${formData.carModel || 'Not specified'}
` +
                `📍 *Address:* ${formData.address}
` +
                `⏰ *Preferred Time:* ${new Date(formData.preferredTime).toLocaleString()}

` +
                `📝 *Notes:* ${formData.additionalNotes || 'None'}

` +
                `📅 *Booking Date:* ${new Date().toLocaleString()}`;
            
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank');
            
            // Resolve immediately as WhatsApp opening is instant
            resolve();
        });
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-icon">❌</div>
            <p>${message}</p>
        `;
        
        const form = document.getElementById('enquiryForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    resetForm() {
        const form = document.getElementById('enquiryForm');
        const successMsg = document.getElementById('successMessage');
        
        form.reset();
        form.style.display = 'block';
        successMsg.style.display = 'none';
        this.setMinDateTime();
        localStorage.removeItem('tempBookingData');
    }

    displayRecentBookings() {
        // Booking history hidden for cleaner mobile interface
        return;
    }

    getServiceName(serviceType) {
        const services = {
            general: 'General Maintenance',
            battery: 'Battery Service',
            tire: 'Tire Service',
            wash: 'Car Wash',
            ac: 'AC Service',
            inspection: 'Full Inspection',
            emergency: 'Emergency Service'
        };
        return services[serviceType] || serviceType;
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .bounce-in').forEach(el => {
            observer.observe(el);
        });

        // Add floating animation to service cards
        this.addServiceCardAnimations();
        
        // Add parallax effect to hero section
        this.addParallaxEffect();
    }

    addServiceCardAnimations() {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateY(5deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateY(0)';
            });
        });
    }

    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            const speed = scrolled * 0.5;
            
            if (parallax) {
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize the booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarServiceBooking();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// WhatsApp floating button function
function openWhatsApp() {
    const phoneNumber = '918770419429';
    const message = 'Hi! I need car service in Gwalior. Can you help me?';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});