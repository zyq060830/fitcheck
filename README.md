# CheckFit

一个 `AI 健身私教` Web MVP，当前已经支持：

- 抖音分享链接解析
- 接近真实产品版的视频内容解析流水线
- 视频截图 OCR 与字幕补充
- OpenAI 兼容接口的 LLM 总结与冲突归因
- 动作库的收藏、删除、标签筛选和本地持久化
- 训练计划生成、打卡完成状态和历史记录

## 本地运行

建议使用内置 Python 服务启动，这样前端可以访问 `/api/douyin/resolve` 和 `/api/ai/analyze`。

```bash
python3 server.py
```

启动后访问 [http://localhost:4173](http://localhost:4173)。

如果 `4173` 已被占用，可以这样启动：

```bash
PORT=4174 python3 server.py
```

## 一键本地联调

当前仓库已经把 `Douyin_TikTok_Download_API` 拉到 `external/Douyin_TikTok_Download_API`，并调整为本地开发端口 `2333`。

先启动外部 Douyin API：

```bash
cd external/Douyin_TikTok_Download_API
source .venv39/bin/activate
python start.py
```

再启动 CheckFit：

```bash
DOUYIN_API_BASE='http://localhost:2333' PORT=4179 python3 server.py
```

然后访问：

- `Douyin API`：`http://localhost:2333/docs`
- `CheckFit`：`http://localhost:4179`

## 使用说明

1. 在页面顶部填入抖音分享链接或分享口令，点击“解析并导入视频”
2. 如有截图，可上传图片并执行 OCR，把文字自动填入字幕区
3. 可手动粘贴字幕，再点击“把当前字幕生成一条待分析内容”
4. 如需真实 LLM 分析，填写 `API Base`、`API Key` 和 `模型名`
5. 如需真实视频内容解析，再填写 `ASR 模型`，例如 `gpt-4o-mini-transcribe` 或 `whisper-1`
6. 如已部署开源 Douyin API，可填写 `Douyin API Base`，例如 `http://localhost:2333`
7. 点击“真实解析视频内容”，后端会优先尝试：
   - 调用开源 Douyin API 获取元数据和直链
   - 失败时回退到本地 `yt-dlp + 服务端托管 Cookie`
8. 后端随后继续执行：
   - 解析链接得到 `video_id`
   - 下载视频文件或直链媒体
   - 用 macOS 原生 `AVFoundation` 提取音频与关键帧
   - 用 macOS 原生 `Vision` 对关键帧做 OCR
   - 合并元数据、转写文本和 OCR 文本
   - 再调用 LLM 输出观点、动作和计划建议
9. 选择至少两条内容，点击“开始 AI 分析”
10. 分析后动作会自动进入动作库，可收藏、删除、按标签筛选
11. 点击“基于动作库生成计划”，再对训练日进行打卡

## 开源 Douyin API 接入

当前版本兼容两类常见路径：

- `http://localhost:2333/api?url=...`
- `http://localhost:2333/api/hybrid/video_data?url=...`

页面中的 `Douyin API 模式` 可选：

- `auto`：先尝试 `hybrid`，再尝试 `classic`
- `hybrid`：只走 `/api/hybrid/video_data`
- `classic`：只走 `/api`

如果你希望通过环境变量而不是页面配置，也支持：

```bash
export DOUYIN_API_BASE='http://localhost:2333'
export DOUYIN_API_MODE='auto'
export DOUYIN_API_KEY='your-token-if-needed'
python3 server.py
```

## 服务端托管 Cookie

推荐使用以下任一方式在服务端配置抖音 Cookie：

- 环境变量 `DOUYIN_COOKIE`
- 环境变量 `DOUYIN_COOKIE_1`、`DOUYIN_COOKIE_2` 等多份轮询
- 文件 `secrets/douyin_cookie.txt`
- 目录 `secrets/douyin_cookies/*.txt`

文件内容支持三种格式：

- 纯 Cookie 字符串
- `Cookie: xxx`
- 浏览器复制出来的 `cURL`

示例：

```bash
export DOUYIN_COOKIE='passport_csrf_token=xxx; ttwid=xxx'
python3 server.py
```

或：

```bash
mkdir -p secrets/douyin_cookies
printf 'Cookie: passport_csrf_token=xxx; ttwid=xxx\n' > secrets/douyin_cookies/main.txt
python3 server.py
```

如需在本地开发阶段继续尝试浏览器 Cookie 回退，可额外设置：

```bash
ALLOW_BROWSER_COOKIE_FALLBACK=1 python3 server.py
```

## 技术说明

- 前端：原生 HTML / CSS / JavaScript
- OCR：浏览器侧 `Tesseract.js`
- 服务端媒体流水线：`Swift + AVFoundation + Vision`
- 视频下载：项目内 `.venv` 中的 `yt-dlp`
- 后端：Python 标准库 HTTP 服务
- LLM：通过本地后端转发到 OpenAI 兼容接口

## 当前限制

- 抖音页面结构可能变动，外部 Douyin API 返回字段也可能随版本变化
- 抖音视频下载常常需要新鲜 cookies；如果服务端托管的 Cookie 过期，真实视频流水线可能会失败
- OCR 质量取决于截图清晰度和文字遮挡情况
- ASR 与 LLM 分析需要你自行提供可用的模型接口配置
