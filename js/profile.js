document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const currentUser = localStorage.getItem('currentUser');

    function getProfileTemplate(username, email) {
        return `
            <section class="user-info">
                <h2>User Information</h2>
                <p><strong>Username:</strong> <span id="username">${username}</span></p>
                <p><strong>Email:</strong> <span id="email">${email}</span></p>
            </section>

            <section class="game-preferences">
                <h2>Game Preferences</h2>
                <div>
                    <label for="theme">Game Theme:</label>
                    <select id="theme" name="theme">
                        <option value="vegetables">Vegetables</option>
                        <option value="domesticAnimals">Domestic Animals</option>
                        <option value="wildAnimals">Wild Animals</option>
                        <option value="alphabet">Alphabet</option>
                        <option value="dogs">Dogs</option>
                        <option value="dinosaurs">Dinosaurs</option>
                    </select>
                </div>
                <div>
                    <label for="size">Game Size:</label>
                    <select id="size" name="size">
                        <option value="3x3">3 x 3</option>
                        <option value="4x3">4 x 3</option>
                        <option value="4x4">4 x 4</option>
                        <option value="5x4">5 x 4</option>
                        <option value="6x5">6 x 5</option>
                    </select>
                </div>
                <button onclick="savePreferences()" class="button save-button">Save Preferences</button>
                ${currentUser ? '<button onclick="logout()" class="button logout-button">Logout</button>' : ''}
            </section>

            <section>
                <h2>Game History</h2>
                <table class="scores-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Game Size</th>
                            <th>Theme</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="scores-body">
                    </tbody>
                </table>
            </section>
        `;
    }

    if (!currentUser) {
        mainContent.innerHTML = `
            <div class="demo-banner">
                <h2>⚠️ You need to Sign In or Sign Up to view your profile ⚠️</h2>
                <p>This is currently showing example data</p>
                <div style="margin-top: 10px;">
                    <a href="signin.html" style="color: white; margin-right: 20px;">Sign In</a>
                    <a href="signup.html" style="color: white;">Sign Up</a>
                </div>
            </div>
            ${getProfileTemplate('ExampleUser', 'example@user.com')}
        `;
    } else {
        const user = JSON.parse(currentUser);
        mainContent.innerHTML = getProfileTemplate(user.username, user.email);
        
        if (user.preferences) {
            document.getElementById('theme').value = user.preferences.theme;
            document.getElementById('size').value = user.preferences.size;
        }
        
        displayScores();
    }
});

function savePreferences() {
    if (!localStorage.getItem('currentUser')) {
        alert('Please sign in to save preferences');
        return;
    }

    const theme = document.getElementById('theme').value;
    const size = document.getElementById('size').value;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.preferences = { theme, size };
    
    // Update user in both currentUser and users array
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    let users = JSON.parse(localStorage.getItem('users'));
    users = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Preferences saved successfully! Redirecting to game...');
    window.location.href = 'play.html'; // Add this line to redirect to play page
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'signin.html';
}

function displayScores() {
    const scoresBody = document.getElementById('scores-body');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user?.scores) {
        scoresBody.innerHTML = user.scores
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(score => `
                <tr>
                    <td>${user.username}</td>
                    <td>${score.score}</td>
                    <td>${score.size}</td>
                    <td>${score.theme}</td>
                    <td>${score.date}</td>
                </tr>
            `).join('');
    }
}