# Zhihu answer comments API

> The top-level comments on an answer, by the answer's ID, a page at a time in Zhihu's default order: text, commenter, likes, reply count, time posted and IP location.

Canonical page: https://okdata.online/apis/zhihu/answers/comments/list/

- **Endpoint**: `GET /v1/zhihu/answers/comments/list`
- **ID**: `zhihu.answers.comments.list`
- **Price**: $0.002 per call · about 10 comments per page
- **Returns**: a page of about 10 comments (`data.items`, Comment objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The answer ID (digits): the number after /answer/ in its link. (e.g. `2509154330`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

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
curl -G "https://api.okdata.online/v1/zhihu/answers/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=2509154330'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/zhihu/answers/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "2509154330"},
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
const url = new URL('https://api.okdata.online/v1/zhihu/answers/comments/list');
url.searchParams.set('id', "2509154330");

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
    "capability": "zhihu.answers.comments.list",
    "id": "2509154330"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Zhihu answer comments, read the first two pages and sum up what people praise and complain about.

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
        "text": "这个帐篷收起来好小，求链接",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "b32409944256dfd62a963434fcda6aa9",
          "username": "qingzhuang-tubu",
          "name": "轻装徒步",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 15700,
          "verified": true
        },
        "likes": 214,
        "replies": 9,
        "ip_location": "浙江"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "zhihu.answers.comments.list",
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

### How much does the Zhihu answer comments API cost?

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Zhihu account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Zhihu; nothing is fetched with your own Zhihu account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Zhihu does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Zhihu endpoints

- [Zhihu search](https://okdata.online/apis/zhihu/posts/search/): $0.002 per call · about 20 posts per page
- [Zhihu question answers](https://okdata.online/apis/zhihu/questions/answers/list/): $0.002 per call · about 20 posts per page
- [Zhihu question detail](https://okdata.online/apis/zhihu/questions/get/): $0.002 per call
- [Zhihu answer detail](https://okdata.online/apis/zhihu/answers/get/): $0.002 per call
- [Zhihu comment replies](https://okdata.online/apis/zhihu/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Zhihu article detail](https://okdata.online/apis/zhihu/articles/get/): $0.002 per call
- [Zhihu column articles](https://okdata.online/apis/zhihu/columns/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu pin detail](https://okdata.online/apis/zhihu/pins/get/): $0.002 per call
- [Zhihu user profile](https://okdata.online/apis/zhihu/users/get/): $0.002 per call
- [Zhihu user search](https://okdata.online/apis/zhihu/users/search/): $0.002 per call · about 20 accounts per page
- [Zhihu user followers](https://okdata.online/apis/zhihu/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Zhihu user answers](https://okdata.online/apis/zhihu/users/answers/list/): $0.002 per call · about 20 posts per page
- [Zhihu user articles](https://okdata.online/apis/zhihu/users/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu user pins](https://okdata.online/apis/zhihu/users/pins/list/): $0.002 per call · about 20 posts per page
