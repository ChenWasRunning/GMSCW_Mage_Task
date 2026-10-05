/* An identifier is a bearer key: anyone who knows it can access this progress. */
(function(root){
'use strict';
const API='https://gmscw-mage-task.ran1997pld.chatgpt.site/api/progress';
const KEY='gmscw-mage-cloud-v1';
root.setupMageSync=function({getCompleted,replaceCompleted}) {
 const $=id=>document.getElementById(id);
 let active=null,busy=false,saving=false,conflict=false,timer;
 function status(text,error=false){$('sync-status').textContent=text;$('sync-status').classList.toggle('sync-error',error);}
 function persist(){try{if(active)localStorage.setItem(KEY,JSON.stringify(active));else localStorage.removeItem(KEY);}catch{status('当前浏览器无法保存进度钥匙，请记住 identifier。',true);}}
 function controls(){for(const id of ['identifier','create-progress','load-progress','new-local-progress'])$(id).disabled=busy||saving;$('retry-sync').hidden=!active?.dirty||busy||saving||conflict;}
 function badge(){$('active-identifier').textContent=active?`当前进度：${active.identifier}`:'本机新旅程';}
 async function request(action,body){
  let response;
  try{response=await fetch(`${API}/${action}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000),credentials:'omit'});}catch{throw new Error('network');}
  let data;try{data=await response.json();}catch{throw new Error('network');}
  if(!response.ok)throw new Error(data.error||'unavailable');
  if(!Array.isArray(data.completed)||!Number.isSafeInteger(data.revision))throw new Error('unavailable');
  return data;
 }
 function identifier(){const value=$('identifier').value.normalize('NFC').trim();if(!value||value.length>200){status('请输入 1–200 个字符的 identifier。',true);return null;}return value;}
 function lock(value){busy=value;document.querySelectorAll('.task-check input,.phase-check,#complete-current,[data-route]').forEach(e=>e.disabled=value);controls();if(!value)replaceCompleted(getCompleted());}
 async function flush(){
  if(!active?.dirty||busy||saving||conflict)return;
  saving=true;controls();status('正在保存云端进度…');
  const snapshot=[...active.completed];
  try {
   const result=await request('save',{identifier:active.identifier,completed:snapshot,revision:active.revision});
   active.revision=result.revision;
   active.dirty=JSON.stringify(active.completed)!==JSON.stringify(snapshot);
   persist();status(active.dirty?'正在保存最新修改…':'已保存到云端，可在其他设备读取。');
  }catch(error){
   if(error.message==='revision_conflict'){conflict=true;status('其他设备已更新此进度。当前修改仍保存在本机；请“读取进度”采用云端版本，或换一个 identifier 创建副本。',true);}
   else status('暂时无法连接云端，修改已保留在本机。恢复网络后重试保存。',true);
  }finally{saving=false;controls();}
  if(active?.dirty&&!conflict&&$('sync-status').textContent==='正在保存最新修改…')void flush();
 }
 function changed(){if(busy)return;if(!active){status('进度已保存在本机。创建 identifier 后即可跨设备继续。');return;}active.completed=[...getCompleted()];active.dirty=true;persist();status('修改已保存在本机，等待云端同步…');controls();clearTimeout(timer);timer=setTimeout(flush,400);}
 async function select(action){
  if(busy||saving)return;
  const id=identifier();if(!id)return;
  if(action==='load'&&(getCompleted().length||active?.dirty)&&!confirm('读取后将用云端进度替换四职业清单。尚未同步的本机修改会被替换，是否继续？'))return;
  lock(true);status(action==='create'?'正在创建进度…':'正在读取进度…');
  try {
   const result=await request(action,{identifier:id,completed:getCompleted()});
   active={identifier:id,completed:result.completed,revision:result.revision,dirty:false};conflict=false;persist();replaceCompleted(result.completed);badge();status(action==='create'?'创建成功，后续勾选会自动保存。':'已读取云端进度，后续勾选会自动保存。');
  }catch(error){
   const messages={identifier_taken:'这个 identifier 已被使用，请选择另一个，例如在末尾加上随机词或数字。如果这是你的进度，请点击“读取进度”。',not_found:'没有找到这个 identifier。检查输入，或点击“创建并保存”保存当前进度。',invalid_identifier:'请输入 1–200 个字符的 identifier。'};
   status(messages[error.message]||'连接失败，当前进度未改变，请稍后重试。',true);
  }finally{lock(false);}
 }
 $('create-progress').addEventListener('click',()=>select('create'));
 $('load-progress').addEventListener('click',()=>select('load'));
 $('identifier').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();status('请选择“创建并保存”或“读取进度”。');$('create-progress').focus();}});
 $('retry-sync').addEventListener('click',flush);
 $('new-local-progress').addEventListener('click',()=>{
  if(busy||saving)return;
  if((getCompleted().length||active)&&!confirm('清空四职业的本机勾选，开启新旅程？已同步的云端进度保留，可用原 identifier 读取；未同步的修改会丢弃。'))return;
  clearTimeout(timer);active=null;conflict=false;persist();replaceCompleted([]);$('identifier').value='';badge();status('全新的任务清单已准备好，从第一步开始吧。');controls();
 });
 addEventListener('online',flush);
 addEventListener('beforeunload',event=>{if(active?.dirty){event.preventDefault();event.returnValue='';}});
 try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved.identifier==='string'&&Number.isSafeInteger(saved.revision)&&Array.isArray(saved.completed)){active=saved;$('identifier').value=saved.identifier;replaceCompleted(saved.completed);}}catch{}
 badge();controls();
 if(active){
  if(active.dirty)void flush();
  else {lock(true);status('正在恢复你的云端进度…');request('load',{identifier:active.identifier}).then(result=>{active={...active,...result,dirty:false};persist();replaceCompleted(result.completed);status('已恢复云端进度。');}).catch(()=>status('暂时无法读取云端，已恢复本机缓存；稍后点击“读取进度”刷新。',true)).finally(()=>lock(false));}
 }else status('从第一步开始。进度会保存在本机；设置 identifier 后可跨设备继续。');
 return {changed,isBusy:()=>busy};
};
})(window);
