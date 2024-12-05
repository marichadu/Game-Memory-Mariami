function loadHeader() {
    return fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header');
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

function checkLoginStatus() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function showWelcomeMessage(username) {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <div class="demo-banner">
            <h2>👋 Hey ${username}!</h2>
            <p>You are already signed in.</p>
            <div class="cta-buttons">
                <a href="profile.html" class="cta-button signin">View Profile</a>
                <button onclick="logout()" class="cta-button logout">Log Out</button>
            </div>
        </div>
    `;
}

function handleFormErrors(errorElement, message) {
    errorElement.textContent = message;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'signin.html';
}

