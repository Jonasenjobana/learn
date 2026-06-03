import './style.css';

const app = document.querySelector('#app');

const user = {
  name: '小明',
  profile: {
    role: 'frontend learner',
  },
};

const page = document.createElement('main');
page.className = 'page';

const title = document.createElement('h1');
title.textContent = 'Webpack Day3';

const intro = document.createElement('p');
intro.className = 'intro';
intro.textContent = `${user.name} 今天学习 ${user.profile?.role ?? 'webpack learner'} 的 Babel 和代码分割。`;

const button = document.createElement('button');
button.className = 'load-button';
button.type = 'button';
button.textContent = '加载分数统计模块';

const result = document.createElement('section');
result.className = 'result';
result.textContent = '点击按钮后，stats 模块才会被异步加载。';

button.addEventListener('click', async () => {
  button.disabled = true;
  button.textContent = '加载中...';

  const statsModule = await import(
    /* webpackChunkName: "stats" */
    './modules/stats'
  );

  const scores = [88, 92, 76, 95, 67, 100];
  const summary = statsModule.createScoreSummary(scores);

  result.innerHTML = `
    <h2>统计结果</h2>
    <ul>
      <li>最高分：${summary.max}</li>
      <li>最低分：${summary.min}</li>
      <li>平均分：${summary.average}</li>
    </ul>
  `;

  button.textContent = '已加载';
});

page.append(title, intro, button, result);
app.appendChild(page);
