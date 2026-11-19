# Xigua Video detail API

> One Xigua video by ID or link: title, author and followers, time published, plays, likes, comments, shares, saves, length and cover.

Canonical page: https://okdata.online/apis/xigua/videos/get/

- **Endpoint**: `GET /v1/xigua/videos/get`
- **ID**: `xigua.videos.get`
- **Price**: $0.004 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Content research, Competitor monitoring

## Price

One call costs $0.004 and returns one post. 1,000 lookups cost $4.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The video ID: the digits in its ixigua.com link (the same ID as on Toutiao). Give id or url. (e.g. `7709330516603961894`) |
| `url` | string | no |  | Its ixigua.com link (or the same video's toutiao.com/video/ link); the ID is read from it. Short v.ixigua.com share links are not read. (e.g. `https://www.ixigua.com/7709330516603961894`) |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
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
curl -G "https://api.okdata.online/v1/xigua/videos/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=7709330516603961894'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xigua/videos/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "7709330516603961894"},
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
const url = new URL('https://api.okdata.online/v1/xigua/videos/get');
url.searchParams.set('id', "7709330516603961894");

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
    "capability": "xigua.videos.get",
    "id": "7709330516603961894"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Xigua Video detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "7436185237401447690",
      "url": "https://www.ixigua.com/7436185237401447690",
      "type": "video",
      "title": "两晚山里露营，装备清单都在这了",
      "text": "",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "3876512094",
        "username": null,
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
        "reposts": null
      },
      "images": [
        "https://p3-sign.bdxiguaimg.com/tos-cn-i-example/cover.webp"
      ],
      "hashtags": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xigua.videos.get",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Xigua Video detail API cost?

One call costs $0.004 and returns one post. 1,000 lookups cost $4.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Xigua Video account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Xigua Video; nothing is fetched with your own Xigua Video account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Xigua Video does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Xigua Video endpoints

- [Xigua Video search](https://okdata.online/apis/xigua/videos/search/): $0.002 per call · about 10 videos per page
- [Xigua Video comments](https://okdata.online/apis/xigua/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Xigua Video creator profile](https://okdata.online/apis/xigua/users/get/): $0.002 per call
- [Xigua Video creator videos](https://okdata.online/apis/xigua/users/videos/list/): $0.002 per call · about 30 videos per page
