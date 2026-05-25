const fs = require('fs');
const path = require('path');
const out='dist';
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for (const f of ['index.html','src/styles.css','src/app.js','public/manifest.json','public/icon.svg','vercel.json','README.md']) {
  const src=path.join(process.cwd(),f); if(!fs.existsSync(src)) continue;
  const dest=path.join(process.cwd(),out,f.replace(/^src\//,'').replace(/^public\//,''));
  fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.copyFileSync(src,dest);
}
