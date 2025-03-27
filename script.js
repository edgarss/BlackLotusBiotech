// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            // Convert FormData to object for validation
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Validate form data
            if (!validateForm(formObject)) {
                return;
            }
            
            // Using Formspree
            const formspreeEndpoint = 'https://formspree.io/f/xblgarzn';
            
            // Display loading state
            displayMessage('info', 'Sending your message...');
            
            fetch(formspreeEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Display success message
                displayMessage('success', 'Thank you for your message! We will get back to you soon.');
                // Reset the form
                contactForm.reset();
            })
            .catch(error => {
                // Display error message
                displayMessage('error', 'There was a problem submitting your form. Please try again later.');
                console.error('Form submission error:', error);
            });
        }); // Added missing closing bracket for form submit event listener
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll-based animations
    function revealOnScroll() {
        const elements = document.querySelectorAll('.product-card, .benefit-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize element styles for animations
    const animatedElements = document.querySelectorAll('.product-card, .benefit-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add scroll event for animations
    window.addEventListener('scroll', revealOnScroll);
    // Initial check for elements in view
    revealOnScroll();
});

// Form validation function
function validateForm(formData) {
    let isValid = true;
    const errorMessages = [];
    
    // Check if required fields are filled
    if (!formData.name || formData.name.trim() === '') {
        errorMessages.push('Name is required');
        isValid = false;
    }
    
    if (!formData.email || formData.email.trim() === '') {
        errorMessages.push('Email is required');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        errorMessages.push('Please enter a valid email address');
        isValid = false;
    }
    
    if (!formData.message || formData.message.trim() === '') {
        errorMessages.push('Message is required');
        isValid = false;
    }
    
    // Display validation errors if any
    if (!isValid) {
        const errorMessage = errorMessages.join('. ');
        displayMessage('error', errorMessage);
    }
    
    return isValid;
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to display messages to the user
function displayMessage(type, message) {
    const contactForm = document.getElementById('contact-form');
    // Check if message container exists, create if not
    let messageContainer = document.getElementById('form-messages');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'form-messages';
        contactForm.parentNode.insertBefore(messageContainer, contactForm.nextSibling);
    }
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Create and add new message
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
    
    // Automatically remove success messages after a delay
    if (type === 'success') {
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}
