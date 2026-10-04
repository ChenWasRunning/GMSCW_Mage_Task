(function(root){
'use strict';
const data=root.MAGE_GLOSSARY,terms=new Map([...data.terms,...Object.values(data.taskTitles)].map(t=>[t.id,t])),names=new Map();
for(const term of data.terms)for(const name of [term.zh,...term.aliases||[]])names.set(name,term);
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp([...names.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
function validMatch(name,text,index){
 if(name==='山')return (index===0||/[找 ·／]/.test(text[index-1]))&&(index+1===text.length||/[想／交 ]/.test(text[index+1]));
 if(name==='简')return (index===0||/[ ·边向找]/.test(text[index-1]))&&(index+1===text.length||/[处 ·→／]/.test(text[index+1]));
 return true;
}
function matches(text){pattern.lastIndex=0;return [...text.matchAll(pattern)].filter(m=>validMatch(m[0],text,m.index));}
function decorate(container){
 if(!container)return;
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode()){
  const node=walker.currentNode;
  if(!node.parentElement.closest('.game-term,.map-trigger,button,a,input,textarea,script,style,[data-no-glossary],#name-popover'))nodes.push(node);
 }
 for(const node of nodes){const found=matches(node.nodeValue);if(!found.length)continue;const fragment=document.createDocumentFragment();let index=0;
  for(const match of found){fragment.append(document.createTextNode(node.nodeValue.slice(index,match.index)));const term=names.get(match[0]);const span=make('span','game-term',match[0]);span.dataset.term=term.id;span.dataset.kind=term.kind;span.tabIndex=0;span.setAttribute('role','button');span.setAttribute('aria-label',`${match[0]}：${term.en}`);span.setAttribute('aria-haspopup','dialog');span.setAttribute('aria-controls','name-popover');span.setAttribute('aria-expanded','false');fragment.append(span);index=match.index+match[0].length;}
  fragment.append(document.createTextNode(node.nodeValue.slice(index)));node.replaceWith(fragment);
 }
}
function taskTitle(task){const term=data.taskTitles[task.id];const span=make('span','game-term',task.title);span.dataset.term=term.id;span.dataset.kind='quest';span.tabIndex=0;span.setAttribute('role','button');span.setAttribute('aria-label',`${task.title}：${term.en}`);span.setAttribute('aria-haspopup','dialog');span.setAttribute('aria-controls','name-popover');span.setAttribute('aria-expanded','false');return span;}
function mapTerms(text){return [...new Map(matches(text).map(m=>names.get(m[0])).filter(t=>t.kind==='map').map(t=>[t.id,t])).values()];}
function routeButton(container,tasks,label='地图'){
 const maps=[...new Map(tasks.flatMap(t=>mapTerms(t.place)).map(t=>[t.id,t])).values()];
 if(!maps.length)return;
 const button=make('button','map-trigger',label);button.type='button';button.dataset.maps=maps.map(t=>t.id).join(',');button.setAttribute('aria-label',label+'：'+maps.map(t=>t.zh).join('、'));button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','name-popover');button.setAttribute('aria-expanded','false');container.append(button);
}
const popup=make('aside','name-popover');popup.id='name-popover';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label','名称与地图详情');popup.setAttribute('data-no-glossary','');document.body.append(popup);
let active=null,pinned=false,closeTimer;
function close(){clearTimeout(closeTimer);active?.setAttribute('aria-expanded','false');active=null;pinned=false;popup.hidden=true;}
function isMap(trigger){return !!trigger&&(!!trigger.dataset.maps||terms.get(trigger.dataset.term)?.kind==='map');}
function position(){
 if(!active||popup.hidden)return;
 const r=active.getBoundingClientRect(),margin=12,gap=12;
 popup.style.width='';popup.style.maxHeight=`${innerHeight-2*margin}px`;
 let width=popup.offsetWidth,left,top;
 if(isMap(active)){
  const right=innerWidth-r.right-margin-gap,leftSpace=r.left-margin-gap;
  if(Math.max(right,leftSpace)>=260){
   const useRight=right>=width||(leftSpace<width&&right>=leftSpace);
   width=Math.min(width,useRight?right:leftSpace);popup.style.width=`${width}px`;
   left=useRight?r.right+gap:r.left-gap-width;
   top=Math.max(margin,Math.min(r.top,innerHeight-popup.offsetHeight-margin));
  }else{
   // On narrow screens, use the larger vertical space without covering the name.
   const below=innerHeight-r.bottom-margin-gap,above=r.top-margin-gap;
   const useBelow=below>=above;
   popup.style.maxHeight=`${Math.max(48,useBelow?below:above)}px`;
   left=Math.min(Math.max(margin,r.left),innerWidth-width-margin);
   top=useBelow?r.bottom+gap:r.top-gap-popup.offsetHeight;
  }
 }else{
  left=Math.min(Math.max(margin,r.left),innerWidth-width-margin);
  top=r.bottom+gap;if(top+popup.offsetHeight>innerHeight-margin)top=r.top-popup.offsetHeight-gap;
 }
 popup.style.left=`${Math.max(margin,left)}px`;popup.style.top=`${Math.max(margin,top)}px`;
}
function activate(trigger){if(isMap(trigger)&&active===trigger&&!popup.hidden)close();else open(trigger,true);}

function addLink(parent,url,label){if(!url)return;const link=make('a','',label);link.href=url;link.target='_blank';link.rel='noopener noreferrer';parent.append(link);}
function mapView(list,region){
 const sheet=data.atlas.regions[region];const figure=make('figure','map-preview');const image=make('img');image.src=sheet.image;image.alt=sheet.name+' 大地图';image.width=sheet.width;image.height=sheet.height;figure.append(image);
 const selected=new Map();for(const term of list){if(term.location){const node=data.atlas.nodes[term.location.node];if(node.region===region)selected.set(term.location.node,{...node,term});}}
 for(const [name,node] of Object.entries(data.atlas.nodes)){if(node.region!==region||node.approximate)continue;const dot=make('i','map-landmark');dot.style.left=`${node.x}%`;dot.style.top=`${node.y}%`;dot.setAttribute('aria-hidden','true');figure.append(dot);}
 let number=0;for(const [name,node] of selected){const marker=make('span','map-pin'+(node.term.location.mode!=='exact'||node.approximate?' approximate':''),selected.size>1?String(++number):'');marker.style.left=`${node.x}%`;marker.style.top=`${node.y}%`;marker.title=name;marker.setAttribute('aria-label',node.term.zh+'：'+name);figure.append(marker);}
 const block=make('div','map-block');block.append(figure);
 if(selected.size>1){const legend=make('p','map-legend');legend.textContent=[...selected.entries()].map(([name,n],i)=>`${i+1}. ${n.term.zh}`).join(' · ');block.append(legend);}
 if(list.length===1&&list[0].location){const term=list[0],node=data.atlas.nodes[term.location.node];let text;
  if(node.approximate)text='区域定位：'+term.location.node+'。大地图未列独立节点，圆环表示大致区域。';
  else if(term.location.mode==='entrance')text='入口／所属区域：'+term.location.node+'。该地图没有独立的大地图标记。';
  else text='高亮点：'+term.en+'。';
  block.append(make('p','map-caption',text));
 }else block.append(make('p','map-caption','实心点为大地图节点；空心圆为入口或近似区域。多张地图可能共用一个点。'));
 const credit=make('p','map-credit');addLink(credit,sheet.source,'Classic World 大地图 · '+sheet.name);credit.append(document.createTextNode(' · © NEXON'));block.append(credit);return block;
}
function open(trigger,pin=false){
 clearTimeout(closeTimer);if(active!==trigger){active?.setAttribute('aria-expanded','false');pinned=false;}active=trigger;pinned=pin||pinned;popup.replaceChildren();
 const closeButton=make('button','popover-close','×');closeButton.type='button';closeButton.setAttribute('aria-label','关闭名称提示');closeButton.addEventListener('click',()=>{const previous=active;close();previous?.focus({preventScroll:true});close();});popup.append(closeButton);
 let list;
 if(trigger.dataset.term){const term=terms.get(trigger.dataset.term);if(!term)return;popup.append(make('span','term-kind',{map:'地图',npc:'NPC',monster:'怪物',item:'道具',quest:'任务'}[term.kind]),make('h3','term-chinese',term.zh),make('p','term-english',term.en));if(term.note)popup.append(make('p','term-note',term.note));const source=make('p','term-source');addLink(source,term.source,'查看名称来源');popup.append(source);if(term.references?.length>1){const refs=make('div','quest-references');for(const ref of term.references){const row=make('p');addLink(row,ref.url,ref.name);refs.append(row);}popup.append(refs);}list=term.kind==='map'?[term]:[];
 }else{list=trigger.dataset.maps.split(',').map(id=>terms.get(id)).filter(Boolean);popup.append(make('span','term-kind','执行地点'),make('h3','term-chinese',trigger.textContent==='阶段地图'?'这一阶段去哪里':'这一步去哪里'),make('p','term-note','也可逐个点击中文地名，查看对应英文与单点位置。'));}
 const regions=[...new Set(list.map(t=>t.region||data.atlas.nodes[t.location?.node]?.region).filter(Boolean))];
 for(const region of regions)popup.append(mapView(list,region));
 if(list.length>1){const details=make('div','route-locations');for(const t of list){const row=make('p');row.append(make('strong','',t.zh),document.createTextNode(' · '+t.en));details.append(row);}popup.append(details);}
 if(list.length&&!regions.length)popup.append(make('p','term-note','此地点没有唯一的大地图坐标，可从各城入口前往。'));
 trigger.setAttribute('aria-expanded','true');popup.classList.toggle('has-map',regions.length>0);popup.hidden=false;position();
}
const target=e=>e.target.closest?.('.game-term,.map-trigger');
document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const t=target(e);if(t&&!isMap(t)&&!(pinned&&isMap(active))&&!t.contains(e.relatedTarget))open(t);});
document.addEventListener('pointerout',e=>{const t=target(e);if(t&&t===active&&!pinned&&!popup.contains(e.relatedTarget)&&!t.contains(e.relatedTarget))closeTimer=setTimeout(close,220);});
document.addEventListener('focusin',e=>{const t=target(e);if(t){if(!isMap(t)&&!(pinned&&isMap(active)))open(t);}else if(!popup.contains(e.target))close();});
document.addEventListener('focusout',e=>{if(!pinned&&!popup.contains(e.relatedTarget)&&!active?.contains(e.relatedTarget))closeTimer=setTimeout(close,220);});
document.addEventListener('click',e=>{const t=target(e);if(t){e.preventDefault();activate(t);}else if(!popup.contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const previous=active;close();if(popup.contains(document.activeElement)){previous?.focus({preventScroll:true});close();}}else if((e.key==='Enter'||e.key===' ')&&target(e)&&e.target.tagName!=='BUTTON'){e.preventDefault();activate(target(e));}});
popup.addEventListener('pointerenter',()=>clearTimeout(closeTimer));popup.addEventListener('pointerleave',e=>{if(!pinned&&!active?.contains(e.relatedTarget))closeTimer=setTimeout(close,220);});
addEventListener('resize',position);document.addEventListener('scroll',e=>{if(!popup.contains(e.target)){if(active&&!active.isConnected)close();else position();}},true);
root.MageGlossary={decorate,taskTitle,routeButton,mapTerms,terms,data,close};
})(window);
