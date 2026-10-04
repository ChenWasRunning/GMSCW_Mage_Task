import {readFile,writeFile} from 'node:fs/promises';
const glossary=JSON.parse(await readFile('data/glossary.json','utf8'));
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
await writeFile('dist/glossary-data.js','window.MAGE_GLOSSARY='+JSON.stringify({...glossary,atlas})+';\n');
console.log(`Built ${ids.size} terms, ${aliases.size} names and ${Object.keys(atlas.nodes).length} map landmarks.`);
