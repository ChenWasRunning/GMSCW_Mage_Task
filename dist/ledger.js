(function(root){
'use strict';
function apply(bag,task){for(const [k,n] of Object.entries(task.gain))bag[k]=(bag[k]||0)+n;for(const [k,n] of Object.entries(task.cost))bag[k]=(bag[k]||0)-n;return bag;}
function snapshot(tasks,completed){const done=new Set(completed);const current=tasks.find(t=>!done.has(t.id))||null;const actual={};tasks.filter(t=>done.has(t.id)).forEach(t=>apply(actual,t));const projected={...actual};if(current)apply(projected,current);const relevant=tasks.filter(t=>done.has(t.id)||t===current);const levelTask=relevant.reduce((best,t)=>parseInt(t.level)>=parseInt(best.level)?t:best,{level:'1'});return {current,actual,projected,level:levelTask.level,count:tasks.filter(t=>done.has(t.id)).length,deficits:Object.entries(projected).filter(([,n])=>n<0)};}
const api={apply,snapshot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MageLedger=api;
})(typeof window==='undefined'?globalThis:window);
