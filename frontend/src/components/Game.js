import { createCatcher, createItem, checkCollision, handleCollision } from '../utils/gameObjects.js';
import { updateScore, updateTimer } from '../utils/ui.js';
import { CATCHER_SPEED, ITEM_SPEED, SPAWN_INTERVAL, GOOD_ITEMS, BAD_ITEMS } from '../utils/constants.js';

export class Game {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.catcher = null;
        this.items = [];
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = false;
    }

    init() {
        this.catcher = createCatcher();
        this.scene.add(this.catcher);
        this.updateCatcherPosition();
    }

    updateCatcherPosition() {
        if (this.catcher) {
            this.catcher.position.y = -0.8 * this.camera.top;
        }
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 60;
        updateScore(this.score);
        updateTimer(this.timeLeft);
        this.gameActive = true;
        this.spawnItems();
        this.startTimer();
    }

    spawnItems() {
        if (this.gameActive) {
            const item = createItem(GOOD_ITEMS, BAD_ITEMS);
            this.items.push(item);
            this.scene.add(item);
            setTimeout(() => this.spawnItems(), SPAWN_INTERVAL);
        }
    }

    startTimer() {
        const timerInterval = setInterval(() => {
            if (this.timeLeft > 0 && this.gameActive) {
                this.timeLeft--;
                updateTimer(this.timeLeft);
            } else {
                clearInterval(timerInterval);
                this.endGame();
            }
        }, 1000);
    }

    update() {
        if (!this.gameActive) return;

        this.items.forEach((item, index) => {
            item.position.y -= ITEM_SPEED;
            if (item.position.y < -1) {
                this.scene.remove(item);
                this.items.splice(index, 1);
            } else if (checkCollision(this.catcher, item)) {
                handleCollision(item);
                this.score += item.userData.type === 'good' ? 50 : -100;
                updateScore(this.score);
                this.scene.remove(item);
                this.items.splice(index, 1);
            }
        });
    }

    moveCatcher(direction) {
        if (direction === 'left' && this.catcher.position.x > this.camera.left) {
            this.catcher.position.x -= CATCHER_SPEED;
        } else if (direction === 'right' && this.catcher.position.x < this.camera.right) {
            this.catcher.position.x += CATCHER_SPEED;
        }
    }

    endGame() {
        this.gameActive = false;
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').textContent = this.score;
    }
}