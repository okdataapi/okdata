# Reddit post comments API

> Comments on a post with the first levels of replies (parent_id says which comment a reply answers): text, commenter, score and reply count. Reddit's default order, newest or top score first.

Canonical page: https://okdata.online/apis/reddit/posts/comments/list/

- **Endpoint**: `GET /v1/reddit/posts/comments/list`
- **ID**: `reddit.posts.comments.list`
- **Price**: $0.002 per call · about 10 comments per page
- **Returns**: a page of about 10 comments (`data.items`, Comment objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The post ID, with or without the t3_ prefix. Give id or url. (e.g. `t3_1nnrvkr`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.reddit.com/r/nasa/comments/1nnrvkr/`) |
| `sort` | string: best / latest / popular | no | `best` | Result order. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Comment](https://okdata.online/docs/objects/comment/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Comment ID. |
| `post_id` | string | ID of the post it is under. |
| `parent_id` | string \| null | The comment it replies to; null for top-level comments. |
| `text` | string | Comment text. |
| `published_at` | string | When it was posted, ISO 8601 in UTC. |
| `author` | AccountRef | Who wrote it. |
| `likes` | integer \| null | Likes on the comment. |
| `replies` | integer \| null | Replies under it. |
| `ip_location` | string \| null | Region label the platform shows next to the comment, if any. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/reddit/posts/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=t3_1nnrvkr'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/reddit/posts/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "t3_1nnrvkr"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["likes"], row["text"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/reddit/posts/comments/list');
url.searchParams.set('id', "t3_1nnrvkr");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.likes, row.text);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "reddit.posts.comments.list",
    "id": "t3_1nnrvkr"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Reddit post comments, read the first two pages and sum up what people praise and complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "7302000000000000001",
        "post_id": "7301234567890123456",
        "parent_id": null,
        "text": "Which tent is that? Looks tiny packed.",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "t2_1dkvvygb",
          "username": "trailkit",
          "name": "trailkit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": null,
          "verified": true
        },
        "likes": 214,
        "replies": 9,
        "ip_location": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "reddit.posts.comments.list",
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

### How much does the Reddit post comments API cost?

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Reddit account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Reddit; nothing is fetched with your own Reddit account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Reddit does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Reddit endpoints

- [Reddit post search](https://okdata.online/apis/reddit/posts/search/): $0.004 per call · about 25 posts per page
- [Reddit post detail](https://okdata.online/apis/reddit/posts/get/): $0.002 per call
- [Reddit Popular feed](https://okdata.online/apis/reddit/popular/posts/list/): $0.002 per call · about 10 posts per page
- [Reddit community posts](https://okdata.online/apis/reddit/subreddits/posts/list/): $0.004 per call · about 25 posts per page
- [Reddit community profile](https://okdata.online/apis/reddit/subreddits/get/): $0.002 per call
- [Reddit trending searches](https://okdata.online/apis/reddit/trends/list/): $0.002 per call · about 6 board entries per page
- [Reddit user profile](https://okdata.online/apis/reddit/users/get/): $0.002 per call
- [Reddit user posts](https://okdata.online/apis/reddit/users/posts/list/): $0.002 per call · about 25 posts per page
- [Reddit user active communities](https://okdata.online/apis/reddit/users/subreddits/list/): $0.002 per call · about 30 accounts per page
- [Reddit video transcript](https://okdata.online/apis/reddit/posts/transcript/get/): $0.004 per call
