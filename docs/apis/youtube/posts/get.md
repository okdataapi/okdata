# YouTube post detail API

> One channel post (once a Community post) by ID or link: text, channel, pictures, likes, the video it shares (ext.video_id, its cover in images), and roughly when it was posted.

Canonical page: https://okdata.online/apis/youtube/posts/get/

- **Endpoint**: `GET /v1/youtube/posts/get`
- **ID**: `youtube.posts.get`
- **Price**: $0.002 per call
- **Returns**: one Post object (`data.item`)
- **Status**: stable
- **Good for**: Content research, Competitor monitoring

## Price

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The post ID, starting with Ug (what follows /post/ in its link). Give id or url. (e.g. `Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.youtube.com/post/Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw`) |
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
curl -G "https://api.okdata.online/v1/youtube/posts/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/youtube/posts/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw"},
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
const url = new URL('https://api.okdata.online/v1/youtube/posts/get');
url.searchParams.set('id', "Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw");

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
    "capability": "youtube.posts.get",
    "id": "Ugkx-7xgRw-Uc9lRS3_2RvS2zASPTZOFtIlw"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use YouTube post detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "Zx3kP9vQm2A",
      "url": "https://www.youtube.com/watch?v=Zx3kP9vQm2A",
      "type": "video",
      "title": "Two nights, one backpack: my full camping kit",
      "text": "What I packed, what I would leave at home, and what it all weighs.",
      "lang": "en",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "UCa1b2c3d4e5f6g7h8i9j0kL",
        "username": "@trailkit",
        "name": "Trail Kit",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": 412000,
        "verified": true
      },
      "metrics": {
        "views": 1250000,
        "likes": 48200,
        "comments": 1312,
        "shares": null,
        "favorites": null,
        "reposts": null
      },
      "images": null,
      "hashtags": [
        "camping"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "youtube.posts.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
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

### How much does the YouTube post detail API cost?

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a YouTube account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from YouTube; nothing is fetched with your own YouTube account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if YouTube does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More YouTube endpoints

- [YouTube video search](https://okdata.online/apis/youtube/videos/search/): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/): $0.002 per call
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/): $0.002 per call · about 20 comments per page
- [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/): $0.004 per call
- [YouTube comment replies](https://okdata.online/apis/youtube/comments/replies/list/): $0.002 per call · about 10 comments per page
- [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/): $0.002 per call · about 10 posts per page
