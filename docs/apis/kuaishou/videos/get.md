# Kuaishou video detail API

> One video by ID or link (a v.kuaishou.com short link works too): caption, author, plays, likes, comments and shares.

Canonical page: https://okdata.online/apis/kuaishou/videos/get/

- **Endpoint**: `GET /v1/kuaishou/videos/get`
- **ID**: `kuaishou.videos.get`
- **Price**: $0.002 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The video ID: the 3x… part of the web link. Give id or url. (e.g. `3xv88urbnic5abk`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.kuaishou.com/short-video/3xv88urbnic5abk`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
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
curl -G "https://api.okdata.online/v1/kuaishou/videos/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=3xv88urbnic5abk'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/kuaishou/videos/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "3xv88urbnic5abk"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/kuaishou/videos/get');
url.searchParams.set('id', "3xv88urbnic5abk");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "kuaishou.videos.get",
    "id": "3xv88urbnic5abk"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Kuaishou video detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "3xv88urbnic5abk",
      "url": "https://www.kuaishou.com/short-video/3xv88urbnic5abk",
      "type": "video",
      "title": null,
      "text": "两晚山里露营，装备清单都在这了 #露营 #户外装备",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "1096637401",
        "username": "qingzhuang_tubu",
        "name": "轻装徒步",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": 182300,
        "verified": true
      },
      "metrics": {
        "views": 1250000,
        "likes": 48200,
        "comments": 1312,
        "shares": 2210,
        "favorites": 9650,
        "reposts": 640
      },
      "images": null,
      "hashtags": [
        "露营",
        "户外装备"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "kuaishou.videos.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Kuaishou video detail API cost?

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Kuaishou account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Kuaishou; nothing is fetched with your own Kuaishou account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Kuaishou does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Kuaishou endpoints

- [Kuaishou video search](https://okdata.online/apis/kuaishou/videos/search/): $0.02 per call · about 10 videos per page
- [Kuaishou video comments](https://okdata.online/apis/kuaishou/videos/comments/list/): $0.002 per call · about 10 comments per page
- [Kuaishou comment replies](https://okdata.online/apis/kuaishou/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Kuaishou account profile](https://okdata.online/apis/kuaishou/users/get/): $0.02 per call
- [Kuaishou account search](https://okdata.online/apis/kuaishou/users/search/): $0.02 per call · about 20 accounts per page
- [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/): $0.02 per call · about 20 videos per page
- [Kuaishou hot list](https://okdata.online/apis/kuaishou/trends/list/): $0.002 per call · about 51 board entries per page
