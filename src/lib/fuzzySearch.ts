import { categories, type TroubleshootingItem } from "@/data/troubleshootingData";

export interface SearchResult {
  item: TroubleshootingItem;
  categoryId: string;
  categoryTitle: string;
  score: number;
}

/** Simple fuzzy similarity: longest common subsequence ratio + keyword bonus */
function similarity(query: string, text: string): number {
  const a = query.toLowerCase();
  const b = text.toLowerCase();

  // Exact substring match gets highest boost
  if (b.includes(a)) return 1.0;

  // Word-level matching: how many query words appear in text
  const queryWords = a.split(/\s+/).filter(Boolean);
  const matchedWords = queryWords.filter((w) => b.includes(w));
  const wordScore = queryWords.length > 0 ? matchedWords.length / queryWords.length : 0;

  // LCS ratio for typo tolerance
  const lcsLen = lcs(a, b);
  const lcsScore = a.length > 0 ? lcsLen / a.length : 0;

  return wordScore * 0.6 + lcsScore * 0.4;
}

function lcs(a: string, b: string): number {
  if (a.length > 30) a = a.slice(0, 30); // cap for perf
  const m = a.length;
  const n = Math.min(b.length, 80);
  const prev = new Array(n + 1).fill(0);
  const curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    for (let j = 0; j <= n; j++) {
      prev[j] = curr[j];
      curr[j] = 0;
    }
  }
  return prev[n];
}

export function searchArticles(query: string, limit = 6): SearchResult[] {
  if (!query.trim()) return [];

  const results: SearchResult[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      const titleScore = similarity(query, item.title) * 1.0;
      const descScore = similarity(query, item.description) * 0.7;
      const stepScore = Math.max(
        0,
        ...item.steps.map((s) => similarity(query, s) * 0.4)
      );
      const score = Math.max(titleScore, descScore, stepScore);

      if (score > 0.25) {
        results.push({
          item,
          categoryId: cat.id,
          categoryTitle: cat.title,
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
