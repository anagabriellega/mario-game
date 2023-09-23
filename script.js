const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const currentScoreElement = document.querySelector('.current-score');

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.game-over button');

const audioStar = new Audio('./sons/audio_theme.mp3');
const audioGameOver = new Audio('./sons/audio_gameover.mp3');

let gameStarted = false; // Variável para controlar se o jogo já começou
let intervalId; // Variável para armazenar o ID do intervalo
let currentScore = 0; // Variável para controlar a pontuação
let gameSpeed = 10; // Velocidade inicial do jogo (pode ser ajustada)
let pipesJumped = 0; // Variável para rastrear a contagem de pipes pulados

const startGame = () => {
    if (!gameStarted) {
        gameStarted = true; // Define que o jogo começou
        pipe.classList.add('pipe-animation');
        startButton.style.display = 'none';

        // Restaura a imagem do Mario ao estado inicial
        mario.src = './imagem/mario-walking.gif';
        mario.style.width = '73.5px'; // 30% menor
        mario.style.bottom = '0';

        // Redefina a pontuação atual
        currentScore = 0;
        currentScoreElement.textContent = currentScore;

        // Redefina a contagem de pipes pulados
        pipesJumped = 0;

        // Defina a velocidade inicial do jogo
        gameSpeed = 10;

        // Audio
        audioStar.play();

        // Iniciar o loop do jogo apenas após o início
        loop();
    }
}

const restartGame = () => {
    document.querySelector('.game-over').style.display = 'none';
    pipe.style.left = '';
    pipe.style.right = '0';

    // Restaura a imagem do Mario ao estado inicial
    mario.src = './imagem/mario-walking.gif';
    mario.style.width = '150px';
    mario.style.bottom = '0';

    startButton.style.display = 'none';

    audioGameOver.pause();
    audioGameOver.currentTime = 0;

    audioStar.play();
    audioStar.currentTime = 0;

    // Reinicializa o jogo
    gameStarted = false;

    // Limpa o intervalo anterior
    clearInterval(intervalId);

    // Inicia o jogo novamente
    startGame();
}

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
}

const increaseScore = () => {
    // Incrementa a pontuação atual
    currentScore++;
    currentScoreElement.textContent = currentScore;

    // Incrementa a contagem de pipes pulados
    pipesJumped++;

    // Verifica se a contagem de pipes pulados é um múltiplo de 5
    if (pipesJumped % 5 === 0) {
        increaseSpeed();
    }
}

const increaseSpeed = () => {
    // Aumenta a velocidade em 50%
    gameSpeed = gameSpeed * 1.5;
    clearInterval(intervalId);
    loop();
}

const checkCollision = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));
    const marioWidth = parseInt(window.getComputedStyle(mario).width.replace('px', ''));

    // Calcular a porcentagem da sobreposição do Mario com o cano
    const overlapPercentage = (pipePosition - marioWidth) / marioWidth * 100;

    if (overlapPercentage >= 15 && pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.classList.remove('pipe-animation');
        pipe.style.left = `${pipePosition}px`;

        mario.src = 'imagem/game-over.png';
        mario.style.width = '56px';
        mario.style.marginLeft = '50px';

        audioStar.pause();
        audioGameOver.play();

        function stopAudio() {
            audioGameOver.pause();
        }

        setTimeout(stopAudio, 7000);

        document.querySelector('.game-over').style.display = 'flex';

        // Pausa o jogo após a colisão
        clearInterval(intervalId);
    }
}

const loop = () => {
    intervalId = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = parseInt(window.getComputedStyle(mario).bottom.replace('px', ''));

        if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
            checkCollision(); // Verificar colisão
        }
    }, gameSpeed); // Use a variável gameSpeed como intervalo de tempo
}

// Evento de clique para iniciar o jogo
startButton.addEventListener('click', startGame);

// Evento de clique para reiniciar o jogo
restartButton.addEventListener('click', restartGame);

// Evento de clique para fazer o Mario pular
document.addEventListener('click', jump);
