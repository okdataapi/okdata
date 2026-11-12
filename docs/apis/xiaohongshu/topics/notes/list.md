# Xiaohongshu topic notes API

> The hottest notes under a topic (hashtag) page, about 10 in one answer: title, text, author, likes, comments, saves, shares, pictures and hashtags.

Canonical page: https://okdata.online/apis/xiaohongshu/topics/notes/list/

- **Endpoint**: `GET /v1/xiaohongshu/topics/notes/list`
- **ID**: `xiaohongshu.topics.notes.list`
- **Price**: $0.02 per call · about 10 notes per page
- **Returns**: a page of about 10 notes (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Trend research, Content research

## Price

One call costs $0.02 and returns one page of about 10 notes. Collecting 1,000 notes takes about 100 calls, $2.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The topic page ID (24 hex characters): the id in a topic link, e.g. a hashtag link in a note. (e.g. `5ee1c0a110694c00010b4ae9`) |
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
curl -G "https://api.okdata.online/v1/xiaohongshu/topics/notes/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=5ee1c0a110694c00010b4ae9'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/topics/notes/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "5ee1c0a110694c00010b4ae9"},
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
const url = new URL('https://api.okdata.online/v1/xiaohongshu/topics/notes/list');
url.searchParams.set('id', "5ee1c0a110694c00010b4ae9");

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
    "capability": "xiaohongshu.topics.notes.list",
    "id": "5ee1c0a110694c00010b4ae9"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Xiaohongshu topic notes and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "6731f0a2000000001b02c3d4",
        "url": "https://www.xiaohongshu.com/explore/6731f0a2000000001b02c3d4",
        "type": "image",
        "title": "油皮夏天防晒怎么选｜实测 6 款",
        "text": "连续两周通勤实测，按清爽度和防晒力排了个序，第 3 款意外好用。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "5f1234567890abcdef123456",
          "username": null,
          "name": "通勤护肤笔记",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 46200,
          "verified": true
        },
        "metrics": {
          "views": null,
          "likes": 48200,
          "comments": 1312,
          "shares": 2210,
          "favorites": 9650,
          "reposts": null
        },
        "images": [
          "https://sns-img.example.com/6731f0a2/1.jpg",
          "https://sns-img.example.com/6731f0a2/2.jpg"
        ],
        "hashtags": [
          "防晒",
          "油皮"
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
    "capability": "xiaohongshu.topics.notes.list",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
    },
    "unavailable": {
      "metrics.views": "platform",
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

### How much does the Xiaohongshu topic notes API cost?

One call costs $0.02 and returns one page of about 10 notes. Collecting 1,000 notes takes about 100 calls, $2.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.02.

### Do I need a Xiaohongshu (RedNote) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Xiaohongshu (RedNote); nothing is fetched with your own Xiaohongshu (RedNote) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Xiaohongshu (RedNote) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Xiaohongshu (RedNote) endpoints

- [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/): $0.02 per call · about 20 notes per page
- [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/): $0.02 per call
- [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/): $0.02 per call · about 10 comments per page
- [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/): $0.02 per call
- [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/): $0.02 per call · about 20 notes per page
- [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/): $0.02 per call · about 20 board entries per page
- [Xiaohongshu PGY creator search](https://okdata.online/apis/xiaohongshu/pgy/creators/search/): $0.04 per call · about 20 creators per page
- [Xiaohongshu PGY creator detail](https://okdata.online/apis/xiaohongshu/pgy/creators/get/): $0.04 per call
- [Xiaohongshu shop product search](https://okdata.online/apis/xiaohongshu/shop/products/search/): $0.02 per call · about 20 products per page
- [Xiaohongshu shop product reviews](https://okdata.online/apis/xiaohongshu/shop/products/reviews/list/): $0.02 per call · about 12 reviews per page
- [Xiaohongshu image search](https://okdata.online/apis/xiaohongshu/images/search/): $0.02 per call · about 20 posts per page
- [Xiaohongshu comment replies](https://okdata.online/apis/xiaohongshu/comments/replies/list/): $0.02 per call · about 5 comments per page
- [Xiaohongshu topic detail](https://okdata.online/apis/xiaohongshu/topics/get/): $0.02 per call
- [Xiaohongshu account search](https://okdata.online/apis/xiaohongshu/users/search/): $0.02 per call · about 20 accounts per page
- [Xiaohongshu shop product detail](https://okdata.online/apis/xiaohongshu/shop/products/get/): $0.02 per call
- [Xiaohongshu search suggestions](https://okdata.online/apis/xiaohongshu/keywords/related/): $0.02 per call · about 10 results per page
- [Xiaohongshu video note with its video](https://okdata.online/apis/xiaohongshu/videos/get/): $0.02 per call
- [Xiaohongshu PGY keyword search index](https://okdata.online/apis/xiaohongshu/pgy/keywords/history/): $0.04 per call
- [Xiaohongshu PGY related keywords](https://okdata.online/apis/xiaohongshu/pgy/keywords/related/): $0.04 per call · about 98 results per page
- [Xiaohongshu PGY creator audience](https://okdata.online/apis/xiaohongshu/pgy/creators/audience/get/): $0.04 per call
- [Xiaohongshu PGY creator note metrics](https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/): $0.04 per call
- [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/): $0.04 per call · about 8 notes per page
- [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/): $0.04 per call
- [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/): $0.04 per call · about 4 creators per page
- [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/): $0.04 per call · about 34 notes per page
- [Xiaohongshu PGY creator costs and summary](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/): $0.04 per call
- [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/): $0.04 per call
- [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/): $0.04 per call
- [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/): $0.04 per call
