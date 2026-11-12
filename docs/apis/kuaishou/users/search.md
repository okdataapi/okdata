# Kuaishou account search API

> Find accounts by keyword, optionally only verified ones or those live now, by gender, or ordered by followers: user ID, name, handle, bio, followers and verification.

Canonical page: https://okdata.online/apis/kuaishou/users/search/

- **Endpoint**: `GET /v1/kuaishou/users/search`
- **ID**: `kuaishou.users.search`
- **Price**: $0.02 per call · about 20 accounts per page
- **Returns**: a page of about 20 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.02 and returns one page of about 20 accounts. Collecting 1,000 accounts takes about 50 calls, $1.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `人民日报`) |
| `filter` | string: verified / live | no |  | Only verified accounts, or only those live now. |
| `gender` | string: female / male | no |  | Only female or only male accounts (as the profile says). |
| `sort` | string: relevance / most_followers / fewest_followers | no | `relevance` | Result order. |
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
curl -G "https://api.okdata.online/v1/kuaishou/users/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=人民日报'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/kuaishou/users/search",
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
const url = new URL('https://api.okdata.online/v1/kuaishou/users/search');
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
    "capability": "kuaishou.users.search",
    "query": "人民日报"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Kuaishou account search and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
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
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "kuaishou.users.search",
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

### How much does the Kuaishou account search API cost?

One call costs $0.02 and returns one page of about 20 accounts. Collecting 1,000 accounts takes about 50 calls, $1.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.02.

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
- [Kuaishou account profile](https://okdata.online/apis/kuaishou/users/get/): $0.02 per call
- [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/): $0.02 per call · about 20 videos per page
- [Kuaishou hot list](https://okdata.online/apis/kuaishou/trends/list/): $0.002 per call · about 51 board entries per page
