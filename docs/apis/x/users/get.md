# X account profile API

> An account by handle or numeric ID, or up to 100 accounts by ID in one call: followers, following, post count, bio and verification. IDs that find no account are listed under data.missing and not charged.

Canonical page: https://okdata.online/apis/x/users/get/

- **Endpoint**: `GET /v1/x/users/get`
- **ID**: `x.users.get`
- **Price**: $0.0004 per account · at most $0.04 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

You pay $0.0004 for each of the accounts a call returns, at least one and at most $0.04 per call (100 accounts). 1,000 accounts cost $0.40. An empty page is billed as one item; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The numeric account ID. Give one of id, username or ids. (e.g. `4398626122`) |
| `username` | string | no |  | The handle, with or without @. Give one of id, username or ids. (e.g. `openai`) |
| `ids` | string[] | no |  | Up to 100 numeric account IDs (POST with a JSON body, or comma-separated in a GET). Give one of id, username or ids. (e.g. `4398626122,11348282`) |
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
curl -G "https://api.okdata.online/v1/x/users/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=4398626122'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/x/users/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "4398626122"},
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
const url = new URL('https://api.okdata.online/v1/x/users/get');
url.searchParams.set('id', "4398626122");

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
    "capability": "x.users.get",
    "id": "4398626122"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use X account profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1450012345678901248",
      "url": "https://x.com/trailkit",
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
    "capability": "x.users.get",
    "billing": {
      "amount": "0.0004",
      "currency": "USD",
      "balance_after": "9.9996"
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

### How much does the X account profile API cost?

You pay $0.0004 for each of the accounts a call returns, at least one and at most $0.04 per call (100 accounts). 1,000 accounts cost $0.40. An empty page is billed as one item; failed calls are not charged.

### Do I need a X (Twitter) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from X (Twitter); nothing is fetched with your own X (Twitter) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if X (Twitter) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More X (Twitter) endpoints

- [X post detail](https://okdata.online/apis/x/posts/get/): $0.0003 per call
- [X post search](https://okdata.online/apis/x/posts/search/): $0.002 per call · about 20 posts per page
- [X account posts](https://okdata.online/apis/x/users/posts/list/): $0.002 per call · about 20 posts per page
- [X trending topics](https://okdata.online/apis/x/trends/list/): $0.009 per call · about 30 board entries per page
- [X post replies](https://okdata.online/apis/x/posts/replies/list/): $0.002 per call · about 35 posts per page
- [X post quotes](https://okdata.online/apis/x/posts/quotes/list/): $0.0003 per post · at most $0.006 per call
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
