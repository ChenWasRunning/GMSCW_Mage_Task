import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import worker from '../server/worker.mjs';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const sqlite=new DatabaseSync(':memory:');sqlite.exec(await readFile(new URL('../drizzle/0000_tricky_micromacro.sql',import.meta.url),'utf8'));
const DB={prepare(sql){return {bind(...args){return {async run(){return {meta:{changes:sqlite.prepare(sql).run(...args).changes}};},async first(){return sqlite.prepare(sql).get(...args)||null;}};}};}};
const server=createServer(async(req,res)=>{try{const path=req.url==='/'?'/index.html':req.url;const data=await readFile(new URL('../dist'+path,import.meta.url));res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':'text/html');res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const a=await browser.newContext(),b=await browser.newContext();let offline=false;const errors=[];
 for(const context of [a,b])await context.route('https://gmscw-mage-task.ran1997pld.chatgpt.site/api/**',async route=>{
  if(offline&&context===a)return route.abort();
  const request=route.request();const response=await worker.fetch(new Request(request.url(),{method:request.method(),headers:{'Content-Type':'application/json',Origin:'https://chenwasrunning.github.io'},body:request.postData()}),{DB});
  await route.fulfill({status:response.status,contentType:'application/json',body:await response.text()});
 });
 const pa=await a.newPage(),pb=await b.newPage();for(const p of [pa,pb]){p.on('pageerror',e=>errors.push(e.message));p.on('dialog',d=>d.accept());await p.goto(url);}
 const count=async(p,n)=>assert.equal(await p.locator('.completed').count(),n);
 const status=async(p,text)=>p.locator('#sync-status').filter({hasText:text}).waitFor();
 await count(pa,0);await count(pb,0);
 await pa.click('#complete-current');await pa.fill('#identifier','跨设备-test');await pa.click('#create-progress');await status(pa,'创建成功');
 await pb.fill('#identifier','跨设备-test');await pb.click('#create-progress');await status(pb,'已被使用');await count(pb,0);
 await pb.click('#load-progress');await status(pb,'已读取');await count(pb,1);
 await pa.click('#complete-current');await status(pa,'已保存到云端');await count(pa,2);
 await pb.click('#complete-current');await status(pb,'其他设备已更新');await pb.click('#load-progress');await status(pb,'已读取');await count(pb,2);
 offline=true;await pa.click('#complete-current');await status(pa,'暂时无法连接');await count(pa,3);
 await pa.reload();await status(pa,'暂时无法连接');await count(pa,3);
 offline=false;await pa.click('#retry-sync');await status(pa,'已保存到云端');
 await pb.click('#load-progress');await status(pb,'已读取');await count(pb,3);
 await pb.locator('.task-check input').first().uncheck();await status(pb,'已保存到云端');await count(pb,2);
 await pa.click('#load-progress');await status(pa,'已读取');await count(pa,2);
 await pa.fill('#identifier','not-found');await pa.click('#load-progress');await status(pa,'没有找到');await count(pa,2);
 await pa.fill('#identifier','复制-test');await pa.click('#create-progress');await status(pa,'创建成功');await count(pa,2);
 await pa.click('#new-local-progress');await count(pa,0);await pa.reload();await count(pa,0);
 await pb.setViewportSize({width:390,height:844});assert.equal(await pb.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await pb.screenshot({path:'/tmp/mage-sync-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS: new device, create, duplicate, cross-device load, autosave, conflict, offline reload/retry, undo, missing ID, copy, new journey, mobile, no JS errors.');
}finally{await browser.close();server.close();}
