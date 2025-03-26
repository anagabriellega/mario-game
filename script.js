const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const currentScoreElement = document.querySelector('.current-score');
const hardModeToggle = document.getElementById('hard-mode-toggle');
let hardMode = false;

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.game-over button');

const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreText = document.getElementById('final-score');
const highScoreText = document.getElementById('high-score-text');
const newRecordText = document.getElementById('new-record');

const audioStar = new Audio('./sons/audio_theme.mp3');
const audioGameOver = new Audio('./sons/audio_gameover.mp3');

let gameStarted = false;
let intervalId;
let currentScore = 0;
let gameSpeed = 10;
let pipesJumped = 0;
let pipeSpeed = 2; 

const startGame = () => {
    if (!gameStarted) {
        gameStarted = true;
        pipe.classList.add('pipe-animation');
        startButton.style.display = 'none';
        hardMode = hardModeToggle.checked;

        mario.src = './imagem/mario-walking.gif';
        mario.style.width = '73.5px';
        mario.style.bottom = '0';

        currentScore = 0;
        currentScoreElement.textContent = currentScore;
        pipesJumped = 0;
        gameSpeed = 10;

        pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;


        audioStar.play();
        loop();
    }
};

const restartGame = () => {
    gameOverScreen.style.display = 'none';
    pipe.style.left = '';
    pipe.style.right = '0';

    mario.src = './imagem/mario-walking.gif';
    mario.style.width = '150px';
    mario.style.bottom = '0';

    startButton.style.display = 'none';

    pipeSpeed = 2;
    pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;


    audioGameOver.pause();
    audioGameOver.currentTime = 0;

    audioStar.play();
    audioStar.currentTime = 0;

    gameStarted = false;
    clearInterval(intervalId);
    startGame();
};

const jump = () => {
    if (gameStarted) {
        if (!mario.classList.contains('jump')) {
            mario.classList.add('jump');
            increaseScore();
            setTimeout(() => {
                mario.classList.remove('jump');
            }, 800);
        }
    }
};

const increaseScore = () => {
    currentScore++;
    currentScoreElement.textContent = currentScore;
    pipesJumped++;

    if (pipesJumped % 5 === 0) {
        increaseSpeed();
    }
};

const increaseSpeed = () => {
    if (pipeSpeed > 0.8) { // define um limite mínimo de velocidade
      pipeSpeed = pipeSpeed * 0.85;
      pipe.style.animation = `pipe-animation ${pipeSpeed}s infinite linear`;
      console.log(`Velocidade atual: ${pipeSpeed.toFixed(2)}s`);
  
      const speedMessage = document.getElementById('speed-up-message');
      speedMessage.style.display = 'block';
      speedMessage.style.animation = 'fadeOut 1s ease-out forwards';
  
      setTimeout(() => {
        speedMessage.style.display = 'none';
      }, 1000);
    }
  };
  

const checkCollision = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));
    const marioWidth = parseInt(window.getComputedStyle(mario).width.replace('px', ''));

    const overlapPercentage = (pipePosition - marioWidth) / marioWidth * 100;

    if (overlapPercentage >= 15 && pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.classList.remove('pipe-animation');
        pipe.style.left = `${pipePosition}px`;

        mario.src = 'imagem/game-over.png';
        mario.style.width = '56px';
        mario.style.marginLeft = '50px';

        audioStar.pause();
        audioGameOver.play();
        setTimeout(() => audioGameOver.pause(), 7000);

        const highScore = parseInt(localStorage.getItem('marioHighScore')) || 0;
        finalScoreText.textContent = `Pontuação: ${currentScore}`;
        highScoreText.textContent = `Recorde: ${highScore}`;

        if (currentScore > highScore) {
            localStorage.setItem('marioHighScore', currentScore);
            highScoreText.textContent = `Recorde: ${currentScore}`;
            newRecordText.style.display = 'block';
        } else {
            newRecordText.style.display = 'none';
        }

        gameOverScreen.style.display = 'flex';
        clearInterval(intervalId);
    }
};

const loop = () => {
    intervalId = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            checkCollision();
            if (hardMode && Math.random() < 0.01) {
                pipe.style.visibility = 'hidden';
                setTimeout(() => {
                  pipe.style.visibility = 'visible';
                }, 1000); // 1s invisível
              }              
        }
    }, gameSpeed);
};

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
document.addEventListener('click', jump);

const startScreen = document.getElementById('startScreen');

const closeStartScreen = () => {
  startScreen.style.display = 'none';
};