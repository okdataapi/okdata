# Zhihu user search API

> People and organisations matching keywords, 20 a page: name and follower count, with answer and article counts, upvotes received and whether it is an organisation under ext. The headline is in the profile (zhihu.users.get).

Canonical page: https://okdata.online/apis/zhihu/users/search/

- **Endpoint**: `GET /v1/zhihu/users/search`
- **ID**: `zhihu.users.search`
- **Price**: $0.002 per call · about 20 accounts per page
- **Returns**: a page of about 20 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.002 and returns one page of about 20 accounts. Collecting 1,000 accounts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `人民日报`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Account](https://okdata.online/docs/objects/account/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Account ID on the platform. |
| `url` | string | Profile link. |
| `username` | string \| null | Handle, where the platform has one. |
| `name` | string | Display name. |
| `bio` | string \| null | Profile bio. |
| `avatar_url` | string \| null | Avatar image URL. |
| `verified` | boolean \| null | Whether the platform shows a verification badge. |
| `followers` | integer \| null | Followers. |
| `following` | integer \| null | Accounts it follows. |
| `posts` | integer \| null | Posts, videos, notes or articles published. |
| `likes` | integer \| null | Total likes received, where the platform shows it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/zhihu/users/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=人民日报'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/zhihu/users/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "人民日报"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["name"], row["followers"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/zhihu/users/search');
url.searchParams.set('query', "人民日报");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.name, row.followers);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "zhihu.users.search",
    "query": "人民日报"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Zhihu user search and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "b32409944256dfd62a963434fcda6aa9",
        "url": "https://www.zhihu.com/people/qingzhuang-tubu",
        "username": "qingzhuang-tubu",
        "name": "轻装徒步",
        "bio": "轻装，走远路。",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "verified": true,
        "followers": 182300,
        "following": 312,
        "posts": 486,
        "likes": 2310000
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "zhihu.users.search",
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

### How much does the Zhihu user search API cost?

One call costs $0.002 and returns one page of about 20 accounts. Collecting 1,000 accounts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

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
- [Zhihu answer comments](https://okdata.online/apis/zhihu/answers/comments/list/): $0.002 per call · about 10 comments per page
- [Zhihu comment replies](https://okdata.online/apis/zhihu/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Zhihu article detail](https://okdata.online/apis/zhihu/articles/get/): $0.002 per call
- [Zhihu column articles](https://okdata.online/apis/zhihu/columns/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu pin detail](https://okdata.online/apis/zhihu/pins/get/): $0.002 per call
- [Zhihu user profile](https://okdata.online/apis/zhihu/users/get/): $0.002 per call
- [Zhihu user followers](https://okdata.online/apis/zhihu/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Zhihu user answers](https://okdata.online/apis/zhihu/users/answers/list/): $0.002 per call · about 20 posts per page
- [Zhihu user articles](https://okdata.online/apis/zhihu/users/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu user pins](https://okdata.online/apis/zhihu/users/pins/list/): $0.002 per call · about 20 posts per page
