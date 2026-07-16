"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import {
  COMMIT_STYLES,
  FORBIDDEN_RULES,
  OUTPUT_FORMATS,
  PROJECT_TYPES,
  STACKS,
  STYLE_RULES,
  assembleAgentConfig,
  decodeAgentConfig,
  encodeAgentConfig,
  type AgentConfigState
} from "@/lib/agentConfig";

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active ? "border-accent bg-accent text-white" : "border-line bg-white text-ink hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </button>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-accent";

export function AgentConfigBuilder() {
  const [state, setState] = useState<AgentConfigState>({
    projectName: "",
    projectDesc: "",
    projectType: null,
    stackKeys: [],
    stackExtra: "",
    commands: { install: "", dev: "", test: "", build: "" },
    styleKeys: ["follow_existing", "minimal_comments"],
    forbiddenKeys: ["no_secrets"],
    commitKey: null,
    extraNote: ""
  });
  const [format, setFormat] = useState<(typeof OUTPUT_FORMATS)[number]["key"]>("claude");
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const output = useMemo(() => assembleAgentConfig(state, format), [state, format]);
  const filename = OUTPUT_FORMATS.find((item) => item.key === format)?.filename ?? "CLAUDE.md";

  // 공유 링크(?c=)로 진입하면 설정을 복원한다.
  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get("c");
    if (!encoded) {
      return;
    }
    const decoded = decodeAgentConfig(encoded);
    if (!decoded) {
      return;
    }
    // 알 수 없는 키(구버전 링크 등)는 조용히 버린다 — 깨진 상태로 조립되는 것보다 낫다.
    setState({
      ...decoded,
      projectType: PROJECT_TYPES.some((item) => item.key === decoded.projectType) ? decoded.projectType : null,
      stackKeys: decoded.stackKeys.filter((key) => STACKS.some((item) => item.key === key)),
      styleKeys: decoded.styleKeys.filter((key) => STYLE_RULES.some((item) => item.key === key)),
      forbiddenKeys: decoded.forbiddenKeys.filter((key) => FORBIDDEN_RULES.some((item) => item.key === key)),
      commitKey: COMMIT_STYLES.some((item) => item.key === decoded.commitKey) ? decoded.commitKey : null
    });
    track("agentconfig_open", {});
  }, []);

  async function copyShareLink() {
    const url = `${window.location.origin}/tools/claude-md?c=${encodeAgentConfig(state)}`;
    await navigator.clipboard.writeText(url);
    track("agentconfig_share", { format });
    setShareNotice("공유 링크를 복사했습니다. 붙여넣으면 이 설정이 채워진 채 열립니다.");
    window.setTimeout(() => setShareNotice(null), 4000);
  }

  function toggleList(field: "stackKeys" | "styleKeys" | "forbiddenKeys", key: string) {
    setState((prev) => {
      const list = prev[field];
      return { ...prev, [field]: list.includes(key) ? list.filter((item) => item !== key) : [...list, key] };
    });
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    track("agentconfig_copy", { format });
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    track("agentconfig_download", { format });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">
          <span className="mr-2 text-accent">1단계</span>프로젝트 소개
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            type="text"
            value={state.projectName}
            onChange={(event) => setState((prev) => ({ ...prev, projectName: event.target.value }))}
            placeholder="프로젝트 이름 (예: my-shop)"
            className={inputClass}
          />
          <input
            type="text"
            value={state.projectDesc}
            onChange={(event) => setState((prev) => ({ ...prev, projectDesc: event.target.value }))}
            placeholder="한 줄 설명 (예: 반려동물 용품 쇼핑몰)"
            className={inputClass}
          />
        </div>
        <p className="mt-4 text-sm text-muted">프로젝트 유형</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PROJECT_TYPES.map((item) => (
            <Chip
              key={item.key}
              active={state.projectType === item.key}
              label={item.label}
              onClick={() => setState((prev) => ({ ...prev, projectType: item.key }))}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">기술 스택 (복수 선택)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STACKS.map((item) => (
            <Chip
              key={item.key}
              active={state.stackKeys.includes(item.key)}
              label={item.label}
              onClick={() => toggleList("stackKeys", item.key)}
            />
          ))}
        </div>
        <input
          type="text"
          value={state.stackExtra}
          onChange={(event) => setState((prev) => ({ ...prev, stackExtra: event.target.value }))}
          placeholder="기타 스택 직접 입력 (예: Supabase, Tailwind)"
          className={`${inputClass} mt-3`}
        />
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">
          <span className="mr-2 text-accent">2단계</span>자주 쓰는 명령어 (아는 것만)
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(
            [
              ["install", "의존성 설치 (예: npm install)"],
              ["dev", "개발 서버 (예: npm run dev)"],
              ["test", "테스트 (예: npm test)"],
              ["build", "빌드 (예: npm run build)"]
            ] as const
          ).map(([key, placeholder]) => (
            <input
              key={key}
              type="text"
              value={state.commands[key]}
              onChange={(event) =>
                setState((prev) => ({ ...prev, commands: { ...prev.commands, [key]: event.target.value } }))
              }
              placeholder={placeholder}
              className={inputClass}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">
          <span className="mr-2 text-accent">3단계</span>작업 규칙
        </h2>
        <p className="mt-2 text-sm text-muted">코드 스타일</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLE_RULES.map((item) => (
            <Chip
              key={item.key}
              active={state.styleKeys.includes(item.key)}
              label={item.label}
              onClick={() => toggleList("styleKeys", item.key)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">금지사항</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FORBIDDEN_RULES.map((item) => (
            <Chip
              key={item.key}
              active={state.forbiddenKeys.includes(item.key)}
              label={item.label}
              onClick={() => toggleList("forbiddenKeys", item.key)}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">커밋 규약</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMIT_STYLES.map((item) => (
            <Chip
              key={item.key}
              active={state.commitKey === item.key}
              label={item.label}
              onClick={() => setState((prev) => ({ ...prev, commitKey: prev.commitKey === item.key ? null : item.key }))}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">추가 규칙 (자유 입력)</p>
        <textarea
          rows={2}
          value={state.extraNote}
          onChange={(event) => setState((prev) => ({ ...prev, extraNote: event.target.value }))}
          placeholder="예: API 응답은 반드시 zod로 검증한다"
          className={`${inputClass} mt-2`}
        />
      </section>

      <section className="rounded-lg border border-accent bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">완성된 파일</h2>
          <div className="flex flex-wrap items-center gap-2">
            {OUTPUT_FORMATS.map((item) => (
              <Chip key={item.key} active={format === item.key} label={item.label} onClick={() => setFormat(item.key)} />
            ))}
          </div>
        </div>
        <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-neutral-950 p-4 text-sm leading-7 text-neutral-100">
          <code>{output}</code>
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyOutput}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            {copied ? "복사됨" : "복사"}
          </button>
          <button
            type="button"
            onClick={downloadOutput}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            ⬇ {filename} 다운로드
          </button>
          <button
            type="button"
            onClick={copyShareLink}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            🔗 공유 링크 복사
          </button>
        </div>
        {shareNotice ? <p className="mt-2 text-xs leading-5 text-accent">{shareNotice}</p> : null}
        <p className="mt-3 text-xs leading-5 text-muted">
          내려받은 파일을 프로젝트 최상위 폴더에 두면 Claude Code·Codex·Cursor 같은 AI 코딩 도구가 자동으로 읽습니다.
        </p>
      </section>
    </div>
  );
}
