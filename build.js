const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
for (const file of ['index.html','styles.css','app.js']) fs.copyFileSync(path.join(__dirname,file), path.join(dist,file));
fs.cpSync(path.join(__dirname,'public'), path.join(dist,'public'), { recursive: true });
console.log('Static build completed.');
