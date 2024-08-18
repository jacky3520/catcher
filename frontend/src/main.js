import * as THREE from 'three';
import bgImage from '../assets/bg1.png';
import boatImage from '../assets/boat.png';
import p1Image from '../assets/p1.png';
import p2Image from '../assets/p2.png';
import p3Image from '../assets/p3.png';
import p4Image from '../assets/p4.png';
import e1Image from '../assets/e1.png';
import e2Image from '../assets/e2.png';

let scene, camera, renderer, catcher, items;
let score = 0;
let timeLeft = 60;
let gameActive = false;

const CATCHER_SPEED = 0.1; // Adjusted speed
const ITEM_SPEED = 0.01; // Adjusted speed
const SPAWN_INTERVAL = 1000;
const GOOD_ITEMS = [p1Image, p2Image, p3Image, p4Image];
const BAD_ITEMS = [e1Image, e2Image];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add background
    const bgTexture = new THREE.TextureLoader().load(bgImage, () => {
        updateBackgroundCover();
    });
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;
    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.name = 'background';
    scene.add(bgMesh);

    createCatcher();
    items = [];

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown);

    setupUI();
}

function updateBackgroundCover() {
    const bgMesh = scene.getObjectByName('background');
    const texture = bgMesh.material.map;
    
    const imageAspect = texture.image.width / texture.image.height;
    const screenAspect = window.innerWidth / window.innerHeight;

    let scale;
    if (screenAspect > imageAspect) {
        scale = screenAspect / imageAspect;
        bgMesh.scale.set(scale, 1, 1);
    } else {
        scale = imageAspect / screenAspect;
        bgMesh.scale.set(1, scale, 1);
    }

    // Adjust camera to fit the scaled background
    const verticalFov = 2 * Math.atan(1 / (2 * camera.position.z)) * (180 / Math.PI);
    const horizontalFov = 2 * Math.atan((screenAspect) / (2 * camera.position.z)) * (180 / Math.PI);

    camera.left = -1 * scale;
    camera.right = 1 * scale;
    camera.top = 1 * (screenAspect < imageAspect ? scale : 1);
    camera.bottom = -1 * (screenAspect < imageAspect ? scale : 1);
    camera.updateProjectionMatrix();
}

function createCatcher() {
    const texture = new THREE.TextureLoader().load(boatImage);
    texture.onload = () => {
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(2, 2 / aspectRatio);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        catcher = new THREE.Mesh(geometry, material);
        catcher.position.y = -0.8 * camera.top; // Position relative to camera
        catcher.scale.set(0.2, 0.2, 1); // Adjust scale as needed
        scene.add(catcher);
    };
}

function createItem() {
    const isGood = Math.random() < 0.7;
    const texture = new THREE.TextureLoader().load(isGood ? GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)] : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)]);
    texture.onload = () => {
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(1, 1 / aspectRatio);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const item = new THREE.Mesh(geometry, material);
        item.position.x = Math.random() * (camera.right - camera.left) + camera.left;
        item.position.y = camera.top + 0.5; // Start above the visible area
        item.scale.set(0.1, 0.1, 1); // Adjust scale as needed
        item.userData.type = isGood ? 'good' : 'bad';
        scene.add(item);
        items.push(item);
    };
}

function animate() {
    requestAnimationFrame(animate);

    if (gameActive) {
        items.forEach((item, index) => {
            item.position.y -= ITEM_SPEED;
            if (item.position.y < camera.bottom - 0.5) {
                scene.remove(item);
                items.splice(index, 1);
            } else if (checkCollision(catcher, item)) {
                handleCollision(item);
                scene.remove(item);
                items.splice(index, 1);
            }
        });
    }

    renderer.render(scene, camera);
}

function checkCollision(catcher, item) {
    const catcherBox = new THREE.Box3().setFromObject(catcher);
    const itemBox = new THREE.Box3().setFromObject(item);
    return catcherBox.intersectsBox(itemBox);
}

function handleCollision(item) {
    if (item.userData.type === 'good') {
        score += 50;
    } else {
        score -= 100;
    }
    updateScore();
}

function onKeyDown(event) {
    if (!gameActive) return;

    if (event.key === 'ArrowLeft' && catcher.position.x > camera.left) {
        catcher.position.x -= CATCHER_SPEED;
    } else if (event.key === 'ArrowRight' && catcher.position.x < camera.right) {
        catcher.position.x += CATCHER_SPEED;
    }
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateBackgroundCover();
}

function setupUI() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('show-leaderboard').addEventListener('click', showLeaderboard);
    document.getElementById('submit-score').addEventListener('click', submitScore);
    document.getElementById('back-to-menu').addEventListener('click', showStartMenu);
}

function startGame() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    score = 0;
    timeLeft = 60;
    updateScore();
    updateTimer();
    gameActive = true;
    spawnItems();
    startTimer();
}

function spawnItems() {
    if (gameActive) {
        createItem();
        setTimeout(spawnItems, SPAWN_INTERVAL);
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0 && gameActive) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function updateScore() {
    document.getElementById('score-value').textContent = score;
}

function updateTimer() {
    document.getElementById('time-value').textContent = timeLeft;
}

function endGame() {
    gameActive = false;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function submitScore() {
    const playerName = document.getElementById('player-name').value;
    // TODO: Implement API call to submit score
    showLeaderboard();
}

function showLeaderboard() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    // TODO: Implement API call to fetch leaderboard data
    updateLeaderboard([]);
}

function updateLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboardData.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

function showStartMenu() {
    document.getElementById('leaderboard').style.display = 'none';
    document.getElementById('start-menu').style.display = 'block';
}

init();
animate();