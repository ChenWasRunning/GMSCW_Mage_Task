import json,pathlib,urllib.request,concurrent.futures,subprocess
root=pathlib.Path(__file__).resolve().parents[1]
ids={'莎莉的镜子':4031003,'玛利亚的信':4031000,'卢卡斯的信':4031001,'蓝色蜗牛壳':4000000,'花蘑菇盖':4000001,'绿水灵珠':4000010,'猪头':4000017,'粗羽毛':4003004,'动物皮':4000021,'柠檬':2010004,'松叶':4000005,'绿叶球':4000004,'石榴石母矿':4020000,'魔法密林回城卷':2030002,'石榴石':4021000,'三眼章鱼触角':4000006,'绿蘑菇盖':4000012,'蝴蝶结':4000002,'特制酱油':4031154,'蓝蘑菇盖':4000009,'热血头带':1002100,'矿泉水':2022000,'工地手套':1082002,'蛇皮':4000034,'刺蘑菇盖':4000015,'镜子碎片':4031155,'道符':4000008,'火独眼兽之尾':4000007,'破披风':1102053,'变异蘑菇的血':4031005,'闪耀的石头':4031004,'奇怪的药':4031006,'褐色斗笠':1002026,'汉斯的信件':4031009,'黑珠':4031013,'英雄证书':4031012,'香蕉':4000029,'风独眼兽之尾':4000013,'特制烤鳗鱼':4031014,'钻石':4021007,'新鲜的牛奶':4031015,'神秘书':4031016,'桑拿服':1050018}
source=json.loads(subprocess.check_output(['curl','-sSL','--fail','--max-time','60','https://maplestory.io/api/GMS/83/item'])); names={x['id']:x.get('name') for x in source}
def fetch(pair):
 name,i=pair; url=f'https://maplestory.io/api/GMS/83/item/{i}/icon'; file=root/f'dist/assets/{i}.png'
 if name=='热血头带':
  url='https://kafuffu20.com/classic-world/data/icons/equips/1002100.png'; file=root/'dist/assets/ribboned-pig-headband.png'
 if not file.exists():
  data=subprocess.check_output(['curl','-sSL','--fail','--max-time','40',url])
  if not data.startswith(b'\x89PNG'): raise ValueError(f'Not PNG: {name}')
  file.write_bytes(data)
 return name,dict(id=i,path='assets/'+file.name,english='Ribboned Pig Headband' if name=='热血头带' else names[i],source=url,category='装备' if i<2000000 else '消耗' if i<3000000 else '其他')
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: result=dict(pool.map(fetch,ids.items()))
result['桑拿服']['note']='蓝色男款图示；女性奖励红色款。'
(root/'dist/items.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(root/'dist/items.js').write_text('window.ITEMS = '+json.dumps(result,ensure_ascii=False)+';\n')
print('Verified and downloaded',len(result),'icons')
