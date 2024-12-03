document.addEventListener('DOMContentLoaded', function() {
    // Define available themes and their image paths
    const THEMES = {
        vegetables: {
            path: 'images/vegetables/',
            images: ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg']
        }
    };

    // Get DOM elements
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let gameTimer;
    let seconds = 0;
    let gameStarted = false;

    // Show demo banner
    const demoBanner = document.createElement('div');
    demoBanner.className = 'demo-banner';
    demoBanner.innerHTML = `
        <h2>⚠️ Demo Version - Vegetables Theme Only ⚠️</h2>
        <p>Sign up or Sign in to discover more themes!</p>
        <div class="demo-buttons">
            <a href="signup.html" class="demo-button">Sign Up</a>
            <a href="signin.html" class="demo-button">Sign In</a>
        </div>
    `;
    gameBoard.parentNode.insertBefore(demoBanner, gameBoard);

    function createInitialDeck() {
        // Clear game board
        gameBoard.innerHTML = '';
        
        // Create deck container
        const deckContainer = document.createElement('div');
        deckContainer.className = 'deck-container';
        
        // Get 6 random vegetables for 4x3 grid
        const allImages = [...THEMES.vegetables.images];
        const shuffledImages = allImages.toSorted(() => Math.random() - 0.5);
        const selectedImages = shuffledImages.slice(0, 6);
        
        // Create pairs and shuffle
        const allCards = [...selectedImages, ...selectedImages];
        const shuffledCards = allCards.toSorted(() => Math.random() - 0.5);

        // Create and display face-down cards
        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.value = image;
            card.innerHTML = `
                <div class="card-face card-front">
                    <img src="${THEMES.vegetables.path}${image}" alt="card">
                </div>
                <div class="card-face card-back"></div>
            `;
            cards.push(card);
            deckContainer.appendChild(card);
        });

        // Add play button overlay
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = 'PLAY';
        deckContainer.appendChild(playButton);

        // Add deck to game board
        gameBoard.appendChild(deckContainer);

        // Handle play button click
        playButton.addEventListener('click', function() {
            playButton.classList.add('fade-out');
            setTimeout(() => {
                playButton.remove();
                document.querySelector('.game-info').style.display = 'flex';
                startGame();
            }, 300);
        });
    }

    function handleCardClick(card) {
        if (!gameStarted || flippedCards.length === 2 || 
            flippedCards.includes(card) || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            score += 10;
            scoreElement.textContent = score;

            if (matchedPairs === cards.length / 2) {
                endGame();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
            score = Math.max(0, score - 1);
            scoreElement.textContent = score;
        }

        flippedCards = [];
    }

    function startGame() {
        gameStarted = true;
        gameTimer = setInterval(() => {
            seconds++;
            timerElement.textContent = formatTime(seconds);
        }, 1000);

        // Add click listeners to cards
        cards.forEach(card => {
            card.addEventListener('click', () => handleCardClick(card));
        });
    }

    function endGame() {
        clearInterval(gameTimer);
        alert(`Congratulations! You won!\nScore: ${score}\nTime: ${formatTime(seconds)}\n\nSign up to access more themes and save your scores!`);
    }

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Initialize the game
    createInitialDeck();
});