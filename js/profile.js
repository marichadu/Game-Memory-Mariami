

document.addEventListener("DOMContentLoaded", function () {
  const currentUser = checkLoginStatus();
  const profileContent = document.getElementById('profileContent');

      if (!currentUser) {
          // Show guest view
          profileContent.innerHTML = `
              <div class="demo-banner">
                <h2>⚠️ You need to Sign In or Sign Up to view your profile ⚠️</h2>
                <p>This is currently showing example data</p>
                <div class="demo-buttons">
                    <a href="signin.html" class="cta-button signin">Sign In</a>
                    <a href="signup.html" class="cta-button signup">Sign Up</a>
                </div>
            </div>

            <div class="example-profile">
                <h2>Profile Information</h2>
                <div class="profile-info">
                    <p>Username: <span>Example User</span></p>
                    <p>Email: <span>example@user.com</span></p>
                </div>

                <h2>Game Preferences</h2>
                <form id="preferencesForm">
                    <label for="theme">Choose Theme:</label>
                    <select id="theme" name="theme" disabled>
                        <option value="vegetables">Vegetables</option>
                        <option value="domesticAnimals">Domestic Animals</option>
                        <option value="wildAnimals">Wild Animals</option>
                        <option value="alphabet">Alphabet</option>
                        <option value="dogs">Dogs</option>
                        <option value="dinosaurs">Dinosaurs</option>
                    </select>

                    <label for="size">Choose Grid Size:</label>
                    <select id="size" name="size" disabled>
                        <option value="4x3">4x3 (12 cards)</option>
                        <option value="4x4">4x4 (16 cards)</option>
                        <option value="5x4">5x4 (20 cards)</option>
                        <option value="5x5">5x5 (25 cards)</option>
                    </select>

                    <button type="submit" disabled>Start Game</button>
                </form>

                <h2>Game History</h2>
                <table id="scoresTable">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Theme</th>
                            <th>Size</th>
                            <th>Time</th>
                            <th>Moves</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${new Date().toLocaleDateString()}</td>
                            <td>Vegetables</td>
                            <td>4x3</td>
                            <td>01:45</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>${new Date(Date.now() - 86400000).toLocaleDateString()}</td>
                            <td>Dogs</td>
                            <td>4x4</td>
                            <td>02:30</td>
                            <td>16</td>
                        </tr>
                        <tr>
                            <td>${new Date(Date.now() - 172800000).toLocaleDateString()}</td>
                            <td>Alphabet</td>
                            <td>5x4</td>
                            <td>03:15</td>
                            <td>20</td>
                        </tr>
                  </tbody>
              </table>`;
      } else {
          // Show authenticated user view
          profileContent.innerHTML = `
              <h2>Profile Information</h2>
              <div class="profile-info">
                  <p>Username: <span id="displayUsername"></span></p>
                  <p>Email: <span id="displayEmail"></span></p>
              </div>
  
              <h2>Game Preferences</h2>
              <form id="preferencesForm">
                  <label for="theme">Theme:</label>
                  <select id="theme" required>
                      <option value="vegetables">Vegetables</option>
                      <option value="domesticAnimals">Domestic Animals</option>
                      <option value="wildAnimals">Wild Animals</option>
                      <option value="dinosaursWithNames">Dinosaurs With Names</option>:]</option>/
                      <option value="dogs">Dogs</option>
                      <option value="dinosaurs">Dinosaurs</option>
                      <option value="animatedAnimals">Animated Animals</option>gs">Dogs</option>

                  </select>
  
                  <label for="size">Grid Size:</label>
                  <select id="size" required>
                      <option value="4x3">4x3 (12 cards)</option>
                      <option value="4x4">4x4 (16 cards)</option>
                      <option value="5x4">5x4 (20 cards)</option>
                      <option value="5x5">5x5 (25 cards)</option>
                  </select>
  
                  <button type="submit">Save & Play</button>
              </form>
  
              <h2>Game History</h2>
              <table id="scoresTable">
                  <thead>
                      <tr>
                          <th>Date</th>
                          <th>Theme</th>
                          <th>Size</th>
                          <th>Time</th>
                          <th>Moves</th>
                      </tr>
                  </thead>
                  <tbody></tbody>
              </table>
  
              <button id="logoutBtn" class="cta-button logout">Log Out</button>`;
   // Initialize authenticated user view
   document.getElementById('displayUsername').textContent = currentUser.username;
   document.getElementById('displayEmail').textContent = currentUser.email;

   const form = document.getElementById("preferencesForm");
   const themeSelect = document.getElementById("theme");
   const sizeSelect = document.getElementById("size");
   const scoresTableBody = document.querySelector("#scoresTable tbody");

   // Set initial values if user has preferences
   if (currentUser.preferences) {
       themeSelect.value = currentUser.preferences.theme;
       sizeSelect.value = currentUser.preferences.size;
   }

   // Display scores
   if (currentUser.scores && currentUser.scores.length > 0) {
       scoresTableBody.innerHTML = "";
       currentUser.scores.forEach((score) => {
           const row = document.createElement("tr");
           row.innerHTML = `
               <td>${new Date(score.date).toLocaleDateString()}</td>
               <td>${score.theme.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</td>
               <td>${score.size}</td>
               <td>${score.time}</td>
               <td>${score.moves}</td>
           `;
           scoresTableBody.appendChild(row);
       });
   } else {
       scoresTableBody.innerHTML = '<tr><td colspan="5">No games played yet</td></tr>';
   }

   // Form submit handler
   form.addEventListener("submit", function (e) {
       e.preventDefault();
       const preferences = {
           theme: themeSelect.value,
           size: sizeSelect.value,
       };
       currentUser.preferences = preferences;
       localStorage.setItem("currentUser", JSON.stringify(currentUser));

       const users = JSON.parse(localStorage.getItem("users") || "[]");
       const userIndex = users.findIndex((u) => u.email === currentUser.email);
       if (userIndex !== -1) {
           users[userIndex].preferences = preferences;
           localStorage.setItem("users", JSON.stringify(users));
       }

       window.location.href = `play.html?theme=${preferences.theme}&size=${preferences.size}`;
   });

    // Logout handler
    document.getElementById("logoutBtn").addEventListener('click', logout);
  }
});