// Opt-in smoke test against the live server: npm run build && OKDATA_MCP_LIVE=1 npm test. It starts the
// built dist/bin.js over stdio with no key and uses only the free tools (find, describe, account
// status); it never calls `call`, so nothing is ever charged.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { describe, expect, it } from 'vitest';

const BIN = fileURLToPath(new URL('../dist/bin.js', import.meta.url));
const text = (r: unknown): string => ((r as CallToolResult).content[0] as { text: string }).text;

describe.skipIf(!process.env.OKDATA_MCP_LIVE || !existsSync(BIN))('live server over stdio (free tools only)', () => {
  it('lists the tools, finds, describes and reads the status without a key', async () => {
    const env: Record<string, string> = { PATH: process.env.PATH ?? '' };
    if (process.env.OKDATA_LIVE_MCP_URL) env.OKDATA_MCP_URL = process.env.OKDATA_LIVE_MCP_URL;
    const client = new Client({ name: 'okdata-mcp-live-test', version: '1.0.0' });
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [BIN], env })); // no OKDATA_API_KEY
    try {
      expect(client.getServerVersion()?.name).toBe('okdata');
      expect(client.getInstructions()).toContain('find');
      const names = (await client.listTools()).tools.map((t) => t.name);
      expect(names).toEqual(expect.arrayContaining(['find', 'describe', 'call', 'account']));
      const found = await client.callTool({ name: 'find', arguments: { query: '小红书 笔记 评论' } });
      expect(found.isError).toBeFalsy();
      expect(text(found)).toContain('xiaohongshu.');
      const described = await client.callTool({ name: 'describe', arguments: { ids: ['weibo.trends.list'] } });
      expect(described.isError).toBeFalsy();
      expect(text(described)).toContain('weibo.trends.list');
      const status = await client.callTool({ name: 'account', arguments: { what: 'status' } });
      expect(status.isError, text(status)).toBeFalsy();
    } finally {
      await client.close();
    }
  }, 60_000);
});
