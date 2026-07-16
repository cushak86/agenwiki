// CLAUDE.md / AGENTS.md / .cursor/rules(.mdc) 생성기의 재료 데이터와 조립 로직.
// AI 코딩 도구(Claude Code·Codex·Cursor)가 읽는 프로젝트 설정 파일을 클릭으로 만든다.

export const PROJECT_TYPES = [
  { key: "webapp", label: "웹앱 (프론트+백)" },
  { key: "frontend", label: "프론트엔드" },
  { key: "api", label: "API 서버" },
  { key: "library", label: "라이브러리·패키지" },
  { key: "script", label: "스크립트·자동화" },
  { key: "data", label: "데이터 분석·ML" }
];

export const STACKS = [
  { key: "ts", label: "TypeScript" },
  { key: "react", label: "React/Next.js" },
  { key: "node", label: "Node.js" },
  { key: "python", label: "Python" },
  { key: "java", label: "Java/Spring" },
  { key: "go", label: "Go" },
  { key: "vue", label: "Vue/Nuxt" },
  { key: "flutter", label: "Flutter" }
];

export const STYLE_RULES = [
  { key: "follow_existing", label: "기존 패턴 따르기", text: "새 코드는 주변 코드의 네이밍·구조·관용구를 따른다. 새로운 스타일을 도입하기 전에 기존 코드를 먼저 살핀다." },
  { key: "minimal_comments", label: "주석 최소화", text: "주석은 코드로 표현할 수 없는 의도·제약만 남긴다. 코드를 반복 설명하는 주석은 쓰지 않는다." },
  { key: "korean_comments", label: "주석은 한국어", text: "주석과 커밋 메시지는 한국어로 작성한다." },
  { key: "strict_types", label: "타입 엄격", text: "any 사용을 피하고 타입을 명시한다. 타입 오류를 임시 우회(ts-ignore 등)로 덮지 않는다." },
  { key: "small_functions", label: "작은 함수 선호", text: "함수는 한 가지 일만 하도록 작게 유지하고, 깊은 중첩 대신 이른 반환을 쓴다." },
  { key: "test_first", label: "테스트 동반", text: "동작을 바꾸는 변경에는 테스트를 함께 추가하거나 갱신한다." },
  { key: "error_handling", label: "에러 처리 명시", text: "에러를 조용히 삼키지 않는다. 실패 시 로그를 남기거나 호출자에게 전파한다." }
];

export const FORBIDDEN_RULES = [
  { key: "no_new_deps", label: "새 의존성 임의 추가 금지", text: "새 라이브러리·패키지를 추가하기 전에 반드시 먼저 확인을 받는다." },
  { key: "no_secrets", label: "시크릿 커밋 금지", text: "API 키·토큰·비밀번호·.env 파일을 절대 커밋하지 않는다." },
  { key: "no_force_push", label: "force push 금지", text: "git push --force를 사용하지 않는다." },
  { key: "no_skip_tests", label: "테스트 우회 금지", text: "실패하는 테스트를 삭제하거나 skip 처리로 우회하지 않는다. 원인을 고친다." },
  { key: "no_big_refactor", label: "요청 밖 리팩터링 금지", text: "요청받지 않은 대규모 리팩터링·파일 이동을 하지 않는다. 발견한 개선점은 제안만 한다." },
  { key: "no_prod_data", label: "운영 데이터 접근 금지", text: "운영 DB·운영 환경에 직접 접근하거나 수정하지 않는다." }
];

export const COMMIT_STYLES = [
  { key: "conventional", label: "Conventional Commits", text: "커밋 메시지는 Conventional Commits(feat:, fix:, chore: 등)를 따른다." },
  { key: "korean", label: "한국어 한 줄", text: "커밋 메시지는 '무엇을 왜 했는지' 한국어 한 줄로 작성한다." },
  { key: "ticket", label: "티켓 번호 포함", text: "커밋 메시지 앞에 이슈·티켓 번호를 붙인다. 예: [PROJ-123] 로그인 오류 수정" }
];

// placement: 파일을 "어디에" 두는지. 셋이 서로 다르다 — Cursor만 최상위가 아니라 폴더 안이다.
// 여기를 뭉뚱그려 "최상위에 두면 다 읽습니다"라고 안내하면 Cursor 사용자에게 거짓이 된다.
export const OUTPUT_FORMATS = [
  {
    key: "claude",
    label: "CLAUDE.md",
    filename: "CLAUDE.md",
    placement: "프로젝트 최상위 폴더에 CLAUDE.md로 저장하세요. Claude Code가 세션 시작 때 읽습니다."
  },
  {
    key: "agents",
    label: "AGENTS.md",
    filename: "AGENTS.md",
    placement: "프로젝트 최상위 폴더에 AGENTS.md로 저장하세요. Codex 등 여러 도구가 읽는 공통 규격이고, Cursor 공식 문서도 대안으로 안내합니다."
  },
  {
    key: "cursor",
    label: ".cursor/rules",
    filename: "project.mdc",
    placement:
      "프로젝트에 .cursor/rules/ 폴더를 만들고 그 안에 project.mdc로 저장하세요 — 최상위에 두는 게 아닙니다. Cursor 공식 문서가 안내하는 현행 방식입니다."
  }
] as const;

export type AgentConfigState = {
  projectName: string;
  projectDesc: string;
  projectType: string | null;
  stackKeys: string[];
  stackExtra: string;
  commands: { install: string; dev: string; test: string; build: string };
  styleKeys: string[];
  forbiddenKeys: string[];
  commitKey: string | null;
  extraNote: string;
};

// 설정의 공유 링크 인코딩. 서버·DB 없이 URL 자체가 저장소다 — lib/recipe.ts 와 같은 방식.
// 포맷: [projectName, projectDesc, projectType, stackKeys[], stackExtra,
//        [install, dev, test, build], styleKeys[], forbiddenKeys[], commitKey, extraNote] → JSON → base64url

const CONFIG_FIELD_COUNT = 10;

export function encodeAgentConfig(state: AgentConfigState): string {
  const payload = JSON.stringify([
    state.projectName,
    state.projectDesc,
    state.projectType,
    state.stackKeys,
    state.stackExtra,
    [state.commands.install, state.commands.dev, state.commands.test, state.commands.build],
    state.styleKeys,
    state.forbiddenKeys,
    state.commitKey,
    state.extraNote
  ]);
  const bytes = new TextEncoder().encode(payload);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeAgentConfig(encoded: string): AgentConfigState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    if (!Array.isArray(parsed) || parsed.length !== CONFIG_FIELD_COUNT) {
      return null;
    }

    const [projectName, projectDesc, projectType, stackKeys, stackExtra, commands, styleKeys, forbiddenKeys, commitKey, extraNote] =
      parsed;

    if (!Array.isArray(stackKeys) || !Array.isArray(styleKeys) || !Array.isArray(forbiddenKeys) || !Array.isArray(commands)) {
      return null;
    }

    const str = (value: unknown) => (typeof value === "string" ? value : "");
    const strOrNull = (value: unknown) => (typeof value === "string" ? value : null);
    const strList = (list: unknown[]) => list.filter((key): key is string => typeof key === "string");

    return {
      projectName: str(projectName),
      projectDesc: str(projectDesc),
      projectType: strOrNull(projectType),
      stackKeys: strList(stackKeys),
      stackExtra: str(stackExtra),
      commands: {
        install: str(commands[0]),
        dev: str(commands[1]),
        test: str(commands[2]),
        build: str(commands[3])
      },
      styleKeys: strList(styleKeys),
      forbiddenKeys: strList(forbiddenKeys),
      commitKey: strOrNull(commitKey),
      extraNote: str(extraNote)
    };
  } catch {
    return null;
  }
}

/**
 * YAML 머리말에 넣을 값. 사용자가 친 프로젝트명이 그대로 들어가므로 콜론·따옴표·줄바꿈이
 * 오면 .mdc 파일 자체가 깨진다 — 항상 큰따옴표로 감싸고 안쪽을 이스케이프한다.
 */
function yamlValue(raw: string): string {
  const flat = raw.replace(/[\r\n]+/g, " ").replace(/\\/g, "\\\\").replace(/"/g, '\\"').trim();
  return `"${flat}"`;
}

export function assembleAgentConfig(state: AgentConfigState, format: (typeof OUTPUT_FORMATS)[number]["key"]): string {
  const type = PROJECT_TYPES.find((item) => item.key === state.projectType);
  const stacks = [
    ...STACKS.filter((item) => state.stackKeys.includes(item.key)).map((item) => item.label),
    ...(state.stackExtra.trim().length > 0 ? [state.stackExtra.trim()] : [])
  ];
  const styles = STYLE_RULES.filter((item) => state.styleKeys.includes(item.key));
  const forbidden = FORBIDDEN_RULES.filter((item) => state.forbiddenKeys.includes(item.key));
  const commit = COMMIT_STYLES.find((item) => item.key === state.commitKey);

  const name = state.projectName.trim() || "이 프로젝트";
  const commandEntries = [
    { label: "의존성 설치", value: state.commands.install },
    { label: "개발 서버", value: state.commands.dev },
    { label: "테스트", value: state.commands.test },
    { label: "빌드", value: state.commands.build }
  ].filter((entry) => entry.value.trim().length > 0);

  if (format === "cursor") {
    // Cursor의 현행 규격: .cursor/rules/*.mdc — 머리말(frontmatter)로 적용 범위를 정한다.
    // alwaysApply: true = 프로젝트 전체에 항상 적용(예전 .cursorrules 한 장과 같은 동작).
    const lines = [
      "---",
      `description: ${yamlValue(`${name} 작업 규칙`)}`,
      "alwaysApply: true",
      "---",
      "",
      `# ${name} 작업 규칙`,
      ...(state.projectDesc.trim() ? [state.projectDesc.trim()] : []),
      ...(type ? [`프로젝트 유형: ${type.label}`] : []),
      ...(stacks.length > 0 ? [`기술 스택: ${stacks.join(", ")}`] : []),
      "",
      ...styles.map((rule) => `- ${rule.text}`),
      ...forbidden.map((rule) => `- ${rule.text}`),
      ...(commit ? [`- ${commit.text}`] : []),
      ...(state.extraNote.trim() ? [`- ${state.extraNote.trim()}`] : [])
    ];
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  const sections: string[] = [];

  sections.push(`# ${format === "claude" ? "CLAUDE.md" : "AGENTS.md"}`);
  sections.push(`## 프로젝트 개요\n${state.projectDesc.trim() || `${name} 저장소다.`}${type ? ` (${type.label})` : ""}${stacks.length > 0 ? `\n\n기술 스택: ${stacks.join(", ")}` : ""}`);

  if (commandEntries.length > 0) {
    sections.push(`## 명령어\n${commandEntries.map((entry) => `- ${entry.label}: \`${entry.value.trim()}\``).join("\n")}`);
  }

  if (styles.length > 0) {
    sections.push(`## 코드 스타일\n${styles.map((rule) => `- ${rule.text}`).join("\n")}`);
  }

  if (forbidden.length > 0) {
    sections.push(`## 금지사항\n${forbidden.map((rule) => `- ${rule.text}`).join("\n")}`);
  }

  if (commit) {
    sections.push(`## 커밋 규약\n- ${commit.text}`);
  }

  if (state.extraNote.trim().length > 0) {
    sections.push(`## 기타\n${state.extraNote.trim()}`);
  }

  return sections.join("\n\n");
}
