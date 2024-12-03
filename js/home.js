document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const ctaSection = document.querySelector('.cta-section');
        const user = JSON.parse(currentUser);
        
        ctaSection.innerHTML = `
            <h2>Welcome back, ${user.username}!</h2>
            <div class="cta-buttons">
                <a href="profile.html" class="cta-button signup">View Profile</a>
                <a href="play.html" class="cta-button signin">Play Now</a>
            </div>
        `;
    }
});