const STORAGE_KEYS = {
  settings: "fitcheck.settings.v4",
  videos: "checkfit.catalog.v3",
  library: "checkfit.library.v3",
  currentPlan: "checkfit.plan.current.v3",
  planHistory: "checkfit.plan.history.v3",
  planQueue: "checkfit.plan.queue.v1",
};

const CATEGORY_ORDER = ["下肢🦵", "上肢💪", "核心⬜", "有氧🏃", "热身🔥", "拉伸🧘"];
const SAMPLE_SHARE_TEXT =
  "1.79 复制打开抖音，看看【小硕硕塑身的作品】【7min长视频】练背全过程超详细的！ 为的就是没... https://v.douyin.com/iByEJTPYSpI/ xfb:/ :6pm 04/20 C@H.Iv";
const QUICK_TOPIC_KNOWLEDGE = {
  大体重跑跳: {
    a: "先跑先跳才掉秤快",
    aContent: "有些内容会鼓励直接上跑步、开合跳、波比，觉得只要够累就更快燃脂。",
    b: "先低冲击建立耐受",
    bContent: "对大体重人群来说，先从快走、坐姿有氧、低冲击力量开始，更容易坚持也更安全。",
    verdict: "对大体重起步阶段，更重要的是关节负担和持续性，不是第一周就把强度拉满。",
    insight: "先把身体愿意动起来，比一开始拼命跳更重要。",
  },
  低冲击减脂: {
    a: "燃脂就得爆汗跳操",
    aContent: "很多视频会把高冲击跳操当作减脂标配，默认越累越有效。",
    b: "低冲击也能减脂",
    bContent: "只要训练频率稳定、总活动量提升，快走、低冲击循环和坐姿有氧同样能帮助减脂。",
    verdict: "减脂并不等于高冲击，对大体重人群更该优先选择身体能承受的方式。",
    insight: "有效减脂不靠硬扛，而靠你能持续做下去。",
  },
  膝盖友好训练: {
    a: "膝盖不舒服就别练腿",
    aContent: "担心负担过大，于是完全跳过下肢训练。",
    b: "改动作比停动作更重要",
    bContent: "通过减小幅度、增加支撑和降低冲击，很多下肢动作都能调整成更友好的版本。",
    verdict: "关键不是完全不练，而是把动作改成关节更能接受的版本。",
    insight: "先做关节能接受的训练，身体才会越来越敢动。",
  },
  大体重力量入门: {
    a: "先全做有氧，等瘦了再练力量",
    aContent: "担心力量训练门槛高，于是把所有起步都押在有氧上。",
    b: "从友好力量训练开始",
    bContent: "利用靠墙、椅子、弹力带这些支撑，力量训练能帮助建立稳定和更好的日常活动能力。",
    verdict: "对大体重人群，力量训练不是等以后再做，而是可以从低门槛版本同步开始。",
    insight: "让身体更稳，很多动作才会越来越轻松。",
  },
  "跑步伤膝盖": {
    a: "跑步会伤膝盖",
    aContent: "如果跑姿不稳、体重管理差、突然上强度，跑步确实可能让膝关节不舒服。",
    b: "跑步不一定伤膝盖",
    bContent: "合理进阶、控制训练量、配合力量训练时，跑步本身并不是膝盖问题的唯一原因。",
    verdict: "真正关键不是跑不跑，而是训练量管理、跑姿和下肢力量是否跟上。",
    insight: "跑步不是原罪，失控的训练量才更容易让膝盖抱怨。",
  },
  "空腹有氧": {
    a: "空腹有氧更燃脂",
    aContent: "空腹状态更容易动用脂肪供能，所以很多人把它当成减脂捷径。",
    b: "空腹有氧不是核心",
    bContent: "整体热量缺口、力量训练和长期执行度，比是否空腹更决定减脂效果。",
    verdict: "空腹有氧可以作为工具，但不该代替整体训练和饮食策略。",
    insight: "减脂靠的是长期可执行，不是某一个时段的神奇状态。",
  },
  "女生撸铁": {
    a: "女生别练太重",
    aContent: "担心练壮、线条变粗，所以建议轻重量多次数。",
    b: "女生也要力量训练",
    bContent: "多数女生更难练得很壮，合理力量训练反而更利于塑形和提升代谢。",
    verdict: "不是完全回避重量，而是要学会动作标准、渐进加量和恢复管理。",
    insight: "塑形不是躲开重量，而是学会聪明地使用重量。",
  },
  "深蹲姿势": {
    a: "深蹲膝盖别过脚尖",
    aContent: "担心膝盖压力太大，所以强调蹲的时候膝盖要尽量靠后。",
    b: "膝盖过脚尖不一定错",
    bContent: "不同身材比例和动作风格下，膝盖略过脚尖很常见，关键是整体受力是否稳定。",
    verdict: "与其死盯膝盖位置，不如先保证足底稳定、脊柱中立和膝盖方向一致。",
    insight: "动作标准不是一条死线，而是整体协调和受力稳定。",
  },
  "仰卧起坐": {
    a: "每天卷腹就能练出腹肌",
    aContent: "高频做仰卧起坐能让腹部更紧，更容易看到线条。",
    b: "腹肌不只靠仰卧起坐",
    bContent: "体脂率、整体力量训练和核心稳定能力更影响腹肌是否明显。",
    verdict: "仰卧起坐只是局部刺激，腹肌显现更依赖整体训练和饮食管理。",
    insight: "腹肌是练出来的，也是瘦出来的。",
  },
  蛋白粉: {
    a: "新手没必要喝蛋白粉",
    aContent: "饮食先吃够就行，补剂不是第一优先级。",
    b: "蛋白粉能提高补充效率",
    bContent: "当日常蛋白摄入不稳定时，蛋白粉是方便的补充工具。",
    verdict: "蛋白粉不是必须，但在饮食难补足时很实用。",
    insight: "补剂不是魔法，胜在方便和稳定。",
  },
  "有氧时长": {
    a: "有氧越久越好",
    aContent: "延长有氧时长能多消耗热量，所以越练越有效。",
    b: "有氧也要适量",
    bContent: "过量有氧会挤占恢复，影响力量训练和整体执行。",
    verdict: "有氧不是越久越好，够用并能长期坚持才更重要。",
    insight: "好计划不是把你练垮，而是让你下周还能继续练。",
  },
  "热身时长": {
    a: "热身随便动两下就行",
    aContent: "很多人觉得热身浪费时间，随便活动就开始正式训练。",
    b: "热身要有针对性",
    bContent: "根据当天训练内容激活相关关节和肌群，正式组会更稳定。",
    verdict: "热身不必太长，但要和当天训练目标匹配。",
    insight: "好的热身不是走流程，而是给主训练铺路。",
  },
};

const MOVE_RULES = [
  ["跑步", { name: "快走", muscles: ["心肺", "下肢"], category: "有氧🏃" }],
  ["开合跳", { name: "侧步开合", muscles: ["心肺", "下肢"], category: "热身🔥" }],
  ["波比", { name: "斜板支撑进退", muscles: ["全身"], category: "核心⬜" }],
  ["跳绳", { name: "原地提膝走", muscles: ["心肺", "下肢"], category: "有氧🏃" }],
  ["深蹲", { name: "椅子辅助深蹲", muscles: ["股四头肌", "臀大肌"], category: "下肢🦵" }],
  ["臀桥", { name: "臀桥", muscles: ["臀大肌"], category: "下肢🦵" }],
  ["硬拉", { name: "髋铰链练习", muscles: ["臀大肌", "腘绳肌"], category: "下肢🦵" }],
  ["划船", { name: "坐姿划船", muscles: ["上背", "肱二头肌"], category: "上肢💪" }],
  ["下拉", { name: "弹力带下拉", muscles: ["背阔肌", "肱二头肌"], category: "上肢💪" }],
  ["俯卧撑", { name: "墙壁俯卧撑", muscles: ["胸大肌", "肱三头肌"], category: "上肢💪" }],
  ["侧平举", { name: "侧平举", muscles: ["三角肌"], category: "上肢💪" }],
  ["卷腹", { name: "死虫", muscles: ["腹直肌", "核心"], category: "核心⬜" }],
  ["平板支撑", { name: "斜板支撑", muscles: ["核心"], category: "核心⬜" }],
  ["快走", { name: "快走", muscles: ["心肺", "下肢"], category: "有氧🏃" }],
  ["拉伸", { name: "全身拉伸", muscles: ["全身"], category: "拉伸🧘" }],
];

const DEFAULT_PLAN_MOVES = {
  低冲击有氧: [
    { name: "快走", muscles: ["心肺", "下肢"] },
    { name: "侧步开合", muscles: ["心肺", "下肢"] },
    { name: "坐姿拳击", muscles: ["心肺", "上肢"] },
  ],
  关节友好下肢: [
    { name: "椅子辅助深蹲", muscles: ["股四头肌", "臀大肌"] },
    { name: "臀桥", muscles: ["臀大肌"] },
    { name: "靠墙静蹲", muscles: ["股四头肌", "臀大肌"] },
  ],
  上肢支撑: [
    { name: "坐姿划船", muscles: ["上背", "肱二头肌"] },
    { name: "墙壁俯卧撑", muscles: ["胸大肌", "肱三头肌"] },
    { name: "弹力带下拉", muscles: ["背阔肌", "肱二头肌"] },
  ],
  核心激活: [
    { name: "死虫", muscles: ["核心"] },
    { name: "鸟狗", muscles: ["核心", "后链"] },
    { name: "坐姿收腹抬腿", muscles: ["核心"] },
  ],
  全身激活: [
    { name: "椅子坐站", muscles: ["下肢", "臀大肌"] },
    { name: "站姿弹力带划船", muscles: ["上背", "肱二头肌"] },
    { name: "侧步触碰", muscles: ["心肺", "下肢"] },
  ],
};

const PLAN_TEMPLATES = {
  大体重7天启动: {
    goal: "安全起步",
    level: "新手",
    days: "2",
    duration: "10",
    scene: "居家",
    equipment: "无器械",
    note: "先建立运动耐受，不追求爆汗和高冲击。",
  },
  膝盖友好燃脂: {
    goal: "低冲击减脂",
    level: "新手",
    days: "3",
    duration: "15",
    scene: "居家+健身房",
    equipment: "无器械",
    note: "避免跑跳和连续高冲击，优先快走和支撑动作。",
  },
  居家低冲击: {
    goal: "安全起步",
    level: "新手",
    days: "3",
    duration: "20",
    scene: "居家",
    equipment: "弹力带/小器械",
    note: "希望在家里开始动起来，减少关节压力。",
  },
  久坐激活: {
    goal: "改善体态",
    level: "新手",
    days: "3",
    duration: "15",
    scene: "居家",
    equipment: "弹力带/小器械",
    note: "久坐较多，先从激活和轻强度循环开始。",
  },
};

const defaultVideos = [
  {
    id: "v1",
    title: "大体重减脂就该直接跑步跳操？",
    creator: "爆汗挑战营",
    topic: "大体重跑跳",
    stance: "只要先把心率拉高、拼命跑跳，掉秤才会快。",
    conditions: "更适合关节耐受较好、已经有稳定运动基础的人。",
    risk: "对大体重起步阶段来说，跑跳和波比这类动作更容易让膝踝和下背先受不了。",
    takeaway: "高冲击并不等于更适合起步。",
    description: "主张大体重人群也应该直接上跑跳和高冲击训练。",
    transcript: "",
    sourceType: "demo",
    sourceUrl: "",
    cover: "",
    exercises: [
      { name: "开合跳", muscles: "心肺 / 下肢", cue: "快速提心率。", mistake: "落地过重。", alternative: "侧步开合", difficulty: "中" },
      { name: "波比简化版", muscles: "全身", cue: "连续完成。", mistake: "腰塌。", alternative: "斜板支撑进退", difficulty: "中" },
    ],
  },
  {
    id: "v2",
    title: "大体重起步先做低冲击训练",
    creator: "关节友好教练阿泽",
    topic: "低冲击减脂",
    stance: "先从快走、椅子辅助深蹲和坐姿有氧开始，更容易坚持下去。",
    conditions: "适合大体重起步阶段、膝盖和脚踝压力明显的人群。",
    risk: "如果忽视支撑和动作幅度，仍可能因为动作过深或节奏过快而不舒服。",
    takeaway: "先建立耐受和稳定，再慢慢加量，减脂效率反而更稳。",
    description: "强调低冲击和关节友好的起步方案。",
    transcript: "",
    sourceType: "demo",
    sourceUrl: "",
    cover: "",
    exercises: [
      { name: "快走间歇", muscles: "心肺 / 下肢", cue: "保持能说话的节奏。", mistake: "开局太猛。", alternative: "坐姿拳击", difficulty: "低" },
      { name: "椅子辅助深蹲", muscles: "臀腿 / 核心", cue: "先坐后站，借助椅子控制幅度。", mistake: "起身时憋气。", alternative: "椅子坐站", difficulty: "低" },
    ],
  },
  {
    id: "v3",
    title: "膝盖不舒服就别练下肢了吗",
    creator: "身体状态研究所",
    topic: "膝盖友好训练",
    stance: "膝盖不舒服时应该先把动作改轻、改稳，而不是完全不练。",
    conditions: "适合膝盖压力明显、站久容易累的大体重人群。",
    risk: "如果继续做大幅度深蹲或跳跃，膝盖可能更容易抗拒训练。",
    takeaway: "加支撑、减冲击、降幅度，很多动作还是可以做。",
    description: "强调膝盖友好版本的重要性。",
    transcript: "",
    sourceType: "demo",
    sourceUrl: "",
    cover: "",
    exercises: [
      { name: "臀桥", muscles: "臀部 / 后链", cue: "顶峰收臀。", mistake: "用腰发力。", alternative: "靠墙臀桥", difficulty: "低" },
      { name: "靠墙静蹲", muscles: "臀腿", cue: "停在可控角度。", mistake: "蹲太深。", alternative: "椅子辅助深蹲", difficulty: "低" },
    ],
  },
  {
    id: "v4",
    title: "大体重也可以开始力量训练",
    creator: "友好起步实验室",
    topic: "大体重力量入门",
    stance: "力量训练不用等瘦了再开始，先用靠墙、椅子和弹力带做友好版本就行。",
    conditions: "适合想增强稳定性、减少日常活动吃力感的人。",
    risk: "如果一上来追求标准版俯卧撑或高强度深蹲，容易因为门槛过高而放弃。",
    takeaway: "力量训练可以从低门槛版本开始，并不是以后再说。",
    description: "强调大体重人群也能安全开始力量训练。",
    transcript: "",
    sourceType: "demo",
    sourceUrl: "",
    cover: "",
    exercises: [
      { name: "墙壁俯卧撑", muscles: "胸肩 / 手臂", cue: "手放高一点更好起步。", mistake: "耸肩。", alternative: "桌面俯卧撑", difficulty: "低" },
      { name: "站姿弹力带划船", muscles: "背部 / 手臂", cue: "肩胛先收紧。", mistake: "耸肩代偿。", alternative: "坐姿划船", difficulty: "低" },
    ],
  },
];

const state = {
  settings: loadFromStorage(STORAGE_KEYS.settings, {
    apiBase: "",
    apiKey: "",
    model: "",
    asrModel: "",
    douyinApiBase: "http://localhost:2333",
    douyinApiKey: "",
    douyinApiMode: "auto",
  }),
  videos: loadStoredVideos(),
  selectedVideoIds: ["v1", "v2"],
  library: normalizeStoredLibrary(loadFromStorage(STORAGE_KEYS.library, [])),
  detectedMoves: [],
  currentPlan: loadFromStorage(STORAGE_KEYS.currentPlan, null),
  planHistory: loadFromStorage(STORAGE_KEYS.planHistory, []),
  planQueue: normalizePlanQueue(loadFromStorage(STORAGE_KEYS.planQueue, [])),
  compareResult: null,
  libraryFilter: "all",
  tagFilter: "all",
};

const screens = {
  launch: document.getElementById("screen-launch"),
  home: document.getElementById("screen-home"),
  compare: document.getElementById("screen-compare"),
  plan: document.getElementById("screen-plan"),
  library: document.getElementById("screen-library"),
};

const els = {
  libraryBadge: document.getElementById("library-badge"),
  settingsSheet: document.getElementById("settings-sheet"),
  settingsStatus: document.getElementById("settings-status"),
  homeQuickInput: document.getElementById("home-quick-input"),
  compareRawInput: document.getElementById("compare-raw-input"),
  compareRawStatus: document.getElementById("compare-raw-status"),
  parseStatusText: document.getElementById("parse-status-text"),
  parseFallbackNote: document.getElementById("parse-fallback-note"),
  parseStepLink: document.getElementById("parse-step-link"),
  parseStepVideo: document.getElementById("parse-step-video"),
  parseStepOcr: document.getElementById("parse-step-ocr"),
  parseStepInsight: document.getElementById("parse-step-insight"),
  postImportCta: document.getElementById("post-import-cta"),
  compareTopicInput: document.getElementById("compare-topic-input"),
  compareLevel: document.getElementById("compare-level"),
  compareGoal: document.getElementById("compare-goal"),
  compareScene: document.getElementById("compare-scene"),
  compareEquipment: document.getElementById("compare-equipment"),
  compareDays: document.getElementById("compare-days"),
  compareDuration: document.getElementById("compare-duration"),
  compareLimitations: document.getElementById("compare-limitations"),
  compareLoading: document.getElementById("compare-loading"),
  compareResult: document.getElementById("compare-result"),
  compareResultTopic: document.getElementById("compare-result-topic"),
  compareViewATitle: document.getElementById("compare-viewa-title"),
  compareViewAContent: document.getElementById("compare-viewa-content"),
  compareViewBTitle: document.getElementById("compare-viewb-title"),
  compareViewBContent: document.getElementById("compare-viewb-content"),
  compareVerdict: document.getElementById("compare-verdict"),
  compareRecommendation: document.getElementById("compare-recommendation"),
  compareInsight: document.getElementById("compare-insight"),
  compareFriendlySummary: document.getElementById("compare-friendly-summary"),
  conflictCardList: document.getElementById("conflict-card-list"),
  compareAlternativeList: document.getElementById("compare-alternative-list"),
  compareEvidenceList: document.getElementById("compare-evidence-list"),
  compareConfidenceNote: document.getElementById("compare-confidence-note"),
  compareVideoList: document.getElementById("compare-video-list"),
  selectionSummary: document.getElementById("selection-summary"),
  ocrStatus: document.getElementById("ocr-status"),
  transcriptInput: document.getElementById("transcript-input"),
  planLoading: document.getElementById("plan-loading"),
  planOutput: document.getElementById("plan-output"),
  planHistoryPanel: document.getElementById("plan-history-panel"),
  planHistoryList: document.getElementById("plan-history-list"),
  planQueuePanel: document.getElementById("plan-queue-panel"),
  planQueueList: document.getElementById("plan-queue-list"),
  libraryLoading: document.getElementById("library-loading"),
  detectedMovesPanel: document.getElementById("detected-moves-panel"),
  detectedMovesList: document.getElementById("detected-moves-list"),
  libraryGroups: document.getElementById("library-groups"),
  libraryRawInput: document.getElementById("library-raw-input"),
  tagFilter: document.getElementById("library-tag-filter"),
};

hydrateSettings();
renderCompareVideos();
renderLibrary();
renderPlan();
renderPlanHistory();
renderPlanQueue();
resetParseProgress();
bindEvents();

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadStoredVideos() {
  const stored = loadFromStorage(STORAGE_KEYS.videos, []);
  const merged = [...defaultVideos];
  (Array.isArray(stored) ? stored : []).forEach((video) => {
    if (!merged.some((item) => item.id === video.id)) {
      merged.push(video);
    }
  });
  return merged;
}

function saveCatalog() {
  saveToStorage(
    STORAGE_KEYS.videos,
    state.videos.filter((video) => video.sourceType !== "demo")
  );
}

function saveLibrary() {
  saveToStorage(STORAGE_KEYS.library, state.library);
}

function savePlans() {
  saveToStorage(STORAGE_KEYS.currentPlan, state.currentPlan);
  saveToStorage(STORAGE_KEYS.planHistory, state.planHistory);
  saveToStorage(STORAGE_KEYS.planQueue, state.planQueue);
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function switchScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

function setCompareInput(value) {
  els.compareRawInput.value = value;
  if (els.homeQuickInput) {
    els.homeQuickInput.value = value;
  }
}

function fillSampleInput() {
  setCompareInput(SAMPLE_SHARE_TEXT);
  els.compareRawStatus.textContent = "示例已填入，可以直接开始解析。";
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function resetParseProgress(message = "等待开始") {
  [els.parseStepLink, els.parseStepVideo, els.parseStepOcr, els.parseStepInsight].forEach((step) => {
    if (step) {
      step.dataset.state = "idle";
    }
  });
  els.parseStatusText.textContent = message;
  els.parseFallbackNote.classList.add("hidden");
}

function setParseStep(step, state) {
  const node =
    step === "link"
      ? els.parseStepLink
      : step === "video"
        ? els.parseStepVideo
        : step === "ocr"
          ? els.parseStepOcr
          : els.parseStepInsight;
  if (node) {
    node.dataset.state = state;
  }
}

function showPostImportActions() {
  els.postImportCta.classList.remove("hidden");
}

function hidePostImportActions() {
  els.postImportCta.classList.add("hidden");
}

function getLatestImportedVideo() {
  return state.videos.find((video) => video.sourceType !== "demo") || null;
}

function sendLatestVideoToLibrary() {
  const latest = getLatestImportedVideo();
  if (!latest) {
    switchScreen("library");
    return;
  }
  els.libraryRawInput.value = [latest.title, latest.description, latest.transcript].filter(Boolean).join("\n");
  switchScreen("library");
}

function buildCompareSummaryText() {
  if (!state.compareResult) return "";
  return [
    `议题：${state.compareResult.topic || ""}`,
    `大体重友好度：${state.compareResult.friendlySummary?.label || ""}`,
    `观点A：${state.compareResult.viewA?.stance || ""}`,
    state.compareResult.viewA?.content || "",
    `观点B：${state.compareResult.viewB?.stance || ""}`,
    state.compareResult.viewB?.content || "",
    `柴教练判断：${state.compareResult.verdict || ""}`,
    `个性化建议：${state.compareResult.recommendation || ""}`,
    ...(state.compareResult.alternativeCards || []).map((item) => `替代动作：${item.current} -> ${item.alternative}`),
    `一句话洞察：${state.compareResult.insight || ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function copyCompareSummary() {
  const summary = buildCompareSummaryText();
  if (!summary) return;
  try {
    await navigator.clipboard.writeText(summary);
    window.alert("摘要已复制到剪贴板");
  } catch {
    window.alert("请手动复制");
  }
}

function normalizePlanQueue(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    id: item.id || uid("plan-queue"),
    name: item.name || "未命名动作",
    muscles: Array.isArray(item.muscles) ? item.muscles : String(item.muscles || "").split(/[、,/]/).filter(Boolean),
    category: item.category || inferCategoryFromName(item.name || ""),
    source: item.source || "动作库加入",
  }));
}

function inferEvidenceSources(selectedVideos, rawText = "") {
  const labels = new Set();
  if (rawText) {
    labels.add("标题/文案");
  }
  (selectedVideos || []).forEach((video) => {
    if (video.title || video.description) labels.add("标题/文案");
    if (video.transcript) labels.add("字幕");
    if (video.sourceType === "pipeline") labels.add("关键帧/OCR");
    if (video.sourceType === "demo") labels.add("示例知识库");
  });
  return [...labels];
}

function buildConfidenceNote(evidenceSources) {
  if (evidenceSources.includes("关键帧/OCR") && evidenceSources.includes("字幕")) {
    return "这次判断同时参考了画面文字、字幕和文案信息，可信度相对更高。";
  }
  if (evidenceSources.includes("字幕") || evidenceSources.includes("关键帧/OCR")) {
    return "这次判断已经不只依赖标题，还参考了视频中的部分内容线索。";
  }
  return "当前判断更多来自标题和文案线索，建议继续结合完整视频内容验证。";
}

function hydrateSettings() {
  document.getElementById("api-base").value = state.settings.apiBase || "";
  document.getElementById("api-key").value = state.settings.apiKey || "";
  document.getElementById("api-model").value = state.settings.model || "";
  document.getElementById("asr-model").value = state.settings.asrModel || "";
  document.getElementById("douyin-api-base").value = state.settings.douyinApiBase || "http://localhost:2333";
  document.getElementById("douyin-api-key").value = state.settings.douyinApiKey || "";
  document.getElementById("douyin-api-mode").value = state.settings.douyinApiMode || "auto";
}

function persistSettings() {
  state.settings = {
    apiBase: document.getElementById("api-base").value.trim(),
    apiKey: document.getElementById("api-key").value.trim(),
    model: document.getElementById("api-model").value.trim(),
    asrModel: document.getElementById("asr-model").value.trim(),
    douyinApiBase: document.getElementById("douyin-api-base").value.trim() || "http://localhost:2333",
    douyinApiKey: document.getElementById("douyin-api-key").value.trim(),
    douyinApiMode: document.getElementById("douyin-api-mode").value || "auto",
  };
  saveToStorage(STORAGE_KEYS.settings, state.settings);
}

function isLLMConfigured() {
  return Boolean(state.settings.apiBase && state.settings.apiKey && state.settings.model);
}

function cleanJsonText(input) {
  return String(input || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

function extractJson(input) {
  const cleaned = cleanJsonText(input);
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    throw error;
  }
}

async function callAI(messages, temperature = 0.2, maxTokens = 1000) {
  persistSettings();
  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiBase: state.settings.apiBase,
      apiKey: state.settings.apiKey,
      model: state.settings.model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "请重试");
  }
  return data.content;
}

function inferTopic(text) {
  const source = String(text || "");
  if (/大体重|体重大|体重基数|跑跳|开合跳|波比|跳绳/.test(source)) return "大体重跑跳";
  if (/低冲击|快走|坐姿有氧|椅子|侧步开合/.test(source)) return "低冲击减脂";
  if (/膝盖|膝|关节|脚踝/.test(source)) return "膝盖友好训练";
  if (/力量入门|墙壁俯卧撑|弹力带|靠墙|椅子辅助/.test(source)) return "大体重力量入门";
  if (/跑步|膝盖/.test(source)) return "跑步伤膝盖";
  if (/空腹|有氧/.test(source)) return "空腹有氧";
  if (/女生|撸铁|变壮|力量/.test(source)) return "女生撸铁";
  if (/深蹲|脚尖/.test(source)) return "深蹲姿势";
  if (/仰卧起坐|卷腹|腹肌/.test(source)) return "仰卧起坐";
  if (/蛋白粉|补剂/.test(source)) return "蛋白粉";
  if (/有氧.*多久|时长|跑多久/.test(source)) return "有氧时长";
  if (/热身/.test(source)) return "热身时长";
  if (/减脂|燃脂|热量/.test(source)) return "减脂训练策略";
  if (/背|下拉|划船/.test(source)) return "背部训练顺序";
  return "综合健身议题";
}

function buildCompareFallback(topic, profile) {
  const knowledge = QUICK_TOPIC_KNOWLEDGE[topic] || {
    a: "更激进的做法",
    aContent: "强调某个单点方法更高效，适合想快速看到变化的人。",
    b: "更稳妥的做法",
    bContent: "强调长期执行、基础动作和恢复管理，适合大多数普通训练者。",
    verdict: "冲突往往来自适用人群不同，不同阶段的建议不能直接套到所有人身上。",
    insight: "健身里最重要的不是最极端的观点，而是最适合你当下的做法。",
  };
  return {
    topic,
    viewA: { stance: knowledge.a, content: knowledge.aContent },
    viewB: { stance: knowledge.b, content: knowledge.bContent },
    verdict: knowledge.verdict,
    recommendation: `你当前是${profile.level}，目标是${profile.goal}，更推荐优先选择低冲击、能借助支撑、恢复压力更可控的方案。`,
    insight: knowledge.insight,
  };
}

function getCompareProfile() {
  return {
    level: els.compareLevel.value,
    goal: els.compareGoal.value,
    scene: els.compareScene.value,
    equipment: els.compareEquipment.value,
    days: Number(els.compareDays.value),
    duration: Number(els.compareDuration.value),
    limitations: els.compareLimitations.value.trim(),
  };
}

function normalizeCategory(category) {
  const map = { 无氧: "上肢💪", 有氧: "有氧🏃", 热身: "热身🔥", 拉伸: "拉伸🧘" };
  return map[category] || category || "上肢💪";
}

function inferCategoryFromName(name) {
  const label = String(name || "");
  if (/热身|开合跳|动态/.test(label)) return "热身🔥";
  if (/拉伸|放松|瑜伽/.test(label)) return "拉伸🧘";
  if (/跑|单车|快走|跳绳|有氧/.test(label)) return "有氧🏃";
  if (/卷腹|平板|核心|俄罗斯/.test(label)) return "核心⬜";
  if (/深蹲|臀|腿|弓步|硬拉|提踵/.test(label)) return "下肢🦵";
  return "上肢💪";
}

function inferExercisesFromText(text, topic) {
  const source = String(text || "");
  const matched = [];
  MOVE_RULES.forEach(([keyword, move]) => {
    if (source.includes(keyword)) {
      matched.push({
        name: move.name,
        muscles: (move.muscles || []).join(" / "),
        cue: `优先感受${(move.muscles || ["目标肌群"])[0]}发力，保持节奏稳定。`,
        mistake: "不要只追求次数，先保证动作路径稳定和呼吸节奏。",
        alternative: inferRiskMeta(move.name, move.muscles).alternative,
        difficulty: "低",
      });
    }
  });
  if (matched.length > 0) {
    return matched;
  }
  if (topic === "减脂训练策略") {
    return [
      { name: "快走间歇", muscles: "心肺 / 下肢", cue: "保持中等心率。", mistake: "开局强度太高。", alternative: "低冲击有氧", difficulty: "低" },
    ];
  }
  if (topic === "大体重跑跳" || topic === "低冲击减脂") {
    return [
      { name: "快走间歇", muscles: "心肺 / 下肢", cue: "保持还能正常说话的节奏。", mistake: "一上来就追求爆汗。", alternative: "坐姿拳击", difficulty: "低" },
      { name: "侧步开合", muscles: "心肺 / 下肢", cue: "脚步轻一点，重心稳定。", mistake: "动作做成跳跃版。", alternative: "原地提膝走", difficulty: "低" },
    ];
  }
  return [];
}

function buildImportedVideo(metadata, extraTranscript = "") {
  const rawText = [metadata.description, metadata.transcript, extraTranscript].filter(Boolean).join("\n");
  const topic = inferTopic(`${metadata.title}\n${rawText}`);
  return {
    id: uid("imported"),
    title: metadata.title || "导入的抖音视频",
    creator: metadata.creator || "抖音创作者",
    topic,
    stance: "",
    conditions: "等待 AI 提炼",
    risk: "等待 AI 提炼",
    takeaway: "等待 AI 提炼",
    description: metadata.description || "",
    transcript: [metadata.transcript, extraTranscript].filter(Boolean).join("\n"),
    sourceType: "douyin",
    sourceUrl: metadata.resolved_url || metadata.sourceUrl || "",
    cover: metadata.cover_url || metadata.cover || "",
    suitability: "",
    shortReason: "",
    jointLoad: [],
    exercises: inferExercisesFromText(rawText, topic),
  };
}

function buildPipelineVideo(result) {
  const analysis = result.analysis || {};
  const structured = result.structured_content || {};
  const topic = analysis.topic || inferTopic(structured.combined_text || result.metadata?.title || "");
  const combined = structured.combined_text || structured.transcript || result.metadata?.description || "";
  return {
    id: `pipeline-${result.run_id || uid("pipeline")}`,
    title: result.metadata?.title || "真实解析视频",
    creator: result.metadata?.creator || "抖音创作者",
    topic,
    stance: analysis.stance || analysis.summary || "系统已自动整理这条视频的核心观点。",
    conditions: analysis.conditions || "来自视频、字幕和画面文字的综合判断。",
    risk: Array.isArray(analysis.risks) && analysis.risks[0] ? analysis.risks[0] : "请注意动作标准和恢复管理。",
    takeaway: analysis.summary || "已完成真实视频内容解析",
    description: result.metadata?.description || "",
    transcript: structured.transcript || "",
    sourceType: "pipeline",
    sourceUrl: result.metadata?.resolved_url || "",
    cover: result.metadata?.cover_url || "",
    suitability: analysis.suitability || "",
    shortReason: analysis.short_reason || analysis.shortReason || "",
    jointLoad: normalizeTextList(analysis.joint_load || analysis.jointLoad || []),
    exercises: Array.isArray(analysis.exercises) && analysis.exercises.length > 0
      ? analysis.exercises.map((exercise) => ({
          ...exercise,
          jointLoad: exercise.joint_load || exercise.jointLoad || [],
        }))
      : inferExercisesFromText(combined, topic),
  };
}

function buildTranscriptVideo(transcript) {
  const firstLine = transcript.split("\n").find(Boolean) || "字幕导入内容";
  const topic = inferTopic(transcript);
  return {
    id: uid("transcript"),
    title: firstLine.slice(0, 28),
    creator: "手动字幕导入",
    topic,
    stance: "",
    conditions: "等待 AI 提炼",
    risk: "等待 AI 提炼",
    takeaway: "等待 AI 提炼",
    description: transcript.slice(0, 120),
    transcript,
    sourceType: "transcript",
    sourceUrl: "",
    cover: "",
    suitability: "",
    shortReason: "",
    jointLoad: [],
    exercises: inferExercisesFromText(transcript, topic),
  };
}

function getSelectedVideos() {
  return state.videos.filter((video) => state.selectedVideoIds.includes(video.id));
}

function renderCompareVideos() {
  const list = [...state.videos].sort((a, b) => (a.sourceType === "demo" ? 1 : 0) - (b.sourceType === "demo" ? 1 : 0));
  if (list.length === 0) {
    els.compareVideoList.innerHTML = `
      <article class="compare-empty-card">
        <strong>还没有待分析内容</strong>
        <p>先贴一个抖音链接，系统会把标题、作者、封面和解析结果带进来。</p>
      </article>
    `;
    els.selectionSummary.textContent = "已选 0 条内容";
    return;
  }
  els.compareVideoList.innerHTML = list
    .map((video) => {
      const selected = state.selectedVideoIds.includes(video.id);
      const summary = video.stance || video.description || video.transcript || "等待分析";
      const friendlyMeta = inferFriendlyMetaFromVideo(video);
      const sourceMeta =
        video.sourceType === "demo"
          ? { label: "系统示例", status: "可直接比较" }
          : video.sourceType === "pipeline"
            ? { label: "完整解析", status: "已完成安全评估" }
            : video.sourceType === "transcript"
              ? { label: "字幕补充", status: "文本导入" }
              : { label: "链接导入", status: "已导入内容" };
      const cover = video.cover
        ? `<img class="compare-video-cover" src="${escapeHtml(video.cover)}" alt="${escapeHtml(video.title)}" />`
        : `<div class="compare-video-cover placeholder">${escapeHtml((video.creator || "抖音").slice(0, 2))}</div>`;
      return `
        <article class="compare-video-card ${selected ? "selected" : ""}">
          <div class="compare-video-media">
            ${cover}
            <div class="compare-video-main">
              <div class="compare-video-head">
                <div>
                  <strong>${escapeHtml(video.title)}</strong>
                  <p>${escapeHtml(sourceMeta.label)} · ${escapeHtml(video.creator || "未知创作者")}</p>
                </div>
                <span class="mini-chip">${escapeHtml(video.topic || "待分类")}</span>
              </div>
              <div class="compare-video-meta">
                <span class="video-status-chip">${escapeHtml(sourceMeta.status)}</span>
                <span class="risk-chip risk-${escapeHtml(friendlyMeta.tone)}">${escapeHtml(friendlyMeta.label)}</span>
                ${video.sourceUrl ? `<span class="video-source-chip">含原链接</span>` : ""}
              </div>
              <p class="compare-video-copy">${escapeHtml(summary)}</p>
              <p class="helper-text">${escapeHtml(friendlyMeta.reason)}</p>
            </div>
          </div>
          <div class="compare-video-actions">
            <button class="${selected ? "secondary-action" : "ghost-action"}" type="button" data-video-id="${escapeHtml(video.id)}">
              ${selected ? "已加入分析" : "加入分析"}
            </button>
            ${video.sourceType !== "demo" ? `<button class="delete-btn" type="button" data-delete-video-id="${escapeHtml(video.id)}">✕</button>` : ""}
          </div>
        </article>
      `;
    })
    .join("");
  els.selectionSummary.textContent = `已选 ${state.selectedVideoIds.length} 条内容`;
}

async function extractTopic() {
  const raw = els.compareRawInput.value.trim();
  if (!raw) {
    window.alert("请先粘贴抖音文案或链接。");
    return;
  }
  els.compareRawStatus.textContent = "正在提取议题...";
  try {
    if (isLLMConfigured()) {
      const content = await callAI([
        { role: "system", content: '你是健身内容提炼助手。只输出 JSON。格式：{"topic":"议题标题"}。字符串中不要包含双引号。' },
        { role: "user", content: `请从下面文案中提炼最核心的健身议题：\n${raw}` },
      ]);
      const parsed = extractJson(content);
      els.compareTopicInput.value = parsed.topic || inferTopic(raw);
    } else {
      els.compareTopicInput.value = inferTopic(raw);
    }
    els.compareRawStatus.textContent = "议题已填入下方问题框。";
  } catch {
    els.compareRawStatus.textContent = "提取失败，已尝试本地识别。";
    els.compareTopicInput.value = inferTopic(raw);
  }
}

function addImportedVideoToState(video) {
  state.videos.unshift(video);
  state.selectedVideoIds = [video.id, ...state.selectedVideoIds.filter((id) => id !== video.id)];
  saveCatalog();
  renderCompareVideos();
  showPostImportActions();
}

async function resolveDouyinLink(options = {}) {
  const input = (options.input || els.compareRawInput.value).trim();
  if (!input) {
    if (!options.silent) {
      window.alert("请先粘贴抖音链接或分享口令。");
    }
    return;
  }
  persistSettings();
  if (!options.fromFallback) {
    resetParseProgress("正在识别分享内容...");
    setParseStep("link", "active");
  } else {
    els.parseFallbackNote.classList.remove("hidden");
    setParseStep("link", "done");
    setParseStep("video", "error");
  }
  els.compareRawStatus.textContent = options.fromFallback ? "完整解析失败，正在自动回退到内容导入..." : "正在导入内容...";
  try {
    const response = await fetch("/api/douyin/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, settings: state.settings }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "请重试");
    }
    const imported = buildImportedVideo(data.video, els.transcriptInput.value.trim());
    addImportedVideoToState(imported);
    if (data.video.transcript) {
      els.transcriptInput.value = [els.transcriptInput.value.trim(), data.video.transcript].filter(Boolean).join("\n");
    }
    setParseStep("link", "done");
    els.parseStatusText.textContent = options.fromFallback ? "已回退为内容导入，你仍然可以继续分析。" : "已完成内容导入，可以继续加入对比。";
    els.compareRawStatus.textContent = options.fromFallback
      ? `完整解析失败，已自动导入：${imported.title}`
      : `已导入：${imported.title}`;
    return imported;
  } catch (error) {
    if (!options.fromFallback) {
      setParseStep("link", "error");
      els.parseStatusText.textContent = "内容导入失败";
    }
    els.compareRawStatus.textContent = error.message || "请重试";
    if (!options.silent) {
      window.alert("请重试");
      return null;
    }
    throw error;
  }
}

async function importFromDouyinLink() {
  const input = els.compareRawInput.value.trim();
  if (!input) {
    window.alert("请先粘贴抖音链接或分享内容。");
    return;
  }
  persistSettings();
  hidePostImportActions();
  resetParseProgress("正在识别链接并获取视频...");
  setParseStep("link", "active");
  setParseStep("video", "active");
  els.compareRawStatus.textContent = "正在读懂抖音内容...";
  try {
    const response = await fetch("/api/video/pipeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, settings: state.settings }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "请重试");
    }
    setParseStep("link", "done");
    setParseStep("video", "done");
    els.parseStatusText.textContent = "已拿到视频，正在整理画面和文字...";
    setParseStep("ocr", "active");
    await sleep(120);
    setParseStep("ocr", "done");
    setParseStep("insight", "active");
    const video = buildPipelineVideo(data);
    addImportedVideoToState(video);
    if (video.transcript) {
      els.transcriptInput.value = video.transcript;
    }
    ingestExercises([{ id: video.id, topic: video.topic, exercises: video.exercises }]);
    els.compareTopicInput.value = video.topic || inferTopic(video.description || video.transcript);
    setParseStep("insight", "done");
    els.parseStatusText.textContent = "已完成完整解析，可以直接开始对比。";
    els.compareRawStatus.textContent = `已读懂视频：${video.title}`;
  } catch (error) {
    setParseStep("link", "done");
    setParseStep("video", "error");
    setParseStep("ocr", "idle");
    setParseStep("insight", "idle");
    els.parseFallbackNote.classList.remove("hidden");
    els.parseStatusText.textContent = "完整解析失败，正在自动回退到内容导入...";
    try {
      await resolveDouyinLink({ input, silent: true, fromFallback: true });
    } catch {
      els.parseStatusText.textContent = "完整解析和内容导入都失败了";
      els.compareRawStatus.textContent = error.message || "请重试";
      window.alert("请重试");
    }
  }
}

async function runOCR() {
  const fileInput = document.getElementById("ocr-image-input");
  const file = fileInput?.files?.[0];
  if (!file) {
    window.alert("请先上传一张截图。");
    return;
  }
  if (!window.Tesseract) {
    window.alert("OCR 组件未加载完成，请稍后再试。");
    return;
  }
  els.ocrStatus.textContent = "OCR 识别中...";
  try {
    const result = await window.Tesseract.recognize(file, "chi_sim+eng");
    const text = result?.data?.text?.trim() || "";
    if (!text) {
      throw new Error("没有识别出文字。");
    }
    els.transcriptInput.value = [els.transcriptInput.value.trim(), text].filter(Boolean).join("\n");
    els.ocrStatus.textContent = `识别完成，新增 ${text.length} 个字符`;
  } catch (error) {
    els.ocrStatus.textContent = "OCR 失败";
    window.alert(error.message || "请重试");
  }
}

function addTranscriptAsVideo() {
  const transcript = els.transcriptInput.value.trim();
  if (!transcript) {
    window.alert("请先输入字幕或先执行 OCR。");
    return;
  }
  const video = buildTranscriptVideo(transcript);
  addImportedVideoToState(video);
  els.compareRawStatus.textContent = "字幕已加入待分析内容";
}

function buildLocalSummary(video) {
  const sourceText = `${video.title}\n${video.description}\n${video.transcript}`;
  const topic = video.topic || inferTopic(sourceText);
  return {
    id: video.id,
    title: video.title,
    creator: video.creator,
    topic,
    stance: video.stance || `这条内容围绕${topic}给出了一种训练建议，重点来自标题、文案和字幕。`,
    conditions: video.conditions || "更适合与自身目标、器械和训练基础匹配的场景。",
    risk: video.risk || "如果忽略适用条件，容易把局部经验误解成通用原则。",
    takeaway: video.takeaway || "需要结合个人目标和恢复能力再做判断。",
    sourceType: video.sourceType || "manual",
    transcript: video.transcript || "",
    description: video.description || "",
    exercises: video.exercises && video.exercises.length > 0 ? video.exercises : inferExercisesFromText(sourceText, topic),
  };
}

function normalizeTextList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/[、,/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function tonePriority(tone) {
  return { warn: 3, caution: 2, gear: 1, safe: 0 }[tone] ?? 0;
}

function inferRiskMeta(name, muscles = [], alternativeHint = "") {
  const source = `${name} ${(muscles || []).join(" ")}`;
  if (/跑步|冲刺|开合跳|波比|跳绳|深蹲跳|跳跃|登山跑|高抬腿/.test(source)) {
    return {
      label: "暂不推荐",
      tone: "warn",
      note: "这类动作冲击更大，起步阶段更容易让膝踝、下背和心肺先吃不消。",
      shortReason: "冲击太大",
      joints: ["膝踝", "下背", "心肺"],
      alternative: alternativeHint || "快走、侧步开合、坐姿拳击",
    };
  }
  if (/硬拉|保加利亚|分腿蹲|弓步|深蹲|俯卧撑|平板|卷腹|推举|靠墙静蹲/.test(source)) {
    return {
      label: "需要调整",
      tone: "caution",
      note: "可以做，但更建议用椅子、墙面或减小幅度来降低门槛和关节负担。",
      shortReason: "先降难度",
      joints: /俯卧撑|平板/.test(source) ? ["手腕", "肩", "核心"] : ["膝踝", "下背", "核心"],
      alternative: alternativeHint || "椅子辅助深蹲、墙壁俯卧撑、死虫",
    };
  }
  if (/下拉|划船|哑铃|杠铃|器械/.test(source)) {
    return {
      label: "可直接做",
      tone: "gear",
      note: "动作本身相对友好，但更适合在有器械或支撑环境下进行。",
      shortReason: "环境要跟上",
      joints: ["肩", "上背"],
      alternative: alternativeHint || "弹力带划船、坐姿划船",
    };
  }
  return {
    label: "可直接做",
    tone: "safe",
    note: "这类动作更低冲击，更适合作为大体重人群的起步动作。",
    shortReason: "更好起步",
    joints: ["心肺", "关节友好"],
    alternative: alternativeHint || "继续保持这个版本",
  };
}

function inferFriendlyMetaFromVideo(video) {
  if (video?.suitability) {
    const fallback = inferRiskMeta(video.title || video.topic || "", normalizeTextList(video.jointLoad || []));
    return {
      label: video.suitability,
      tone: video.suitability === "暂不推荐" ? "warn" : video.suitability === "需要调整" ? "caution" : "safe",
      note: video.risk || fallback.note,
      reason: video.risk || fallback.note,
      shortReason: video.shortReason || fallback.shortReason,
      joints: normalizeTextList(video.jointLoad || fallback.joints),
      alternative: fallback.alternative,
      alternatives: [fallback.alternative].filter(Boolean),
    };
  }
  const exerciseList = Array.isArray(video.exercises) ? video.exercises : [];
  const metas = exerciseList.map((exercise) =>
    inferRiskMeta(
      exercise.name,
      Array.isArray(exercise.muscles) ? exercise.muscles : String(exercise.muscles || "").split(/[、/]/).map((item) => item.trim()).filter(Boolean),
      exercise.alternative || ""
    )
  );
  const worst = metas.sort((a, b) => tonePriority(b.tone) - tonePriority(a.tone))[0] || inferRiskMeta(video.title || video.topic || "");
  const alternatives = [...new Set(metas.map((meta) => meta.alternative).filter(Boolean))].slice(0, 3);
  const reason =
    worst.tone === "warn"
      ? "内容里包含跑跳或高冲击动作，起步阶段更容易让关节和心肺先过载。"
      : worst.tone === "caution"
        ? "内容方向可以参考，但动作更适合改成有支撑、减幅度的版本。"
        : "内容里的动作整体更低冲击，更适合作为大体重人群起步。";
  return {
    ...worst,
    reason,
    shortReason: worst.shortReason,
    alternatives,
  };
}

function buildFriendlySummary(summaries, profile) {
  const metas = (summaries || []).map(inferFriendlyMetaFromVideo);
  const worst = metas.sort((a, b) => tonePriority(b.tone) - tonePriority(a.tone))[0] || {
    label: "可直接做",
    tone: "safe",
    reason: "整体更适合大体重起步阶段。",
    alternatives: [],
  };
  const alternatives = [...new Set(metas.flatMap((meta) => meta.alternatives || []))].slice(0, 4);
  return {
    label: worst.label,
    tone: worst.tone,
    intro:
      worst.tone === "warn"
        ? "这组内容里至少有一部分动作不适合直接照做。"
        : worst.tone === "caution"
          ? "这组内容可以参考，但建议先做调整版。"
          : "这组内容整体比较适合先开始。", 
    reason: `${worst.reason} 结合你当前${profile.goal}、${profile.level}的阶段，优先选低冲击和可持续的做法。`,
    shortReason: worst.shortReason || "更适合先稳住节奏",
    joints: worst.joints || [],
    alternatives,
  };
}

function buildAlternativeCards(summaries) {
  const cards = [];
  (summaries || []).forEach((video) => {
    (video.exercises || []).forEach((exercise) => {
      const risk = inferRiskMeta(
        exercise.name,
        Array.isArray(exercise.muscles) ? exercise.muscles : String(exercise.muscles || "").split(/[、/]/).map((item) => item.trim()).filter(Boolean),
        exercise.alternative || ""
      );
      if (risk.tone !== "safe") {
        cards.push({
          source: video.title,
          current: exercise.name,
          alternative: risk.alternative,
          label: risk.label,
          tone: risk.tone,
          joints: risk.joints || [],
          shortReason: risk.shortReason || "",
        });
      }
    });
  });
  return cards.filter((card, index, array) => array.findIndex((item) => item.current === card.current) === index).slice(0, 4);
}

function buildConflictSummary(selectedVideos) {
  const sameTopic = selectedVideos.every((video) => video.topic === selectedVideos[0]?.topic);
  if (sameTopic && selectedVideos[0]) {
    return [
      `这些内容都在讨论${selectedVideos[0].topic}，但对大体重人群来说，冲突的核心通常是关节负担和动作门槛。`,
      "如果创作者没有说清楚适用人群，用户就很容易把高阶训练误当成起步方案。",
      "你真正需要的不是最狠的训练，而是更安全、更能坚持的第一步。",
    ];
  }
  return [
    "当前选中的内容跨越多个主题，所以系统会优先判断哪些动作适合先开始、哪些需要替换。",
    "它们共同决定你的训练优先级、动作选择和恢复安排。",
    "如果希望看到更明显的冲突效果，可以多选同一主题下高冲击和低冲击两类内容。",
  ];
}

function buildPersonalAdvice(selectedVideos, profile) {
  const advice = [];
  const topics = selectedVideos.map((video) => video.topic);
  advice.push(`你当前更适合从${profile.goal}、${profile.level}、${profile.scene}这个组合出发，先做低冲击版本。`);
  if (topics.includes("大体重跑跳") || topics.includes("低冲击减脂")) {
    advice.push("减脂阶段先把快走、坐姿有氧、侧步开合这类低冲击动作练稳定，比直接跑跳更适合起步。");
  }
  if (topics.includes("膝盖友好训练")) {
    advice.push("如果膝盖容易不舒服，优先用椅子辅助深蹲、臀桥、靠墙动作来替代大幅度下肢训练。");
  }
  if (topics.includes("大体重力量入门")) {
    advice.push("力量训练不用等以后再做，可以从墙壁俯卧撑、弹力带划船、椅子坐站这些支撑版本开始。");
  }
  if (profile.limitations) {
    advice.push(`你提到${profile.limitations}，系统会进一步降低冲击、减少连续站立时长，并优先保留有支撑的动作。`);
  }
  advice.push("最适合你的建议，不是网上声音最大的那个，而是当前阶段身体最愿意接受、最能稳定执行的那个。");
  return advice;
}

function buildConflictCards(result, summaries, profile) {
  const first = summaries?.[0] || {};
  const second = summaries?.[1] || {};
  if (first.stance || second.stance || first.conditions || second.conditions) {
    return [
      {
        title: "谁在主张什么",
        left: first.stance || result.viewA?.stance || "更激进的做法",
        right: second.stance || result.viewB?.stance || "更稳妥的做法",
        coach: "先分清两边在强调掉秤速度，还是强调关节负担和长期坚持，不要把起步期和进阶期混成一件事。",
      },
      {
        title: "更适合谁",
        left: first.conditions || result.viewA?.content || "更适合希望快速看到变化、接受更强刺激的人。",
        right: second.conditions || result.viewB?.content || "更适合希望长期稳定执行、先把身体适应起来的人。",
        coach: `结合你现在${profile.goal}、${profile.level}的阶段，更优先选低冲击、动作更稳定、更容易坚持的方案。`,
      },
      {
        title: "潜在风险",
        left: first.risk || first.takeaway || result.viewA?.content || "容易把单点技巧当成通用规则。",
        right: second.risk || second.takeaway || result.viewB?.content || "如果过于保守，也可能错过有效刺激。",
        coach: result.verdict || "真正要避开的不是某一个动作，而是不看身体承受能力就直接照搬。",
      },
    ];
  }
  return [
    {
      title: "主张差异",
      left: result.viewA?.content || "",
      right: result.viewB?.content || "",
      coach: "两边通常不是谁绝对对，而是在不同前提下强调不同重点。",
    },
    {
      title: "适用人群",
      left: "更适合想快速求结果、愿意承受更高训练压力的人。",
      right: "更适合希望长期执行、基础还在建立中的人。",
      coach: `你当前是${profile.level}，更建议优先选择能长期坚持的方案。`,
    },
  ];
}

function enrichCompareResult(result, selectedVideos, profile, rawText = "") {
  const summaries = (selectedVideos || []).map(buildLocalSummary);
  const evidenceSources = inferEvidenceSources(selectedVideos, rawText);
  const friendlySummary = buildFriendlySummary(summaries, profile);
  return {
    ...result,
    conflictCards: buildConflictCards(result, summaries, profile),
    friendlySummary,
    alternativeCards: buildAlternativeCards(summaries),
    evidenceSources,
    confidenceNote: buildConfidenceNote(evidenceSources),
  };
}

function normalizeExercise(exercise, sourceTopic, sourceVideoId) {
  const tags = new Set([sourceTopic, exercise.difficulty || "低"]);
  String(exercise.muscles || "")
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((tag) => tags.add(tag));
  return {
    id: `${sourceVideoId}-${exercise.name}`.replace(/\s+/g, "-"),
    name: exercise.name,
    muscles: Array.isArray(exercise.muscles) ? exercise.muscles : String(exercise.muscles || "").split(/[、/]/).map((item) => item.trim()).filter(Boolean),
    category: inferCategoryFromName(exercise.name),
    source: sourceTopic,
    favorite: false,
    jointLoad: normalizeTextList(exercise.jointLoad || exercise.joint_load || []),
    tags: [...tags],
  };
}

function ingestExercises(videoSummaries) {
  const incoming = videoSummaries.flatMap((summary) =>
    (summary.exercises || []).map((exercise) => normalizeExercise(exercise, summary.topic || "综合健身建议", summary.id))
  );
  incoming.forEach((exercise) => {
    const existingIndex = state.library.findIndex((item) => item.name === exercise.name);
    if (existingIndex === -1) {
      state.library.unshift(exercise);
    } else {
      state.library[existingIndex] = {
        ...state.library[existingIndex],
        ...exercise,
        favorite: state.library[existingIndex].favorite,
      };
    }
  });
  saveLibrary();
  renderLibrary();
}

async function analyzeSelectedVideos(selectedVideos, profile) {
  if (isLLMConfigured()) {
    const content = await callAI(
      [
        {
          role: "system",
          content:
            "你是面向大体重人群的健身内容分析助手。请根据输入视频内容输出 JSON 对象，不要输出 markdown。JSON 结构必须包含 topic_overview, video_summaries, conflict_summary, personal_advice。video_summaries 是数组，每项必须包含 id, title, creator, topic, stance, conditions, risk, takeaway, exercises。exercises 每项包含 name, muscles, cue, mistake, alternative, difficulty。请特别关注高冲击动作、关节负担、是否适合大体重人群起步，并尽量给出低冲击替代动作。conflict_summary 和 personal_advice 都是字符串数组。请用简体中文。",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              profile,
              videos: selectedVideos.map((video) => ({
                id: video.id,
                title: video.title,
                creator: video.creator,
                topic_hint: video.topic,
                description: video.description,
                transcript: video.transcript,
                raw_summary: video.stance,
              })),
            },
            null,
            2
          ),
        },
      ],
      0.2,
      1800
    );
    const parsed = extractJson(content);
    return {
      topicOverview: parsed.topic_overview || "",
      videoSummaries: parsed.video_summaries || [],
      conflictSummary: parsed.conflict_summary || [],
      personalAdvice: parsed.personal_advice || [],
    };
  }
  const summaries = selectedVideos.map(buildLocalSummary);
  return {
    topicOverview: "这版结论会优先判断动作是否适合大体重人群起步，以及能不能替换成更安全的版本。",
    videoSummaries: summaries,
    conflictSummary: buildConflictSummary(summaries),
    personalAdvice: buildPersonalAdvice(summaries, profile),
  };
}

function mapVideoAnalysisToCompare(result, selectedVideos, profile) {
  const first = result.videoSummaries?.[0] || {};
  const second = result.videoSummaries?.[1] || {};
  return enrichCompareResult({
    topic: first.topic || second.topic || "综合健身议题",
    viewA: {
      stance: first.stance || first.title || "观点 A",
      content: [first.conditions, first.risk, first.takeaway].filter(Boolean).join(" "),
    },
    viewB: {
      stance: second.stance || second.title || "观点 B",
      content: [second.conditions, second.risk, second.takeaway].filter(Boolean).join(" "),
    },
    verdict: (result.conflictSummary || []).join(" "),
    recommendation: (result.personalAdvice || []).join(" "),
    insight: result.topicOverview || "更适合你的建议，不是最狠的那个，而是当前阶段身体更愿意接受的那个。",
  }, selectedVideos, profile);
}

async function analyzeCompare() {
  const raw = els.compareRawInput.value.trim();
  const topic = els.compareTopicInput.value.trim() || inferTopic(raw);
  const profile = getCompareProfile();
  els.compareLoading.classList.remove("hidden");
  els.compareResult.classList.add("hidden");
  hidePostImportActions();
  try {
    const selectedVideos = getSelectedVideos();
    let finalResult;
    if (selectedVideos.length >= 2) {
      const result = await analyzeSelectedVideos(selectedVideos, profile);
      ingestExercises(result.videoSummaries || []);
      finalResult = mapVideoAnalysisToCompare(result, selectedVideos, profile);
    } else {
      if (!topic) {
        throw new Error("请先输入你的问题。");
      }
      if (isLLMConfigured()) {
        const content = await callAI([
          {
            role: "system",
            content:
              '你是 FitCheck 的大体重人群健身分析助手。只输出 JSON，不要 markdown。格式必须为 {"topic":"议题标题","viewA":{"stance":"观点A标题","content":"主张和依据"},"viewB":{"stance":"观点B标题","content":"主张和依据"},"verdict":"从大体重友好、安全起步角度给出的判断","recommendation":"针对该用户的个性化建议","insight":"一句话核心洞察"}。请优先关注高冲击动作、关节负担和替代动作。字符串值不要含双引号，用顿号替代。',
          },
          {
            role: "user",
            content: JSON.stringify({ question: topic, profile, raw_content: raw }, null, 2),
          },
        ]);
        finalResult = enrichCompareResult(extractJson(content), selectedVideos, profile, raw);
      } else {
        finalResult = enrichCompareResult(buildCompareFallback(topic, profile), selectedVideos, profile, raw);
      }
    }
    state.compareResult = finalResult;
    renderCompareResult(finalResult);
  } catch {
    window.alert("请重试");
  } finally {
    els.compareLoading.classList.add("hidden");
  }
}

function renderCompareResult(result) {
  els.compareResult.classList.remove("hidden");
  els.compareResultTopic.textContent = result.topic || "";
  els.compareViewATitle.textContent = result.viewA?.stance || "";
  els.compareViewAContent.textContent = result.viewA?.content || "";
  els.compareViewBTitle.textContent = result.viewB?.stance || "";
  els.compareViewBContent.textContent = result.viewB?.content || "";
  els.compareVerdict.textContent = result.verdict || "";
  els.compareRecommendation.textContent = result.recommendation || "";
  els.compareInsight.textContent = result.insight || "";
  const friendlySummary = result.friendlySummary || {};
  els.compareFriendlySummary.innerHTML = friendlySummary.label
    ? `
      <div class="friendly-summary-head">
        <span class="risk-chip risk-${escapeHtml(friendlySummary.tone || "safe")}">${escapeHtml(friendlySummary.label)}</span>
        <strong>${escapeHtml(friendlySummary.intro || "")}</strong>
      </div>
      <div class="friendly-summary-meta">
        ${friendlySummary.shortReason ? `<span class="mini-chip soft-chip">${escapeHtml(friendlySummary.shortReason)}</span>` : ""}
        ${(friendlySummary.joints || []).map((item) => `<span class="mini-chip soft-chip">${escapeHtml(item)}</span>`).join("")}
      </div>
      <p>${escapeHtml(friendlySummary.reason || "")}</p>
    `
    : "";
  els.conflictCardList.innerHTML = (result.conflictCards || [])
    .map(
      (card) => `
        <article class="conflict-card">
          <strong>${escapeHtml(card.title || "冲突点")}</strong>
          <div class="conflict-card-grid">
            <div class="conflict-side">
              <span class="column-tag">A 面</span>
              <p>${escapeHtml(card.left || "")}</p>
            </div>
            <div class="conflict-side">
              <span class="column-tag mint">B 面</span>
              <p>${escapeHtml(card.right || "")}</p>
            </div>
          </div>
          <p class="conflict-coach">柴教练判断：${escapeHtml(card.coach || "")}</p>
        </article>
      `
    )
    .join("");
  els.compareAlternativeList.innerHTML = (result.alternativeCards || [])
    .map(
      (item) => `
        <article class="alternative-card">
          <span class="risk-chip risk-${escapeHtml(item.tone || (item.label === "暂不推荐" ? "warn" : "caution"))}">${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.current)}</strong>
          <div class="alternative-meta">
            ${item.shortReason ? `<span class="mini-chip soft-chip">${escapeHtml(item.shortReason)}</span>` : ""}
            ${(item.joints || []).map((joint) => `<span class="mini-chip soft-chip">${escapeHtml(joint)}</span>`).join("")}
          </div>
          <p>更适合先换成：${escapeHtml(item.alternative || "更低冲击版本")}</p>
          <p class="helper-text">来自：${escapeHtml(item.source || "当前内容")}</p>
        </article>
      `
    )
    .join("");
  els.compareEvidenceList.innerHTML = (result.evidenceSources || [])
    .map((item) => `<span class="evidence-chip">${escapeHtml(item)}</span>`)
    .join("");
  els.compareConfidenceNote.textContent = result.confidenceNote || "";
}

function toggleVideoSelection(videoId) {
  if (state.selectedVideoIds.includes(videoId)) {
    state.selectedVideoIds = state.selectedVideoIds.filter((id) => id !== videoId);
  } else {
    state.selectedVideoIds.push(videoId);
  }
  renderCompareVideos();
}

function deleteImportedVideo(videoId) {
  state.videos = state.videos.filter((video) => video.id !== videoId);
  state.selectedVideoIds = state.selectedVideoIds.filter((id) => id !== videoId);
  saveCatalog();
  renderCompareVideos();
}

function normalizeStoredLibrary(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    id: item.id || uid("move"),
    name: item.name || "未命名动作",
    muscles: Array.isArray(item.muscles) ? item.muscles : String(item.muscles || "").split(/[、,/]/).filter(Boolean),
    category: normalizeCategory(item.category || inferCategoryFromName(item.name || "")),
    source: item.source || "我的动作库",
    favorite: Boolean(item.favorite),
    jointLoad: normalizeTextList(item.jointLoad || item.joint_load || []),
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));
}

function queueMoveForPlan(moveId) {
  const move = state.library.find((item) => item.id === moveId);
  if (!move) return;
  if (!state.planQueue.some((item) => item.name === move.name)) {
    state.planQueue.unshift({
      id: uid("plan-queue"),
      name: move.name,
      muscles: move.muscles,
      category: move.category,
      source: move.source || "动作库",
    });
    savePlans();
    renderPlanQueue();
  }
}

function removeQueuedMove(queueId) {
  state.planQueue = state.planQueue.filter((item) => item.id !== queueId);
  savePlans();
  renderPlanQueue();
  renderLibrary();
}

function clearPlanQueue() {
  state.planQueue = [];
  savePlans();
  renderPlanQueue();
  renderLibrary();
}

function renderPlanQueue() {
  if (!state.planQueue || state.planQueue.length === 0) {
    els.planQueuePanel.classList.add("hidden");
    els.planQueueList.innerHTML = "";
    return;
  }
  els.planQueuePanel.classList.remove("hidden");
  els.planQueueList.innerHTML = state.planQueue
    .map(
      (move) => `
        <article class="queue-chip-card">
          <div>
            <strong>${escapeHtml(move.name)}</strong>
            <p>${escapeHtml((move.muscles || []).join("、") || move.category || "候选动作")}</p>
          </div>
          <button class="delete-btn" type="button" data-remove-queue-id="${escapeHtml(move.id)}">✕</button>
        </article>
      `
    )
    .join("");
}

function detectMovesLocally(text) {
  const found = [];
  MOVE_RULES.forEach(([keyword, move]) => {
    if (text.includes(keyword) && !found.some((item) => item.name === move.name)) {
      found.push({
        id: uid("move"),
        name: move.name,
        muscles: move.muscles,
        category: move.category,
        source: "文案识别",
        favorite: false,
        jointLoad: inferRiskMeta(move.name, move.muscles).joints,
        tags: [move.category, ...(move.muscles || [])],
      });
    }
  });
  return found.length > 0
    ? found
    : [
        { id: uid("move"), name: "椅子辅助深蹲", muscles: ["股四头肌", "臀大肌"], category: "下肢🦵", source: "文案识别", favorite: false, tags: ["下肢🦵"] },
        { id: uid("move"), name: "快走", muscles: ["心肺", "下肢"], category: "有氧🏃", source: "文案识别", favorite: false, jointLoad: ["心肺", "关节友好"], tags: ["有氧🏃"] },
      ];
}

async function detectMoves() {
  const text = els.libraryRawInput.value.trim();
  if (!text) {
    window.alert("请先粘贴健身文案。");
    return;
  }
  els.libraryLoading.classList.remove("hidden");
  els.detectedMovesPanel.classList.add("hidden");
  try {
    let moves;
    if (isLLMConfigured()) {
      const content = await callAI([
        {
          role: "system",
          content:
            '你是健身动作识别助手。只输出 JSON。格式：{"moves":[{"name":"动作名","muscles":["主要肌肉"],"category":"无氧/有氧/热身/拉伸"}]}。字符串值不要含双引号。',
        },
        { role: "user", content: text },
      ]);
      const parsed = extractJson(content);
      moves = (parsed.moves || []).map((move) => ({
        id: uid("move"),
        name: move.name,
        muscles: Array.isArray(move.muscles) ? move.muscles : [move.muscles].filter(Boolean),
        category: normalizeCategory(move.category),
        source: "AI 识别",
        favorite: false,
        jointLoad: normalizeTextList(move.joint_load || move.jointLoad || []),
        tags: [normalizeCategory(move.category), ...(Array.isArray(move.muscles) ? move.muscles : [move.muscles].filter(Boolean))],
      }));
    } else {
      moves = detectMovesLocally(text);
    }
    state.detectedMoves = moves;
    renderDetectedMoves();
  } catch {
    window.alert("请重试");
  } finally {
    els.libraryLoading.classList.add("hidden");
  }
}

function renderDetectedMoves() {
  els.detectedMovesPanel.classList.remove("hidden");
  els.detectedMovesList.innerHTML = state.detectedMoves
    .map(
      (move, index) => `
        <article class="move-check">
          <label>
            <input type="checkbox" data-detected-index="${index}" checked />
            <div>
              <strong>${escapeHtml(move.name)}</strong>
              <p>${escapeHtml(move.category)} · ${escapeHtml((move.muscles || []).join("、"))}</p>
            </div>
          </label>
        </article>
      `
    )
    .join("");
}

function saveDetectedMoves() {
  const selectedIndexes = [...els.detectedMovesList.querySelectorAll("input[data-detected-index]:checked")].map((item) =>
    Number(item.dataset.detectedIndex)
  );
  const incoming = selectedIndexes.map((index) => state.detectedMoves[index]).filter(Boolean);
  if (incoming.length === 0) {
    window.alert("请先勾选至少一个动作。");
    return;
  }
  incoming.forEach((move) => {
    if (!state.library.some((item) => item.name === move.name)) {
      state.library.unshift(move);
    }
  });
  saveLibrary();
  renderLibrary();
  els.detectedMovesPanel.classList.add("hidden");
}

function addManualMove() {
  const input = document.getElementById("manual-move-input");
  const name = input.value.trim();
  if (!name) return;
  state.library.unshift({
    id: uid("manual"),
    name,
    muscles: [],
    category: inferCategoryFromName(name),
    source: "手动添加",
    favorite: false,
    jointLoad: inferRiskMeta(name, []).joints,
    tags: [inferCategoryFromName(name)],
  });
  saveLibrary();
  renderLibrary();
  input.value = "";
}

function toggleFavoriteMove(moveId) {
  state.library = state.library.map((item) => (item.id === moveId ? { ...item, favorite: !item.favorite } : item));
  saveLibrary();
  renderLibrary();
}

function deleteMove(moveId) {
  state.library = state.library.filter((item) => item.id !== moveId);
  saveLibrary();
  renderLibrary();
}

function renderTagFilter() {
  const tags = new Set(["all"]);
  state.library.forEach((item) => (item.tags || []).forEach((tag) => tags.add(tag)));
  els.tagFilter.innerHTML = [...tags]
    .map((tag) => `<option value="${escapeHtml(tag)}">${escapeHtml(tag === "all" ? "全部标签" : tag)}</option>`)
    .join("");
  els.tagFilter.value = tags.has(state.tagFilter) ? state.tagFilter : "all";
}

function renderLibrary() {
  els.libraryBadge.textContent = String(state.library.length);
  renderTagFilter();
  const filtered = state.library.filter((item) => {
    const favoritePass = state.libraryFilter === "favorite" ? item.favorite : true;
    const tagPass = state.tagFilter === "all" ? true : (item.tags || []).includes(state.tagFilter);
    return favoritePass && tagPass;
  });
  if (filtered.length === 0) {
    els.libraryGroups.innerHTML = `
      <section class="panel-card">
        <p class="helper-text">当前筛选下没有动作。先识别一段文案，或者切换筛选条件。</p>
      </section>
    `;
    return;
  }
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: filtered.filter((move) => move.category === category),
  })).filter((group) => group.items.length > 0);

  els.libraryGroups.innerHTML = grouped
    .map(
      (group) => `
        <section class="library-group">
          <h4>${escapeHtml(group.category)}</h4>
          <div class="exercise-group-list">
            ${group.items
              .map(
                (move) => {
                  const risk = inferRiskMeta(move.name, move.muscles);
                  const jointLoad = normalizeTextList(move.jointLoad || risk.joints);
                  return `
                  <div class="library-move">
                    <div>
                      <strong>${escapeHtml(move.name)}</strong>
                      <p>${escapeHtml((move.muscles || []).join("、") || "未标注肌群")} · ${escapeHtml(move.source || "动作库")}</p>
                      <div class="library-meta-row">
                        <span class="risk-chip risk-${escapeHtml(risk.tone)}">
                          ${escapeHtml(risk.label)}
                        </span>
                        ${risk.shortReason ? `<span class="mini-chip soft-chip">${escapeHtml(risk.shortReason)}</span>` : ""}
                        ${jointLoad.map((joint) => `<span class="mini-chip soft-chip">${escapeHtml(joint)}</span>`).join("")}
                      </div>
                      <p class="helper-text">${escapeHtml(risk.note)}</p>
                      <p class="helper-text">可替代为：${escapeHtml(risk.alternative)}</p>
                    </div>
                    <div class="library-action-row">
                      <button class="secondary-action mini-action" type="button" data-add-plan-move-id="${escapeHtml(move.id)}">
                        ${state.planQueue.some((item) => item.name === move.name) ? "已入计划" : "加入计划"}
                      </button>
                      <button class="fav-btn ${move.favorite ? "active" : ""}" type="button" data-favorite-move-id="${escapeHtml(move.id)}">★</button>
                      <button class="delete-btn" type="button" data-delete-move-id="${escapeHtml(move.id)}">✕</button>
                    </div>
                  </div>
                `;
                }
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function muscleMeta(name) {
  if (/臀/.test(name)) return { label: "臀🍑" };
  if (/腿|股|蹲|弓步|提踵/.test(name)) return { label: "腿/股🦵" };
  if (/背|腰|划船|下拉/.test(name)) return { label: "背/腰🔙" };
  if (/腹|核心|卷腹|平板/.test(name)) return { label: "腹/核心⬜" };
  if (/胸|俯卧撑/.test(name)) return { label: "胸🫁" };
  if (/肩|侧平举|推举/.test(name)) return { label: "肩🔺" };
  if (/臂|弯举|三头/.test(name)) return { label: "手臂💪" };
  if (/跑|走|跳|单车/.test(name)) return { label: "心肺🏃" };
  return { label: "全身" };
}

function toDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function buildStreakSummary() {
  const historyPlans = (state.planHistory || []).filter((plan, index, array) => array.findIndex((item) => item.id === plan.id) === index);
  const completionTimes = historyPlans.flatMap((plan) => (plan.days || []).map((day) => day.completedAt).filter(Boolean));
  const uniqueSessionCount = new Set(completionTimes.filter(Boolean)).size;
  const uniqueDateKeys = [...new Set(completionTimes.map(toDateKey).filter(Boolean))].sort();
  let streakDays = 0;
  for (let index = uniqueDateKeys.length - 1; index >= 0; index -= 1) {
    if (index === uniqueDateKeys.length - 1) {
      streakDays = 1;
      continue;
    }
    const current = new Date(uniqueDateKeys[index]);
    const next = new Date(uniqueDateKeys[index + 1]);
    const diffDays = Math.round((next - current) / 86400000);
    if (diffDays === 1) {
      streakDays += 1;
    } else {
      break;
    }
  }
  const milestone =
    uniqueSessionCount >= 14
      ? "你已经完成 14 次训练，身体已经进入比较稳定的适应节奏。"
      : uniqueSessionCount >= 7
        ? "你已经完成 7 次训练，起步节奏已经越来越稳了。"
        : uniqueSessionCount >= 3
          ? "你已经完成 3 次训练，第一段安全起步习惯正在形成。"
          : "先完成第一周里的 3 次训练，让身体先适应动起来。";
  return {
    streakDays,
    uniqueSessionCount,
    milestone,
    lastCompletedAt: completionTimes.sort().slice(-1)[0] || "",
  };
}

function buildCoachGrowthMessage(profile, streakSummary) {
  if (streakSummary.streakDays >= 3) {
    return `柴教练提醒：你已经连续 ${streakSummary.streakDays} 天保持节奏，现在最重要的是别突然加太猛。`;
  }
  if (profile.goal.includes("减脂")) {
    return "柴教练提醒：低冲击减脂先把频率练稳定，比一开始冲太猛更有用。";
  }
  if (profile.goal.includes("改善体态")) {
    return "柴教练提醒：体态改善最怕三天打鱼两天晒网，小而稳比偶尔爆发更有效。";
  }
  return "柴教练提醒：先把动作做稳、把身体练得敢动起来，再去追更高强度。";
}

function getPlanProfile() {
  return {
    goal: document.getElementById("plan-goal").value,
    level: document.getElementById("plan-level").value,
    days: Number(document.getElementById("plan-days").value),
    duration: Number(document.getElementById("plan-duration").value),
    scene: document.getElementById("plan-scene").value,
    equipment: document.getElementById("plan-equipment").value,
    note: document.getElementById("plan-note").value.trim(),
  };
}

function applyPlanTemplate(templateName) {
  const template = PLAN_TEMPLATES[templateName];
  if (!template) return;
  document.getElementById("plan-goal").value = template.goal;
  document.getElementById("plan-level").value = template.level;
  document.getElementById("plan-days").value = template.days;
  document.getElementById("plan-duration").value = template.duration;
  document.getElementById("plan-scene").value = template.scene;
  document.getElementById("plan-equipment").value = template.equipment;
  document.getElementById("plan-note").value = template.note;
}

function defaultWarmup(focus) {
  return `${focus}训练前先做 3 分钟轻松热身和关节活动`;
}

function defaultCooldown(focus) {
  return `${focus}训练后做 3 分钟放松拉伸和呼吸恢复`;
}

function pickMovesByFocus(focus, count) {
  const focusMap = {
    低冲击有氧: /走|侧步|坐姿|有氧|心肺/,
    关节友好下肢: /臀|腿|蹲|坐站|桥/,
    上肢支撑: /肩|胸|背|划船|下拉|俯卧撑/,
    核心激活: /腹|核心|死虫|鸟狗|平板/,
    全身激活: /全身|侧步|划船|坐站|有氧/,
  };
  const matcher = focusMap[focus] || /./;
  const queueMatched = state.planQueue.filter((move) => matcher.test(move.name) || (move.muscles || []).some((muscle) => matcher.test(muscle)));
  const matched = state.library.filter((move) => matcher.test(move.name) || (move.muscles || []).some((muscle) => matcher.test(muscle)));
  const defaultPool = (DEFAULT_PLAN_MOVES[focus] || DEFAULT_PLAN_MOVES["全身激活"]).map((move) => ({
    ...move,
    category: inferCategoryFromName(move.name),
    source: "默认推荐",
  }));
  const fallbackPool = [...queueMatched, ...matched, ...(state.planQueue.length > 0 ? state.planQueue : []), ...(state.library.length > 0 ? state.library : defaultPool)];
  const fallback = fallbackPool.filter((move, index, array) => array.findIndex((item) => item.name === move.name) === index);
  return fallback.slice(0, count).map((move) => ({
    name: move.name,
    sets: focus === "低冲击有氧" ? "2组 x 3分钟" : "2组 x 8-10次",
    primary: (move.muscles || []).slice(0, 1),
    secondary: (move.muscles || []).slice(1, 2),
    jointLoad: inferRiskMeta(move.name, move.muscles).joints,
    feel: `发力时重点感受${(move.muscles || [focus])[0]}在持续工作，保持呼吸平稳，不用追求很累。`,
    tip: "先做舒服、能坚持的版本；如果关节不舒服，就减小幅度或增加支撑。",
  }));
}

function buildLocalPlan(profile) {
  const templates = [
    { focus: "低冲击有氧" },
    { focus: "关节友好下肢" },
    { focus: "上肢支撑" },
    { focus: "核心激活" },
    { focus: "全身激活" },
  ];
  return {
    id: uid("plan"),
    createdAt: new Date().toISOString(),
    title: `${profile.goal}低冲击计划`,
    summary: `按${profile.level}基础、${profile.scene}场景和每周${profile.days}练的节奏安排，优先保证关节友好、低门槛和可坚持。`,
    profileSnapshot: profile,
    days: templates.slice(0, profile.days).map((item, index) => ({
      id: uid("plan-day"),
      day: `第${index + 1}天`,
      focus: item.focus,
      warmup: defaultWarmup(item.focus),
      cooldown: defaultCooldown(item.focus),
      exercises: pickMovesByFocus(item.focus, profile.duration >= 20 ? 4 : 3),
      completed: false,
      completedAt: null,
    })),
  };
}

async function generatePlan() {
  const profile = getPlanProfile();
  els.planLoading.classList.remove("hidden");
  els.planOutput.classList.add("hidden");
  try {
    let plan;
    if (isLLMConfigured()) {
      const content = await callAI(
        [
          {
            role: "system",
            content:
              '你是 FitCheck 的大体重人群训练计划助手。只输出 JSON，不要 markdown。格式：{"title":"计划名","summary":"说明","days":[{"day":"第1天","focus":"重点","warmup":"热身描述","cooldown":"拉伸描述","exercises":[{"name":"动作名","sets":"3组x12次","primary":["臀大肌"],"secondary":["股四头肌"],"feel":"发力感受","tip":"注意事项"}]}]}。计划请优先低冲击、关节友好、可持续，避免跑跳和过高动作门槛。字符串值不要含双引号，用顿号替代。',
          },
          {
            role: "user",
            content: JSON.stringify(
              {
                profile,
                saved_moves: state.library.map((move) => ({ name: move.name, muscles: move.muscles, category: move.category })),
                queued_moves: state.planQueue.map((move) => ({ name: move.name, muscles: move.muscles, category: move.category })),
              },
              null,
              2
            ),
          },
        ],
        0.2,
        2000
      );
      const parsed = extractJson(content);
      plan = {
        id: uid("plan"),
        createdAt: new Date().toISOString(),
        title: parsed.title,
        summary: parsed.summary,
        profileSnapshot: profile,
        days: (parsed.days || []).map((day) => ({
          ...day,
          id: uid("plan-day"),
          completed: false,
          completedAt: null,
        })),
      };
    } else {
      plan = buildLocalPlan(profile);
    }
    state.currentPlan = plan;
    state.planHistory.unshift(JSON.parse(JSON.stringify(plan)));
    savePlans();
    renderPlan();
    renderPlanHistory();
  } catch {
    window.alert("请重试");
  } finally {
    els.planLoading.classList.add("hidden");
  }
}

function renderExercise(exercise) {
  const risk = inferRiskMeta(exercise.name, [...(exercise.primary || []), ...(exercise.secondary || [])]);
  const jointLoad = normalizeTextList(exercise.jointLoad || risk.joints);
  const primaryTags = (exercise.primary || []).map(
    (item) => `<span class="muscle-tag muscle-primary">${escapeHtml(muscleMeta(item).label)}</span>`
  );
  const secondaryTags = (exercise.secondary || []).map(
    (item) => `<span class="muscle-tag muscle-secondary">${escapeHtml(muscleMeta(item).label)}</span>`
  );
  return `
    <details class="exercise-shell">
      <summary>
        <div class="exercise-title">
          <span>${escapeHtml(exercise.name)}</span>
          <span class="sets-text">${escapeHtml(exercise.sets || "")}</span>
        </div>
        <div class="exercise-risk-row">
          <span class="risk-chip risk-${escapeHtml(risk.tone)}">${escapeHtml(risk.label)}</span>
        </div>
      </summary>
      <div class="exercise-detail">
        <div class="exercise-meta">${primaryTags.join("")}${secondaryTags.join("")}</div>
        <div class="exercise-meta">
          ${jointLoad.map((item) => `<span class="mini-chip soft-chip">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="feel-box">🔥 发力感受：${escapeHtml(exercise.feel || "")}</div>
        <div class="tip-box">⚠️ 新手注意：${escapeHtml(exercise.tip || "")}</div>
        <div class="risk-box">风险提示：${escapeHtml(risk.note)}</div>
        <div class="tip-box">更友好替代：${escapeHtml(risk.alternative)}</div>
      </div>
    </details>
  `;
}

function renderPlan() {
  if (!state.currentPlan || !Array.isArray(state.currentPlan.days) || state.currentPlan.days.length === 0) {
    els.planOutput.classList.remove("hidden");
    els.planOutput.innerHTML = `
      <section class="panel-card empty-state-card">
        <p class="field-title">还没有训练计划</p>
        <h3 class="result-title">先判断哪些动作适合你，再生成第一周低冲击安排</h3>
        <p class="helper-text">你可以直接用安全动作库生成，也可以先去导入抖音内容再回来。</p>
      </section>
    `;
    return;
  }
  els.planOutput.classList.remove("hidden");
  const completedCount = state.currentPlan.days.filter((day) => day.completed).length;
  const streakSummary = buildStreakSummary();
  const profile = state.currentPlan.profileSnapshot || getPlanProfile();
  const coachMessage = buildCoachGrowthMessage(profile, streakSummary);
  els.planOutput.innerHTML = `
    <section class="panel-card plan-overview-card">
      <p class="field-title">${escapeHtml(state.currentPlan.title || "专属训练计划")}</p>
      <h3 class="result-title">${escapeHtml(state.currentPlan.summary || "")}</h3>
      <div class="plan-stats-grid">
        <article class="plan-stat-card">
          <span>本周进度</span>
          <strong>${completedCount} / ${state.currentPlan.days.length}</strong>
        </article>
        <article class="plan-stat-card">
          <span>连续训练</span>
          <strong>${streakSummary.streakDays} 天</strong>
        </article>
        <article class="plan-stat-card">
          <span>累计打卡</span>
          <strong>${streakSummary.uniqueSessionCount} 次</strong>
        </article>
      </div>
      <p class="helper-text">${escapeHtml(streakSummary.milestone)}</p>
      <p class="coach-growth-note">${escapeHtml(coachMessage)}</p>
    </section>
    <section class="plan-week-strip">
      ${state.currentPlan.days
        .map(
          (day, index) => `
            <button class="week-day-tile ${day.completed ? "done" : ""}" type="button" data-plan-day-id="${day.id}">
              <span class="week-day-index">Day ${index + 1}</span>
              <strong>${escapeHtml(day.focus)}</strong>
              <em>${day.completed ? "已打卡" : "待完成"}</em>
            </button>
          `
        )
        .join("")}
    </section>
    ${state.currentPlan.days
      .map(
        (day) => `
          <article class="plan-day-card ${day.completed ? "plan-completed" : ""}">
            <div class="day-head">
              <div>
                <p class="field-title">${escapeHtml(day.day)}</p>
                <h4>${escapeHtml(day.focus)}</h4>
              </div>
              <div class="day-head-actions">
                <span class="focus-badge">${day.completed ? "今日完成" : "待训练"}</span>
                <button class="${day.completed ? "secondary-action" : "ghost-action"}" type="button" data-plan-day-id="${day.id}">
                  ${day.completed ? "已完成" : "打卡完成"}
                </button>
              </div>
            </div>
            <div class="training-flow">
              <section class="flow-section warmup">
                <h5>🔥 热身</h5>
                <p>${escapeHtml(day.warmup || defaultWarmup(day.focus || "训练"))}</p>
              </section>
              <section class="flow-section">
                <h5>主训练 ×3</h5>
                ${(day.exercises || []).map((exercise) => renderExercise(exercise)).join("")}
              </section>
              <section class="flow-section cooldown">
                <h5>🧘 拉伸放松</h5>
                <p>${escapeHtml(day.cooldown || defaultCooldown(day.focus || "训练"))}</p>
              </section>
            </div>
            ${day.completedAt ? `<p class="helper-text">完成时间：${escapeHtml(formatDateTime(day.completedAt))}</p>` : ""}
          </article>
        `
      )
      .join("")}
  `;
}

function renderPlanHistory() {
  if (!state.planHistory || state.planHistory.length === 0) {
    els.planHistoryPanel.classList.add("hidden");
    return;
  }
  els.planHistoryPanel.classList.remove("hidden");
  els.planHistoryList.innerHTML = state.planHistory
    .slice(0, 5)
    .map((plan) => {
      const completedCount = (plan.days || []).filter((day) => day.completed).length;
      return `
        <article class="history-card">
          <strong>${escapeHtml(formatDateTime(plan.createdAt))}</strong>
          <p>${escapeHtml(plan.title || "训练计划")} · ${completedCount}/${(plan.days || []).length} 已完成</p>
          <p>${escapeHtml((plan.days || []).map((day) => `${day.day}:${day.focus}`).join(" | "))}</p>
        </article>
      `;
    })
    .join("");
}

function togglePlanDay(dayId) {
  if (!state.currentPlan) return;
  state.currentPlan.days = state.currentPlan.days.map((day) => {
    if (day.id !== dayId) return day;
    const completed = !day.completed;
    return { ...day, completed, completedAt: completed ? new Date().toISOString() : null };
  });
  state.planHistory = state.planHistory.map((plan) => (plan.id === state.currentPlan.id ? JSON.parse(JSON.stringify(state.currentPlan)) : plan));
  savePlans();
  renderPlan();
  renderPlanHistory();
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("zh-CN", { hour12: false });
}

function bindEvents() {
  document.getElementById("start-demo-btn").addEventListener("click", () => switchScreen("home"));
  document.getElementById("home-example-btn").addEventListener("click", fillSampleInput);
  document.getElementById("compare-example-btn").addEventListener("click", fillSampleInput);
  document.getElementById("home-start-parse-btn").addEventListener("click", async () => {
    const input = els.homeQuickInput.value.trim();
    if (!input) {
      switchScreen("compare");
      els.compareRawInput.focus();
      els.compareRawStatus.textContent = "先贴一个抖音链接，我来帮你读懂。";
      return;
    }
    setCompareInput(input);
    switchScreen("compare");
    await importFromDouyinLink();
  });
  document.querySelectorAll("[data-screen-target]").forEach((button) => {
    button.addEventListener("click", () => switchScreen(button.dataset.screenTarget));
  });
  document.querySelectorAll("[data-back-home]").forEach((button) => {
    button.addEventListener("click", () => switchScreen("home"));
  });

  document.getElementById("open-settings-btn").addEventListener("click", () => els.settingsSheet.classList.remove("hidden"));
  document.getElementById("close-settings-btn").addEventListener("click", () => els.settingsSheet.classList.add("hidden"));
  document.getElementById("save-settings-btn").addEventListener("click", () => {
    persistSettings();
    els.settingsStatus.textContent = isLLMConfigured() ? "配置已保存，AI 功能已可用。" : "配置已保存，当前将使用本地基础逻辑。";
  });

  document.getElementById("extract-topic-btn").addEventListener("click", extractTopic);
  document.getElementById("compare-link-btn").addEventListener("click", importFromDouyinLink);
  document.getElementById("compare-resolve-btn").addEventListener("click", resolveDouyinLink);
  document.getElementById("ocr-btn").addEventListener("click", runOCR);
  document.getElementById("add-transcript-btn").addEventListener("click", addTranscriptAsVideo);
  document.getElementById("compare-analyze-btn").addEventListener("click", analyzeCompare);
  document.getElementById("share-insight-btn").addEventListener("click", async () => {
    if (!state.compareResult?.insight) return;
    try {
      await navigator.clipboard.writeText(state.compareResult.insight);
      window.alert("已复制到剪贴板");
    } catch {
      window.alert("请手动复制");
    }
  });
  document.getElementById("cta-analyze-btn").addEventListener("click", analyzeCompare);
  document.getElementById("cta-library-btn").addEventListener("click", sendLatestVideoToLibrary);
  document.getElementById("cta-plan-btn").addEventListener("click", () => switchScreen("plan"));
  document.getElementById("result-go-library-btn").addEventListener("click", sendLatestVideoToLibrary);
  document.getElementById("result-go-plan-btn").addEventListener("click", () => switchScreen("plan"));
  document.getElementById("copy-result-summary-btn").addEventListener("click", copyCompareSummary);

  els.compareVideoList.addEventListener("click", (event) => {
    const selectButton = event.target.closest("[data-video-id]");
    if (selectButton) {
      toggleVideoSelection(selectButton.dataset.videoId);
      return;
    }
    const deleteButton = event.target.closest("[data-delete-video-id]");
    if (deleteButton) {
      deleteImportedVideo(deleteButton.dataset.deleteVideoId);
    }
  });

  document.getElementById("generate-plan-btn").addEventListener("click", generatePlan);
  document.getElementById("clear-plan-queue-btn").addEventListener("click", clearPlanQueue);
  document.getElementById("plan-template-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-plan-template]");
    if (button) {
      applyPlanTemplate(button.dataset.planTemplate);
    }
  });
  els.planOutput.addEventListener("click", (event) => {
    const button = event.target.closest("[data-plan-day-id]");
    if (button) {
      togglePlanDay(button.dataset.planDayId);
    }
  });
  els.planQueueList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-queue-id]");
    if (button) {
      removeQueuedMove(button.dataset.removeQueueId);
    }
  });

  document.getElementById("detect-moves-btn").addEventListener("click", detectMoves);
  document.getElementById("save-detected-moves-btn").addEventListener("click", saveDetectedMoves);
  document.getElementById("manual-add-btn").addEventListener("click", addManualMove);
  document.getElementById("filter-all-btn").addEventListener("click", () => {
    state.libraryFilter = "all";
    renderLibrary();
  });
  document.getElementById("filter-fav-btn").addEventListener("click", () => {
    state.libraryFilter = "favorite";
    renderLibrary();
  });
  els.tagFilter.addEventListener("change", () => {
    state.tagFilter = els.tagFilter.value;
    renderLibrary();
  });

  els.libraryGroups.addEventListener("click", (event) => {
    const addPlanButton = event.target.closest("[data-add-plan-move-id]");
    if (addPlanButton) {
      queueMoveForPlan(addPlanButton.dataset.addPlanMoveId);
      renderLibrary();
      return;
    }
    const favoriteButton = event.target.closest("[data-favorite-move-id]");
    if (favoriteButton) {
      toggleFavoriteMove(favoriteButton.dataset.favoriteMoveId);
      return;
    }
    const deleteButton = event.target.closest("[data-delete-move-id]");
    if (deleteButton) {
      deleteMove(deleteButton.dataset.deleteMoveId);
    }
  });

  document.getElementById("topic-chip-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic-chip]");
    if (button) {
      els.compareTopicInput.value = button.dataset.topicChip;
    }
  });
}
