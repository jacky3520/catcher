import * as THREE from 'three';
import boatImage from '../../assets/boat.png';

export function createCatcher() {
    const texture = new THREE.TextureLoader().load(boatImage);
    const geometry = new THREE.PlaneGeometry(0.2, 0.1);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const catcher = new THREE.Mesh(geometry, material);
    catcher.position.set(0, -0.9, 0);
    return catcher;
}

export function createItem(goodItems, badItems) {
    const isGood = Math.random() > 0.3;
    const itemTexture = new THREE.TextureLoader().load(isGood ? goodItems[Math.floor(Math.random() * goodItems.length)] : badItems[Math.floor(Math.random() * badItems.length)]);
    const geometry = new THREE.PlaneGeometry(0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ map: itemTexture, transparent: true });
    const item = new THREE.Mesh(geometry, material);
    item.position.set(Math.random() * 1.8 - 0.9, 1.1, 0);
    item.userData.type = isGood ? 'good' : 'bad';
    return item;
}

export function checkCollision(catcher, item) {
    const catcherBox = new THREE.Box3().setFromObject(catcher);
    const itemBox = new THREE.Box3().setFromObject(item);
    return catcherBox.intersectsBox(itemBox);
}

export function handleCollision(item) {
    // Add any additional collision handling logic here
}