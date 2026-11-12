# Kuaishou account profile API

> An account by user ID: name, handle, bio, followers, following, video count, total likes, verification and IP location.

Canonical page: https://okdata.online/apis/kuaishou/users/get/

- **Endpoint**: `GET /v1/kuaishou/users/get`
- **ID**: `kuaishou.users.get`
- **Price**: $0.02 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.02 and returns one account. 1,000 lookups cost $20.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The user ID (digits, not the Kuaishou handle), from a search or a video’s author.id. (e.g. `1096637401`) |
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
curl -G "https://api.okdata.online/v1/kuaishou/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1096637401'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/kuaishou/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1096637401"},
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
const url = new URL('https://api.okdata.online/v1/kuaishou/users/get');
url.searchParams.set('id', "1096637401");

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
    "capability": "kuaishou.users.get",
    "id": "1096637401"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Kuaishou account profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1096637401",
      "url": "https://www.kuaishou.com/profile/3xuk66hz8hvt23e",
      "username": "qingzhuang_tubu",
      "name": "轻装徒步",
      "bio": "轻装，走远路。周更露营和徒步装备。",
      "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
      "verified": true,
      "followers": 182300,
      "following": 312,
      "posts": 486,
      "likes": 2310000
    }
  },
  "warnings": [],
  "meta": {
    "capability": "kuaishou.users.get",
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

### How much does the Kuaishou account profile API cost?

One call costs $0.02 and returns one account. 1,000 lookups cost $20.00. Failed calls are not charged.

### Do I need a Kuaishou account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Kuaishou; nothing is fetched with your own Kuaishou account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Kuaishou does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Kuaishou endpoints

- [Kuaishou video search](https://okdata.online/apis/kuaishou/videos/search/): $0.02 per call · about 10 videos per page
- [Kuaishou video detail](https://okdata.online/apis/kuaishou/videos/get/): $0.002 per call
- [Kuaishou video comments](https://okdata.online/apis/kuaishou/videos/comments/list/): $0.002 per call · about 10 comments per page
- [Kuaishou comment replies](https://okdata.online/apis/kuaishou/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Kuaishou account search](https://okdata.online/apis/kuaishou/users/search/): $0.02 per call · about 20 accounts per page
- [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/): $0.02 per call · about 20 videos per page
- [Kuaishou hot list](https://okdata.online/apis/kuaishou/trends/list/): $0.002 per call · about 51 board entries per page
