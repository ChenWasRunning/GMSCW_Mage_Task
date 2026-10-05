/* Recommendations adapted from the user-provided video transcript, not live spawn data. */
(function(root){
'use strict';
const bands=[
 {min:1,max:7,label:'Lv. 1–7 · 彩虹岛过渡',note:'视频建议优先做离岛准备，不必在岛上长时间刷怪；约 8 级离岛是作者的个人路线。',maps:[
 ['彩虹岛','任务优先','顺路完成比格斯的收集任务；皮奥的椅子任务若抢不到箱子，可先离岛。']]},
 {min:8,max:9,label:'Lv. 8–9 · 转职前补级',note:'先接沿途任务，再在转职城镇附近补级，减少往返。',maps:[
 ['明珠港郊外','就近补级','视频建议离岛后在明珠港周边补足转职等级。'],
 ['魔法密林南郊','靠近法师转职城镇','以能一至两下击败的怪物为主，顺路接当地任务。']]},
 {min:10,max:14,label:'Lv. 10–14 · 避开热门点',note:'以下拥挤程度是视频作者的预期，并非实时人数。',maps:[
 ['大木林一','魔法密林附近','视频建议向树上走，配合魔法密林当地任务练级。'],
 ['射手训练场Ⅱ','热门地图替代','从射手训练场Ⅰ向上走；视频建议用这里分流。'],
 ['射手村西部树林','约 12 级起 · 组队分层','蜗牛、绿水灵、木妖、猪猪和花蘑菇混合；地图较大，可利用隐藏传送点。']]},
 {min:15,max:19,label:'Lv. 15–19 · 法师与省药选择',note:'文本未明确树洞编号，以下以所在区域定位，不猜测具体入口。',maps:[
 ['魔法森林南部','绿水灵树洞 · 适合法师','视频推荐组队分平台练级；地点较远，但因知名度高仍可能拥挤。'],
 ['魔法森林南部','绿水灵＋绿蘑菇树洞 · 省药','寻找这两种怪物的树洞；作者认为速度较慢但容易积累金币，可练到约 25 级。'],
 ['射手村东部树林','约 15 级起 · 猪猪','猪猪较多，也有安全站位；作者体验中这里仍比较忙。']]},
 {min:20,max:24,label:'Lv. 20–24 · 收益与药费取舍',note:'废弃都市组队任务从 21 级起可作为备选；视频看重其奖励关卡练级，任务本身经验并不突出。',maps:[
 ['魔法森林南部','省药补资金','绿水灵＋绿蘑菇树洞适合继续积累金币，练级速度相对慢。'],
 ['黑森林沼泽','约 20 级起 · 经验快／耗药','从黑森林西入口进入隐藏地图，主要打小青蛇和三眼章鱼；建议组队分散站位。'],
 ['废都北方工地','远程组队 · 隐藏地图入口','视频提到工地内的隐藏地图：小平台打三眼章鱼，队友负责底部蓝蘑菇；文本未给出地图名。'],
 ['地铁一号线第一地区','蓝水灵 · 留意药费','视频认为远程职业较适合；怪物移动快、伤害高，先评估能否安全输出。']]},
 {min:25,max:30,label:'Lv. 25–30 · 地铁与蚂蚁洞',note:'地铁环城区的 25–30 级是作者明确提到的法师经验；其余等级分组是依据文本整理的路线建议。',maps:[
 ['地铁环城区','法师推荐 · 蝙蝠','作者提到自己过去玩法师时常在这里从 25 级练到 30 级。'],
 ['蚂蚁洞四','蚂蚁洞一的替代 · 耗药','视频称布局与蚂蚁洞一相近；热门入口拥挤时可尝试更深处，注意药费。'],
 ['魔法森林南部','约 25 级 · 省药回补','绿水灵＋绿蘑菇树洞可作为低成本备选，效率较慢。'],
 ['魔法密林','刺蘑菇树洞 · 补资金','作者会从高药费地图回到魔法密林的刺蘑菇树洞积累金币；文本未明确树洞编号。']]}
];
const extra=root.MAGE_TRAINING_EXTRA;
const urls={A:'https://www.youtube.com/watch?v=gUTSUmXTTkM',B:'https://www.youtube.com/watch?v=-WmSz0pQkUo'};
const sourceNames={A:'攻略 A · 省药／分流',B:'攻略 B · 效率／1–70'};
let manual='auto',job='all',currentTask=null;
try{const saved=JSON.parse(localStorage.getItem('mage-training-view')||'{}');if(saved.level==='auto'||Number.isInteger(Number(saved.level))&&Number(saved.level)>=1&&Number(saved.level)<=70)manual=String(saved.level);if(['all','ice','fire','cleric'].includes(saved.job))job=saved.job;}catch{}
function remember(){try{localStorage.setItem('mage-training-view',JSON.stringify({level:manual,job}));}catch{}}
function select(task){const level=Number(String(task?.level||'').match(/\d+/)?.[0]);return bands.find(b=>level>=b.min&&level<=b.max)||null;}
function recommendations(level,branch='all'){
 const band=select({level});const old=band?band.maps.map(([name,tag,text])=>({name,tag,text,source:'A',jobs:['all']})):[];
 // The second transcript identifies the construction-site entrance explicitly.
 const clean=old.filter(t=>t.name!=='废都北方工地').map(t=>t.tag.startsWith('绿水灵树洞')?{...t,name:'南部森林训练场Ⅰ',text:t.text+' 攻略 B 已明确此树洞名称。'}:t);
 return [...extra.filter(t=>level>=t.min&&level<=t.max&&(branch==='all'||t.jobs.includes('all')||t.jobs.includes(branch))),...clean];
}
const add=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;};
function link(source){const a=add('a','',sourceNames[source]);a.href=urls[source];a.target='_blank';a.rel='noopener noreferrer';return a;}
function render(task){
 currentTask=task;const box=document.getElementById('training-recommendations');box.replaceChildren();box.append(add('h3','','推荐练级地图 · Lv. 1–70'));
 const controls=add('div','training-controls');const levelLabel=add('label','','查看等级 '),levelSelect=add('select','');levelSelect.id='training-level-select';const auto=add('option','','跟随当前任务');auto.value='auto';levelSelect.append(auto);for(let n=1;n<=70;n++){const o=add('option','','Lv. '+n);o.value=String(n);levelSelect.append(o);}levelSelect.value=manual;levelLabel.append(levelSelect);
 const jobLabel=add('label','','法师分支 '),jobSelect=add('select','');jobSelect.id='training-job-select';for(const [value,name]of [['all','全部法师'],['ice','冰雷'],['fire','火毒'],['cleric','牧师']]){const o=add('option','',name);o.value=value;jobSelect.append(o);}jobSelect.value=job;jobLabel.append(jobSelect);controls.append(levelLabel);if(!root.MAGE_SELECTED_ROUTE||root.MAGE_SELECTED_ROUTE==='mage')controls.append(jobLabel);box.append(controls);
 const refresh=()=>{remember();MageGlossary.close();render(currentTask);MageGlossary.decorate(box);};levelSelect.addEventListener('change',()=>{manual=levelSelect.value;refresh();document.getElementById('training-level-select').focus();});jobSelect.addEventListener('change',()=>{job=jobSelect.value;refresh();document.getElementById('training-job-select').focus();});
 const level=manual==='auto'?(Number(String(task?.level||'32').match(/\d+/)?.[0])||32):Number(manual);
 box.append(add('p','training-level',manual==='auto'?(task?'当前任务等级：'+task.level:'任务路线已完成 · 从 Lv. 32 继续刷怪'):'手动查看：Lv. '+level),add('p','training-note','等级选择只切换练级建议，不改变任务进度或材料背包。32–70 级为独立刷怪路线，可随时选级查看，不必先完成原任务。'));
 if(level>=32)box.append(add('p','training-band','Lv. '+level+' · 纯刷怪路线'));
 const list=add('ul','training-list');for(const item of recommendations(level,(!root.MAGE_SELECTED_ROUTE||root.MAGE_SELECTED_ROUTE==='mage')?job:'general')){const row=add('li','');row.append(add('strong','training-map',item.name),add('span','training-tag',item.tag),add('p','',item.text));const credit=add('p','training-source');credit.append(link(item.source));row.append(credit);list.append(row);}box.append(list);
 if(level>=60)box.append(add('p','training-note','60–70 级：攻略 B 明确建议，纯经验通常更适合继续刷 50 级段地图；火龙和寺院深处主要是打宝备选，不能当成更快升级的保证。'));
 else if(level>=21&&level<=30)box.append(add('p','training-note','两份攻略都降低了废弃都市组队任务本身的经验优先级，但认可奖励关卡练级。这只是 21–30 级的可选补充。'));
 box.append(add('p','training-note','建议来自两份视频文本，不是实时刷怪／掉落数据。部分等级区间为整理建议；以实际击杀速度和药耗调整。高等级新区域只标注所属区域，中文译名待核实处已说明。'));
 const compare=add('details','training-comparison');compare.append(add('summary','','两份攻略差别大吗？'));compare.append(add('p','','整体方向一致，主要是取舍不同：A 偏避开拥挤、少耗药；B 偏刷怪效率、分层站位和掉落，并延伸至 70 级。'));
 const comparison=add('ul','');for(const text of ['低等级：A 推荐射手训练场Ⅱ、西部树林等替代点；B 优先介绍训练场Ⅰ、绿水灵树洞、猪的海岸、坠落注意。','蓝水灵：A 的战士体验偏耗药；B 强调怪物密度与组队空间，适合与否取决于职业和站位。','黑森林沼泽：A 约 20 级起，B 为 22–27 级；不是精确的准入等级。','蚂蚁洞：两份都认可以蚂蚁洞四替代拥挤的一号地图。','入口修正：B 明确坠落注意从废都南方工地顶部进入，修正 A 转录中“北方工地”的模糊说法。','60 级后：B 区分经验与打宝；纯升级继续刷较弱怪物常更合适。'])comparison.append(add('li','',text));compare.append(comparison);const credits=add('p','training-source');credits.append(link('A'),document.createTextNode(' · '),link('B'));compare.append(credits);box.append(compare);
 const route=add('details','training-roadmap');route.append(add('summary','','32–70 级纯刷怪路线总览'));for(const [n,title,text]of [[32,'32–39','火焰之地二；火毒／牧师可选小幽灵，冰雷可选火独眼兽洞穴。'],[40,'40–44','冰雷：危险的峡谷；火毒／牧师：死亡山谷；通用：龙族打猎场。'],[45,'45–49','延续上一段；牧师可试幽灵，48 级左右可考虑流光尽头。'],[50,'50–54','石人寺院入口、流光尽头；牧师可继续幽灵。'],[55,'55–59','石人寺院入口、流光尽头；牧师可试另一处圣域。'],[60,'60–64','以低等级地图的击杀效率为主；火龙仅为打宝备选。'],[65,'65–70','延续效率路线；寺院深处偏打宝且耗药，不强制换图。']]){const row=add('p','');const button=add('button','training-jump','Lv. '+title);button.type='button';button.addEventListener('click',()=>{manual=String(n);refresh();document.getElementById('training-level-select').focus();});row.append(button,document.createTextNode(' '+text));route.append(row);}if(!root.MAGE_SELECTED_ROUTE||root.MAGE_SELECTED_ROUTE==='mage')box.append(route);
}
root.MageTraining={select,recommendations,render};
})(window);
