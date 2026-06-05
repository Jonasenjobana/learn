import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101820);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2.5, 2, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
const material = new THREE.MeshStandardMaterial({
  color: 0x49d3c6,
  roughness: 0.45,
  metalness: 0.2,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.4);
directionalLight.position.set(3, 4, 5);
scene.add(directionalLight);

function resizeRenderer() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeRenderer);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
