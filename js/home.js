document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    const ctaSection = document.querySelector('.cta-section');

    if (currentUser) {
        const user = JSON.parse(currentUser);
        ctaSection.innerHTML = `
            <h2>Welcome back, ${user.username}!</h2>
            <p>You are already signed in. Click below to log out of your account.</p>
            <div class="cta-buttons">
                <button onclick="logout()" class="cta-button logout">Log Out</button>
            </div>
        `;
    } else {
        ctaSection.innerHTML = `
            <h2>Ready to Play?</h2>
            <p>Experience the game in demo mode with limited features.</p>
            <div class="cta-buttons">
                <a href="signup.html" class="cta-button signup">Sign Up</a>
                <a href="signin.html" class="cta-button signin">Sign In</a>
                <a href="play.html?demo=true" class="cta-button demo">Demo Mode</a>
            </div>
        `;
    }
});

