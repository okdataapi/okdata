import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { find, tokens } from '../src/search.js';
import { VERSION } from '../src/version.js';
import { catalogData, plainBody, sandbox, startMock, type MockApi, type Sandbox } from './helpers.js';

let api: MockApi;
let box: Sandbox;

beforeAll(async () => {
  api = await startMock();
  api.handle((req) => (req.path === '/v1/catalog' ? { body: plainBody(catalogData()) } : { status: 404, body: {} }));
});
afterAll(async () => { await api.close(); });
beforeEach(() => {
  api.seen.length = 0;
  box = sandbox(api.url);
});

describe('okdata find', () => {
  it('finds endpoints for Chinese words, with price, needs and a ready call', async () => {
    const r = await box.run(['find', '抖音 评论']);
    expect(r.code).toBe(0);
    expect(r.out.split('\n')[0]).toMatch(/^douyin\.videos\.comments\.list/);
    expect(r.out).toContain('okdata call douyin.videos.comments.list id=');
    expect(api.seen[0]!.headers.authorization).toBeUndefined();
  });

  it('keeps to the platform named, and lists all it has when no word matches', () => {
    const cat = catalogData() as never;
    const x = find(cat, 'twitter user profile', { limit: 5 });
    expect(x.platform).toBe('x');
    expect(x.matches.every((e) => e.platform === 'x')).toBe(true);
    const all = find(cat, 'zzz', { platform: 'bilibili', limit: 5 });
    expect(all.listedAll).toBe(true);
    expect(all.matches.length).toBe(catalogData().endpoints.filter((e) => e.platform === 'bilibili').length);
    expect(find(cat, '小红书笔记搜索', { limit: 3 }).matches[0]!.id).toBe('xiaohongshu.notes.search');
    expect(find(cat, 'youtube transcript', { limit: 3 }).matches[0]!.id).toBe('youtube.videos.transcript.get');
  });

  it('splits Chinese runs into pairs and drops filler words', () => {
    expect(tokens('查一下 视频评论')).toEqual(['视频评论', '视频', '频评', '评论']);
    expect(tokens('the comments of a post')).toEqual(['comments', 'post']);
  });

  it('answers --json and caches the catalog for the next run', async () => {
    const r = await box.run(['find', 'weibo hot search', '--json', '--limit', '2']);
    const doc = JSON.parse(r.out);
    expect(doc.platform).toBe('weibo');
    expect(doc.matches[0]).toMatchObject({ id: 'weibo.trends.list', unit: 'call' });
    expect(doc.matches[0].call).toContain('okdata call weibo.trends.list');
    expect(existsSync(join(box.configDir, 'catalog-cache.json'))).toBe(true);
    await box.run(['find', 'weibo']);
    expect(api.seen.filter((s) => s.path === '/v1/catalog')).toHaveLength(1);
  });

  it('refuses no words, an unknown platform or category', async () => {
    expect((await box.run(['find'])).code).toBe(1);
    expect((await box.run(['find', 'x', '--platform', 'myspace'])).code).toBe(1);
    expect((await box.run(['find', 'x', '--category', 'food'])).code).toBe(1);
  });
});

describe('okdata show', () => {
  it('shows params, price, paging and an example call', async () => {
    const r = await box.run(['show', 'douyin.videos.search']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('Price: $0.02 per call');
    expect(r.out).toMatch(/query\s+string, required/);
    expect(r.out).toContain('one of relevance | latest | most_liked');
    expect(r.out).toContain("okdata call douyin.videos.search 'query=露营装备'");
    expect(r.out).toContain('https://okdata.online/apis/douyin/videos/search/');
  });

  it('answers in Chinese with --lang zh, as JSON with --json, and refuses an unknown id', async () => {
    expect((await box.run(['show', 'douyin.videos.search', '--lang', 'zh'])).out).toContain('抖音视频搜索');
    expect(JSON.parse((await box.run(['show', 'x.posts.get', '--json'])).out).id).toBe('x.posts.get');
    expect((await box.run(['show', 'nope.nothing'])).code).toBe(1);
  });
});

describe('help and version', () => {
  it('prints help with the exit codes, and the version of package.json', async () => {
    const help = await box.run(['--help']);
    expect(help.code).toBe(0);
    expect(help.out).toContain('Exit codes:');
    expect(help.out).toMatch(/5 {2}network/);
    expect((await box.run([])).code).toBe(1);
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string };
    expect((await box.run(['--version'])).out.trim()).toBe(pkg.version);
    expect(VERSION).toBe(pkg.version);
  });
});
