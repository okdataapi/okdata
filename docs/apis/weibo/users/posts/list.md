# Weibo account posts API

> An account's posts (its own and its reposts), newest first, by user ID: text (a long post is cut short here; ext.text_truncated says so), likes, comments, reposts, video plays, pictures and topics.

Canonical page: https://okdata.online/apis/weibo/users/posts/list/

- **Endpoint**: `GET /v1/weibo/users/posts/list`
- **ID**: `weibo.users.posts.list`
- **Price**: $0.002 per call · about 20 posts per page
- **Returns**: a page of about 20 posts (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.002 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The user ID (uid, digits): the number after weibo.com/u/ in a profile link. (e.g. `2803301701`) |
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
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the source gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/weibo/users/posts/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=2803301701'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/weibo/users/posts/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "2803301701"},
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
const url = new URL('https://api.okdata.online/v1/weibo/users/posts/list');
url.searchParams.set('id', "2803301701");

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
    "capability": "weibo.users.posts.list",
    "id": "2803301701"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Weibo account posts and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "5098765432109876",
        "url": "https://weibo.com/1234567890/PbQ7rT2xZ",
        "type": "text",
        "title": null,
        "text": "新品今天开售，评论区抽三位送同款。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "1234567890",
          "username": null,
          "name": "轻装户外官方",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 532000,
          "verified": true
        },
        "metrics": {
          "views": null,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": null,
          "reposts": 640
        },
        "images": [
          "https://wx1.sinaimg.example.com/large/abc123.jpg"
        ],
        "hashtags": [
          "新品发布"
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
    "capability": "weibo.users.posts.list",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.views": "platform",
      "metrics.shares": "platform",
      "metrics.favorites": "platform"
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

### How much does the Weibo account posts API cost?

One call costs $0.002 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Weibo account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Weibo; nothing is fetched with your own Weibo account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Weibo does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Weibo endpoints

- [Weibo post search](https://okdata.online/apis/weibo/posts/search/): $0.002 per call · about 10 posts per page
- [Weibo hot search](https://okdata.online/apis/weibo/trends/list/): $0.002 per call · about 50 board entries per page
- [Weibo account profile](https://okdata.online/apis/weibo/users/get/): $0.002 per call
- [Weibo post detail](https://okdata.online/apis/weibo/posts/get/): $0.002 per call
- [Weibo post comments](https://okdata.online/apis/weibo/posts/comments/list/): $0.002 per call · about 20 comments per page
- [Weibo comment replies](https://okdata.online/apis/weibo/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Weibo post likers](https://okdata.online/apis/weibo/posts/likers/list/): $0.002 per call · about 50 accounts per page
- [Weibo account followers](https://okdata.online/apis/weibo/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Weibo account search](https://okdata.online/apis/weibo/users/search/): $0.002 per call · about 20 accounts per page
- [Weibo hot search (backup)](https://okdata.online/apis/weibo/backup/trends/list/): $0.0025 per call · about 50 board entries per page
