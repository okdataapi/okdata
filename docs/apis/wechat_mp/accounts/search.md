# Official Account search API

> Find Official Accounts by name or keyword, with their original ID (gh_…). Charged per account returned; when the balance is below a full page, the first page shrinks to what it covers.

Canonical page: https://okdata.online/apis/wechat_mp/accounts/search/

- **Endpoint**: `GET /v1/wechat_mp/accounts/search`
- **ID**: `wechat_mp.accounts.search`
- **Price**: $0.058 per account · at most $0.58 per call
- **Returns**: a page of about 10 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Competitor monitoring

## Price

You pay $0.058 for each of the accounts a call returns, at least one and at most $0.58 per call (10 accounts). 1,000 accounts cost $58.00. An empty page is billed as one item; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `36氪`) |
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
curl -G "https://api.okdata.online/v1/wechat_mp/accounts/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=36氪'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/accounts/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "36氪"},
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
const url = new URL('https://api.okdata.online/v1/wechat_mp/accounts/search');
url.searchParams.set('query', "36氪");

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
    "capability": "wechat_mp.accounts.search",
    "query": "36氪"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Official Account search and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "MzA5NTI3MjIwMA==",
        "url": "https://mp.weixin.qq.com/mp/profile_ext?__biz=MzA5NTI3MjIwMA==",
        "username": "chuhai_growth",
        "name": "出海增长笔记",
        "bio": "写给出海团队的增长复盘。",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "verified": true,
        "followers": null,
        "following": null,
        "posts": 486,
        "likes": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_mp.accounts.search",
    "billing": {
      "amount": "0.058",
      "currency": "USD",
      "balance_after": "9.942"
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

### How much does the Official Account search API cost?

You pay $0.058 for each of the accounts a call returns, at least one and at most $0.58 per call (10 accounts). 1,000 accounts cost $58.00. An empty page is billed as one item; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.058.

### Do I need a WeChat Official Accounts account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Official Accounts; nothing is fetched with your own WeChat Official Accounts account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Official Accounts does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Official Accounts endpoints

- [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/): $0.02 per call · about 10 articles per page
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/): $0.02 per call
- [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/): $0.02 per call
- [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/): $0.02 per call · about 20 comments per page
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/): $0.02 per call
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/): $0.02 per call · about 3 comments per page
- [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/): $0.15 per call
