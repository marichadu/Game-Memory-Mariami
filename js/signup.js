// signup.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const strengthText = document.getElementById('strength-text');
    const passwordStrength = document.getElementById('password-strength');

    username.addEventListener('input', function() {
        if (this.value.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters long';
        } else {
            usernameError.textContent = '';
        }
    });

    email.addEventListener('input', function() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (!validateEmail(this.value)) {
            emailError.textContent = 'Please enter a valid email address';
        } else if (users.some(user => user.email === this.value)) {
            emailError.textContent = 'This email is already registered';
        } else {
            emailError.textContent = '';
        }
    });

    function checkPasswordStrength(password) {
        let strength = {
            score: 0,
            color: '',
            width: '0%',
            text: ''
        };
    
        if (password.length >= 6) strength.score += 1;
        if (password.length >= 8) strength.score += 1;
        if (/[A-Z]/.test(password)) strength.score += 1;
        if (/\d/.test(password)) strength.score += 1;
        if (/[^A-Za-z\d]/.test(password)) strength.score += 1;
    
        switch (strength.score) {
            case 0:
                strength.color = '#ff0000';
                strength.width = '20%';
                strength.text = 'Very Weak';
                break;
            case 1:
                strength.color = '#ff8c00';
                strength.width = '40%';
                strength.text = 'Weak';
                break;
            case 2:
                strength.color = '#ffff00';
                strength.width = '60%';
                strength.text = 'Medium';
                break;
            case 3:
                strength.color = '#9acd32';
                strength.width = '80%';
                strength.text = 'Strong';
                break;
            case 4:
            case 5:
                strength.color = '#008000';
                strength.width = '100%';
                strength.text = 'Very Strong';
                break;
        }
    
        return strength;
    }

    password.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        passwordStrength.style.backgroundColor = strength.color;
        passwordStrength.style.width = strength.width;
        strengthText.textContent = `Password Strength: ${strength.text}`;
    
        if (this.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters long';
        } else if (!/\d/.test(this.value)) {
            passwordError.textContent = 'Password must contain at least one number';
        } else if (!/[^A-Za-z\d]/.test(this.value)) {
            passwordError.textContent = 'Password must contain at least one symbol';
        } else {
            passwordError.textContent = '';
        }
    });
    
    confirmPassword.addEventListener('input', function() {
        if (this.value !== password.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
        } else {
            confirmPasswordError.textContent = '';
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (username.value.length < 3) {
            usernameError.textContent = 'Username must be at least 3 characters long';
            return;
        }

        if (!validateEmail(email.value)) {
            emailError.textContent = 'Please enter a valid email address';
            return;
        }

        if (password.value.length < 6 || !/\d/.test(password.value) || !/[^A-Za-z\d]/.test(password.value)) {
            passwordError.textContent = 'Password must be at least 6 characters with a number and a symbol';
            return;
        }

        if (password.value !== confirmPassword.value) {
            confirmPasswordError.textContent = 'Passwords do not match';
            return;
        }

        const newUser = {
            username: username.value,
            email: email.value.toLowerCase(),
            password: password.value,
            preferences: {
                theme: 'vegetables',
                size: '4x4'
            },
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