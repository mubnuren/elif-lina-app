const fs = require('fs');
const path = require('path');
const root = __dirname;
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
function copy(src, dest) {
  const from = path.join(root, src);
  const to = path.join(dist, dest || src);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}
copy('index.html');
copy('src/styles.css', 'styles.css');
copy('src/app.js', 'app.js');
copy('public/icon.svg', 'icon.svg');
copy('public/manifest.json', 'manifest.json');
console.log('Elif Lina V2.1 static build completed.');
