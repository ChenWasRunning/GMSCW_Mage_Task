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
function select(task){const level=Number(String(task?.level||'').match(/\d+/)?.[0]);return bands.find(b=>level>=b.min&&level<=b.max)||null;}
function render(task){const box=document.getElementById('training-recommendations');box.replaceChildren();const add=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;e.textContent=text;return e;};box.append(add('h3','','推荐练级地图'));if(!task){box.append(add('p','training-note','路线已完成。此视频的练级建议覆盖至 30 级。'));return;}const band=select(task);box.append(add('p','training-level','当前任务等级：'+task.level));if(!band){box.append(add('p','training-note','视频只覆盖至 30 级，暂不据此推断 31 级以上的练级地图。'));return;}box.append(add('p','training-band',band.label));const list=add('ul','training-list','');for(const [name,tag,description]of band.maps){const row=add('li','','');row.append(add('strong','training-map',name),add('span','training-tag',tag),add('p','',description));list.append(row);}box.append(list,add('p','training-note',band.note),add('p','training-note','按当前任务标注等级匹配（等级区间取起始等级），不读取角色实际等级。优先选择能一至两下击败、与自身相差约 10 级以内的怪物；药费过高时换图。'));const credit=add('p','training-source','根据所提供的视频文本整理 · ');const a=add('a','','查看原视频');a.href='https://www.youtube.com/watch?v=gUTSUmXTTkM';a.target='_blank';a.rel='noopener noreferrer';credit.append(a);box.append(credit);}
root.MageTraining={select,render};
})(window);
