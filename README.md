# GMSCW_Mage_Task

MapleStory Classic World 法师 1–32+ 级开荒手册。基于用户提供的奇怪小鸭视频转写，整理 92 个法师／共用路线步骤。

在线访问：https://chenwasrunning.github.io/GMSCW_Mage_Task/

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

等级是攻略路线目标／估计。数量是按路线收齐所列材料后的计划库存；未知额外掉落、未知奖励、药品使用、卖出与金币余额不假造。早期额外掉落可抵扣后续收集目标，不能重复多刷一份。全文见 `docs/source-transcript.txt`。其他职业专属路线不纳入。

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
