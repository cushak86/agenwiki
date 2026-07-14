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

export const INGREDIENTS = [
  { key: "no_hallucination", label: "환각 방지", text: "제공된 내용에 없는 사실을 지어내지 않습니다. 근거가 없으면 '불명확'으로 표시합니다." },
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
    ...INGREDIENTS.filter((item) => ingredients.includes(item.key)).map((item) => item.text),
    ...FORMATS.filter((item) => formats.includes(item.key)).map((item) => item.text)
  ];

  const parts = [
    task.role,
    instruction,
    rules.length > 0 ? `규칙: ${rules.map((rule, index) => `(${index + 1}) ${rule}`).join(" ")}` : null,
    note.trim().length > 0 ? `추가 요청: ${note.trim()}` : null,
    `[${task.inputLabel}]: {${task.inputLabel}}`
  ];

  return parts.filter(Boolean).join(" ");
}
