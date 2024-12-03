document.addEventListener('DOMContentLoaded', function() {
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
            emailError.textContent = 'Email not found';
            return;
        }

        if (user.password !== password.value) {
            passwordError.textContent = 'Incorrect password';
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'profile.html';
    });
});