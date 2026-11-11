// python/src/okdata/_endpoints.py and _models.py: typed methods for every endpoint and
// TypedDicts for every object, so the Python SDK never drifts from the catalog.
import {
  type Endpoint, type FieldDoc, type Files, type NamespaceNode, type Param, type Source,
  GENERATED_NOTE, MODEL_ORDER, SHARED_PARAMS, docsUrl, modelName, namespaceTree, needsIdOrUrl, paramDescription, priceText, splitId,
} from './shared.ts';

const PY_KEYWORDS = new Set(['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield']);

const pyName = (name: string): string => (PY_KEYWORDS.has(name) ? `${name}_` : name);
const pyStr = (s: string): string => JSON.stringify(s);
const docText = (s: string): string => s.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
const className = (path: string[]): string => path.map((p) => p.split('_').map(modelName).join('')).join('');

function paramType(p: Param): string {
  if (p.enum) return `Literal[${p.enum.map(pyStr).join(', ')}]`;
  switch (p.type) {
    case 'integer': return 'int';
    case 'boolean': return 'bool';
    case 'string[]': return 'Sequence[str]';
    default: return 'str';
  }
}

const endpointParams = (e: Endpoint): Param[] => e.params.filter((p) => !SHARED_PARAMS.has(p.name));

function signature(e: Endpoint): string {
  const idOrUrl = needsIdOrUrl(e);
  const args = endpointParams(e).map((p) => {
    const type = paramType(p);
    return p.required && !idOrUrl ? `${pyName(p.name)}: ${type}` : `${pyName(p.name)}: Optional[${type}] = None`;
  });
  // Required first so the signature stays valid Python.
  const ordered = [...args.filter((a) => !a.includes('=')), ...args.filter((a) => a.includes('='))];
  return ['self', '*', ...ordered, 'view: Optional[View] = None', 'fields: Optional[Fields] = None', 'idempotency_key: Optional[str] = None']
    .map((a) => `        ${a},`).join('\n');
}

/** "Example: 42." without doubling a trailing full stop. */
const exampleNote = (v: string | number | boolean): string => {
  const text = String(v);
  return `Example: ${text}${text.endsWith('.') ? '' : '.'}`;
};

function docstring(e: Endpoint, site: Source['site']): string[] {
  const perPage = e.list && e.pageSize ? ` About ${e.pageSize} per page; each page is its own call.` : '';
  const args = endpointParams(e).map((p) => {
    const extra = [
      p.default !== undefined ? `Default ${String(p.default)}.` : '',
      p.example !== undefined && p.name !== 'cursor' ? exampleNote(p.example) : '',
    ].filter(Boolean).join(' ');
    return `            ${pyName(p.name)}: ${docText(paramDescription(e, p))}${extra ? ` ${docText(extra)}` : ''}`;
  });
  return [
    `        """${docText(e.title.en)}: ${docText(e.summary.en)}`,
    '',
    `        Price: ${priceText(e)}.${perPage} Failed calls are free.`,
    ...(needsIdOrUrl(e) ? ['        Give id or url, not both.'] : []),
    `        Docs: ${docsUrl(site, e)}`,
    ...(args.length ? ['', '        Args:', ...args] : []),
    '        """',
  ];
}

function method(e: Endpoint, site: Source['site']): string[] {
  const { action } = splitId(e.id);
  const model = modelName(e.object);
  const ret = e.list ? `Page[${model}]` : `Item[${model}]`;
  const params = endpointParams(e).map((p) => `${pyStr(p.name)}: ${pyName(p.name)}`).join(', ');
  return [
    `    def ${pyName(action)}(`,
    signature(e),
    `    ) -> ${ret}:`,
    ...docstring(e, site),
    ...(needsIdOrUrl(e) ? ['        require_one_of(id=id, url=url)'] : []),
    `        return self._client._${e.list ? 'page' : 'item'}(`,
    `            ${pyStr(e.id)}, {${params}}, view=view, fields=fields, idempotency_key=idempotency_key`,
    '        )',
  ];
}

/** One class per namespace, children before parents so every name is defined before use. */
function namespaceClasses(node: NamespaceNode, site: Source['site']): string[] {
  const out: string[] = [];
  for (const child of node.children.values()) out.push(...namespaceClasses(child, site));
  if (node.path.length === 0) return out;
  const children = [...node.children.entries()];
  const body: string[] = [];
  if (children.length) {
    body.push(...children.map(([name, child]) => `    ${pyName(name)}: ${className(child.path)}`), '');
    body.push('    def __init__(self, client: OkData) -> None:', '        super().__init__(client)');
    body.push(...children.map(([name, child]) => `        self.${pyName(name)} = ${className(child.path)}(client)`), '');
  }
  for (const e of node.endpoints) body.push(...method(e, site), '');
  if (body.length === 0) body.push('    pass', '');
  out.push(`class ${className(node.path)}(_Namespace):`, `    """${node.path.join('.')}"""`, '', ...body, '');
  return out;
}

function endpointInfo(e: Endpoint, pathOf: Source['pathOf']): string {
  return [
    `    ${pyStr(e.id)}: EndpointInfo(`,
    `        id=${pyStr(e.id)}, method=${pyStr(e.method)}, path=${pyStr(pathOf(e))}, object=${pyStr(e.object)},`,
    `        list=${e.list ? 'True' : 'False'}, page_size=${e.list && e.pageSize ? e.pageSize : 'None'}, unit=${pyStr(e.unit)},`,
    `        price=${pyStr(e.price)}, max_charge=${pyStr(e.maxCharge)}, title=${pyStr(e.title.en)},`,
    '    ),',
  ].join('\n');
}

export function endpointsPy(src: Source): string {
  const { catalog, site } = src;
  const tree = namespaceTree(catalog.endpoints);
  const platforms = [...tree.children.entries()];
  const models = [...new Set(catalog.endpoints.map((e) => modelName(e.object)))].sort();
  return [
    `# ${GENERATED_NOTE}`,
    `# Catalog ${catalog.revision}, price book ${catalog.priceBook}: ${catalog.endpoints.length} endpoints on ${catalog.platforms.length} platforms.`,
    'from __future__ import annotations',
    '',
    'from typing import TYPE_CHECKING, Dict, Literal, Optional, Sequence',
    '',
    `from ._models import ${models.join(', ')}`,
    'from ._params import Fields, View, require_one_of',
    'from ._response import EndpointInfo, Item, Page',
    '',
    'if TYPE_CHECKING:',
    '    from ._client import OkData',
    '',
    `CATALOG_REVISION = ${pyStr(catalog.revision)}`,
    `PRICE_BOOK = ${pyStr(catalog.priceBook)}`,
    '',
    'ENDPOINTS: Dict[str, EndpointInfo] = {',
    ...catalog.endpoints.map((e) => endpointInfo(e, src.pathOf)),
    '}',
    '"""Every endpoint by id: method, path, price and page size."""',
    '',
    '',
    'class _Namespace:',
    '    def __init__(self, client: OkData) -> None:',
    '        self._client = client',
    '',
    '',
    ...namespaceClasses(tree, site).flatMap((line) => (line.startsWith('class ') ? ['', line] : [line])),
    '',
    'class Platforms:',
    '    """The typed endpoint methods, one attribute per platform."""',
    '',
    ...platforms.map(([name, child]) => `    ${pyName(name)}: ${className(child.path)}`),
    '',
    '    def _init_platforms(self, client: OkData) -> None:',
    ...platforms.map(([name, child]) => `        self.${pyName(name)} = ${className(child.path)}(client)`),
    '',
  ].join('\n').replace(/\n{4,}/g, '\n\n\n');
}

function fieldType(f: FieldDoc): string {
  const base = f.enum ? `Literal[${f.enum.map(pyStr).join(', ')}]`
    : f.type === 'ref' ? modelName(f.ref ?? 'object')
    : f.type === 'ref[]' ? `List[${modelName(f.ref ?? 'object')}]`
    : f.type === 'string[]' ? 'List[str]'
    : f.type === 'object' ? 'Dict[str, Any]'
    : f.type === 'integer' ? 'int'
    : f.type === 'number' ? 'float'
    : f.type === 'boolean' ? 'bool'
    : 'str';
  return f.nullable ? `Optional[${base}]` : base;
}

export function modelsPy(src: Source): string {
  const fields = src.gen.objectFields;
  const classes = MODEL_ORDER.map((name) => {
    const list = fields[name];
    if (!list) throw new Error(`The catalog has no fields for ${name}`);
    return [
      '',
      '',
      `class ${modelName(name)}(TypedDict, total=False):`,
      ...list.flatMap((f) => [`    ${f.name}: ${fieldType(f)}`, `    """${docText(f.description.en)}"""`]),
    ].join('\n');
  });
  return [
    `# ${GENERATED_NOTE}`,
    '"""The objects every endpoint returns. A Post is the same shape on Douyin and on YouTube.',
    '',
    'Keys are total=False because view=compact drops null fields and fields= keeps only what you ask for.',
    'A field a platform does not have is None and meta["unavailable"] says why.',
    '"""',
    'from __future__ import annotations',
    '',
    'from typing import Any, Dict, List, Literal, Optional, TypedDict',
    ...classes,
    '',
  ].join('\n');
}

export function generatePython(src: Source): Files {
  return new Map([
    ['python/src/okdata/_endpoints.py', endpointsPy(src)],
    ['python/src/okdata/_models.py', modelsPy(src)],
  ]);
}
