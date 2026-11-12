# WeChat Channels video search (backup) API

> The backup of wechat_channels.videos.search, from another source: the same parameters and result, without saves.

Canonical page: https://okdata.online/apis/wechat_channels/backup/videos/search/

- **Endpoint**: `GET /v1/wechat_channels/backup/videos/search`
- **ID**: `wechat_channels.backup.videos.search`
- **Price**: $0.15 per call · about 10 videos per page
- **Returns**: a page of about 10 videos (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Content research, Competitor monitoring

## Price

One call costs $0.15 and returns one page of about 10 videos. Collecting 1,000 videos takes about 100 calls, $15.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `露营装备推荐`) |
| `sort` | string: relevance / latest / popular | no | `relevance` | Result order. |
| `published_within` | string: day / week / half_year | no |  | Only videos from the last day, week or half year. |
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
curl -G "https://api.okdata.online/v1/wechat_channels/backup/videos/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=露营装备推荐'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/backup/videos/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "露营装备推荐"},
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
const url = new URL('https://api.okdata.online/v1/wechat_channels/backup/videos/search');
url.searchParams.set('query', "露营装备推荐");

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
    "capability": "wechat_channels.backup.videos.search",
    "query": "露营装备推荐"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Channels video search (backup) and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
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
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_channels.backup.videos.search",
    "billing": {
      "amount": "0.15",
      "currency": "USD",
      "balance_after": "9.85"
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

### How much does the WeChat Channels video search (backup) API cost?

One call costs $0.15 and returns one page of about 10 videos. Collecting 1,000 videos takes about 100 calls, $15.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.15.

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
- [WeChat Channels video detail](https://okdata.online/apis/wechat_channels/videos/get/): $0.02 per call
- [WeChat Channels video comments](https://okdata.online/apis/wechat_channels/videos/comments/list/): $0.015 per call · about 25 comments per page
- [WeChat Channels comment replies](https://okdata.online/apis/wechat_channels/comments/replies/list/): $0.015 per call · about 20 comments per page
- [WeChat Channels live replays](https://okdata.online/apis/wechat_channels/users/live_replays/list/): $0.02 per call · about 48 posts per page
- [WeChat Channels video share link](https://okdata.online/apis/wechat_channels/videos/share_link/get/): $0.02 per call
- [WeChat Channels account collections](https://okdata.online/apis/wechat_channels/users/collections/list/): $0.02 per call · about 7 results per page
- [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/): $0.02 per call · about 20 videos per page
- [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/): $0.015 per call
- [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/): $0.03 per call
- [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/): $0.06 per call · about 15 videos per page
