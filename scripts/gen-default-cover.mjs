import fs from 'fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect fill="#f0f0f0" width="400" height="300"/>
  <text x="200" y="150" font-family="Arial" font-size="18" fill="#999" text-anchor="middle" dominant-baseline="middle">暂无图片</text>
</svg>`;

fs.writeFileSync('public/uploads/default/image/default-cover.svg', svg);
console.log('default cover created');
