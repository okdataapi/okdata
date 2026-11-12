// `okdata find`: plain words (English or Chinese) to endpoints. A platform named in the words, or
// given with --platform, limits the search to it and is never swapped for another; with no word
// left that matches, everything that platform has is listed.
import type { CatalogData, CatalogEndpoint, CatalogPlatform } from './catalog.js';

export interface FindOptions {
  platform?: string;
  category?: string;
  limit: number;
}

export interface FindResult {
  platform: string | null;
  /** true: no word matched, so this is everything the platform has. */
  listedAll: boolean;
  matches: CatalogEndpoint[];
}

/** Names people use that the catalog's platform names do not spell out. */
const EXTRA_NAMES: Readonly<Record<string, readonly string[]>> = {
  x: ['twitter', 'tweet', 'tweets', '推特', '推文'],
  xiaohongshu: ['rednote', 'xhs', '红书'],
  wechat_mp: ['公众号', 'official account', 'official accounts'],
  wechat_channels: ['视频号'],
  wechat: ['搜一搜'],
  bilibili: ['b站', 'bili', '哔哩哔哩'],
  douyin: ['抖音'],
  youtube: ['油管', 'yt'],
  kuaishou: ['快手'],
  zhihu: ['知乎'],
  weibo: ['微博'],
};

const STOP = new Set(['the', 'a', 'an', 'of', 'on', 'for', 'in', 'to', 'and', 'with', 'me', 'my', 'what', 'how', 'by', 'from', 'about', 'is', 'are', '的', '了', '和', '在', '查', '找', '看', '一下', '查一下', '找一下', '搜一下', '看看', '帮我', '我', '有哪些', '什么']);
const CJK = /[㐀-鿿]/;

function platformNames(p: CatalogPlatform): string[] {
  const split = (s: string) => s.toLowerCase().split(/[()（）]/).map((x) => x.trim()).filter(Boolean);
  return [...new Set([p.id, p.id.replace(/_/g, ' '), ...split(p.name.en), ...split(p.name.zh), ...(EXTRA_NAMES[p.id] ?? [])])];
}

const isWord = (name: string) => /^[a-z0-9 ]+$/.test(name);

/** The platform named in the words (longest name first), and the words without it. */
function detectPlatform(words: string, platforms: readonly CatalogPlatform[]): { platform: string | null; rest: string } {
  const names = platforms.flatMap((p) => platformNames(p).map((name) => ({ id: p.id, name }))).sort((a, b) => b.name.length - a.name.length);
  for (const { id, name } of names) {
    const re = isWord(name) ? new RegExp(`(^|[^a-z0-9])${name.replace(/ /g, '\\s+')}($|[^a-z0-9])`) : null;
    if (re ? re.test(words) : words.includes(name)) return { platform: id, rest: re ? words.replace(re, ' ') : words.replace(name, ' ') };
  }
  return { platform: null, rest: words };
}

/** Words, and for runs of Chinese characters the run and its two-character pieces. */
export function tokens(words: string): string[] {
  const out: string[] = [];
  for (const raw of words.toLowerCase().split(/[\s,.;:!?，。；：！？、"'“”‘’()（）]+/)) {
    const t = raw.trim();
    if (!t || STOP.has(t)) continue;
    out.push(t);
    if (CJK.test(t) && t.length > 2) for (let i = 0; i + 2 <= t.length; i += 1) if (!STOP.has(t.slice(i, i + 2))) out.push(t.slice(i, i + 2));
  }
  return [...new Set(out)];
}

function score(e: CatalogEndpoint, words: readonly string[]): number {
  const fields: [number, string][] = [
    [3, `${e.id} ${e.title.en} ${e.title.zh} ${e.short.en} ${e.short.zh}`.toLowerCase()],
    [2, [...e.aliases.en, ...e.aliases.zh, e.group?.en ?? '', e.group?.zh ?? ''].join(' ').toLowerCase()],
    [1, `${e.summary.en} ${e.summary.zh}`.toLowerCase()],
  ];
  let total = 0;
  for (const w of words) total += Math.max(0, ...fields.filter(([, text]) => text.includes(w)).map(([weight]) => weight));
  return total;
}

export function find(catalog: CatalogData, words: string, opts: FindOptions): FindResult {
  const detected = opts.platform ? { platform: opts.platform, rest: words.toLowerCase() } : detectPlatform(words.toLowerCase(), catalog.platforms);
  const pool = catalog.endpoints.filter((e) => (!detected.platform || e.platform === detected.platform) && (!opts.category || e.category === opts.category));
  const ws = tokens(detected.rest);
  const scored = pool.map((e, i) => ({ e, i, s: ws.length ? score(e, ws) : 0 })).filter((x) => x.s > 0);
  if (scored.length === 0 && detected.platform) return { platform: detected.platform, listedAll: true, matches: pool };
  scored.sort((a, b) => b.s - a.s || a.i - b.i);
  return { platform: detected.platform, listedAll: false, matches: scored.slice(0, opts.limit).map((x) => x.e) };
}
