document.addEventListener('DOMContentLoaded', function() {
    const THEMES = {
        vegetables: {
            path: 'images/vegetables/',
            images: ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg', '6.svg']
        },
        domesticAnimals: {
            path: 'images/domesticAnimals/',
            images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg']
        },
        wildAnimals: {
            path: 'images/wildAnimals/',
            images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '20.webp', '21.webp', '22.webp', '23.webp', '24.webp', '25.webp', '26.webp', '27.webp', '28.webp']
        },
        alphabet: {
            path: 'images/alphabet/',
            images: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png', '23.png', '24.png', '25.png', '26.png']
        },
        dogs: {
            path: 'images/dogs/',
            images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp', '13.webp', '14.webp', '15.webp', '16.webp', '17.webp', '18.webp', '19.webp', '20.webp', '21.webp', '22.webp', '23.webp']
        },
        dinosaurs: {
            path: 'images/dinosaurs/',
            images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg']
        },
        dinosaursWithNames: {
            path: 'images/dinosaursWithNames/',
            images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg']
        },
        animatedAnimals: {
            path: 'images/animatedAnimals/',
            images: ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp']
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'vegetables';
    const size = urlParams.get('size') || '4x3';
    const isDemo = urlParams.get('demo') === 'true';

    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let gameTimer;
    let seconds = 0;
    let gameStarted = false;

    if (isDemo || !localStorage.getItem('currentUser')) {
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
    }

    function initializeGame(theme, size) {
        createInitialDeck(theme, size);
    }

    function createInitialDeck(theme, size) {
        gameBoard.innerHTML = '';
        const deckContainer = document.createElement('div');
        deckContainer.className = 'deck-container';

        const cardCount = getCardCount(size);
        const allImages = [...THEMES[theme].images];
        const shuffledImages = allImages.sort(() => Math.random() - 0.5);
        const selectedImages = shuffledImages.slice(0, cardCount);

        const allCards = [...selectedImages, ...selectedImages];
        const shuffledCards = allCards.sort(() => Math.random() - 0.5);

        shuffledCards.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.value = image;
            card.innerHTML = `
                <div class="card-face card-front">
                    <img src="${THEMES[theme].path}${image}" alt="card">
                </div>
                <div class="card-face card-back"></div>
            `;
            cards.push(card);
            deckContainer.appendChild(card);
        });

        const playButtonWrapper = document.createElement('div');
        playButtonWrapper.className = 'play-button-wrapper';

        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.textContent = 'PLAY';

        playButtonWrapper.appendChild(playButton);
        deckContainer.appendChild(playButtonWrapper);
        gameBoard.appendChild(deckContainer);

        const gameInfo = document.querySelector('.game-info');
        if (gameInfo) {
            gameInfo.style.display = 'none';
        }

        playButton.addEventListener('click', function() {
            playButtonWrapper.classList.add('fade-out');
            setTimeout(() => {
                playButtonWrapper.remove();
                if (gameInfo) {
                    gameInfo.style.display = 'flex';
                }
                startGame();
            }, 300);
        });
    }

    function getCardCount(size) {
        const [cols, rows] = size.split('x').map(Number);
        return (cols * rows) / 2;
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

    initializeGame(theme, size);
});