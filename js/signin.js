document.addEventListener('DOMContentLoaded', function() {
    const currentUser = checkLoginStatus();
    
    if (currentUser) {
        showWelcomeMessage(currentUser.username); // Use the function from utils.js
        return;
    }

    const form = document.getElementById('signinForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        emailError.textContent = '';
        passwordError.textContent = '';

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email.value.toLowerCase());
        
        if (!user) {
            handleFormErrors(emailError, 'Email not found'); // Use the function from utils.js
            return;
        }

        if (user.password !== password.value) {
            handleFormErrors(passwordError, 'Incorrect password'); // Use the function from utils.js
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'profile.html';
    });
});