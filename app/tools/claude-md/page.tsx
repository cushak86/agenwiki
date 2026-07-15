import { AgentConfigBuilder } from "@/components/AgentConfigBuilder";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "CLAUDE.md 생성기 — AI 코딩 설정 파일 만들기",
  description:
    "프로젝트 정보와 작업 규칙을 클릭으로 고르면 CLAUDE.md·AGENTS.md·.cursorrules 파일이 완성됩니다. Claude Code·Codex·Cursor용. 무료, 로그인 없음.",
  pathname: "/tools/claude-md"
});

export default function ClaudeMdGeneratorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">도구</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-ink">CLAUDE.md 생성기</h1>
        <p className="mt-4 leading-8 text-muted">
          AI 코딩 도구는 프로젝트 최상위의 설정 파일(CLAUDE.md·AGENTS.md·.cursorrules)을 읽고 그 규칙대로 일합니다.
          아래에서 프로젝트 정보와 규칙을 고르면 세 형식 모두로 파일을 만들어 드립니다.
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <AgentConfigBuilder />
      </div>

      <div className="mt-14 max-w-3xl space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-ink">CLAUDE.md가 뭔가요?</h2>
          <p className="mt-3 leading-8 text-muted">
            Claude Code가 세션을 시작할 때 자동으로 읽는 프로젝트 안내서입니다. 프로젝트 구조, 자주 쓰는 명령어, 코드
            스타일, 하지 말아야 할 것을 적어두면 AI가 매번 같은 걸 물어보지 않고 팀의 규칙대로 작업합니다. Codex 등
            여러 도구가 함께 읽는 공통 규격으로는 AGENTS.md가 쓰이고, Cursor는 .cursorrules를 읽습니다 — 내용은 거의
            같아서 이 생성기는 세 형식을 모두 만들어 줍니다.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-ink">잘 쓰는 요령</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-8 text-muted">
            <li>짧게 유지하세요. 규칙이 길수록 AI가 놓치는 규칙도 늘어납니다. 정말 지켜야 할 것만 담는 게 낫습니다.</li>
            <li>
              &ldquo;하지 마라&rdquo;가 &ldquo;해라&rdquo;보다 잘 작동합니다. 특히 시크릿 커밋 금지, 새 의존성 임의
              추가 금지 같은 금지선을 분명히 하세요.
            </li>
            <li>명령어 섹션이 의외로 중요합니다. 테스트·빌드 명령을 적어두면 AI가 스스로 검증하고 제출합니다.</li>
            <li>프로젝트가 바뀌면 파일도 갱신하세요. 낡은 규칙은 없는 것보다 나쁩니다.</li>
          </ul>
          <p className="mt-4 leading-8 text-muted">
            섹션별로 무엇을 어떻게 적어야 하는지 실전 예시가 필요하면{" "}
            <a href="/guides/how-to-write-claude-md" className="font-semibold text-accent hover:underline">
              CLAUDE.md 작성법 가이드
            </a>
            를 함께 보세요.
          </p>
        </section>
      </div>
    </div>
  );
}
