# TikTok video detail API

> One video by ID or link.

Canonical page: https://okdata.online/apis/tiktok/videos/get/

- **Endpoint**: `GET /v1/tiktok/videos/get`
- **ID**: `tiktok.videos.get`
- **Price**: $0.002 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Competitor monitoring

## Price

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The video ID. Give id or url. (e.g. `7305085486984858894`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.tiktok.com/@user/video/7305085486984858894`) |
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
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the source gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/tiktok/videos/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=7305085486984858894'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/videos/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "7305085486984858894"},
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
const url = new URL('https://api.okdata.online/v1/tiktok/videos/get');
url.searchParams.set('id', "7305085486984858894");

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
    "capability": "tiktok.videos.get",
    "id": "7305085486984858894"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use TikTok video detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "7305085486984858894",
      "url": "https://www.tiktok.com/@trailkit/video/7305085486984858894",
      "type": "video",
      "title": null,
      "text": "Everything I packed for two nights in the hills #camping #gear",
      "lang": "en",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "6812345678901234567",
        "username": "trailkit",
        "name": "Trail Kit",
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
        "reposts": null
      },
      "images": null,
      "hashtags": [
        "camping",
        "gear"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.videos.get",
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

### How much does the TikTok video detail API cost?

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a TikTok account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from TikTok; nothing is fetched with your own TikTok account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if TikTok does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More TikTok endpoints

- [TikTok video search](https://okdata.online/apis/tiktok/videos/search/): $0.002 per call · about 30 videos per page
- [TikTok video comments](https://okdata.online/apis/tiktok/videos/comments/list/): $0.002 per call · about 50 comments per page
- [TikTok account profile](https://okdata.online/apis/tiktok/users/get/): $0.002 per call
- [TikTok Ads Library search](https://okdata.online/apis/tiktok/ads/search/): $0.004 per call · about 12 ads per page
- [TikTok Creative Center top ads](https://okdata.online/apis/tiktok/creative_center/ads/search/): $0.002 per call · about 20 ads per page
- [TikTok Shop product search](https://okdata.online/apis/tiktok/shop/products/search/): $0.004 per call · about 20 products per page
- [TikTok Shop product detail](https://okdata.online/apis/tiktok/shop/products/get/): $0.002 per call
- [TikTok Shop product reviews](https://okdata.online/apis/tiktok/shop/products/reviews/list/): $0.002 per call · about 20 reviews per page
- [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/): $0.002 per call
- [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/): $0.002 per call · about 20 comments per page
- [TikTok account search](https://okdata.online/apis/tiktok/users/search/): $0.002 per call · about 30 accounts per page
- [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/): $0.002 per call · about 10 videos per page
- [TikTok Creative Center top ad](https://okdata.online/apis/tiktok/creative_center/ads/get/): $0.002 per call
- [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/): $0.002 per call · about 20 products per page
- [TikTok account followers](https://okdata.online/apis/tiktok/users/followers/list/): $0.002 per call · about 20 accounts per page
- [TikTok hashtag videos](https://okdata.online/apis/tiktok/hashtags/videos/list/): $0.002 per call · about 20 videos per page
