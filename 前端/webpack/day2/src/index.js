import './style.css';
import heroUrl from './assets/hero.svg';
import noteText from './assets/note.txt';

const app = document.querySelector('#app');

const page = document.createElement('main');
page.className = 'page';

const title = document.createElement('h1');
title.textContent = 'Webpack Day2';

const intro = document.createElement('p');
intro.className = 'intro';
intro.textContent = '今天重点练习静态资源、public 目录、contenthash 和生产构建。';

const hero = document.createElement('img');
hero.className = 'hero-image';
hero.src = heroUrl;
hero.alt = 'Webpack static assets demo';

const note = document.createElement('pre');
note.className = 'note';
note.textContent = noteText;

const backgroundBox = document.createElement('section');
backgroundBox.className = 'background-box';
backgroundBox.textContent = '这个区域的背景图来自 CSS url()'+heroUrl;

page.append(title, intro, hero, note, backgroundBox);
app.appendChild(page);
