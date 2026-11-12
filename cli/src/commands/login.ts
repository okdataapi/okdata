// okdata login [--no-browser]: the device link. POST /cli/link gives a link and an 8-character code;
// the person opens the link, checks the code and approves in the console; POST /cli/link/token then
// hands over a new key named "Command line", saved 0600 in the config directory. The key and the
// device code are never printed.
import { DEFAULT_BASE_URL } from '@okdata/sdk';
import { parse } from '../args.js';
import { saveConfig } from '../config.js';
import type { Context } from '../context.js';
import { EXIT, type ExitCode } from '../exit.js';
import { printJson } from '../output.js';
import { VERSION } from '../version.js';

interface Start {
  device_code: string;
  user_code: string;
  verification_url: string;
  verification_url_complete?: string;
  expires_in: number;
  interval: number;
}

type Poll =
  | { status: 'pending'; interval?: number }
  | { status: 'slow_down'; interval?: number }
  | { status: 'denied' }
  | { status: 'expired' }
  | { status: 'approved'; key: string; key_id: string; key_name: string };

const MIN_INTERVAL_S = 1;

function done(ctx: Context, status: string, message: string, code: ExitCode, extra: Record<string, unknown> = {}): ExitCode {
  if (ctx.json) printJson(ctx.io, { status, ...extra, exit_code: code });
  else ctx.io.err(message);
  return code;
}

export async function loginCommand(ctx: Context, argv: readonly string[]): Promise<ExitCode> {
  const { values } = parse(argv, { 'no-browser': { type: 'boolean' } });
  const ok = ctx.client({ needKey: false });
  const start = (await ok.request('POST', '/cli/link', { auth: false, body: { client_name: `okdata CLI ${VERSION} on ${ctx.io.host}` } })) as unknown as Start;
  const link = start.verification_url_complete ?? start.verification_url;
  const lines = [`Open this link, check that it shows the code ${start.user_code}, and approve:`, `  ${link}`, 'Waiting for approval… (Ctrl-C to stop)'];
  ctx.io.err(ctx.json ? JSON.stringify({ status: 'waiting', verification_url: link, user_code: start.user_code, expires_in: start.expires_in }) : lines.join('\n'));
  if (!values['no-browser'] && !ctx.json && ctx.io.isTTY) ctx.io.openUrl(link);
  let interval = Math.max(MIN_INTERVAL_S, Number(start.interval) || 5);
  const deadline = Date.now() + (Number(start.expires_in) || 600) * 1000;
  while (Date.now() < deadline) {
    await ctx.io.sleep(interval * 1000);
    const poll = (await ok.request('POST', '/cli/link/token', { auth: false, body: { device_code: start.device_code } })) as unknown as Poll;
    if (poll.status === 'pending') continue;
    if (poll.status === 'slow_down') {
      interval = Math.max(interval + 5, poll.interval ?? 0);
      continue;
    }
    if (poll.status === 'denied') return done(ctx, 'denied', 'The sign-in was refused in the console. Nothing was saved.', EXIT.auth);
    if (poll.status === 'expired') break;
    const path = saveConfig(ctx.io, {
      api_key: poll.key, key_id: poll.key_id, key_name: poll.key_name,
      base_url: ctx.baseUrl === DEFAULT_BASE_URL ? undefined : ctx.baseUrl,
    });
    return done(ctx, 'approved', `Logged in. A key named "${poll.key_name}" (${poll.key_id}) is saved in ${path} (readable by you only). OKDATA_API_KEY, when set, still comes first.`, EXIT.ok, { key_id: poll.key_id, key_name: poll.key_name, config_path: path });
  }
  return done(ctx, 'expired', 'The link expired before it was approved. Run okdata login again.', EXIT.auth);
}
