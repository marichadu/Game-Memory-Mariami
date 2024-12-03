document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const currentUser = localStorage.getItem('currentUser');

    const THEMES = {
        vegetables: { displayName: 'Vegetables', images: ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg'] },
        domesticAnimals: { displayName: 'Domestic Animals', images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'] },
        wildAnimals: { displayName: 'Wild Animals', images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '20.webp', '21.webp', '22.webp', '23.webp', '24.webp', '25.webp', '26.webp', '27.webp', '28.webp'] },
        alphabet: { displayName: 'Alphabet', images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png', '23.png', '24.png', '25.png', '26.png'] },
        dogs: { displayName: 'Dogs', images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '20.webp', '21.webp', '22.webp', '23.webp'] },
        dinosaurs: { displayName: 'Dinosaurs', images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'] },
        dinosaursWithNames: { displayName: 'Dinosaurs with Names', images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'] },
        animatedAnimals: { displayName: 'Animated Animals', images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp'] }
    };

    function calculateGridSizes(imageCount) {
        const sizes = new Set();
        for (let rows = 3; rows <= imageCount; rows++) {
            for (let cols = 3; cols <= imageCount; cols++) {
                if (rows * cols >= imageCount) {
                    const size = rows <= cols ? `${rows}x${cols}` : `${cols}x${rows}`;
                    sizes.add(size);
                }
            }
        }
        return Array.from(sizes);
    }

    function getProfileTemplate(username, email, theme, size) {
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
                        ${Object.entries(THEMES).map(([key, value]) => `<option value="${key}" ${key === theme ? 'selected' : ''}>${value.displayName}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label for="size">Game Size:</label>
                    <select id="size" name="size">
                        ${calculateGridSizes(THEMES[theme].images.length).map(s => `<option value="${s}" ${s === size ? 'selected' : ''}>${s}</option>`).join('')}
                    </select>
                </div>
                ${currentUser ? `
                    <button onclick="savePreferences()" class="button save-button">Save Preferences</button>
                    <button onclick="logout()" class="button logout-button">Log Out</button>
                ` : `
                    <button onclick="redirectToSignup()" class="button signup-button">Sign Up to Save Preferences</button>
                `}
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
            ${getProfileTemplate('ExampleUser', 'example@user.com', 'vegetables', '3x3')}
        `;
    } else {
        const user = JSON.parse(currentUser);
        const theme = user.preferences?.theme || 'vegetables';
        const size = user.preferences?.size || calculateGridSizes(THEMES[theme].images.length)[0];
        mainContent.innerHTML = getProfileTemplate(user.username, user.email, theme, size);

        document.getElementById('theme').addEventListener('change', function() {
            updateSizeOptions(this.value);
        });

        displayScores();
    }

    function updateSizeOptions(selectedTheme) {
        const sizeSelect = document.getElementById('size');
        const sizes = calculateGridSizes(THEMES[selectedTheme].images.length);
        sizeSelect.innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    }

    function redirectToSignup() {
        window.location.href = 'signup.html';
    }

    function savePreferences() {
        if (!localStorage.getItem('currentUser')) {
            alert('Please sign in to save preferences');
            return;
        }
    
        const theme = document.getElementById('theme').value;
        const size = document.getElementById('size').value;
    
        console.log('Saving preferences:', { theme, size });
    
        const user = JSON.parse(localStorage.getItem('currentUser'));
        user.preferences = { theme, size };
    
        localStorage.setItem('currentUser', JSON.stringify(user));
    
        let users = JSON.parse(localStorage.getItem('users'));
        users = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(users));
    
        alert('Preferences saved successfully! Redirecting to your game...');
        window.location.href = `play.html?theme=${theme}&size=${size}`;
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
                        <td>${THEMES[score.theme].displayName}</td>
                        <td>${score.date}</td>
                    </tr>
                `).join('');
        }
    }
});