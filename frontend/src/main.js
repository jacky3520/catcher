import * as THREE from 'three';
import { Game } from './components/Game.js';
import { createBackground, updateBackgroundCover } from './utils/background.js';
import { showStartMenu, showGameScreen, showLeaderboard, showGameOver } from './utils/ui.js';
import { submitScore, fetchLeaderboard } from './services/api.js';

let scene, camera, renderer, game;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createBackground(scene);
    
    game = new Game(scene, camera, renderer);
    game.init();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown);

    setupUI();
}

function animate() {
    requestAnimationFrame(animate);
    game.update();
    renderer.render(scene, camera);
}

function onKeyDown(event) {
    if (!game.gameActive) return;

    if (event.key === 'ArrowLeft') {
        game.moveCatcher('left');
    } else if (event.key === 'ArrowRight') {
        game.moveCatcher('right');
    }
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateBackgroundCover(scene, camera);
    game.updateCatcherPosition();
}

function setupUI() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('show-leaderboard').addEventListener('click', showLeaderboard);
    document.getElementById('submit-score').addEventListener('click', handleSubmitScore);
    document.getElementById('back-to-menu').addEventListener('click', showStartMenu);
}

function startGame() {
    showGameScreen();
    game.startGame();
}

async function handleSubmitScore() {
    const playerName = document.getElementById('player-name').value;
    try {
        await submitScore(playerName, game.score);
        showLeaderboard();
        updateLeaderboard();
    } catch (error) {
        console.error('Failed to submit score:', error);
    }
}

async function updateLeaderboard() {
    try {
        const leaderboardData = await fetchLeaderboard();
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        leaderboardData.forEach((entry, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    } catch (error) {
        console.error('Failed to update leaderboard:', error);
    }
}

init();
animate();