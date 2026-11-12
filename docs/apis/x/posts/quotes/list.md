# X post quotes API

> Posts that quote a post, newest or most popular first, 20 a page: what people added, who they are and how far it went.

Canonical page: https://okdata.online/apis/x/posts/quotes/list/

- **Endpoint**: `GET /v1/x/posts/quotes/list`
- **ID**: `x.posts.quotes.list`
- **Price**: $0.0003 per post · at most $0.006 per call
- **Returns**: a page of about 20 posts (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

You pay $0.0003 for each of the posts a call returns, at least one and at most $0.006 per call (20 posts). 1,000 posts cost $0.30. An empty page is billed as one item; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The ID of the post that was quoted. (e.g. `2120216592395174382`) |
| `sort` | string: latest / popular | no | `latest` | Result order. |
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
curl -G "https://api.okdata.online/v1/x/posts/quotes/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=2120216592395174382'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/x/posts/quotes/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "2120216592395174382"},
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
const url = new URL('https://api.okdata.online/v1/x/posts/quotes/list');
url.searchParams.set('id', "2120216592395174382");

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
    "capability": "x.posts.quotes.list",
    "id": "2120216592395174382"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use X post quotes and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1856012345678901234",
        "url": "https://x.com/trailkit/status/1856012345678901234",
        "type": "text",
        "title": null,
        "text": "Shipped the lighter tent today. 1.1 kg packed, same footprint.",
        "lang": "en",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "1450012345678901248",
          "username": "trailkit",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 18230,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": 9650,
          "reposts": 640
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
    "capability": "x.posts.quotes.list",
    "billing": {
      "amount": "0.0003",
      "currency": "USD",
      "balance_after": "9.9997"
    },
    "unavailable": {
      "metrics.shares": "platform"
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

### How much does the X post quotes API cost?

You pay $0.0003 for each of the posts a call returns, at least one and at most $0.006 per call (20 posts). 1,000 posts cost $0.30. An empty page is billed as one item; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.0003.

### Do I need a X (Twitter) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from X (Twitter); nothing is fetched with your own X (Twitter) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if X (Twitter) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More X (Twitter) endpoints

- [X post detail](https://okdata.online/apis/x/posts/get/): $0.0003 per call
- [X post search](https://okdata.online/apis/x/posts/search/): $0.002 per call · about 20 posts per page
- [X account profile](https://okdata.online/apis/x/users/get/): $0.0004 per account · at most $0.04 per call
- [X account posts](https://okdata.online/apis/x/users/posts/list/): $0.002 per call · about 20 posts per page
- [X trending topics](https://okdata.online/apis/x/trends/list/): $0.009 per call · about 30 board entries per page
- [X post replies](https://okdata.online/apis/x/posts/replies/list/): $0.002 per call · about 35 posts per page
- [X post retweeters](https://okdata.online/apis/x/posts/retweeters/list/): $0.002 per call · about 100 accounts per page
- [X article](https://okdata.online/apis/x/posts/article/get/): $0.002 per call
- [X thread](https://okdata.online/apis/x/threads/posts/list/): $0.0003 per post · at most $0.015 per call
- [X account search](https://okdata.online/apis/x/users/search/): $0.0004 per account · at most $0.008 per call
- [X account followers](https://okdata.online/apis/x/users/followers/list/): $0.0001 per account · at most $0.02 per call
- [X account following](https://okdata.online/apis/x/users/following/list/): $0.0001 per account · at most $0.02 per call
- [X account mentions](https://okdata.online/apis/x/users/mentions/list/): $0.0003 per post · at most $0.006 per call
- [X list posts](https://okdata.online/apis/x/lists/posts/list/): $0.002 per call · about 100 posts per page
- [X list members](https://okdata.online/apis/x/lists/members/list/): $0.0004 per account · at most $0.008 per call
- [X list followers](https://okdata.online/apis/x/lists/followers/list/): $0.0004 per account · at most $0.008 per call
- [X community profile](https://okdata.online/apis/x/communities/get/): $0.0004 per call
- [X community posts](https://okdata.online/apis/x/communities/posts/list/): $0.0003 per post · at most $0.006 per call
- [X community members](https://okdata.online/apis/x/communities/members/list/): $0.0004 per account · at most $0.008 per call
