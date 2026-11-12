# Reddit user active communities API

> The communities a user is active in, each as an account: name, description and members (in followers). The whole list in one answer.

Canonical page: https://okdata.online/apis/reddit/users/subreddits/list/

- **Endpoint**: `GET /v1/reddit/users/subreddits/list`
- **ID**: `reddit.users.subreddits.list`
- **Price**: $0.002 per call · about 30 accounts per page
- **Returns**: a page of about 30 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.002 and returns one page of about 30 accounts. Collecting 1,000 accounts takes about 34 calls, $0.068 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `username` | string | yes |  | The username, with or without u/. (e.g. `nasa`) |
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
curl -G "https://api.okdata.online/v1/reddit/users/subreddits/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'username=nasa'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/reddit/users/subreddits/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"username": "nasa"},
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
const url = new URL('https://api.okdata.online/v1/reddit/users/subreddits/list');
url.searchParams.set('username', "nasa");

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
    "capability": "reddit.users.subreddits.list",
    "username": "nasa"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Reddit user active communities and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "t2_1dkvvygb",
        "url": "https://www.reddit.com/user/trailkit/",
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
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "reddit.users.subreddits.list",
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

### How much does the Reddit user active communities API cost?

One call costs $0.002 and returns one page of about 30 accounts. Collecting 1,000 accounts takes about 34 calls, $0.068 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Reddit account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Reddit; nothing is fetched with your own Reddit account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Reddit does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Reddit endpoints

- [Reddit post search](https://okdata.online/apis/reddit/posts/search/): $0.004 per call · about 25 posts per page
- [Reddit post detail](https://okdata.online/apis/reddit/posts/get/): $0.002 per call
- [Reddit post comments](https://okdata.online/apis/reddit/posts/comments/list/): $0.002 per call · about 10 comments per page
- [Reddit Popular feed](https://okdata.online/apis/reddit/popular/posts/list/): $0.002 per call · about 10 posts per page
- [Reddit community posts](https://okdata.online/apis/reddit/subreddits/posts/list/): $0.004 per call · about 25 posts per page
- [Reddit community profile](https://okdata.online/apis/reddit/subreddits/get/): $0.002 per call
- [Reddit trending searches](https://okdata.online/apis/reddit/trends/list/): $0.002 per call · about 6 board entries per page
- [Reddit user profile](https://okdata.online/apis/reddit/users/get/): $0.002 per call
- [Reddit user posts](https://okdata.online/apis/reddit/users/posts/list/): $0.002 per call · about 25 posts per page
- [Reddit video transcript](https://okdata.online/apis/reddit/posts/transcript/get/): $0.004 per call
