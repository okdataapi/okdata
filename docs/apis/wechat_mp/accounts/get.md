# Official Account profile API

> An Official Account by its original ID: name, IP location, number of original articles, the linked Channels account and whether it is banned. WeChat shows no bio, avatar or follower count here.

Canonical page: https://okdata.online/apis/wechat_mp/accounts/get/

- **Endpoint**: `GET /v1/wechat_mp/accounts/get`
- **ID**: `wechat_mp.accounts.get`
- **Price**: $0.02 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Competitor monitoring

## Price

One call costs $0.02 and returns one account. 1,000 lookups cost $20.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The account's original ID, mostly gh_… (not its name). Find it by name with wechat.accounts.search; an article's author.id is one too. (e.g. `gh_363b924965e9`) |
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
curl -G "https://api.okdata.online/v1/wechat_mp/accounts/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=gh_363b924965e9'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/accounts/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "gh_363b924965e9"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["name"], row["followers"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat_mp/accounts/get');
url.searchParams.set('id', "gh_363b924965e9");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.name, row.followers);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat_mp.accounts.get",
    "id": "gh_363b924965e9"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Official Account profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
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
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_mp.accounts.get",
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

### How much does the Official Account profile API cost?

One call costs $0.02 and returns one account. 1,000 lookups cost $20.00. Failed calls are not charged.

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
- [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/): $0.02 per call · about 20 comments per page
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/): $0.02 per call
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/): $0.02 per call · about 3 comments per page
- [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/): $0.15 per call
