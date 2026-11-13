import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ConfigError, configFromEnv, DEFAULT_MCP_URL, ENTRY, remoteHeaders } from '../src/config.js';
import { VERSION } from '../src/version.js';

describe('settings from the environment', () => {
  it('uses the hosted server and no key by default', () => {
    const config = configFromEnv({});
    expect(config.url.href).toBe(DEFAULT_MCP_URL);
    expect(config.apiKey).toBeNull();
    expect(configFromEnv({ OKDATA_API_KEY: '  ' }).apiKey).toBeNull();
  });

  it('takes OKDATA_MCP_URL, else OKDATA_BASE_URL plus /mcp', () => {
    expect(configFromEnv({ OKDATA_BASE_URL: 'http://127.0.0.1:8787/' }).url.href).toBe('http://127.0.0.1:8787/mcp');
    expect(configFromEnv({ OKDATA_BASE_URL: 'http://127.0.0.1:8787', OKDATA_MCP_URL: 'https://example.test/x/mcp' }).url.href).toBe('https://example.test/x/mcp');
  });

  it('refuses an address that is not an http(s) URL', () => {
    expect(() => configFromEnv({ OKDATA_MCP_URL: 'api.okdata.online/mcp' })).toThrow(ConfigError);
    expect(() => configFromEnv({ OKDATA_MCP_URL: 'ftp://api.okdata.online/mcp' })).toThrow(/http or https/);
  });

  it('sends the key only when there is one, with its user agent and an X-Entry the API accepts', () => {
    expect(remoteHeaders(configFromEnv({ OKDATA_API_KEY: ' okd_abc ' }))).toMatchObject({ Authorization: 'Bearer okd_abc' });
    const headers = remoteHeaders(configFromEnv({}));
    expect(headers.Authorization).toBeUndefined();
    expect(headers['User-Agent']).toBe(`okdata-mcp/${VERSION} node/${process.versions.node}`);
    // The API refuses the whole request when X-Entry does not match this.
    expect(headers['X-Entry']).toBe(ENTRY);
    expect(ENTRY).toMatch(/^[A-Za-z0-9][A-Za-z0-9_.-]{0,31}$/);
  });

  it('has the version of package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
    expect(VERSION).toBe(pkg.version);
  });
});
