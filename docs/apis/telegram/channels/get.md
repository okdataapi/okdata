# Telegram channel profile API

> A public Telegram channel by handle: name, description, avatar, subscribers (rounded, as t.me shows them) and verification, and under ext the photo, video, file and link counts it shows.

Canonical page: https://okdata.online/apis/telegram/channels/get/

- **Endpoint**: `GET /v1/telegram/channels/get`
- **ID**: `telegram.channels.get`
- **Price**: $0.002 per call
- **Returns**: one Account object (`data.item`)
- **Status**: stable
- **Good for**: Competitor monitoring, Creator discovery

## Price

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `username` | string | yes |  | The public channel's handle (what follows t.me/), with or without @. (e.g. `telegram`) |
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
curl -G "https://api.okdata.online/v1/telegram/channels/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'username=telegram'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/telegram/channels/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"username": "telegram"},
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
const url = new URL('https://api.okdata.online/v1/telegram/channels/get');
url.searchParams.set('username', "telegram");

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
    "capability": "telegram.channels.get",
    "username": "telegram"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Telegram channel profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "trailkit",
      "url": "https://t.me/trailkit",
      "username": "trailkit",
      "name": "Trail Kit",
      "bio": "Light packs, long walks.",
      "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
      "verified": true,
      "followers": 182300,
      "following": 312,
      "posts": 486,
      "likes": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "telegram.channels.get",
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

### How much does the Telegram channel profile API cost?

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

### Do I need a Telegram account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Telegram; nothing is fetched with your own Telegram account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Telegram does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Telegram endpoints

- [Telegram channel messages](https://okdata.online/apis/telegram/channels/messages/list/): $0.002 per call · about 20 posts per page
- [Telegram message detail](https://okdata.online/apis/telegram/messages/get/): $0.002 per call
