import {readFile,writeFile} from 'node:fs/promises';
const glossary=JSON.parse(await readFile('data/glossary.json','utf8'));
const taskTitles=JSON.parse(await readFile('data/task-titles.json','utf8'));
const tasks=JSON.parse(await readFile('dist/tasks.json','utf8'));
for(const task of tasks){if(!taskTitles[task.id]?.en||taskTitles[task.id].zh!==task.title)throw new Error('Missing task title: '+task.id);}
const atlas=JSON.parse(await readFile('data/world-maps.json','utf8'));
const ids=new Set(),aliases=new Map();
for(const term of glossary.terms){
 if(ids.has(term.id))throw new Error(`Duplicate term ID: ${term.id}`);ids.add(term.id);
 if(!term.zh||!term.en)throw new Error(`Missing name: ${term.id}`);
 if(term.location&&!atlas.nodes[term.location.node])throw new Error(`Missing map node: ${term.zh}`);
 for(const name of [term.zh,...term.aliases||[]]){
  if(aliases.has(name))throw new Error(`Ambiguous alias ${name}`);aliases.set(name,term.id);
 }
}
await writeFile('dist/glossary-data.js','window.MAGE_GLOSSARY='+JSON.stringify({...glossary,atlas,taskTitles})+';\n');
console.log(`Built ${ids.size} terms, ${aliases.size} names and ${Object.keys(atlas.nodes).length} map landmarks.`);

const training=JSON.parse(await readFile('data/training-extra.json','utf8'));
await writeFile('dist/training-extra.js','window.MAGE_TRAINING_EXTRA='+JSON.stringify(training)+';\n');
