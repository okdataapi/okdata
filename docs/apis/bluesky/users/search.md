# Bluesky account search API

> Accounts whose name, handle or bio match the keywords, 25 a page in Bluesky's order: handle, display name, bio, avatar and the verification badge. Search results carry no counts; bluesky.users.get has them.

Canonical page: https://okdata.online/apis/bluesky/users/search/

- **Endpoint**: `GET /v1/bluesky/users/search`
- **ID**: `bluesky.users.search`
- **Price**: $0.001 per call · about 25 accounts per page
- **Returns**: a page of about 25 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.001 and returns one page of about 25 accounts. Collecting 1,000 accounts takes about 40 calls, $0.04 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `nasa`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
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
curl -G "https://api.okdata.online/v1/bluesky/users/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=nasa'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/users/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "nasa"},
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
const url = new URL('https://api.okdata.online/v1/bluesky/users/search');
url.searchParams.set('query', "nasa");

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
    "capability": "bluesky.users.search",
    "query": "nasa"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bluesky account search and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "did:plc:trailkitexample2qz7xk4mb",
        "url": "https://bsky.app/profile/trailkit.bsky.social",
        "username": "trailkit.bsky.social",
        "name": "Trail Kit",
        "bio": "Light packs, long walks.",
        "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
        "verified": false,
        "followers": 182300,
        "following": 312,
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
    "capability": "bluesky.users.search",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Bluesky account search API cost?

One call costs $0.001 and returns one page of about 25 accounts. Collecting 1,000 accounts takes about 40 calls, $0.04 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.001.

### Do I need a Bluesky account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bluesky; nothing is fetched with your own Bluesky account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Bluesky does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bluesky endpoints

- [Bluesky profile](https://okdata.online/apis/bluesky/users/get/): $0.001 per call
- [Bluesky account posts](https://okdata.online/apis/bluesky/users/posts/list/): $0.001 per call · about 30 posts per page
- [Bluesky post](https://okdata.online/apis/bluesky/posts/get/): $0.001 per call
- [Bluesky post replies](https://okdata.online/apis/bluesky/posts/comments/list/): $0.001 per call · about 200 comments per page
