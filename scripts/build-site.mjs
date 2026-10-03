import {mkdir,copyFile,cp,readdir,rm} from 'node:fs/promises';
await rm('dist/client',{recursive:true,force:true});
await mkdir('dist/client',{recursive:true});
for(const file of await readdir('dist')) {
  if(['client','server','.openai'].includes(file)) continue;
  await cp(`dist/${file}`,`dist/client/${file}`,{recursive:true});
}
await mkdir('dist/server',{recursive:true});
await copyFile('server/worker.mjs','dist/server/index.js');
