const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('file://'+path.join(__dirname,'../dist/index.html'));await page.waitForSelector('.game-term');
 assert.equal(await page.locator('.task-place .map-trigger').count(),92);assert.equal(await page.locator('.phase-heading .map-trigger').count(),6);
 const terms=await page.evaluate(()=>MAGE_GLOSSARY.terms);assert.equal(terms.length,206);assert(terms.every(t=>t.en));assert.equal(terms.find(t=>t.zh==='热血头带').en,'Ribboned Pig Headband');
 const mapId=terms.find(t=>t.zh==='明珠港').id,npcId=terms.find(t=>t.zh==='汉斯').id,mobId=terms.find(t=>t.zh==='花蘑菇').id,itemId=terms.find(t=>t.zh==='花蘑菇盖').id;
 async function hover(id,english){const term=page.locator(`[data-term="${id}"]`).first();await term.scrollIntoViewIfNeeded();await term.hover();await page.locator('#name-popover').waitFor({state:'visible'});assert.equal(await page.locator('.term-english').innerText(),english);}
 await hover(npcId,'Grendel the Really Old');await hover(mobId,'Orange Mushroom');await hover(itemId,'Orange Mushroom Cap');assert.equal(await page.locator(`.game-term[data-term="${itemId}"] .game-term`).count(),0);
 await hover(mapId,'Lith Harbor');assert.equal(await page.locator('.map-pin').count(),1);assert.equal(await page.locator('.map-preview img').getAttribute('src'),'assets/maps/victoria-island.png');assert.equal(await page.locator('.map-preview img').evaluate(i=>i.complete&&i.naturalWidth>0),true);assert.equal(await page.locator('.map-pin').evaluate(e=>parseFloat(e.style.left)),15.881);
 await page.screenshot({path:'/tmp/mage-map-tooltip-desktop.png'});
 // Tooltip stays open while hovered, source is reachable, Escape dismisses it.
 await page.locator('.term-source a').hover();assert.equal(await page.locator('#name-popover').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#name-popover').isVisible(),false);
 const phase=page.locator('.phase-heading .map-trigger').first();await phase.scrollIntoViewIfNeeded();await phase.hover();assert.equal(await page.locator('.map-preview img').getAttribute('src'),'assets/maps/maple-island.png');assert((await page.locator('.map-pin').count())>5);
 // Every place has an English tooltip; entrance estimates are explicitly labelled.
 const tree=terms.find(t=>t.zh==='魔法师树洞迷宫');await hover(tree.id,"Magician's Tree Dungeon");assert.match(await page.locator('.map-caption').innerText(),/入口/);
 const sleep=terms.find(t=>t.zh==='林中之城');await hover(sleep.id,'Sleepywood');assert.match(await page.locator('.map-caption').innerText(),/大致位置|大致区域/);
 // Short NPC aliases must not underline ordinary 山 in map names.
 assert.equal(await page.locator('.game-term .game-term').count(),0);
 // Re-render after checking/undoing a task retains glossary, map and progress behavior.
 await page.keyboard.press('Escape');await page.locator('#complete-current').click();assert.equal(await page.locator('.completed').count(),1);assert.equal(await page.locator('#current-place .map-trigger').count(),1);assert((await page.locator('#current-title .game-term').count())>0);
 await page.locator('.task-check input').first().uncheck();assert.equal(await page.locator('.completed').count(),0);
 await page.setViewportSize({width:390,height:844});const mobileTerm=page.locator('#current-place .game-term').first();await mobileTerm.click();assert.equal(await page.locator('#name-popover').isVisible(),true);const box=await page.locator('#name-popover').boundingBox();assert(box.x>=0&&box.x+box.width<=390);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'/tmp/mage-map-tooltip-mobile.png'});await page.locator('.popover-close').click();assert.equal(await page.locator('#name-popover').isVisible(),false);
 await page.locator('#identifier').focus();await mobileTerm.focus();assert.equal(await page.locator('#name-popover').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#name-popover').isVisible(),false);
 // Keep user identifiers out of the glossary decorator.
 await page.locator('#identifier').fill('汉斯-明珠港');assert.equal(await page.locator('.progress-account .game-term').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS: 206 terms, 92 task maps, six stage maps, exact coordinates, grouped/approximate anchors, non-nested longest matches, hover/focus/Escape/touch, mobile layout, preserved progress, no JS errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
