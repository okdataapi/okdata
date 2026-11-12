# Bilibili account profile API

> An account by user ID: name, bio, avatar, verification and what it says, followers, following, number of videos, total likes, level and live room link.

Canonical page: https://okdata.online/apis/bilibili/users/get/

- **Endpoint**: `GET /v1/bilibili/users/get`
- **ID**: `bilibili.users.get`
- **Price**: $0.002 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The user ID (mid, digits): the number after space.bilibili.com/ in a space link. (e.g. `8047632`) |
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
curl -G "https://api.okdata.online/v1/bilibili/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=8047632'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "8047632"},
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
const url = new URL('https://api.okdata.online/v1/bilibili/users/get');
url.searchParams.set('id', "8047632");

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
    "capability": "bilibili.users.get",
    "id": "8047632"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bilibili account profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "3546581234567890",
      "url": "https://space.bilibili.com/3546581234567890",
      "username": null,
      "name": "周末写代码",
      "bio": "只做能跑起来的教程。",
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
    "capability": "bilibili.users.get",
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

### How much does the Bilibili account profile API cost?

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

### Do I need a Bilibili account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bilibili; nothing is fetched with your own Bilibili account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Bilibili does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bilibili endpoints

- [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/): $0.002 per call · about 20 videos per page
- [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/): $0.002 per call
- [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Bilibili hot searches](https://okdata.online/apis/bilibili/trends/list/): $0.002 per call · about 50 board entries per page
- [Bilibili account videos](https://okdata.online/apis/bilibili/users/videos/list/): $0.002 per call · about 30 videos per page
- [Bilibili comment replies](https://okdata.online/apis/bilibili/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Bilibili popular videos](https://okdata.online/apis/bilibili/videos/trending/): $0.002 per call · about 20 videos per page
- [Bilibili account videos (backup)](https://okdata.online/apis/bilibili/backup/users/videos/list/): $0.0025 per call · about 20 videos per page
