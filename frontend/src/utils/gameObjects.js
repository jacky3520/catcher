import * as THREE from 'three';
import boatImage from '../../assets/boat.png';

export function createCatcher() {
    const texture = new THREE.TextureLoader().load(boatImage);
    texture.onload = () => {
        const aspectRatio = texture.image.width / texture.image.height;
        catcher.scale.set(0.2, 0.2 / aspectRatio, 1);
    };
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const catcher = new THREE.Mesh(geometry, material);
    catcher.position.set(0, -0.9, 0);
    catcher.scale.set(0.2, 0.4, 1); // Initial scale
    return catcher;
}

export function createItem(goodItems, badItems) {
    const isGood = Math.random() > 0.3;
    const itemImage = isGood ? goodItems[Math.floor(Math.random() * goodItems.length)] : badItems[Math.floor(Math.random() * badItems.length)];
    const itemTexture = new THREE.TextureLoader().load(itemImage);
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: itemTexture, transparent: true });
    const item = new THREE.Mesh(geometry, material);
    item.position.set(Math.random() * 1.8 - 0.9, 1.1, 0);
    item.scale.set(0.1, 0.2, 1); // Initial scale
    item.userData.type = isGood ? 'good' : 'bad';
    
    itemTexture.onload = () => {
        const aspectRatio = itemTexture.image.width / itemTexture.image.height;
        item.scale.set(0.1, 0.1 / aspectRatio, 1);
    };
    
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