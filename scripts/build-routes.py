"""Four routes from docs/source-transcript.txt; preserve all original mage IDs."""
import json,pathlib,copy
R=pathlib.Path(__file__).resolve().parents[1];mage=json.loads((R/'dist/tasks.json').read_text());base={t['id']:t for t in mage};routes={}
def item(s):return {p.rsplit(':',1)[0]:int(p.rsplit(':',1)[1]) for p in s.split(';') if p}
def row(level,title,place,goal,gain='',cost='',note='',xp=0):return dict(level=level,title=title,place=place,goal=goal,gain=item(gain),cost=item(cost),note=note,xp=xp)
display=json.loads((R/'data/glossary.json').read_text())['display']
def clone(n):
 t=copy.deepcopy(base[f'q{n:03}']);t.update(display.get(t['id'],{}));return t
def early(kind):
 a=[]
 def add(*args,**kw):a.append(row(*args,**kw))
 if kind=='archer':
  add('10','成为弓箭手','射手村 → 射手村公园 → 弓箭手培训中心 · 赫丽娜','找赫丽娜完成一转。')
  add('10','研究蘑菇怪物的理由','射手村 · 布鲁斯','先接任务：蘑菇仔20只、花蘑菇20只，蘑菇芽孢10、花蘑菇盖10。')
  add('10–11','蘑菇山收集与练级','射手训练场Ⅰ → 射手村西边小山 → 蘑菇山','打蘑菇仔20、花蘑菇20，收齐材料；再练到11级快升级。可选训练场Ⅰ、西边小山或蘑菇山。','蘑菇芽孢:10;花蘑菇盖:10',note='约320只仅为估计；猪类掉落先留着，后续材料按目标补齐。')
  add('12','交蘑菇研究','射手村 · 布鲁斯','交蘑菇芽孢10、花蘑菇盖10，达到12级，再坐车去魔法密林。','射手村回城卷:2','蘑菇芽孢:10;花蘑菇盖:10',xp=171)
  a.append(clone(26));a[-1]['level']='12'
  add('12–14','黑木妖与绿水灵材料储备','魔法密林南郊／大木林Ⅰ／大木林Ⅱ','黑木妖约350只，升到14级。松叶55、绿叶球40、绿水灵珠13、石榴石母矿1收齐；为后续共用任务预留。','松叶:55;绿叶球:40;绿水灵珠:13;石榴石母矿:1')
  a.append(clone(29));a[-1]['level']='14'
  a.append(clone(32))
  add('14','第一轮绿蘑菇收集','智慧森林','接任务后打绿蘑菇30只，收绿蘑菇盖70：赛恩30、皮亚20、玛亚可选收集20。','绿蘑菇盖:70',note='原文明确赛恩与皮亚合计50；为后续可选玛亚任务另保留20。')
  a.extend([clone(34),clone(35),clone(36)]);a[-2]['gain']={};a[-2]['goal']='接第二条任务后再打绿蘑菇30，继续练到15级快升级；盖子已在上一轮收齐，不再重复增加库存。'
  add('16–18','练到18级并储备材料','射手村东部草丛／地铁一号线第一地区／智慧森林','练到18级快升级；蝴蝶结20、猪头20补齐。再去青蘑菇树林收蓝蘑菇盖40，皮亚与玛亚各20。','蝴蝶结:20;猪头:20;蓝蘑菇盖:40',note='参考：猪约2000／蓝水灵1150／绿蘑菇1230；提前掉落抵扣本步目标。')
  a.append(clone(38));a[-1]['level']='18'
  a.append(clone(44));a[-1]['level']='19';a[-1]['goal']='交绿蘑菇盖20、蓝蘑菇盖20，约19级。'
  a.append(clone(27));a[-1]['level']='19';a[-1]['goal']='在林中之城接黑木妖30只／石榴石母矿1的学徒任务。'
  add('19','黑森林学徒与章鱼材料','黑森林通道 → 黑森林 → 黑森林西入口','接任务后打黑木妖30；混刷约400只。再打三眼章鱼，收触角80。','三眼章鱼触角:80',note='黑木妖刷新少；避开刺蘑菇、青蛇和黑斧木妖。')
  a.append(clone(30));a[-1]['level']='19'
  add('19–20','练到20级约90%','青蘑菇树林／迷宫通道','刷蓝蘑菇约690只，按经验条调整，避开铁甲猪。')
  a.extend([clone(39),clone(40),clone(43)])
  for t in a[-3:]:t['level']='20–21'
  a[-1]['goal']='用布鲁斯给的射手村回城卷回城，交特制酱油，领取热血头带并达到21级。';a[-1]['cost']['射手村回城卷']=1
  a[-3]['cost']['魔法密林回城卷']=1
 elif kind=='warrior':
  add('10','购买矿泉水／成为战士','明珠港 · 简 → 勇士部落 → 战士圣殿 · 武术教练','出发前买矿泉水1，再找武术教练一转。','矿泉水:1')
  add('10–11','黑木妖练到11级','勇士村西入口／勇士部落东入口／勇士部落西部','约80只黑木妖，松叶总共收55、石榴石母矿留1。','松叶:55;石榴石母矿:1')
  add('11','木妖好可怕／酋长的家修理','勇士部落 · 易安／酋长','两条都接：木妖30；木妖20、黑木妖20、树枝10、松叶10。')
  add('11','共享木妖计数并留树枝','勇士村西入口','打木妖30、黑木妖20；收树枝22（酋长10、伊卡路斯12）。','树枝:22')
  add('11','交勇士部落两任务','勇士部落 · 易安／酋长','交两条任务，提交树枝10、松叶10。',cost='树枝:10;松叶:10',xp=407)
  add('11','内拉前置与好无聊','废弃都市 · 内拉／伊卡路斯','付1000金币接花蘑菇20、漂漂猪20及材料；伊卡路斯好无聊一对话即交，再接树枝12、绿叶球12。',xp=236)
  add('11','逆恩森林材料储备','逆恩森林Ⅰ','花蘑菇20、漂漂猪20；收花蘑菇盖30、蝴蝶结30、绿叶球42、绿水灵珠10、猪头20。','花蘑菇盖:30;蝴蝶结:30;绿叶球:42;绿水灵珠:10;猪头:20',note='花蘑菇盖额外20用于玛亚；提前掉落抵扣，不重复刷。避开铁甲猪。')
  add('12','交内拉与伊卡路斯','废弃都市 · 内拉／伊卡路斯','交花蘑菇盖10、蝴蝶结10；接黑木妖25、松叶15。交树枝12、绿叶球12。',cost='花蘑菇盖:10;蝴蝶结:10;树枝:12;绿叶球:12',xp=407)
  add('12','黑木妖25只','废都北方工地','接任务后打黑木妖25，松叶已备好。')
  add('12','交休咪的拜托','废弃都市 · 内拉','交松叶15，再接三眼章鱼30、触角20、矿泉水1。',cost='松叶:15',xp=171)
  add('12–13','三眼章鱼与触角储备','废都南方工地','打三眼章鱼30；触角收80（内拉20、麦吉30、胡小姐30）。','三眼章鱼触角:80')
  add('13','交安德里亚的拜托','废弃都市 · 内拉','交触角20、矿泉水1，领取工地手套。','工地手套:1','三眼章鱼触角:20;矿泉水:1',xp=171)
  add('13–14','返回勇士部落附近补级','废都北入口 → 废都北方工地 → 勇士部落西部','打黑木妖和绿蘑菇约160只，到14级。')
  add('14–21','战士练到21级','西部岩山Ⅲ／地铁一号线第一地区／东部岩山Ⅱ','绿蘑菇约2400只或蓝水灵2250只到20级，再补到21；18级后也可打斧木妖。绿蘑菇盖留20给玛亚。','绿蘑菇盖:20',note='20→21参考绿蘑菇780或斧木妖630只；避开黑斧木妖。')
 else:
  add('10','购买矿泉水／成为飞侠','明珠港 · 简 → 废弃都市 → 盗贼藏身处 · 达克鲁','出发前买矿泉水1；找达克鲁一转。','矿泉水:1')
  add('10','内拉：防具店老板的拜托','废弃都市 · 内拉','付1000金币接花蘑菇20、漂漂猪20、花蘑菇盖10、蝴蝶结10；留好药钱。')
  add('10–11','逆恩森林收集与补级','逆恩森林Ⅰ','各打20只，再刷漂漂猪约50只到11级；花蘑菇盖30、蝴蝶结30、猪头20补齐。','花蘑菇盖:30;蝴蝶结:30;猪头:20',note='花蘑菇盖额外20留给玛亚；避开铁甲猪。')
  add('11','绿水灵材料与树枝','逆恩森林Ⅲ → 废都南方工地','收绿叶球42、绿水灵珠10；回城沿途打木妖收树枝12。','绿叶球:42;绿水灵珠:10;树枝:12',note='避开沿途猴子和蓝蘑菇；提前掉落抵扣。')
  add('11','交内拉／好无聊一、二','废弃都市 · 内拉／伊卡路斯','交花蘑菇盖10、蝴蝶结10，接黑木妖25、松叶15；好无聊一对话即交，二交树枝12、绿叶球12。','废弃都市回城卷:1','花蘑菇盖:10;蝴蝶结:10;树枝:12;绿叶球:12',note='回城卷按原文下一步使用的一张记入，其余奖励数量未明确不推算。',xp=643)
  add('11','顺路接勇士部落两任务','废都北入口 → 废都北方工地 → 勇士部落 · 易安／酋长','接木妖好可怕和酋长的家修理，再回勇士村西入口打怪。')
  add('11','三任务共享击杀与松叶储备','勇士村西入口','三条都接后打木妖30、黑木妖25；收树枝10、松叶55、石榴石母矿1。','树枝:10;松叶:55;石榴石母矿:1')
  add('12','交勇士部落与内拉任务','勇士部落 → 回城卷 → 废弃都市 · 内拉','交易安、酋长，再用回城卷回废弃都市交内拉。松叶合计消耗25，剩30给麦吉。',cost='树枝:10;松叶:25;废弃都市回城卷:1',xp=578)
  add('12–13','安德里亚的拜托与章鱼练级','废弃都市 · 内拉 → 坠落主义','先接任务再打三眼章鱼30，练到13级共约130只；触角收80。','三眼章鱼触角:80')
  add('13','交安德里亚的拜托','废弃都市 · 内拉','交触角20、矿泉水1，领取工地手套。','工地手套:1','三眼章鱼触角:20;矿泉水:1',xp=171)
  add('13–19','飞侠练到19级','地铁一号线第一地区／坠落主义／换乘区','蓝水灵约1800只；15级前也可打三眼章鱼，19级后可提前打蝙蝠。')
  add('19','阿勒斯的拜托／购买沙拉','废弃都市 · 阿勒斯 → 市政中心 → 射手村 · 长老斯坦','先接阿勒斯的拜托，买沙拉1（原文220金币），找长老斯坦交后接说服任务：绿／蓝蘑菇各25、盖各15。','沙拉:1',xp=959)
  a.append(clone(38));a[-1]['level']='19';a[-1]['goal']='交绿水灵珠10、蝴蝶结20，再接第二个担心；胡小姐支线留到秘密之书时做。'
  add('19','蓝蘑菇与守卫兵前置','迷宫通道 → 射手村迷宫入口 · 鲁克','打蓝蘑菇25，收盖35（斯坦15、玛亚20）；找鲁克接青蛇20、蝙蝠20、沙拉1、蛇皮10、翅膀10。','蓝蘑菇盖:35',note='接完即离开石头人区域。')
  add('19','绿蘑菇收集','射手训练场Ⅲ','打绿蘑菇25，收盖35（斯坦15、玛亚20）。','绿蘑菇盖:35')
  add('19','说服长老斯坦／母亲的金表','射手村 · 长老斯坦 → 废弃都市 · 阿勒斯','交绿、蓝蘑菇盖各15；领取旧金表后立即送阿勒斯，领取再交付净库存为0。',cost='绿蘑菇盖:15;蓝蘑菇盖:15',xp=2742)
  add('19–20','青蛇与后续材料储备','沼泽地2','击杀青蛇20；蛇皮收30（鲁克10、内拉20），刺蘑菇盖先留20。','蛇皮:30;刺蘑菇盖:20',note='避开31级鳄鱼。')
  add('20 · 92%','蝙蝠翅膀与补级','换乘区','打蝙蝠20、收翅膀10；继续到20级92%，合计约730只。','蝙蝠翅膀:10')
  add('21','交迷宫入口的守卫兵','射手村迷宫入口 · 鲁克','交沙拉1、蛇皮10、蝙蝠翅膀10，升到21级。随机宝石不计入确定库存；若出钻石留给秘密之书。',cost='沙拉:1;蛇皮:10;蝙蝠翅膀:10',xp=1668)
 return a
for kind,label,prefix,town,hall,master,instructor,exam,monsters,choices in [
 ('archer','弓箭手','a','射手村','弓箭手培训中心','赫丽娜','迷宫通道','弓箭手二转考验场','火独眼兽／无魂蘑菇','猎人／弩弓手'),
 ('warrior','战士','w','勇士部落','战士圣殿','武术教练','西部岩山Ⅳ','战士岩山','火野猪／猴子','剑客／准骑士／枪战士'),
 ('thief','飞侠','t','废弃都市','盗贼藏身处','达克鲁','废都北方工地','飞侠施工现场','眼兽／蓝蘑菇','刺客／侠客')]:
 rows=[clone(n) for n in range(1,25)];rows[-1].update(title='比尔的召唤／准备前往'+town,goal='交比尔的召唤，准备前往'+town+'。'+('先在简处购买下一步所需矿泉水，再乘车。' if kind!='archer' else '选择射手村。'),note='新手车费：射手村80、废弃都市100、勇士部落120金币。')
 branch=early(kind)
 for t in branch:t['phase']='03 '+label+'一转 · 10–21'
 rows+=branch
 for n in range(45,75):
  if kind!='archer' and 49<=n<=55:continue
  t=clone(n)
  if kind!='archer' and n==46:t.update(title='找特奥',goal='交任务，再接找索菲亚；内拉前置已完成，无需再买矿泉水。',gain={},note='')
  if kind=='thief' and n==58:t['gain']={'刺蘑菇盖':20};t['goal']='接任务后各打青蛇、刺蘑菇40只并练至23级；蛇皮已留20，再收刺蘑菇盖20供玛亚。'
  if kind!='archer' and n==64:t['goal']+=' 找克里斯拉玛接学徒：黑木妖30、石榴石母矿1；30级回勇士部落时打。';t['note']='学徒必须先接再计数。'
  if n==67:t['goal']='交火独眼兽之尾30，领取'+label+'职业鞋。';t['gain']={label+'职业鞋（款式待确认）':1};t['note']='原文只明确25级职业鞋，不猜具体款式。'
  rows.append(t)
  if kind!='archer' and n==71:
   t=row('30','完成学徒的黑木妖计数','勇士村西入口','已接学徒任务后打黑木妖30，回城坐车。');t['phase']='04 共用任务 · 21–30';rows.append(t)
  if kind=='warrior' and n==73:
   t=clone(38);t['phase']='04 共用任务 · 21–30';t['level']='30';t['goal']='交绿水灵珠10、蝴蝶结20；第二个担心留到秘密之书时顺路做。';rows.append(t)
  if kind=='warrior' and n==73:
   t=row('30','补齐玛亚的蓝蘑菇盖','青蘑菇树林','为可选玛亚收集任务补齐蓝蘑菇盖20；其他三种盖前面已预留。','蓝蘑菇盖:20');t['phase']='04 共用任务 · 21–30';rows.append(t)
 second=[row('30',label+'的下一段旅程／寻找教官',hall+' · '+master,'对话交任务，接寻找教官并领取信件。',master+'的信件:1',xp=3150),row('30','交信／接资格测试',instructor+' · '+label+'转职教官','交信，再接黑珠30个的资格测试。',cost=master+'的信件:1',xp=3150),row('30',label+'二转考验',exam,'跟教官进入，打专用30级'+monsters+'，收黑珠30。','黑珠:30',note='试炼怪与普通地图怪等级不同；不把转录中的“黑猪”误作怪物。'),row('30','领取资格证明',instructor+' · '+label+'转职教官','交黑珠30，领取英雄证书。','英雄证书:1','黑珠:30',xp=3150),row('30','完成'+label+'二转',hall+' · '+master,'交英雄证书，选择'+choices+'。',cost='英雄证书:1',xp=3150)]
 for t in second:t['phase']='05 '+label+'二转'
 rows+=second
 for n in range(80,93):
  if kind!='archer' and n==81:
   t=clone(30);t['phase']='06 秘密之书 · 32+';t['level']='32';rows.append(t)
  if kind!='archer' and n==82:
   for number in [39,40]:t=clone(number);t['phase']='06 秘密之书 · 32+';t['level']='32';rows.append(t)
  t=clone(n)
  if n==89:t['note']='商店不卖；'+('鲁克可能已奖励钻石，若有则使用，不必再买；随机奖励不预先计入。' if kind=='thief' else '向玩家购买，或炼金达到6级后制作。')
  rows.append(t)
  if kind!='archer' and n==86:t=clone(43);t['phase']='06 秘密之书 · 32+';t['level']='32+';rows.append(t)
 for i,t in enumerate(rows):t['id']=prefix+f'{i+1:03}'
 first=next(t['id'] for t in rows if t['title']=='成为'+label or t['title'].endswith('成为'+label));secondid=next(t['id'] for t in rows if t['title']=='完成'+label+'二转')
 routes[kind]=dict(label=label,tasks=rows,firstJob=first,secondJob=secondid)
routes['mage']=dict(label='魔法师',tasks=mage,firstJob='q025',secondJob='q079')
# Reject route mistakes before publishing: no material can be spent before collection.
for kind,r in routes.items():
 bag={}
 for t in r['tasks']:
  for k,n in t['gain'].items():bag[k]=bag.get(k,0)+n
  for k,n in t['cost'].items():bag[k]=bag.get(k,0)-n
  assert all(n>=0 for n in bag.values()),(kind,t['id'],t['title'],bag)
 print(kind,len(r['tasks']))
(R/'dist/routes.json').write_text(json.dumps(routes,ensure_ascii=False,indent=2)+'\n');(R/'dist/routes.js').write_text('window.MAGE_ROUTES='+json.dumps(routes,ensure_ascii=False)+';\n')
# New titles are descriptive English, explicitly not asserted to be official quest names.
translations=json.loads((R/'data/route-title-translations.json').read_text())
titles=json.loads((R/'data/task-titles.json').read_text())
for kind,r in routes.items():
 if kind=='mage':continue
 for i,t in enumerate(r['tasks']):
  match=next((v for v in titles.values() if v['zh']==t['title']),None)
  titles[t['id']]=dict(id='quest-'+t['id'],kind='quest',zh=t['title'],en=translations.get(t['title']) or (match['en'] if match else f"{kind.title()} route · Step {i+1}"),note=match['note'] if match else '攻略步骤标签的说明性英文，不是游戏任务正式英文名。',source='https://www.bilibili.com/video/BV1gQad6ZEJV/')
(R/'data/task-titles.json').write_text(json.dumps(titles,ensure_ascii=False,indent=2)+'\n')
(R/'server/route-ids.json').write_text(json.dumps([t['id'] for r in routes.values() for t in r['tasks']])+'\n')

# Keep the Worker allowlist aligned with all route IDs.
import re
p=R/'server/worker.mjs';source=p.read_text();ids=[t['id'] for r in routes.values() for t in r['tasks']];source=re.sub(r'const validIds = new Set\([^\n]+', 'const validIds = new Set('+json.dumps(ids)+');', source);p.write_text(source)
