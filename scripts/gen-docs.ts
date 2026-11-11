// docs/: one Markdown file per endpoint, platform and object in English and Chinese, plus the
// machine-readable files (llms.txt, openapi.json, prices.json, mcp-tools.json, catalog.json).
// The page text comes from the same generators the okdata.online site uses.
import { type Endpoint, type Files, type Lang, type Source, GENERATED_NOTE, priceText, priceTextZh } from './shared.ts';

type Fn<R> = (...args: unknown[]) => R;

const json = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const withNewline = (text: string): string => (text.endsWith('\n') ? text : `${text}\n`);
const prefix = (lang: Lang): string => (lang === 'en' ? 'docs' : 'docs/zh');

/** docs/apis/douyin/videos/search.md (relative to the repository root). */
export const endpointDocPath = (e: Pick<Endpoint, 'id'>, lang: Lang): string =>
  `${prefix(lang)}/apis/${e.id.split('.').join('/')}.md`;

const cell = (s: string): string => s.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

function table(head: string[], rows: string[][]): string {
  const line = (cells: string[]) => `| ${cells.map(cell).join(' | ')} |`;
  return [line(head), `|${head.map(() => '---').join('|')}|`, ...rows.map(line)].join('\n');
}

/** The endpoint table for README.md and docs/README.md; links are relative to `from`. */
export function endpointTable(src: Source, lang: Lang, from: 'root' | 'docs'): string {
  const link = (e: Endpoint) => (from === 'root' ? endpointDocPath(e, lang) : endpointDocPath(e, lang).replace(/^docs\//, ''));
  return src.catalog.platforms.map((p) => {
    const list = src.catalog.endpoints.filter((e) => e.platform === p.id);
    const rows = list.map((e) => [
      `[${e.title[lang]}](${link(e)})`,
      `\`${e.id}\``,
      lang === 'en' ? priceText(e) : priceTextZh(e),
    ]);
    const head = lang === 'en' ? ['Endpoint', 'ID', 'Price'] : ['接口', 'ID', '价格'];
    return [`**${p.name[lang]}**`, '', table(head, rows)].join('\n');
  }).join('\n\n');
}

function docsIndex(src: Source): string {
  const { catalog } = src;
  const n = catalog.endpoints.length;
  return [
    '# okdata docs',
    '',
    `<!-- ${GENERATED_NOTE} -->`,
    '',
    `${n} endpoints on ${catalog.platforms.length} platforms, catalog ${catalog.revision}, price book ${catalog.priceBook}. `
      + `The same pages, kept current, are at ${src.site.siteUrl}/apis/. 中文在下面。`,
    '',
    '## Files for agents and code',
    '',
    '- [agents.md](agents.md): set okdata up in an AI agent (MCP or HTTP), step by step',
    '- [llms.txt](llms.txt) and [llms-full.txt](llms-full.txt): the whole API as an AI reads it',
    '- [openapi.json](openapi.json): OpenAPI 3.1 for every endpoint',
    '- [prices.json](prices.json): every price, the billing rules and the cost of 1,000 items',
    '- [mcp-tools.json](mcp-tools.json): the tools the MCP server exposes',
    '- [catalog.json](catalog.json): endpoints, parameters and prices as data',
    '- [errors.md](errors.md): every error code, whether it is charged and whether to retry',
    `- Objects: ${src.gen.OBJECT_KINDS.map((k) => `[${k}](objects/${k}.md)`).join(', ')}`,
    '',
    '## Endpoints',
    '',
    endpointTable(src, 'en', 'docs'),
    '',
    '## 中文文档',
    '',
    '- [zh/agents.md](zh/agents.md)：在智能体里配置 okdata',
    '- [zh/llms.txt](zh/llms.txt)、[zh/llms-full.txt](zh/llms-full.txt)：给 AI 读的全部说明',
    '- [zh/errors.md](zh/errors.md)：错误码、是否扣费、要不要重试',
    `- 数据对象：${src.gen.OBJECT_KINDS.map((k) => `[${k}](zh/objects/${k}.md)`).join('、')}`,
    '',
    endpointTable(src, 'zh', 'docs'),
    '',
  ].join('\n');
}

/** The catalog as /v1/catalog serves it, with the public API origin. */
export function catalogJson(src: Source): unknown {
  return {
    ...src.catalog,
    baseUrl: src.site.apiUrl,
    endpoints: src.catalog.endpoints.map((e) => ({ ...e, path: src.pathOf(e) })),
  };
}

export function generateDocs(src: Source): Files {
  const { catalog, site, gen } = src;
  const call = <R>(name: string, ...args: unknown[]): R => (gen[name] as unknown as Fn<R>)(...args);
  const files: Files = new Map();
  const langs: Lang[] = ['en', 'zh'];

  for (const lang of langs) {
    for (const e of catalog.endpoints) files.set(endpointDocPath(e, lang), withNewline(call<string>('endpointMd', catalog, e, lang, site)));
    for (const p of catalog.platforms) files.set(`${prefix(lang)}/apis/${p.id}.md`, withNewline(call<string>('platformMd', catalog, p, lang, site)));
    for (const k of gen.OBJECT_KINDS) files.set(`${prefix(lang)}/objects/${k}.md`, withNewline(call<string>('objectMd', catalog, k, lang, site)));
    files.set(`${prefix(lang)}/errors.md`, withNewline(call<string>('errorsMd', lang, site)));
    files.set(`${prefix(lang)}/agents.md`, withNewline(call<string>('toAgentsMd', catalog, site, lang)));
    files.set(`${prefix(lang)}/llms.txt`, withNewline(call<string>('toLlmsTxt', catalog, lang, site)));
    files.set(`${prefix(lang)}/llms-full.txt`, withNewline(call<string>('toLlmsFullTxt', catalog, lang, site)));
  }

  files.set('docs/README.md', docsIndex(src));
  files.set('docs/openapi.json', json(call('toOpenAPI', catalog, site)));
  files.set('docs/prices.json', json(call('toPrices', catalog)));
  files.set('docs/mcp-tools.json', json(call('toMcpTools', catalog)));
  files.set('docs/catalog.json', json(catalogJson(src)));
  return files;
}
