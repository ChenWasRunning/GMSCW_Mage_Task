# 中英文名称与世界地图

核对日期：2026-10-03。范围为这份 92 步路线中的地图、怪物、NPC 与道具；不是完整游戏百科。

## 数据与来源

- `data/glossary.json`：206 个词条，包含英文名、中文别名、逐条来源链接、地图 ID、提示说明。英文优先取 Classic World 数据库的游戏字段；保留攻略原来的中文，不将不同版本的中文译名强行替换。
- [楓情報 Classic World](https://kafuffu20.com/classic-world/zh-cn/)：按 NPC、怪物、地图和道具编号核对中英对应。
- [NiaMeowDB NPC 索引](https://meowdb.com/msclassic/npcs/all)及其[简体中文版本](https://meowdb.com/msclassic/zh-cn/npcs/all)：交叉核对任务人物。
- 装备名另外对照同站 equips 索引。纠正原项目将“热血头带”写成 Red Headband 的对应关系，正确为 Ribboned Pig Headband，并替换对应图标。其他图标仍为原有 [MapleStory.io GMS v83](https://maplestory.io/) 资源，不能据此推断 Classic World 属性。
- `data/world-maps.json`：彩虹岛、金银岛两张大地图及节点百分比坐标，来自 [MapleClassic Wiki: Maple Island](https://mapleclassic.wiki/wiki/Maple_Island) 和 [Victoria Island](https://mapleclassic.wiki/wiki/Victoria_Island)。游戏地图素材 © NEXON；Wiki 内容按其 [CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) 声明署名。本文件与坐标数据保留原来源链接。

## 精度与别名

- 直接出现在世界地图上的地点使用来源节点坐标；实心高亮。
- 室内、地下城、隐藏地图没有独立节点时，显示入口或所属区域，使用空心标记，并在提示中说明。坐标不是地图内部 NPC 的站立位置。
- 小蘑菇两张教学地图使用共同世界地图节点，并明确标注。
- Sleepywood 在采用的大地图上有绘画和文字但没有独立节点；按绘画区域人工标注近似坐标，永远附“区域／大致位置”说明。其内部地图沿用这一区域标记。
- 自由市场没有唯一地理坐标，只显示名称和说明，不制造一个精确点。
- “浮木妖”按攻略的等级、路线和读音对应 Axe Stump（斧木妖）；“泥岩／逆恩森林一”对应 L Forest I；“地铁环城区”按路线对应 Transfer Area。提示保留校对说明。
- 法师职业鞋未给具体款式，仅显示英文类别与“未确认”，不虚构具体装备名。
- 单字 NPC“山”和“简”使用上下文约束，避免误标普通汉字；其余名称最长优先，防止将“花蘑菇盖”拆成“花蘑菇”。

## 构建与验证

编辑 JSON 后运行 `node scripts/build-glossary.mjs`，生成 `dist/glossary-data.js`；完整 `npm run build` 自动包含此步骤。生成时检查重复 ID、名称冲突、地图节点存在性。

界面采用事件委托，支持悬停、键盘聚焦、Enter/Space、Esc、关闭按钮与手机点按。提示内可打开来源链接。不会扫描 identifier 或改动任务 ID、材料计算和云端存储。

`node scripts/test-glossary.cjs`（Playwright + Chrome）检查词条、92 个任务地图、6 个阶段地图、坐标、入口说明、最长匹配、悬停与键盘、手机布局、原进度行为。原有 ledger、浏览器和跨设备同步测试继续保留。

地图交互：地图名称保留虚线下划线，仅点击（或 Enter/Space）打开，再点同一名称关闭，右上角 × 也可关闭。弹窗优先在名称右侧／左侧；手机空间不足时移至上方／下方并限制高度，避免遮挡触发名称。NPC 与道具使用实线下划线，保持悬停显示。

## 2026-10-05 名称核对

以 kafuffu20 Classic World 简体中文详情页的 h1 名称为显示标准，核对 163 个地图、NPC、怪物条目；逐条结果见 `data/name-audit.json`。旧名称保留为别名，页面通过统一显示层规范化，不改动任务 ID 或物品账本。资料站仅提供英文的条目按英文原名显示；两张同名蘑菇村保留第一／第二张的区分说明。来自视频的高等级区域描述仍标注说明性翻译，不冒充资料站正式名称。
