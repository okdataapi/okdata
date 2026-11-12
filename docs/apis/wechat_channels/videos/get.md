# WeChat Channels video detail API

> One video by its ID, a search result's export/… ID or its share link: description, author (with the account ID), time posted, likes, comments, shares, saves and location. url is the video file (encrypted: decrypt it with ext.decode_key from the same answer).

Canonical page: https://okdata.online/apis/wechat_channels/videos/get/

- **Endpoint**: `GET /v1/wechat_channels/videos/get`
- **ID**: `wechat_channels.videos.get`
- **Price**: $0.02 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.02 and returns one post. 1,000 lookups cost $20.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The video ID (digits), or a search result's export/… ID. Give id or url. (e.g. `15051893554318805499`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://weixin.qq.com/sph/AH3sCoIPhH`) |
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
curl -G "https://api.okdata.online/v1/wechat_channels/videos/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=15051893554318805499'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/videos/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "15051893554318805499"},
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
const url = new URL('https://api.okdata.online/v1/wechat_channels/videos/get');
url.searchParams.set('id', "15051893554318805499");

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
    "capability": "wechat_channels.videos.get",
    "id": "15051893554318805499"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Channels video detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "15051893554318805499",
      "url": "https://wxapp.tc.qq.com/251/20302/stodownload?encfilekey=example",
      "type": "video",
      "title": null,
      "text": "两晚山里露营，装备清单都在这了 #露营 #户外装备",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder",
        "username": null,
        "name": "轻装徒步",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": null,
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
        "https://wxapp.tc.qq.com/251/20304/stodownload?encfilekey=cover"
      ],
      "hashtags": [
        "露营",
        "户外装备"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_channels.videos.get",
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

### How much does the WeChat Channels video detail API cost?

One call costs $0.02 and returns one post. 1,000 lookups cost $20.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a WeChat Channels account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Channels; nothing is fetched with your own WeChat Channels account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Channels does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Channels endpoints

- [WeChat Channels video search](https://okdata.online/apis/wechat_channels/videos/search/): $0.02 per call · about 10 videos per page
- [WeChat Channels account search](https://okdata.online/apis/wechat_channels/users/search/): $0.02 per call · about 1 accounts per page
- [WeChat Channels account profile](https://okdata.online/apis/wechat_channels/users/get/): $0.02 per call
- [WeChat Channels account videos](https://okdata.online/apis/wechat_channels/users/videos/list/): $0.02 per call · about 15 videos per page
- [WeChat Channels video comments](https://okdata.online/apis/wechat_channels/videos/comments/list/): $0.015 per call · about 25 comments per page
- [WeChat Channels comment replies](https://okdata.online/apis/wechat_channels/comments/replies/list/): $0.015 per call · about 20 comments per page
- [WeChat Channels live replays](https://okdata.online/apis/wechat_channels/users/live_replays/list/): $0.02 per call · about 48 posts per page
- [WeChat Channels video share link](https://okdata.online/apis/wechat_channels/videos/share_link/get/): $0.02 per call
- [WeChat Channels account collections](https://okdata.online/apis/wechat_channels/users/collections/list/): $0.02 per call · about 7 results per page
- [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/): $0.02 per call · about 20 videos per page
- [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/): $0.015 per call
- [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/): $0.03 per call
- [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/): $0.06 per call · about 15 videos per page
- [WeChat Channels video search (backup)](https://okdata.online/apis/wechat_channels/backup/videos/search/): $0.15 per call · about 10 videos per page
