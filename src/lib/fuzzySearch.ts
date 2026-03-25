import { categories, type TroubleshootingItem } from "@/data/troubleshootingData";

export interface SearchResult {
  item: TroubleshootingItem;
  categoryId: string;
  categoryTitle: string;
  score: number;
}

/**
 * Scores how well a query matches a piece of text.
 * Handles: exact substrings, partial words (prefix), typos (LCS subsequence).
 */
function similarity(query: string, text: string): number {
  const a = query.toLowerCase().trim();
  const b = text.toLowerCase();

  if (!a) return 0;

  // Exact substring match — highest confidence
  if (b.includes(a)) return 1.0;

  // Split both into words (handle hyphens like "wi-fi")
  const queryWords = a.split(/\s+/).filter(Boolean);
  const textWords = b.split(/[\s\-\/]+/).filter(Boolean);

  // Word-level matching: exact → prefix → substring, in order of confidence
  let wordScore = 0;
  if (queryWords.length > 0) {
    const matched = queryWords.filter((qw) => {
      if (textWords.some((tw) => tw === qw)) return true;         // exact word
      if (textWords.some((tw) => tw.startsWith(qw))) return true;  // prefix  e.g. "pay" → "payouts"
      if (textWords.some((tw) => tw.includes(qw))) return true;    // substring e.g. "out" → "payouts"
      return false;
    });
    wordScore = matched.length / queryWords.length;
  }

  // LCS subsequence ratio — catches transpositions and typos e.g. "priner" → "printer"
  const lcsLen = lcs(a, b);
  const lcsScore = a.length > 0 ? lcsLen / a.length : 0;

  return wordScore * 0.6 + lcsScore * 0.4;
}

function lcs(a: string, b: string): number {
  if (a.length > 30) a = a.slice(0, 30);
  const m = a.length;
  const n = Math.min(b.length, 100);
  const prev = new Array(n + 1).fill(0);
  const curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    for (let j = 0; j <= n; j++) { prev[j] = curr[j]; curr[j] = 0; }
  }
  return prev[n];
}

export function searchArticles(query: string, limit = 6): SearchResult[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const results: SearchResult[] = [];

  for (const cat of categories) {
    for (const item of cat.items) {
      const titleScore  = similarity(q, item.title)       * 1.0;
      const descScore   = similarity(q, item.description) * 0.7;
      const stepScore   = item.steps.length > 0
        ? Math.max(...item.steps.map((s) => similarity(q, s))) * 0.4
        : 0;
      const score = Math.max(titleScore, descScore, stepScore);

      if (score > 0.25) {
        results.push({ item, categoryId: cat.id, categoryTitle: cat.title, score });
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
