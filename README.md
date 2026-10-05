# GMSCW_Mage_Task

MapleStory Classic World 四职业开荒手册。基于奇怪小鸭全职业原文，提供魔法师92步、弓箭手94步、战士86步、飞侠89步；各路线含共用开局、职业初期任务、21级后共用任务和二转。

在线访问：https://chenwasrunning.github.io/GMSCW_rookie_guidance/

## 使用

直接用浏览器打开 `dist/index.html`，或在项目中运行 `python3 -m http.server 8080 --directory dist`，访问 http://localhost:8080 。无构建依赖，无需账号或游戏登录。

- 左侧 checkbox 完成任务，整行灰显；滑动开关展开／收起完成行。
- 顶部始终显示最靠前未完成任务、所需消耗、获得与注意事项。
- 右侧显示完成当前任务后的预计等级、累计材料背包；43 个本地游戏图标。
- 材料获得累加、交付扣除，撤销自动回滚。乱序完成会提示库存缺口。
- 新设备默认从空白清单开始；未设置 identifier 时在本机保存。
- 顶部输入 1–200 个字符的 identifier，点击“创建并保存”保存当前进度，后续勾选自动同步。重名会提示选择其他字符串，不覆盖已有进度。
- 换设备输入同一 identifier，点击“读取进度”。identifier 区分大小写，忽略首尾空格，统一 Unicode NFC。知道 identifier 的人可以读取和修改进度，请使用不易猜到的字符串，不要使用密码或个人敏感信息。
- 断网保留本机修改，支持重试；多设备同时修改使用版本检查，冲突时明确提示读取云端或另建副本。不会连接游戏读取背包。
- `dist/GMSCW_Mage_Task.xlsx` 提供 92 步完整流程与 777 行逐步背包快照。Excel 完成栏用下拉 ☑ 灰显，实时背包与动画位于网页。

## 数据口径

等级是攻略路线目标／估计。数量是按路线收齐所列材料后的计划库存；未知额外掉落、未知奖励、药品使用、卖出与金币余额不假造。早期额外掉落可抵扣后续收集目标，不能重复多刷一份。全文见 `docs/source-transcript.txt`。四职业的材料收集和前置顺序分别整理；随机宝石及未明确款式的职业鞋不虚构确定奖励。

转写修正与假设见网页“阅读说明”和 Excel“使用说明”。法师职业鞋未给款式，保留文字待确认；桑拿服男蓝女红。图标使用 GMS v83 只作历史版本图示，不覆盖经典世界二测数值。

## 开发与验证

```sh
python3 scripts/build-data.py
node scripts/test-ledger.cjs
# optional: pip install openpyxl
python3 scripts/build-excel.py
# optional browser test: npm install playwright
node scripts/browser-test.cjs
```

`dist/tasks.json` / `dist/tasks.js` 由 `scripts/build-data.py` 同时生成。`dist/items.json` 记录图标对应的历史 GMS ID、英文名和来源。`scripts/fetch-assets.py` 可下载图标（需网络）。浏览器测试使用 macOS 已安装 Chrome，可按环境修改路径。

测试覆盖：累加、跨步骤保留、消耗、撤销、乱序缺口、全路线无负库存、当前任务选择、完成状态、滑动隐藏、刷新保存、手机无横向溢出、图片加载。WebMCP 工具经模拟页面注册接口验证；真实支持 WebMCP 的浏览器环境未提供。

## 来源与版权

- [奇怪小鸭：经典世界｜全职业胎教级从 1 级到二转任务流程](https://www.bilibili.com/video/BV1gQad6ZEJV/)（2026-09-30，用户提供转写）
- [MapleStory.io](https://maplestory.io/)：`/api/GMS/83/item/{id}/icon`，43 个图标均核对英文名和 PNG 格式。

MapleStory 图像素材版权属于 NEXON。本项目为个人学习用任务记录工具，与 NEXON 无隶属关系。

## 部署与同步

GitHub Pages 使用 `.github/workflows/pages.yml` 将 `dist/` 发布为静态网页。仓库 Settings → Pages 的 Source 为 GitHub Actions。

跨设备存储由原项目的 Sites Worker + D1 提供，API 在 `server/worker.mjs`。数据库只保存 identifier 的 SHA-256、完成任务 ID、修订号与更新时间，不保存明文 identifier，也不提供记录列表。CORS 允许本项目的 GitHub Pages 和 Sites 域名。identifier 是唯一的访问凭据，不是实名账号或密码登录。

后端构建：`npm ci && npm run build`。数据库 schema 位于 `db/schema.ts`，使用 `npm run db:generate` 生成增量迁移。构建输出 `dist/client` 和 `dist/server` 被 Git 忽略，仅供 Sites 发布；GitHub Pages 不包含后端构建目录。

验证：`npm test`（Node 22.13+，使用内置 SQLite），`node scripts/test-cloud-browser.mjs`（需 Playwright 和 Chrome）。新增测试覆盖创建、重复、Unicode/空格处理、读取、撤销、乐观并发、断网刷新/重试和手机布局。

## 英文名称与地图提示

中文游戏名称显示下划线：鼠标悬停或键盘聚焦显示英文，手机点按查看。地图名称附经典世界大地图高亮；每个任务的“地图”和每阶段的“阶段地图”可查看相关地点。室内／隐藏地图以入口或所属区域定位；近似位置明确标注。

资料、逐条来源、别名与坐标精度说明见 [docs/name-map-sources.md](docs/name-map-sources.md)。共 206 个词条、251 种名称／别名，覆盖全部 92 步路线。

地图交互：地图名称保留虚线下划线，仅点击（或 Enter/Space）打开，再点同一名称关闭，右上角 × 也可关闭。弹窗优先在名称右侧／左侧；手机空间不足时移至上方／下方并限制高度，避免遮挡触发名称。NPC 与道具使用实线下划线，保持悬停显示。

全部 92 个步骤标题（含顶部当前任务）支持实线下划线和英文悬停。已核对的游戏任务名与攻略自拟步骤译文分别注明；名称数据在 `data/task-titles.json`。

## 四职业路线

页面顶部选择职业，进度分别保留；同一个 identifier 同步四条路线的完成 ID 集合。旧法师 q001–q092、原本地保存键和旧 identifier 不变；新职业使用 a/w/t 前缀。切换只改查看路线，不提交或清空其他职业进度。新的本机旅程会清空四职业本机进度，云端记录保留。

`python3 scripts/build-routes.py` 生成另外三条路线及后端允许的任务 ID；`npm run build` 生成名称数据和部署目录。Excel 可运行 `python3 scripts/build-excel.py archer`（另有 warrior、thief）。新任务标题的说明性英文见 `data/route-title-translations.json`；不是游戏官方任务名的条目均有说明。

验证包含逐步材料账本、旧法师状态兼容、四职业切换／批量完成／刷新、跨设备保存和冲突处理。

当前公开网址：https://chenwasrunning.github.io/GMSCW_rookie_guidance/ 。职业顺序：战士、法师、飞侠、射手。删除当前 identifier 需确认并校验云端版本；删除全部职业云端记录，保留本机清单。旧 identifier 与本机保存键沿用，仓库更名不迁移或清空数据库。
