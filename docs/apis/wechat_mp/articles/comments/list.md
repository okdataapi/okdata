# Official Account article comments API

> The featured comments on an article, by its link: text, commenter, likes, reply count, time posted, IP location and whether pinned. A comment's id goes to wechat_mp.comments.replies.list.

Canonical page: https://okdata.online/apis/wechat_mp/articles/comments/list/

- **Endpoint**: `GET /v1/wechat_mp/articles/comments/list`
- **ID**: `wechat_mp.articles.comments.list`
- **Price**: $0.02 per call · about 20 comments per page
- **Returns**: a page of about 20 comments (`data.items`, Comment objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

One call costs $0.02 and returns one page of about 20 comments. Collecting 1,000 comments takes about 50 calls, $1.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `url` | string | yes |  | The article link: the long link with __biz, mid, idx and sn, or the short /s/ link. (e.g. `https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec`) |
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
curl -G "https://api.okdata.online/v1/wechat_mp/articles/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'url=https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/articles/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"url": "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec"},
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
const url = new URL('https://api.okdata.online/v1/wechat_mp/articles/comments/list');
url.searchParams.set('url', "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec");

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
    "capability": "wechat_mp.articles.comments.list",
    "url": "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Official Account article comments, read the first two pages and sum up what people praise and complain about.

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
          "id": "MzA5NTI3MjIwMA==",
          "username": "chuhai_growth",
          "name": "出海增长笔记",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": null,
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
    "capability": "wechat_mp.articles.comments.list",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
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

### How much does the Official Account article comments API cost?

One call costs $0.02 and returns one page of about 20 comments. Collecting 1,000 comments takes about 50 calls, $1.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.02.

### Do I need a WeChat Official Accounts account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Official Accounts; nothing is fetched with your own WeChat Official Accounts account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Official Accounts does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Official Accounts endpoints

- [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/): $0.058 per account · at most $0.58 per call
- [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/): $0.02 per call · about 10 articles per page
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/): $0.02 per call
- [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/): $0.02 per call
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/): $0.02 per call
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/): $0.02 per call · about 3 comments per page
- [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/): $0.15 per call
