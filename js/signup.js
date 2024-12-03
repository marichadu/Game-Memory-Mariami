document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const passwordStrength = document.getElementById('password-strength');

    function checkPasswordStrength(password) {
        let strength = {
            score: 0,
            color: '',
            width: '0%'
        };

        if (password.length >= 8) strength.score += 1;
        if (password.length >= 12) strength.score += 1;
        if (/[A-Z]/.test(password)) strength.score += 1;
        if (/\d/.test(password)) strength.score += 1;
        if (/[^A-Za-z\d]/.test(password)) strength.score += 1;

        switch (strength.score) {
            case 0:
                strength.color = '#ff0000';
                strength.width = '20%';
                break;
            case 1:
                strength.color = '#ff8c00';
                strength.width = '40%';
                break;
            case 2:
                strength.color = '#ffff00';
                strength.width = '60%';
                break;
            case 3:
                strength.color = '#9acd32';
                strength.width = '80%';
                break;
            case 4:
            case 5:
                strength.color = '#008000';
                strength.width = '100%';
                break;
        }

        return strength;
    }

    password.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        passwordStrength.style.backgroundColor = strength.color;
        passwordStrength.style.width = strength.width;
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

        if (password.value.length < 8) {
            passwordError.textContent = 'Password must be at least 8 characters long';
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