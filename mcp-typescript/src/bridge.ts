// The bridge: an MCP server on stdio whose tools are the remote okdata server's tools. tools/list and
// tools/call go to the remote server as they are, with the key in Authorization; the server's name,
// version and instructions are the remote's. The remote server has no prompts or resources.
//
// A tool call always answers with a tool result: a failure becomes text with isError, written for the
// agent (the remote's own error text, how to add a key, or how to resend a lost paid call safely).
// A `call` without an idempotency_key gets one, so an answer lost on the way can be fetched again
// without paying twice.
import { randomUUID } from 'node:crypto';
import type { Readable, Writable } from 'node:stream';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport, StreamableHTTPError } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema, CallToolResultSchema, ErrorCode, ListToolsRequestSchema, ListToolsResultSchema, McpError,
  type CallToolRequest, type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { KEYS_URL, remoteHeaders, type BridgeConfig } from './config.js';
import { VERSION } from './version.js';

/** How long a tool call may take: the remote may try more than one data source before it answers. */
export const CALL_TIMEOUT_MS = 180_000;
const CONNECT_TIMEOUT_MS = 30_000;

/** Connects to the remote server (initialize); throws when it cannot be reached. */
export async function connectRemote(config: BridgeConfig): Promise<Client> {
  const transport = new StreamableHTTPClientTransport(config.url, { requestInit: { headers: remoteHeaders(config) } });
  const client = new Client({ name: 'okdata-mcp', version: VERSION });
  try {
    await client.connect(transport, { timeout: CONNECT_TIMEOUT_MS });
  } catch (err) {
    await client.close().catch(() => undefined);
    throw new Error(`could not reach ${config.url.href}: ${reason(err)}`);
  }
  return client;
}

/** Why a request got no usable answer, in a few words. */
export function reason(err: unknown): string {
  if (err instanceof StreamableHTTPError) return err.code !== undefined && err.code > 0 ? `HTTP ${err.code}` : err.message;
  if (err instanceof McpError && err.code === ErrorCode.RequestTimeout) return 'no answer in time';
  if (err instanceof McpError) return withoutPrefix(err);
  if (err instanceof Error) {
    const cause = err.cause as { code?: unknown; message?: unknown } | undefined;
    const detail = typeof cause?.code === 'string' ? cause.code : typeof cause?.message === 'string' ? cause.message : '';
    return detail ? `${err.message} (${detail})` : err.message;
  }
  return String(err);
}

/** McpError puts "MCP error <code>: " before the message it received. */
const withoutPrefix = (err: McpError): string => err.message.replace(/^MCP error -?\d+: /, '');

const toolError = (text: string): CallToolResult => ({ content: [{ type: 'text', text }], isError: true });

/** The answer when the remote refuses a tool for want of a key (HTTP 401) and the bridge has none. */
export const keyNeeded = (tool: string): string =>
  `${tool} needs an okdata API key, and okdata-mcp was started without one: nothing was charged. `
  + `Add OKDATA_API_KEY to the "env" of the okdata server in your MCP client's config (make a key at ${KEYS_URL}), `
  + 'then restart the client. find, describe and account status work without a key.';

/** The answer when a tool call got no usable answer: a paid call may still have run. */
export function noAnswer(config: BridgeConfig, tool: string, args: Readonly<Record<string, unknown>>, why: string): string {
  const head = `okdata-mcp got no usable answer from ${config.url.href} (${why}).`;
  if (tool !== 'call') return `${head} ${tool} is free: try again.`;
  return `${head} The call may have run and been charged. To get its result without paying twice, `
    + `send the same call again with idempotency_key ${JSON.stringify(args.idempotency_key)}.`;
}

/** call's arguments with an idempotency_key: the caller's own, or a new one. */
export function withIdempotencyKey(tool: string, args: Readonly<Record<string, unknown>> | undefined): Record<string, unknown> {
  const given = { ...args };
  return tool === 'call' && !('idempotency_key' in given) ? { ...given, idempotency_key: `okdata-mcp-${randomUUID()}` } : given;
}

async function forwardCall(remote: Client, config: BridgeConfig, params: CallToolRequest['params'], signal: AbortSignal): Promise<CallToolResult> {
  const args = withIdempotencyKey(params.name, params.arguments);
  try {
    return await remote.request({ method: 'tools/call', params: { ...params, arguments: args } }, CallToolResultSchema, { timeout: CALL_TIMEOUT_MS, signal });
  } catch (err) {
    if (err instanceof StreamableHTTPError && err.code === 401 && !config.apiKey) return toolError(keyNeeded(params.name));
    // A JSON-RPC error the remote answered (an unknown tool, bad arguments): its own words.
    const answered = err instanceof McpError && err.code !== ErrorCode.RequestTimeout && err.code !== ErrorCode.ConnectionClosed;
    return toolError(answered ? withoutPrefix(err) : noAnswer(config, params.name, args, reason(err)));
  }
}

/** The local server: the remote's identity and instructions, its tools forwarded. */
export function buildServer(remote: Client, config: BridgeConfig): Server {
  const server = new Server(remote.getServerVersion() ?? { name: 'okdata', version: VERSION }, {
    capabilities: { tools: {} },
    instructions: remote.getInstructions(),
  });
  server.setRequestHandler(ListToolsRequestSchema, async (request, extra) => {
    try {
      return await remote.request({ method: 'tools/list', params: request.params }, ListToolsResultSchema, { signal: extra.signal });
    } catch (err) {
      // A plain Error: the SDK answers it as -32603 with this message as it is.
      throw new Error(`okdata-mcp could not list the tools of ${config.url.href}: ${reason(err)}`);
    }
  });
  server.setRequestHandler(CallToolRequestSchema, (request, extra) => forwardCall(remote, config, request.params, extra.signal));
  return server;
}

export interface Bridge {
  /** Closes the stdio side and the connection to the remote server. */
  close(): Promise<void>;
}

/** Connects to the remote server, then serves MCP on these streams (stdin and stdout by default). */
export async function serve(config: BridgeConfig, io: { stdin: Readable; stdout: Writable } = process): Promise<Bridge> {
  const remote = await connectRemote(config);
  const server = buildServer(remote, config);
  await server.connect(new StdioServerTransport(io.stdin, io.stdout));
  return {
    close: async () => {
      await Promise.allSettled([server.close(), remote.close()]);
    },
  };
}
