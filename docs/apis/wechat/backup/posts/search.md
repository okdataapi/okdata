# WeChat Search articles and videos (backup) API

> The backup of wechat.posts.search, from another source: the same parameters and result.

Canonical page: https://okdata.online/apis/wechat/backup/posts/search/

- **Endpoint**: `GET /v1/wechat/backup/posts/search`
- **ID**: `wechat.backup.posts.search`
- **Price**: $0.15 per call · about 20 posts per page
- **Returns**: a page of about 20 posts (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Content research, Trend research, Word of mouth

## Price

One call costs $0.15 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $7.50 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `咖啡店开业`) |
| `sort` | string: relevance / latest / popular | no | `relevance` | Result order. |
| `published_within` | string: day / week / half_year | no |  | Only results from the last day, week or half year. |
| `type` | string: article / video | no |  | Official Account articles only, or Channels videos only; both, mixed, when left out. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Post](https://okdata.online/docs/objects/post/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Post ID on the platform. |
| `url` | string | Link to the post. |
| `type` | string | What kind of post it is. |
| `title` | string \| null | Title, where the platform has one (videos, notes, articles). |
| `text` | string | Caption, body or description as plain text; articles come as Markdown. |
| `lang` | string \| null | Language code, as reported or detected. |
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the platform gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat/backup/posts/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=咖啡店开业'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/backup/posts/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "咖啡店开业"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat/backup/posts/search');
url.searchParams.set('query', "咖啡店开业");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat.backup.posts.search",
    "query": "咖啡店开业"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Search articles and videos (backup) and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "wechat-search-1",
        "url": "https://mp.weixin.qq.com/s/k3Fq9xYbT0aP2mWnR8sVdA",
        "type": "article",
        "title": "第一次露营需要准备哪些装备？",
        "text": "帐篷、睡袋、防潮垫是基础，其他按季节加。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "MS4wLjABAAAAx7",
          "username": null,
          "name": "轻装徒步",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 182300,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": null,
          "shares": null,
          "favorites": null,
          "reposts": null
        },
        "images": null,
        "hashtags": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat.backup.posts.search",
    "billing": {
      "amount": "0.15",
      "currency": "USD",
      "balance_after": "9.85"
    },
    "unavailable": {
      "metrics.comments": "platform",
      "metrics.shares": "platform",
      "metrics.favorites": "platform",
      "metrics.reposts": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the WeChat Search articles and videos (backup) API cost?

One call costs $0.15 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $7.50 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.15.

### Do I need a WeChat Search account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Search; nothing is fetched with your own WeChat Search account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Search does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Search endpoints

- [WeChat Search articles and videos](https://okdata.online/apis/wechat/posts/search/): $0.02 per call · about 20 posts per page
- [WeChat Official Account live search](https://okdata.online/apis/wechat/accounts/search/): $0.02 per call · about 8 accounts per page
- [WeChat Index](https://okdata.online/apis/wechat/index/keywords/history/): $0.15 per call · about 1 results per page
- [WeChat Search suggestions](https://okdata.online/apis/wechat/keywords/related/): $0.15 per call · about 9 results per page
- [WeChat mini program search](https://okdata.online/apis/wechat/miniprograms/search/): $0.15 per call · about 25 results per page
