// typescript/src/endpoints.ts and models.ts: typed methods for every endpoint and interfaces for
// every object, so the TypeScript SDK never drifts from the catalog.
import {
  type Endpoint, type FieldDoc, type Files, type NamespaceNode, type Param, type Source,
  GENERATED_NOTE, MODEL_ORDER, SHARED_PARAMS, docsUrl, modelName, namespaceTree, needsIdOrUrl, paramDescription, priceText, splitId,
} from './shared.ts';

const str = (s: string): string => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const comment = (s: string): string => s.replace(/\*\//g, '*\\/');
const typeName = (id: string): string => id.split(/[._]/).map(modelName).join('');
const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const key = (name: string): string => (IDENT.test(name) ? name : str(name));

function paramType(p: Param): string {
  if (p.enum) return p.enum.map(str).join(' | ');
  switch (p.type) {
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'string[]': return 'readonly string[]';
    default: return 'string';
  }
}

function paramDoc(e: Endpoint, p: Param): string {
  const extra = [
    p.default !== undefined ? `Default \`${String(p.default)}\`.` : '',
    p.example !== undefined && p.name !== 'cursor' ? `Example: \`${String(p.example)}\`.` : '',
  ].filter(Boolean).join(' ');
  return `  /** ${comment(paramDescription(e, p))}${extra ? ` ${comment(extra)}` : ''} */`;
}

const endpointParams = (e: Endpoint): Param[] => e.params.filter((p) => !SHARED_PARAMS.has(p.name));

/** The params type of one endpoint. id-or-url endpoints get a union so exactly one is given. */
function paramsDecl(e: Endpoint): string {
  const name = `${typeName(e.id)}Params`;
  const idOrUrl = needsIdOrUrl(e);
  const own = endpointParams(e).filter((p) => !(idOrUrl && (p.name === 'id' || p.name === 'url')));
  const body = own.flatMap((p) => [paramDoc(e, p), `  ${key(p.name)}${p.required ? '' : '?'}: ${paramType(p)};`]);
  const head = `/** Parameters of ${comment(e.title.en)} (\`${e.id}\`). */`;
  if (!idOrUrl) return [head, `export interface ${name} extends SharedParams {`, ...body, '}'].join('\n');
  if (body.length === 0) return [head, `export type ${name} = SharedParams & IdOrUrl;`].join('\n');
  return [head, `export type ${name} = SharedParams & IdOrUrl & {`, ...body, '};'].join('\n');
}

const hasRequired = (e: Endpoint): boolean => endpointParams(e).some((p) => p.required) || needsIdOrUrl(e);

function methodDoc(e: Endpoint, site: Source['site'], indent: string): string[] {
  const perPage = e.list && e.pageSize ? ` About ${e.pageSize} per page; each page is its own call.` : '';
  return [
    `${indent}/**`,
    `${indent} * ${comment(e.title.en)}: ${comment(e.summary.en)}`,
    `${indent} *`,
    `${indent} * Price: ${priceText(e)}.${perPage} Failed calls are free.`,
    `${indent} * @see ${docsUrl(site, e)}`,
    `${indent} */`,
  ];
}

function namespaceObject(node: NamespaceNode, site: Source['site'], depth: number): string[] {
  const indent = '  '.repeat(depth + 1);
  const out: string[] = [];
  for (const e of node.endpoints) {
    const { action } = splitId(e.id);
    const model = modelName(e.object);
    const ret = e.list ? `Page<${model}>` : `Item<${model}>`;
    const params = `params: ${typeName(e.id)}Params${hasRequired(e) ? '' : ' = {}'}`;
    out.push(
      ...methodDoc(e, site, indent),
      `${indent}${key(action)}: (${params}, options?: CallOptions): Promise<${ret}> =>`,
      `${indent}  r.${e.list ? 'page' : 'item'}<${model}>(${str(e.id)}, params, options),`,
    );
  }
  for (const [name, child] of node.children) {
    out.push(`${indent}${key(name)}: {`, ...namespaceObject(child, site, depth + 1), `${indent}},`);
  }
  return out;
}

function endpointInfo(e: Endpoint, pathOf: Source['pathOf']): string {
  const fields = [
    `id: ${str(e.id)}`, `method: ${str(e.method)}`, `path: ${str(pathOf(e))}`, `object: ${str(e.object)}`,
    `list: ${e.list}`, `pageSize: ${e.list && e.pageSize ? e.pageSize : 'null'}`, `unit: ${str(e.unit)}`,
    `price: ${str(e.price)}`, `maxCharge: ${str(e.maxCharge)}`, `title: ${str(e.title.en)}`,
  ];
  return `  ${str(e.id)}: { ${fields.join(', ')} },`;
}

export function endpointsTs(src: Source): string {
  const { catalog, site } = src;
  const models = [...new Set(catalog.endpoints.map((e) => modelName(e.object)))].sort();
  return [
    `// ${GENERATED_NOTE}`,
    `// Catalog ${catalog.revision}, price book ${catalog.priceBook}: ${catalog.endpoints.length} endpoints on ${catalog.platforms.length} platforms.`,
    `import type { ${models.join(', ')} } from './models.js';`,
    "import type { CallOptions, EndpointInfo, IdOrUrl, Item, Page, Requester, SharedParams } from './types.js';",
    '',
    `export const CATALOG_REVISION = ${str(catalog.revision)};`,
    `export const PRICE_BOOK = ${str(catalog.priceBook)};`,
    '',
    '/** Every endpoint by id: method, path, price and page size. */',
    'export const ENDPOINTS = {',
    ...catalog.endpoints.map((e) => endpointInfo(e, src.pathOf)),
    '} as const satisfies Record<string, EndpointInfo>;',
    '',
    'export type EndpointId = keyof typeof ENDPOINTS;',
    '',
    ...catalog.endpoints.flatMap((e) => [paramsDecl(e), '']),
    '/** The typed endpoint methods, one property per platform. */',
    'export function buildPlatforms(r: Requester) {',
    '  return {',
    ...[...namespaceTree(catalog.endpoints).children].flatMap(([name, child]) => [
      `    ${key(name)}: {`, ...namespaceObject(child, site, 2), '    },',
    ]),
    '  };',
    '}',
    '',
    'export type Platforms = ReturnType<typeof buildPlatforms>;',
    '',
  ].join('\n');
}

function fieldType(f: FieldDoc): string {
  const base = f.enum ? f.enum.map(str).join(' | ')
    : f.type === 'ref' ? modelName(f.ref ?? 'object')
    : f.type === 'ref[]' ? `${modelName(f.ref ?? 'object')}[]`
    : f.type === 'string[]' ? 'string[]'
    : f.type === 'object' ? 'Record<string, unknown>'
    : f.type === 'integer' || f.type === 'number' ? 'number'
    : f.type === 'boolean' ? 'boolean'
    : 'string';
  return f.nullable ? (f.enum ? `(${base}) | null` : `${base} | null`) : base;
}

export function modelsTs(src: Source): string {
  const fields = src.gen.objectFields;
  const decls = MODEL_ORDER.map((name) => {
    const list = fields[name];
    if (!list) throw new Error(`The catalog has no fields for ${name}`);
    return [
      `export interface ${modelName(name)} {`,
      ...list.flatMap((f) => [`  /** ${comment(f.description.en)} */`, `  ${key(f.name)}${f.optional ? '?' : ''}: ${fieldType(f)};`]),
      '}',
    ].join('\n');
  });
  return [
    `// ${GENERATED_NOTE}`,
    '// The objects every endpoint returns: a Post is the same shape on Douyin and on YouTube.',
    '// These describe view=standard. view=compact drops null fields and fields= keeps only what you',
    '// ask for, so treat results as Partial<...> when you use either.',
    '',
    decls.join('\n\n'),
    '',
  ].join('\n');
}

export function generateTypescript(src: Source): Files {
  return new Map([
    ['typescript/src/endpoints.ts', endpointsTs(src)],
    ['typescript/src/models.ts', modelsTs(src)],
  ]);
}
