import * as THREE from 'three';
import bgImage from '../../assets/bg1.png';

let bgMesh;

export function createBackground(scene) {
    const bgTexture = new THREE.TextureLoader().load(bgImage, () => {
        updateBackgroundCover(scene);
    });
    bgTexture.minFilter = THREE.LinearFilter;
    bgTexture.magFilter = THREE.LinearFilter;
    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.name = 'background';
    scene.add(bgMesh);
}

export function updateBackgroundCover(scene, camera) {
    if (!bgMesh) return;

    const texture = bgMesh.material.map;
    
    const imageAspect = texture.image.width / texture.image.height;
    const screenAspect = window.innerWidth / window.innerHeight;

    if (screenAspect > imageAspect) {
        // Screen is wider than the image
        const scale = screenAspect / imageAspect;
        bgMesh.scale.set(scale, 1, 1);
        camera.left = -scale;
        camera.right = scale;
        camera.top = 1;
        camera.bottom = -1;
    } else {
        // Screen is taller than the image
        const scale = imageAspect / screenAspect;
        bgMesh.scale.set(1, scale, 1);
        camera.left = -1;
        camera.right = 1;
        camera.top = scale;
        camera.bottom = -scale;
    }

    camera.updateProjectionMatrix();
}