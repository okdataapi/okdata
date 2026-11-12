# Bilibili video search API

> Videos matching keywords, with views, danmaku, likes and coins.

Canonical page: https://okdata.online/apis/bilibili/videos/search/

- **Endpoint**: `GET /v1/bilibili/videos/search`
- **ID**: `bilibili.videos.search`
- **Price**: $0.002 per call · about 20 videos per page
- **Returns**: a page of about 20 videos (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Content research

## Price

One call costs $0.002 and returns one page of about 20 videos. Collecting 1,000 videos takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `Claude Code 教程`) |
| `sort` | string: relevance / latest / most_viewed | no | `relevance` | Result order. |
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
curl -G "https://api.okdata.online/v1/bilibili/videos/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=Claude Code 教程'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/videos/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "Claude Code 教程"},
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
const url = new URL('https://api.okdata.online/v1/bilibili/videos/search');
url.searchParams.set('query', "Claude Code 教程");

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
    "capability": "bilibili.videos.search",
    "query": "Claude Code 教程"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bilibili video search and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "BV1Gx4y1H7kQ",
        "url": "https://www.bilibili.com/video/BV1Gx4y1H7kQ",
        "type": "video",
        "title": "用 Claude Code 半小时做完一个爬虫面板",
        "text": "从零开始，全程不写一行 CSS。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "3546581234567890",
          "username": null,
          "name": "周末写代码",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 88100,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": 1312,
          "shares": 2210,
          "favorites": 9650,
          "reposts": null
        },
        "images": null,
        "hashtags": [
          "编程",
          "AI"
        ]
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bilibili.videos.search",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
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

### How much does the Bilibili video search API cost?

One call costs $0.002 and returns one page of about 20 videos. Collecting 1,000 videos takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Bilibili account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bilibili; nothing is fetched with your own Bilibili account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Bilibili does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bilibili endpoints

- [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/): $0.002 per call
- [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Bilibili hot searches](https://okdata.online/apis/bilibili/trends/list/): $0.002 per call · about 50 board entries per page
- [Bilibili account profile](https://okdata.online/apis/bilibili/users/get/): $0.002 per call
- [Bilibili account videos](https://okdata.online/apis/bilibili/users/videos/list/): $0.002 per call · about 30 videos per page
- [Bilibili comment replies](https://okdata.online/apis/bilibili/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Bilibili popular videos](https://okdata.online/apis/bilibili/videos/trending/): $0.002 per call · about 20 videos per page
- [Bilibili account videos (backup)](https://okdata.online/apis/bilibili/backup/users/videos/list/): $0.0025 per call · about 20 videos per page
