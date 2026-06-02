import './style.css'
import loginUrl from './assets/login-bg.png'
function add(a, b) {
    return a + b;
}
// src/index.js
const title = document.createElement('h1');
title.textContent = 'Hello webpack';
document.body.appendChild(title);
const img = document.createElement('img');
img.src = loginUrl;

document.body.appendChild(img);