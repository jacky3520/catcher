export function updateScore(score) {
    document.getElementById('score-value').textContent = score;
}

export function updateTimer(time) {
    document.getElementById('time-value').textContent = time;
}

export function showStartMenu() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
}

export function showGameScreen() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}

export function showGameOver() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
}

export function showLeaderboard() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
}