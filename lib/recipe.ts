// 빌더 레시피의 공유 링크 인코딩. 서버·DB 없이 URL 자체가 저장소다.
// 포맷: [taskKey, audienceKey, toneKey, formatKeys[], ingredientKeys[], note] → JSON → base64url

export type RecipeState = {
  taskKey: string | null;
  audienceKey: string | null;
  toneKey: string | null;
  formatKeys: string[];
  ingredientKeys: string[];
  note: string;
};

export function encodeRecipe(state: RecipeState): string {
  const payload = JSON.stringify([
    state.taskKey,
    state.audienceKey,
    state.toneKey,
    state.formatKeys,
    state.ingredientKeys,
    state.note
  ]);
  const bytes = new TextEncoder().encode(payload);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeRecipe(encoded: string): RecipeState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    if (!Array.isArray(parsed) || parsed.length !== 6) {
      return null;
    }

    const [taskKey, audienceKey, toneKey, formatKeys, ingredientKeys, note] = parsed;

    if (!Array.isArray(formatKeys) || !Array.isArray(ingredientKeys) || typeof note !== "string") {
      return null;
    }

    return {
      taskKey: typeof taskKey === "string" ? taskKey : null,
      audienceKey: typeof audienceKey === "string" ? audienceKey : null,
      toneKey: typeof toneKey === "string" ? toneKey : null,
      formatKeys: formatKeys.filter((key): key is string => typeof key === "string"),
      ingredientKeys: ingredientKeys.filter((key): key is string => typeof key === "string"),
      note
    };
  } catch {
    return null;
  }
}

export type SavedRecipe = {
  name: string;
  encoded: string;
  savedAt: number;
};

const STORAGE_KEY = "agenwiki_recipes";

export function loadSavedRecipes(): SavedRecipe[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedRecipes(recipes: SavedRecipe[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // localStorage가 막힌 환경(시크릿 모드 등)에서는 조용히 무시한다.
  }
}
