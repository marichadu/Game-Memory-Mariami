// signup.js
document.addEventListener('DOMContentLoaded', function() {
   
    // Check if user is already logged in first
    const currentUser = checkLoginStatus();

    if (currentUser) {
        showWelcomeMessage(currentUser.username);
        return;
    }
    const elements = {
        form: document.getElementById('signupForm'),
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        errors: {
            username: document.getElementById('username-error'),
            email: document.getElementById('email-error'),
            password: document.getElementById('password-error'),
            confirmPassword: document.getElementById('confirm-password-error')
        },
        strength: {
            text: document.getElementById('strength-text'),
            bar: document.getElementById('password-strength')
        }
    };
    const validators = {
        username: (value) => value.length >= 3 ? '' : 'Username must be at least 3 characters long',
        email: (value) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (!validateEmail(value)) return 'Please enter a valid email address';
            if (users.some(user => user.email === value)) return 'This email is already registered';
            return '';
        },
        password: (value) => {
            if (value.length < 6) return 'Password must be at least 6 characters long';
            if (!/\d/.test(value)) return 'Password must contain at least one number';
            if (!/[^A-Za-z\d]/.test(value)) return 'Password must contain at least one symbol';
            return '';
        },
        confirmPassword: (value) => value === elements.password.value ? '' : 'Passwords do not match'
    };

    // Add input listeners
    Object.keys(validators).forEach(field => {
        elements[field].addEventListener('input', function() {
            const error = validators[field](this.value);
            elements.errors[field].textContent = error;
            
            if (field === 'password') {
                updatePasswordStrength(this.value);
            }
        });
    });

    function updatePasswordStrength(password) {
        const strengthLevels = [
            { score: 0, color: '#ff0000', width: '20%', text: 'Very Weak' },
            { score: 1, color: '#ff8c00', width: '40%', text: 'Weak' },
            { score: 2, color: '#ffff00', width: '60%', text: 'Medium' },
            { score: 3, color: '#9acd32', width: '80%', text: 'Strong' },
            { score: 4, color: '#008000', width: '100%', text: 'Very Strong' }
        ];

        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z\d]/.test(password)) score++;

        const strength = strengthLevels[Math.min(score, 4)];
        elements.strength.bar.style.backgroundColor = strength.color;
        elements.strength.bar.style.width = strength.width;
        elements.strength.text.textContent = `Password Strength: ${strength.text}`;
    }

    // Form submission
    elements.form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        for (const [field, validator] of Object.entries(validators)) {
            const error = validator(elements[field].value);
            if (error) {
                elements.errors[field].textContent = error;
                return;
            }
        }

        const newUser = {
            username: elements.username.value,
            email: elements.email.value.toLowerCase(),
            password: elements.password.value,
            preferences: { theme: 'vegetables', size: '4x4' },
            scores: []
        };

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        alert('Successfully registered! Redirecting to your profile...');
        window.location.href = 'profile.html';
    });
});