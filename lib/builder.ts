// 프롬프트 마법사 빌더의 재료 데이터.
// LLM을 호출하지 않는다 — 모든 지능은 이 템플릿 조합에 있고, 실행은 사용자의 챗봇 계정에서 한다.

export type BuilderTask = {
  key: string;
  label: string;
  role: string;
  instruction: string;
  inputLabel: string;
  inputPlaceholder: string;
};

export const TASKS: BuilderTask[] = [
  {
    key: "report",
    label: "보고서·기획서",
    role: "당신은 논리적인 비즈니스 문서를 쓰는 전문 컨설턴트입니다.",
    instruction: "아래 [자료]를 바탕으로 {audience}에게 보고할 문서를 {tone} 톤으로 작성하세요.",
    inputLabel: "자료",
    inputPlaceholder: "보고서에 담을 내용, 데이터, 배경을 붙여넣으세요"
  },
  {
    key: "email",
    label: "이메일·메시지",
    role: "당신은 상황과 관계에 맞는 비즈니스 커뮤니케이션 전문가입니다.",
    instruction: "아래 [내용]을 바탕으로 {audience}에게 보낼 메시지를 {tone} 톤으로 작성하세요.",
    inputLabel: "내용",
    inputPlaceholder: "전달할 용건, 상황, 상대와의 관계를 적으세요"
  },
  {
    key: "analyze",
    label: "분석·요약",
    role: "당신은 자료에서 핵심과 함의를 뽑아내는 분석 전문가입니다.",
    instruction: "아래 [자료]를 분석해 {audience}가 의사결정에 쓸 수 있도록 {tone} 톤으로 정리하세요.",
    inputLabel: "자료",
    inputPlaceholder: "분석할 텍스트, 데이터, 문서를 붙여넣으세요"
  },
  {
    key: "translate",
    label: "번역",
    role: "당신은 도착어에서 자연스러운 표현을 우선하는 전문 번역가입니다.",
    instruction: "아래 [원문]을 {audience}가 읽을 글로 {tone} 톤으로 번역하세요. 단어 대 단어 직역이 아니라 의미 단위로 옮깁니다.",
    inputLabel: "원문",
    inputPlaceholder: "번역할 원문과 도착어(예: 한국어→영어)를 적으세요"
  },
  {
    key: "learn",
    label: "학습·설명",
    role: "당신은 어려운 개념을 학습자의 눈높이에 맞춰 설명하는 교사입니다.",
    instruction: "아래 [개념]을 {audience} 수준에서 이해할 수 있게 {tone} 톤으로 설명하세요. 비유 1개와 구체적 예시 2개를 포함합니다.",
    inputLabel: "개념",
    inputPlaceholder: "배우고 싶은 개념·기술·용어를 적으세요"
  },
  {
    key: "code",
    label: "코드 리뷰·수정",
    role: "당신은 가독성과 안정성을 중시하는 시니어 개발자입니다.",
    instruction: "아래 [코드]를 검토해 문제점과 개선안을 {tone} 톤으로 제시하세요. 수정 제안은 변경 전/후 코드를 함께 보여줍니다.",
    inputLabel: "코드",
    inputPlaceholder: "검토받을 코드와 언어, 맥락을 붙여넣으세요"
  },
  {
    key: "ideas",
    label: "아이디어 발상",
    role: "당신은 실행 가능성을 함께 따지는 브레인스토밍 파트너입니다.",
    instruction: "아래 [주제]에 대한 아이디어를 {audience} 관점에서 {tone} 톤으로 제안하세요. 아이디어마다 장점 1개와 위험 1개를 붙입니다.",
    inputLabel: "주제",
    inputPlaceholder: "아이디어가 필요한 주제와 제약 조건을 적으세요"
  }
];

export const AUDIENCES = [
  { key: "exec", label: "경영진·의사결정자" },
  { key: "peer", label: "실무 동료" },
  { key: "customer", label: "고객·외부인" },
  { key: "novice", label: "비전문가·입문자" },
  { key: "expert", label: "해당 분야 전문가" }
];

export const TONES = [
  { key: "formal", label: "격식 있는" },
  { key: "practical", label: "간결한 실무" },
  { key: "friendly", label: "친근한" },
  { key: "persuasive", label: "설득력 있는" }
];

export const FORMATS = [
  { key: "bullets", label: "핵심 불릿", text: "출력은 중요도 순 불릿 목록으로 작성합니다." },
  { key: "table", label: "표", text: "출력의 핵심 내용은 표(항목/내용/비고)로 정리합니다." },
  { key: "steps", label: "단계별 목록", text: "출력은 순서가 있는 단계별 목록으로 작성합니다." },
  { key: "prose", label: "서술형 문단", text: "출력은 소제목이 있는 서술형 문단으로 작성합니다." },
  { key: "structured", label: "요약+본문+실행항목", text: "출력은 '한 줄 요약 → 본문 → 실행 항목' 구조로 작성합니다." }
];

// few-shot 예시: 프롬프트 품질을 가장 크게 올리는 단일 레버.
// "예시 포함" 재료를 켜면 작업 유형별 검증된 입출력 예시가 프롬프트에 삽입된다.
export const EXAMPLES: Record<string, { input: string; output: string }> = {
  report: {
    input: "3분기 온라인 매출 12% 증가, 오프라인 5% 감소, 마케팅비 동결 상태의 월별 데이터",
    output:
      "한 줄 요약: 온라인 전환 가속으로 3분기 총매출은 전년 대비 4% 성장. 핵심: ① 온라인 +12% (신규 고객 유입이 견인) ② 오프라인 -5% (2개 지점 집중) ③ 마케팅 효율 개선. 실행 항목: 오프라인 부진 지점 원인 분석(기한: 10/15, 담당: 영업팀)."
  },
  email: {
    input: "협력사에 납기 1주 연장을 요청하는 상황, 상대는 실무 담당자",
    output:
      "제목: [요청] ○○ 프로젝트 납기 조정 협의 (10/20 → 10/27)\n안녕하세요, ○○팀 △△입니다. 내부 품질 검수에서 보완 사항이 발견되어, 완성도를 위해 납기를 1주 조정하고자 합니다. 조정 시 검수 완료본으로 전달드릴 수 있습니다. 가능 여부를 회신 주시면 일정표를 바로 공유드리겠습니다."
  },
  analyze: {
    input: "고객 설문 200건 원문",
    output:
      "핵심 발견: ① 불만의 62%가 배송 지연에 집중 ② 20대는 UI, 40대는 CS 응대를 주로 지적 ③ 재구매 의향은 배송 만족과 강한 상관. 의사결정 포인트: 배송 SLA 개선이 최우선 투자처. 근거: 문항 3·7 교차 분석."
  },
  translate: {
    input: "\"We're excited to announce...\"로 시작하는 영문 보도자료",
    output:
      "(직역) \"우리는 ~을 발표하게 되어 흥분됩니다\" → (자연스러운 번역) \"○○를 새롭게 선보입니다.\" — 영어의 관습적 표현은 한국어 보도자료 관례에 맞게 옮기고, 의역 노트에 표시."
  },
  learn: {
    input: "RAG가 뭔지 모르는 비개발자",
    output:
      "한 줄 정의: RAG는 AI가 답하기 전에 관련 자료를 먼저 찾아 읽고 답하게 하는 방법입니다. 비유: 오픈북 시험 — 암기(학습)만으로 답하는 대신 교과서(내 문서)를 펴놓고 답합니다. 단, 비유의 한계: 시험과 달리 어떤 책을 펼지도 AI가 고릅니다."
  },
  code: {
    input: "null 체크 없이 중첩 객체에 접근하는 JavaScript 함수",
    output:
      "문제: user.profile.email 접근 시 profile이 없으면 TypeError. 위험도: 높음(런타임 크래시). 개선안: 변경 전 user.profile.email → 변경 후 user?.profile?.email ?? 기본값. 추가 권고: 이 패턴이 3곳 더 있어 일괄 수정 필요."
  },
  ideas: {
    input: "사내 지식 공유가 안 되는 문제",
    output:
      "아이디어 1: 주간 15분 '실패 공유회' — 장점: 심리적 장벽이 낮음 / 위험: 강제성 없으면 소멸. 아이디어 2: 문서화를 온보딩 필수 절차에 결합 — 장점: 자연 축적 / 위험: 형식적 작성."
  }
};

export const INGREDIENTS = [
  { key: "no_hallucination", label: "환각 방지", text: "제공된 내용에 없는 사실을 지어내지 않습니다. 근거가 없으면 '불명확'으로 표시합니다." },
  { key: "few_shot", label: "예시 포함 (few-shot)", text: "" },
  { key: "evidence", label: "근거 표시", text: "핵심 주장마다 어떤 입력 내용에 근거했는지 표시합니다." },
  { key: "step_by_step", label: "단계적 추론", text: "결론을 내기 전에 사고 과정을 단계별로 먼저 보여줍니다." },
  { key: "ask_first", label: "부족하면 되묻기", text: "작업에 필요한 정보가 부족하면 추측하지 말고 먼저 질문합니다." },
  { key: "self_check", label: "자기 검토", text: "출력을 마친 뒤 스스로 오류·누락·어색한 부분을 점검하고 고친 최종본을 제시합니다." },
  { key: "plain_terms", label: "용어 풀기", text: "전문용어는 처음 등장할 때 한 번 쉽게 풀어 씁니다." },
  { key: "concise", label: "분량 제한", text: "전체 분량은 꼭 필요한 만큼만 — 같은 말을 반복하지 않습니다." }
];

export function assemblePrompt(options: {
  task: BuilderTask;
  audience: string;
  tone: string;
  formats: string[];
  ingredients: string[];
  note: string;
}) {
  const { task, audience, tone, formats, ingredients, note } = options;

  const instruction = task.instruction.replace("{audience}", audience).replace("{tone}", tone);

  const rules = [
    ...INGREDIENTS.filter((item) => ingredients.includes(item.key) && item.text.length > 0).map((item) => item.text),
    ...FORMATS.filter((item) => formats.includes(item.key)).map((item) => item.text)
  ];

  const example = ingredients.includes("few_shot") ? EXAMPLES[task.key] : undefined;

  const parts = [
    task.role,
    instruction,
    rules.length > 0 ? `규칙: ${rules.map((rule, index) => `(${index + 1}) ${rule}`).join(" ")}` : null,
    example
      ? `다음은 좋은 출력의 예시입니다. [예시 입력]: ${example.input} [예시 출력]: ${example.output} 이 예시의 수준과 구조를 따르되, 내용은 실제 입력에 맞게 작성합니다.`
      : null,
    note.trim().length > 0 ? `추가 요청: ${note.trim()}` : null,
    `[${task.inputLabel}]: {${task.inputLabel}}`
  ];

  return parts.filter(Boolean).join(" ");
}
