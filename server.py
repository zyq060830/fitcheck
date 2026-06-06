#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import uuid
from dataclasses import dataclass
from html import unescape
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
ARTIFACTS_DIR = ROOT / "artifacts"
RUNS_DIR = ARTIFACTS_DIR / "runs"
SECRETS_DIR = ROOT / "secrets"
MANAGED_COOKIE_FILE = SECRETS_DIR / "douyin_cookie.txt"
MANAGED_COOKIE_DIR = SECRETS_DIR / "douyin_cookies"
DEFAULT_PORT = 4173
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
)
YTDLP_BIN = ROOT / ".venv" / "bin" / "yt-dlp"
SWIFT_BIN = Path("/usr/bin/swift")
MEDIA_PIPELINE_SWIFT = ROOT / "media_pipeline.swift"


@dataclass
class DouyinMetadata:
    input_text: str
    resolved_url: str
    title: str
    creator: str
    description: str
    cover_url: str
    transcript: str
    video_id: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "input_text": self.input_text,
            "resolved_url": self.resolved_url,
            "title": self.title,
            "creator": self.creator,
            "description": self.description,
            "cover_url": self.cover_url,
            "transcript": self.transcript,
            "video_id": self.video_id,
        }


def ensure_directories() -> None:
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    SECRETS_DIR.mkdir(parents=True, exist_ok=True)


def extract_first_url(text: str) -> str:
    match = re.search(r"https?://[^\s]+", text)
    if not match:
        raise ValueError("没有在输入内容里找到链接。")
    return match.group(0).rstrip(".,)`]>\"'")


def extract_share_text_hints(text: str) -> dict[str, str]:
    cleaned = text.strip()
    without_url = re.sub(r"https?://[^\s]+", "", cleaned)
    without_noise = re.sub(r"\b[a-z]{2,6}:/.*$", "", without_url, flags=re.IGNORECASE).strip()
    bracket_parts = re.findall(r"【([^】]+)】", without_noise)

    creator = ""
    title = ""
    title_suffix = ""
    if bracket_parts:
        if len(bracket_parts) >= 2 and "作品" in bracket_parts[0]:
            creator = bracket_parts[0].replace("的作品", "").strip()
            title = bracket_parts[1].strip()
            suffix_match = re.search(rf"【{re.escape(bracket_parts[1])}】([^`]+)", without_noise)
            if suffix_match:
                title_suffix = suffix_match.group(1).strip(" ，。.!！?？")
        elif len(bracket_parts) >= 2:
            creator = bracket_parts[0].strip()
            title = bracket_parts[1].strip()
        elif len(bracket_parts) == 1:
            title = bracket_parts[0].strip()

    if title and title_suffix:
        title = f"{title} {title_suffix}".strip()

    if not title:
        match = re.search(r"看看(.+?)(?:\s{2,}|https?://|$)", without_noise)
        if match:
            title = re.sub(r"[`]+", "", match.group(1)).strip(" ，。.!！?？")

    description = re.sub(r"[`]+", "", without_noise)
    description = re.sub(r"\s+", " ", description)
    return {
        "title": title,
        "creator": creator,
        "description": description[:200].strip(),
    }


def fetch_url(url: str) -> tuple[str, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept-Language": "zh-CN,zh;q=0.9"})
    with urlopen(request, timeout=20) as response:
        body = response.read().decode("utf-8", errors="ignore")
        final_url = response.geturl()
    return final_url, body


def clean_text(value: str) -> str:
    value = unescape(value or "")
    value = re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), value)
    value = value.replace("\\n", "\n").replace("\\/", "/").replace('\\"', '"')
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def pick_first(patterns: list[str], text: str) -> str:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE | re.DOTALL)
        if match:
            return clean_text(match.group(1))
    return ""


def extract_video_id(url: str) -> str:
    for pattern in [r"/video/(\d+)", r"modal_id=(\d+)", r"aweme_id=(\d+)"]:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return ""


def parse_douyin_metadata(input_text: str) -> DouyinMetadata:
    source_url = extract_first_url(input_text)
    share_hints = extract_share_text_hints(input_text)
    resolved_url, html = fetch_url(source_url)
    video_id = extract_video_id(resolved_url)

    title = pick_first(
        [
            r'<meta\s+property="og:title"\s+content="([^"]+)"',
            r'<meta\s+name="title"\s+content="([^"]+)"',
            r"<title>([^<]+)</title>",
            r'"desc"\s*:\s*"([^"]+)"',
        ],
        html,
    )
    description = pick_first(
        [
            r'<meta\s+property="og:description"\s+content="([^"]+)"',
            r'<meta\s+name="description"\s+content="([^"]+)"',
            r'"desc"\s*:\s*"([^"]+)"',
        ],
        html,
    )
    creator = pick_first(
        [
            r'<meta\s+name="author"\s+content="([^"]+)"',
            r'"nickname"\s*:\s*"([^"]+)"',
            r'"authorName"\s*:\s*"([^"]+)"',
            r'"author"\s*:\s*\{[^}]*"nickname"\s*:\s*"([^"]+)"',
        ],
        html,
    )
    cover_url = pick_first(
        [
            r'<meta\s+property="og:image"\s+content="([^"]+)"',
            r'"cover"\s*:\s*\{[^}]*"url_list"\s*:\s*\["([^"]+)"',
            r'"dynamic_cover"\s*:\s*\{[^}]*"url_list"\s*:\s*\["([^"]+)"',
        ],
        html,
    )
    transcript = pick_first(
        [
            r'"subtitle_infos"\s*:\s*\[(.*?)\]',
            r'"video_subtitles"\s*:\s*\[(.*?)\]',
            r'"caption"\s*:\s*"([^"]+)"',
        ],
        html,
    )

    if transcript.startswith("[") or "language_id" in transcript:
        transcript = clean_text(re.sub(r'"\w+"\s*:\s*', "", transcript))

    if not title and share_hints["title"]:
        title = share_hints["title"]
    if not description and share_hints["description"]:
        description = share_hints["description"]
    if not creator and share_hints["creator"]:
        creator = share_hints["creator"]

    if not title and description:
        title = description[:40]
    if not description and title:
        description = title
    if not creator:
        creator = "抖音创作者"

    return DouyinMetadata(
        input_text=input_text,
        resolved_url=resolved_url,
        title=title or "未解析出标题",
        creator=creator,
        description=description or "未解析出描述",
        cover_url=cover_url,
        transcript=transcript,
        video_id=video_id,
    )


def normalize_api_base(api_base: str) -> str:
    api_base = api_base.strip().rstrip("/")
    if api_base.endswith("/chat/completions"):
        return api_base
    return f"{api_base}/chat/completions"


def normalize_audio_api_base(api_base: str) -> str:
    api_base = api_base.strip().rstrip("/")
    if api_base.endswith("/audio/transcriptions"):
        return api_base
    return f"{api_base}/audio/transcriptions"


def normalize_external_api_base(api_base: str) -> str:
    return api_base.strip().rstrip("/")


def proxy_chat_completion(payload: dict[str, Any]) -> dict[str, Any]:
    api_key = payload.get("apiKey", "").strip()
    api_base = payload.get("apiBase", "").strip()
    model = payload.get("model", "").strip()
    messages = payload.get("messages", [])
    temperature = payload.get("temperature", 0.2)

    if not api_key or not api_base or not model:
        raise ValueError("缺少 LLM 配置，请填写 API Base、API Key 和模型名。")
    if not isinstance(messages, list) or not messages:
        raise ValueError("消息内容不能为空。")

    target = normalize_api_base(api_base)
    request_body = json.dumps(
        {
            "model": model,
            "temperature": temperature,
            "response_format": {"type": "json_object"},
            "messages": messages,
        }
    ).encode("utf-8")

    request = Request(
        target,
        data=request_body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": USER_AGENT,
        },
        method="POST",
    )

    with urlopen(request, timeout=60) as response:
        data = json.loads(response.read().decode("utf-8", errors="ignore"))

    choices = data.get("choices") or []
    if not choices:
        raise ValueError("模型没有返回可用内容。")

    content = choices[0].get("message", {}).get("content", "")
    if not content:
        raise ValueError("模型返回为空。")

    return {"content": content, "raw": data}


def run_command(command: list[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=str(cwd or ROOT), text=True, capture_output=True, check=False)


def get_douyin_api_settings(settings: dict[str, Any]) -> dict[str, str]:
    return {
        "base": normalize_external_api_base(str(settings.get("douyinApiBase") or os.environ.get("DOUYIN_API_BASE", ""))),
        "key": str(settings.get("douyinApiKey") or os.environ.get("DOUYIN_API_KEY", "")).strip(),
        "mode": str(settings.get("douyinApiMode") or os.environ.get("DOUYIN_API_MODE", "auto")).strip().lower() or "auto",
    }


def build_douyin_api_candidates(api_base: str, mode: str, source_url: str) -> list[dict[str, str]]:
    query = urlencode({"url": source_url})
    hybrid_minimal_query = urlencode({"url": source_url, "minimal": "true"})
    routes_by_mode = {
        "classic": [
            {"kind": "classic", "url": f"{api_base}/api?{query}"},
        ],
        "hybrid": [
            {"kind": "hybrid_minimal", "url": f"{api_base}/api/hybrid/video_data?{hybrid_minimal_query}"},
            {"kind": "hybrid_full", "url": f"{api_base}/api/hybrid/video_data?{query}"},
            {"kind": "aweme_id", "url": f"{api_base}/api/douyin/web/get_aweme_id?{query}"},
        ],
        "auto": [
            {"kind": "hybrid_minimal", "url": f"{api_base}/api/hybrid/video_data?{hybrid_minimal_query}"},
            {"kind": "hybrid_full", "url": f"{api_base}/api/hybrid/video_data?{query}"},
            {"kind": "aweme_id", "url": f"{api_base}/api/douyin/web/get_aweme_id?{query}"},
            {"kind": "classic", "url": f"{api_base}/api?{query}"},
        ],
    }
    routes = routes_by_mode.get(mode, routes_by_mode["auto"])
    return routes


def fetch_json_url(url: str, api_key: str = "") -> dict[str, Any]:
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json, text/plain;q=0.9, */*;q=0.8",
    }
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
        headers["X-API-Key"] = api_key
    request = Request(url, headers=headers)
    try:
        with urlopen(request, timeout=45) as response:
            return json.loads(response.read().decode("utf-8", errors="ignore"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore").strip()
        message = f"HTTP {exc.code}"
        if detail:
            message = f"{message}: {detail[:500]}"
        raise ValueError(message) from exc


def unwrap_external_api_payload(payload: dict[str, Any]) -> Any:
    if isinstance(payload, dict) and "data" in payload:
        return payload.get("data")
    return payload


def extract_aweme_id_from_payload(payload: Any) -> str:
    payload = unwrap_external_api_payload(payload)
    if isinstance(payload, str):
        cleaned = clean_text(payload)
        if cleaned.isdigit():
            return cleaned
    return first_numeric_string(payload, ["aweme_id", "video_id", "id"])


def build_external_download_url(api_base: str, source_url: str) -> str:
    return f"{api_base}/api/download?{urlencode({'url': source_url, 'prefix': 'false', 'with_watermark': 'false'})}"


def iter_external_api_payloads(source_url: str, settings: dict[str, Any]) -> tuple[list[dict[str, Any]], list[str]]:
    api_settings = get_douyin_api_settings(settings)
    api_base = api_settings["base"]
    if not api_base:
        return [], []

    payloads: list[dict[str, Any]] = []
    errors: list[str] = []
    seen_urls: set[str] = set()
    for candidate in build_douyin_api_candidates(api_base, api_settings["mode"], source_url):
        candidate_url = candidate["url"]
        if candidate_url in seen_urls:
            continue
        seen_urls.add(candidate_url)
        try:
            payload = fetch_json_url(candidate_url, api_settings["key"])
            candidate_kind = candidate["kind"]
            candidate_data = unwrap_external_api_payload(payload)
            if candidate_kind == "aweme_id":
                aweme_id = extract_aweme_id_from_payload(candidate_data)
                if not aweme_id:
                    raise ValueError("未拿到 aweme_id。")
                detail_url = f"{api_base}/api/douyin/web/fetch_one_video?{urlencode({'aweme_id': aweme_id})}"
                detail_payload = fetch_json_url(detail_url, api_settings["key"])
                payloads.append(
                    {
                        "kind": "fetch_one_video",
                        "api_url": detail_url,
                        "payload": unwrap_external_api_payload(detail_payload),
                        "raw_payload": detail_payload,
                    }
                )
                continue
            payloads.append(
                {
                    "kind": candidate_kind,
                    "api_url": candidate_url,
                    "payload": candidate_data,
                    "raw_payload": payload,
                }
            )
        except Exception as exc:
            errors.append(f"{candidate_url}: {exc}")
    return payloads, errors


def flatten_values(data: Any, prefix: str = "") -> list[tuple[str, Any]]:
    items: list[tuple[str, Any]] = []
    if isinstance(data, dict):
        for key, value in data.items():
            child_prefix = f"{prefix}.{key}" if prefix else str(key)
            items.append((child_prefix, value))
            items.extend(flatten_values(value, child_prefix))
    elif isinstance(data, list):
        for index, value in enumerate(data):
            child_prefix = f"{prefix}[{index}]"
            items.append((child_prefix, value))
            items.extend(flatten_values(value, child_prefix))
    return items


def first_non_empty_string(data: Any, key_hints: list[str]) -> str:
    lowered_hints = [hint.lower() for hint in key_hints]
    for path, value in flatten_values(data):
        if not isinstance(value, str):
            continue
        lower_path = path.lower()
        if any(hint in lower_path for hint in lowered_hints):
            cleaned = clean_text(value)
            if cleaned in {"{}", "[]", "null", "None"}:
                continue
            if cleaned:
                return cleaned
    return ""


def first_numeric_string(data: Any, key_hints: list[str]) -> str:
    lowered_hints = [hint.lower() for hint in key_hints]
    for path, value in flatten_values(data):
        if not isinstance(value, (str, int)):
            continue
        lower_path = path.lower()
        if any(hint in lower_path for hint in lowered_hints):
            cleaned = clean_text(str(value))
            if cleaned.isdigit():
                return cleaned
    return ""


def first_url_by_priority(data: Any, prioritized_hints: list[str]) -> str:
    url_candidates: list[tuple[str, str]] = []
    for path, value in flatten_values(data):
        if isinstance(value, str) and value.startswith(("http://", "https://")):
            url_candidates.append((path.lower(), value))
    if not url_candidates:
        return ""

    lowered_hints = [hint.lower() for hint in prioritized_hints]
    for hint in lowered_hints:
        for path, value in url_candidates:
            if hint in path:
                return value
    return url_candidates[0][1]


def resolve_metadata_with_external_api(input_text: str, settings: dict[str, Any]) -> DouyinMetadata | None:
    api_settings = get_douyin_api_settings(settings)
    api_base = api_settings["base"]
    if not api_base:
        return None

    source_url = extract_first_url(input_text)
    share_hints = extract_share_text_hints(input_text)
    payloads, errors = iter_external_api_payloads(source_url, settings)
    for item in payloads:
        try:
            payload = item["payload"]
            title = first_non_empty_string(payload, ["title", "desc", "aweme_detail.desc"]) or share_hints["title"] or "未解析出标题"
            creator = first_non_empty_string(payload, ["nickname", "unique_id", "sec_uid"]) or share_hints["creator"] or "抖音创作者"
            description = first_non_empty_string(payload, ["desc", "title", "text"]) or share_hints["description"] or title
            cover_url = first_url_by_priority(payload, ["cover", "dynamic_cover", "origin_cover", "image"])
            transcript = first_non_empty_string(payload, ["subtitle", "caption", "text_extra", "content"])
            resolved_url = first_non_empty_string(payload, ["original_url", "url", "share_url", "video_url"]) or source_url
            video_id = first_numeric_string(payload, ["aweme_id", "video_id", "id"])
            if not video_id:
                video_id = extract_video_id(resolved_url)
            return DouyinMetadata(
                input_text=input_text,
                resolved_url=resolved_url,
                title=title,
                creator=creator,
                description=description,
                cover_url=cover_url,
                transcript=transcript,
                video_id=video_id,
            )
        except Exception as exc:
            errors.append(f"{item['api_url']}: {exc}")
    raise ValueError("外部 Douyin API 解析失败。\n" + "\n".join(errors))


def normalize_manual_cookies(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""

    curl_match = re.search(r"""Cookie:\s*([^"'\n]+)""", raw, flags=re.IGNORECASE)
    if curl_match:
        raw = curl_match.group(1).strip()
    elif raw.lower().startswith("cookie:"):
        raw = raw.split(":", 1)[1].strip()
    else:
        header_lines = []
        for line in raw.splitlines():
            line = line.strip()
            if not line:
                continue
            if ":" in line and "=" not in line.split(":", 1)[0]:
                continue
            header_lines.append(line)
        if header_lines and all("=" in line for line in header_lines):
            raw = "; ".join(line.rstrip(";") for line in header_lines)

    raw = raw.strip().strip("'\"")
    raw = re.sub(r"\s*;\s*", "; ", raw)
    return raw


def load_managed_cookie_pool() -> list[tuple[str, str]]:
    pool: list[tuple[str, str]] = []

    def add_cookie(source_name: str, value: str) -> None:
        normalized = normalize_manual_cookies(value)
        if normalized:
            pool.append((source_name, normalized))

    env_names = sorted(name for name in os.environ if name == "DOUYIN_COOKIE" or name.startswith("DOUYIN_COOKIE_"))
    for env_name in env_names:
        add_cookie(f"env:{env_name}", os.environ.get(env_name, ""))

    if MANAGED_COOKIE_FILE.exists():
        add_cookie(f"file:{MANAGED_COOKIE_FILE.name}", MANAGED_COOKIE_FILE.read_text(encoding="utf-8", errors="ignore"))

    if MANAGED_COOKIE_DIR.exists():
        for path in sorted(MANAGED_COOKIE_DIR.glob("*.txt")):
            add_cookie(f"file:{path.name}", path.read_text(encoding="utf-8", errors="ignore"))

    deduped: list[tuple[str, str]] = []
    seen: set[str] = set()
    for source_name, cookie in pool:
        if cookie not in seen:
            seen.add(cookie)
            deduped.append((source_name, cookie))
    return deduped


def allow_browser_cookie_fallback() -> bool:
    return os.environ.get("ALLOW_BROWSER_COOKIE_FALLBACK", "").strip().lower() in {"1", "true", "yes", "on"}


def build_browser_cookie_strategies(cookie_mode: str) -> list[tuple[str, list[str]]]:
    cookie_mode = (cookie_mode or "auto").strip().lower()
    if cookie_mode in {"none", "off"}:
        return [("none", [])]
    if cookie_mode in {"safari", "chrome", "edge", "firefox"}:
        return [(cookie_mode, ["--cookies-from-browser", cookie_mode])]
    return [
        ("none", []),
        ("safari", ["--cookies-from-browser", "safari"]),
        ("chrome", ["--cookies-from-browser", "chrome"]),
        ("edge", ["--cookies-from-browser", "edge"]),
        ("firefox", ["--cookies-from-browser", "firefox"]),
    ]


def build_cookie_strategies(cookie_mode: str, manual_cookies: str) -> list[tuple[str, list[str]]]:
    strategies: list[tuple[str, list[str]]] = []
    manual_cookies = normalize_manual_cookies(manual_cookies)
    if manual_cookies:
        return [("manual", ["--add-header", f"Cookie: {manual_cookies}"])]

    for source_name, cookie in load_managed_cookie_pool():
        strategies.append((f"managed:{source_name}", ["--add-header", f"Cookie: {cookie}"]))

    if strategies:
        if allow_browser_cookie_fallback():
            strategies.extend(build_browser_cookie_strategies(cookie_mode))
        return strategies

    return build_browser_cookie_strategies(cookie_mode)


def ensure_yt_dlp_available() -> Path:
    if YTDLP_BIN.exists():
        return YTDLP_BIN
    candidate = shutil.which("yt-dlp")
    if candidate:
        return Path(candidate)
    raise ValueError("未找到 yt-dlp。请先在项目内安装，或确保系统环境存在 yt-dlp。")


def explain_download_errors(errors: list[str], manual_cookies: str) -> str:
    guidance: list[str] = ["视频下载失败。"]
    managed_cookie_count = len(load_managed_cookie_pool())

    if any("operation not permitted" in item.lower() and "safari" in item.lower() for item in errors):
        guidance.append("Safari 自动读取失败是本机权限问题。生产环境建议不要依赖浏览器 Cookies，而是使用服务端托管 Cookie。")

    if any("fresh cookies" in item.lower() for item in errors):
        guidance.append("抖音要求新鲜 Cookies。当前服务端持有的 Cookie 可能已经过期，需要由服务端更新托管 Cookie。")

    if any("could not find firefox cookies database" in item.lower() for item in errors):
        guidance.append("Firefox 本机没有可用配置，可以忽略这条。")

    if manual_cookies:
        guidance.append("当前请求带了手动 Cookie，但仍然失败，说明这份 Cookie 也可能不够新。")
    elif managed_cookie_count > 0:
        guidance.append(f"服务端当前已加载 {managed_cookie_count} 份托管 Cookie，但都未通过下载校验。请刷新并替换 `secrets` 目录或环境变量中的 Cookie。")
    else:
        guidance.append("服务端当前没有可用的托管 Cookie。请在部署环境中配置 `DOUYIN_COOKIE`，或写入 `secrets/douyin_cookie.txt`。")

    if allow_browser_cookie_fallback():
        guidance.append("当前已开启浏览器 Cookie 回退，但浏览器本地读取仍然可能因为权限或时效失败。")

    guidance.append("详细日志：")
    guidance.extend(errors)
    return "\n".join(guidance)


def download_direct_media(media_url: str, run_dir: Path, strategy: str = "external_api_media_url", referer: str = "https://www.douyin.com/") -> dict[str, Any]:
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "*/*",
    }
    if referer:
        headers["Referer"] = referer
    request = Request(media_url, headers=headers)
    output_path = run_dir / "video.mp4"
    with urlopen(request, timeout=60) as response:
        output_path.write_bytes(response.read())
    if not output_path.exists() or output_path.stat().st_size == 0:
        raise ValueError("外部 Douyin API 已返回视频地址，但下载后文件为空。")
    return {
        "strategy": strategy,
        "video_path": str(output_path),
        "source_media_url": media_url,
    }


def resolve_media_with_external_api(source_url: str, settings: dict[str, Any]) -> dict[str, Any] | None:
    api_settings = get_douyin_api_settings(settings)
    api_base = api_settings["base"]
    if not api_base:
        return None

    payloads, errors = iter_external_api_payloads(source_url, settings)
    for item in payloads:
        try:
            payload = item["payload"]
            media_url = first_url_by_priority(
                payload,
                [
                    "nwm_video_url_hq",
                    "nwm_video_url_hd",
                    "nwm_video_url",
                    "wm_video_url_hq",
                    "wm_video_url",
                    "video_data",
                    "play_addr",
                    "play",
                    "download",
                    "url_list",
                    "video_url",
                ],
            )
            if not media_url:
                raise ValueError("未找到可下载视频地址。")
            return {
                "api_url": item["api_url"],
                "api_payload": payload,
                "media_url": media_url,
                "download_url": build_external_download_url(api_base, source_url),
            }
        except Exception as exc:
            errors.append(f"{item['api_url']}: {exc}")

    download_url = build_external_download_url(api_base, source_url)
    if payloads:
        return {
            "api_url": download_url,
            "api_payload": payloads[0]["payload"],
            "media_url": "",
            "download_url": download_url,
        }
    raise ValueError("外部 Douyin API 未返回可下载视频地址。\n" + "\n".join(errors))


def try_download_video(source_url: str, run_dir: Path, cookie_mode: str, manual_cookies: str) -> dict[str, Any]:
    yt_dlp_bin = ensure_yt_dlp_available()
    output_template = run_dir / "video.%(ext)s"
    strategies = build_cookie_strategies(cookie_mode, manual_cookies)
    errors: list[str] = []

    for strategy_name, strategy_args in strategies:
        command = [
            str(yt_dlp_bin),
            "--no-playlist",
            "--no-warnings",
            "--format",
            "best",
            "--print",
            "after_move:filepath",
            "-o",
            str(output_template),
            *strategy_args,
            source_url,
        ]
        result = run_command(command)
        if result.returncode == 0:
            lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
            if not lines:
                errors.append(f"{strategy_name}: 未返回下载路径")
                continue
            file_path = Path(lines[-1])
            if not file_path.exists():
                errors.append(f"{strategy_name}: 下载结果文件不存在")
                continue
            return {
                "strategy": strategy_name,
                "video_path": str(file_path),
                "stdout": result.stdout,
                "stderr": result.stderr,
            }
        stderr = (result.stderr or result.stdout).strip()
        errors.append(f"{strategy_name}: {stderr or '下载失败'}")

    raise ValueError(explain_download_errors(errors, manual_cookies))


def run_media_pipeline(video_path: str, run_dir: Path) -> dict[str, Any]:
    if not SWIFT_BIN.exists():
        raise ValueError("系统缺少 swift，无法执行媒体流水线。")
    if not MEDIA_PIPELINE_SWIFT.exists():
        raise ValueError("缺少 media_pipeline.swift。")

    media_dir = run_dir / "media"
    media_dir.mkdir(parents=True, exist_ok=True)

    command = [str(SWIFT_BIN), str(MEDIA_PIPELINE_SWIFT), "analyze", video_path, str(media_dir)]
    result = run_command(command)
    if result.returncode != 0:
        raise ValueError(f"媒体处理失败：{(result.stderr or result.stdout).strip()}")
    return json.loads(result.stdout)


def transcribe_audio(audio_path: str, api_base: str, api_key: str, asr_model: str) -> str:
    if not api_base or not api_key or not asr_model:
        return ""

    target = normalize_audio_api_base(api_base)
    command = [
        "/usr/bin/curl",
        "-sS",
        target,
        "-H",
        f"Authorization: Bearer {api_key}",
        "-F",
        f"model={asr_model}",
        "-F",
        f"file=@{audio_path}",
        "-F",
        "language=zh",
        "-F",
        "response_format=json",
    ]
    result = run_command(command)
    if result.returncode != 0:
        raise ValueError((result.stderr or result.stdout).strip() or "音频转写失败")

    data = json.loads(result.stdout or "{}")
    return str(data.get("text", "")).strip()


def file_to_public_path(path: str) -> str:
    absolute = Path(path).resolve()
    try:
        relative = absolute.relative_to(ROOT)
    except ValueError:
        return ""
    return "/" + relative.as_posix()


def compact_lines(texts: list[str]) -> list[str]:
    items: list[str] = []
    seen: set[str] = set()
    for block in texts:
        for line in block.splitlines():
            cleaned = line.strip()
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                items.append(cleaned)
    return items


def build_structured_content(metadata: DouyinMetadata, media_result: dict[str, Any], transcript: str) -> dict[str, Any]:
    frame_items = media_result.get("frames", [])
    ocr_lines = compact_lines([str(item.get("text", "")) for item in frame_items])
    combined_text = "\n".join(
        [
            metadata.title,
            metadata.description,
            transcript,
            "\n".join(ocr_lines),
        ]
    ).strip()

    return {
        "video_id": metadata.video_id,
        "title": metadata.title,
        "creator": metadata.creator,
        "description": metadata.description,
        "resolved_url": metadata.resolved_url,
        "transcript": transcript,
        "ocr_lines": ocr_lines,
        "combined_text": combined_text,
        "duration_sec": media_result.get("durationSec", 0),
        "frames": [
            {
                "time_sec": item.get("timeSec", 0),
                "image_path": item.get("imagePath", ""),
                "image_url": file_to_public_path(item.get("imagePath", "")),
                "text": item.get("text", ""),
            }
            for item in frame_items
        ],
    }


def merge_external_metadata(base_metadata: DouyinMetadata, api_payload: dict[str, Any]) -> DouyinMetadata:
    title = first_non_empty_string(api_payload, ["title", "desc"]) or base_metadata.title
    creator = first_non_empty_string(api_payload, ["nickname", "unique_id", "sec_uid"]) or base_metadata.creator
    description = first_non_empty_string(api_payload, ["desc", "title", "text"]) or base_metadata.description
    transcript = first_non_empty_string(api_payload, ["subtitle", "caption", "content"]) or base_metadata.transcript
    cover_url = first_url_by_priority(api_payload, ["cover", "dynamic_cover", "origin_cover", "image"]) or base_metadata.cover_url
    resolved_url = first_non_empty_string(api_payload, ["original_url", "share_url", "url"]) or base_metadata.resolved_url
    video_id = first_numeric_string(api_payload, ["aweme_id", "video_id", "id"]) or base_metadata.video_id or extract_video_id(resolved_url)
    return DouyinMetadata(
        input_text=base_metadata.input_text,
        resolved_url=resolved_url,
        title=title,
        creator=creator,
        description=description,
        cover_url=cover_url,
        transcript=transcript,
        video_id=video_id,
    )


def analyze_single_video_content(structured_content: dict[str, Any], settings: dict[str, Any]) -> dict[str, Any] | None:
    api_base = str(settings.get("apiBase", "")).strip()
    api_key = str(settings.get("apiKey", "")).strip()
    model = str(settings.get("model", "")).strip()
    if not api_base or not api_key or not model:
        return None

    messages = [
        {
            "role": "system",
            "content": (
                "你是面向大体重人群的健身视频分析助手。请只输出 JSON。"
                "请始终优先从安全起步、低冲击、关节负担、动作门槛和可持续执行角度分析，"
                "不要输出泛健身、爆汗挑战、狠练减脂式结论。"
                "JSON 必须包含 topic, summary, stance, conditions, suitability, short_reason, joint_load, risks, exercises, plan_advice。"
                "suitability 只能是 可直接做、需要调整、暂不推荐 之一。"
                "short_reason 是一句 4 到 8 个字的短解释，比如 冲击太大、先降难度、环境要跟上。"
                "joint_load 是字符串数组，表示主要负担部位，比如 膝踝、下背、心肺、手腕、肩。"
                "risks 和 plan_advice 是字符串数组。"
                "exercises 是数组，每项包含 name, muscles, cue, mistake, alternative, difficulty, joint_load。"
                "exercise.joint_load 也是字符串数组。"
                "如果原始内容里动作不明确，就尽量根据语义给出保守抽取，并优先给出低冲击替代动作。请用简体中文。"
            ),
        },
        {
            "role": "user",
            "content": json.dumps(structured_content, ensure_ascii=False, indent=2),
        },
    ]
    result = proxy_chat_completion(
        {
            "apiBase": api_base,
            "apiKey": api_key,
            "model": model,
            "messages": messages,
            "temperature": 0.2,
        }
    )
    try:
        analysis = json.loads(result["content"])
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", result["content"])
        if not match:
            raise ValueError("单视频 LLM 分析返回内容不是有效 JSON。")
        analysis = json.loads(match.group(0))
    return normalize_single_video_analysis(analysis)


def normalize_single_video_analysis(analysis: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(analysis, dict):
        return {}

    suitability = str(analysis.get("suitability", "")).strip()
    if suitability not in {"可直接做", "需要调整", "暂不推荐"}:
        risks_text = " ".join(str(item) for item in analysis.get("risks", []) if item)
        source_text = " ".join(
            [
                str(analysis.get("summary", "")),
                str(analysis.get("stance", "")),
                risks_text,
            ]
        )
        if re.search(r"跑步|开合跳|波比|跳绳|高冲击|爆发", source_text):
            suitability = "暂不推荐"
        elif re.search(r"深蹲|弓步|俯卧撑|平板|硬拉|门槛|支撑", source_text):
            suitability = "需要调整"
        else:
            suitability = "可直接做"

    short_reason = str(analysis.get("short_reason", "")).strip()
    if not short_reason:
        short_reason = {
            "暂不推荐": "冲击太大",
            "需要调整": "先降难度",
            "可直接做": "更好起步",
        }.get(suitability, "更稳妥")

    joint_load = analysis.get("joint_load", [])
    if not isinstance(joint_load, list):
        joint_load = [str(joint_load)] if joint_load else []
    joint_load = [str(item).strip() for item in joint_load if str(item).strip()]

    normalized_exercises: list[dict[str, Any]] = []
    for exercise in analysis.get("exercises", []) if isinstance(analysis.get("exercises", []), list) else []:
        if not isinstance(exercise, dict):
            continue
        exercise_joint_load = exercise.get("joint_load", [])
        if not isinstance(exercise_joint_load, list):
            exercise_joint_load = [str(exercise_joint_load)] if exercise_joint_load else []
        exercise_joint_load = [str(item).strip() for item in exercise_joint_load if str(item).strip()]
        normalized_exercises.append(
            {
                "name": str(exercise.get("name", "")).strip(),
                "muscles": exercise.get("muscles", []),
                "cue": str(exercise.get("cue", "")).strip(),
                "mistake": str(exercise.get("mistake", "")).strip(),
                "alternative": str(exercise.get("alternative", "")).strip(),
                "difficulty": str(exercise.get("difficulty", "")).strip(),
                "joint_load": exercise_joint_load,
            }
        )

    analysis["suitability"] = suitability
    analysis["short_reason"] = short_reason
    analysis["joint_load"] = joint_load
    analysis["exercises"] = normalized_exercises
    return analysis


def run_video_pipeline(payload: dict[str, Any]) -> dict[str, Any]:
    input_text = str(payload.get("input", "")).strip()
    if not input_text:
        raise ValueError("请输入抖音分享链接或分享口令。")

    settings = payload.get("settings", {}) if isinstance(payload.get("settings", {}), dict) else {}
    metadata = parse_douyin_metadata(input_text)
    run_id = uuid.uuid4().hex[:12]
    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)

    cookie_mode = str(payload.get("cookieMode", "auto"))
    manual_cookies = str(payload.get("manualCookies", ""))
    resolver_mode = "local_fallback"
    resolver_message = ""

    try:
        external_media = resolve_media_with_external_api(metadata.resolved_url or extract_first_url(input_text), settings)
        if external_media:
            download_errors: list[str] = []
            download_result: dict[str, Any] | None = None
            if external_media.get("media_url"):
                try:
                    download_result = download_direct_media(external_media["media_url"], run_dir)
                except Exception as exc:
                    download_errors.append(f"media_url: {exc}")
            if not download_result and external_media.get("download_url"):
                try:
                    download_result = download_direct_media(
                        external_media["download_url"],
                        run_dir,
                        strategy="external_api_download",
                        referer="",
                    )
                except Exception as exc:
                    download_errors.append(f"download_url: {exc}")
            if not download_result:
                raise ValueError("；".join(download_errors) or "外部 Douyin API 下载失败。")
            metadata = merge_external_metadata(metadata, external_media["api_payload"])
            resolver_mode = "external_api"
            resolver_message = external_media["api_url"]
        else:
            download_result = try_download_video(metadata.resolved_url or input_text, run_dir, cookie_mode, manual_cookies)
    except Exception as external_exc:
        resolver_message = str(external_exc)
        download_result = try_download_video(metadata.resolved_url or input_text, run_dir, cookie_mode, manual_cookies)

    media_result = run_media_pipeline(download_result["video_path"], run_dir)

    transcript = metadata.transcript
    audio_path = media_result.get("audioPath")
    asr_model = str(settings.get("asrModel", "")).strip()
    if audio_path:
        try:
            transcript = transcribe_audio(
                audio_path,
                str(settings.get("apiBase", "")).strip(),
                str(settings.get("apiKey", "")).strip(),
                asr_model,
            ) or transcript
        except Exception as exc:
            transcript = transcript or ""
            settings["asr_error"] = str(exc)

    structured_content = build_structured_content(metadata, media_result, transcript)
    llm_analysis = None
    try:
        llm_analysis = analyze_single_video_content(structured_content, settings)
    except Exception as exc:
        settings["llm_error"] = str(exc)

    return {
        "run_id": run_id,
        "metadata": metadata.to_dict(),
        "download": {
            "strategy": download_result["strategy"],
            "video_path": download_result["video_path"],
            "video_url": file_to_public_path(download_result["video_path"]),
        },
        "media": {
            "duration_sec": media_result.get("durationSec", 0),
            "audio_path": media_result.get("audioPath", ""),
            "audio_url": file_to_public_path(media_result.get("audioPath", "")) if media_result.get("audioPath") else "",
            "frames": structured_content["frames"],
        },
        "structured_content": structured_content,
        "analysis": llm_analysis,
        "warnings": {
            "asr": settings.get("asr_error", ""),
            "llm": settings.get("llm_error", ""),
        },
        "service_runtime": {
            "managed_cookie_count": len(load_managed_cookie_pool()),
            "browser_cookie_fallback": allow_browser_cookie_fallback(),
            "external_api_configured": bool(get_douyin_api_settings(settings)["base"]),
            "resolver_mode": resolver_mode,
            "resolver_message": resolver_message,
        },
    }


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path == "/api/health":
            external_api_settings = get_douyin_api_settings({})
            self.respond_json(
                {
                    "ok": True,
                    "message": "CheckFit backend is running",
                    "managed_cookie_count": len(load_managed_cookie_pool()),
                    "browser_cookie_fallback": allow_browser_cookie_fallback(),
                    "external_api_configured": bool(external_api_settings["base"]),
                    "external_api_mode": external_api_settings["mode"],
                }
            )
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/api/douyin/resolve":
            self.handle_douyin_resolve()
            return
        if self.path == "/api/video/pipeline":
            self.handle_video_pipeline()
            return
        if self.path == "/api/ai/analyze":
            self.handle_ai_analyze()
            return
        self.respond_json({"ok": False, "error": "Not Found"}, status=HTTPStatus.NOT_FOUND)

    def parse_json_body(self) -> dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8", errors="ignore")
        return json.loads(raw or "{}")

    def handle_douyin_resolve(self) -> None:
        try:
            payload = self.parse_json_body()
            input_text = str(payload.get("input", "")).strip()
            if not input_text:
                raise ValueError("请输入抖音分享链接或分享口令。")
            settings = payload.get("settings", {}) if isinstance(payload.get("settings", {}), dict) else {}
            resolver_mode = "local_parse"
            resolver_message = ""
            try:
                metadata = resolve_metadata_with_external_api(input_text, settings) or parse_douyin_metadata(input_text)
                if get_douyin_api_settings(settings)["base"]:
                    resolver_mode = "external_api"
            except Exception as exc:
                metadata = parse_douyin_metadata(input_text)
                resolver_mode = "local_parse"
                resolver_message = str(exc)
            self.respond_json(
                {
                    "ok": True,
                    "video": metadata.to_dict(),
                    "service_runtime": {
                        "external_api_configured": bool(get_douyin_api_settings(settings)["base"]),
                        "resolver_mode": resolver_mode,
                        "resolver_message": resolver_message,
                    },
                }
            )
        except (ValueError, HTTPError, URLError) as exc:
            self.respond_json({"ok": False, "error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover
            self.respond_json({"ok": False, "error": f"解析失败: {exc}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_video_pipeline(self) -> None:
        try:
            payload = self.parse_json_body()
            result = run_video_pipeline(payload)
            self.respond_json({"ok": True, **result})
        except (ValueError, HTTPError, URLError) as exc:
            self.respond_json({"ok": False, "error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover
            self.respond_json({"ok": False, "error": f"视频解析流水线失败: {exc}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

    def handle_ai_analyze(self) -> None:
        try:
            payload = self.parse_json_body()
            result = proxy_chat_completion(payload)
            self.respond_json({"ok": True, **result})
        except (ValueError, HTTPError, URLError) as exc:
            self.respond_json({"ok": False, "error": str(exc)}, status=HTTPStatus.BAD_REQUEST)
        except Exception as exc:  # pragma: no cover
            self.respond_json({"ok": False, "error": f"AI 调用失败: {exc}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)

    def respond_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def main() -> None:
    ensure_directories()
    port = int(os.environ.get("PORT", DEFAULT_PORT))
    server = ThreadingHTTPServer(("0.0.0.0", port), AppHandler)
    print(f"CheckFit server running at http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
