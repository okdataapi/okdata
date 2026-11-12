# Weibo post likers API

> The accounts that most recently liked a post, about 50, by ID or link: name, bio, avatar, verification and its kind, followers, following, posts, and the gender and region their profiles give.

Canonical page: https://okdata.online/apis/weibo/posts/likers/list/

- **Endpoint**: `GET /v1/weibo/posts/likers/list`
- **ID**: `weibo.posts.likers.list`
- **Price**: $0.002 per call · about 50 accounts per page
- **Returns**: a page of about 50 accounts (`data.items`, Account objects)
- **Status**: preview
- **Good for**: Word of mouth, Creator discovery

## Price

One call costs $0.002 and returns one page of about 50 accounts. Collecting 1,000 accounts takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The post ID (digits). Give id or url. (e.g. `5364174473401962`) |
| `url` | string | no |  | The post link as it is: weibo.com/<user>/… (digits or letters after it), m.weibo.cn/detail/… or m.weibo.cn/status/…. (e.g. `https://weibo.com/2803301701/RqVtdeh0m`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
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
curl -G "https://api.okdata.online/v1/weibo/posts/likers/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=5364174473401962'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/weibo/posts/likers/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "5364174473401962"},
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
const url = new URL('https://api.okdata.online/v1/weibo/posts/likers/list');
url.searchParams.set('id', "5364174473401962");

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
    "capability": "weibo.posts.likers.list",
    "id": "5364174473401962"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Weibo post likers and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1234567890",
        "url": "https://weibo.com/u/1234567890",
        "username": null,
        "name": "轻装户外官方",
        "bio": "户外装备品牌官方微博",
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
    "capability": "weibo.posts.likers.list",
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

### How much does the Weibo post likers API cost?

One call costs $0.002 and returns one page of about 50 accounts. Collecting 1,000 accounts takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Weibo account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Weibo; nothing is fetched with your own Weibo account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Weibo does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Weibo endpoints

- [Weibo post search](https://okdata.online/apis/weibo/posts/search/): $0.002 per call · about 10 posts per page
- [Weibo hot search](https://okdata.online/apis/weibo/trends/list/): $0.002 per call · about 50 board entries per page
- [Weibo account profile](https://okdata.online/apis/weibo/users/get/): $0.002 per call
- [Weibo post detail](https://okdata.online/apis/weibo/posts/get/): $0.002 per call
- [Weibo post comments](https://okdata.online/apis/weibo/posts/comments/list/): $0.002 per call · about 20 comments per page
- [Weibo comment replies](https://okdata.online/apis/weibo/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Weibo account posts](https://okdata.online/apis/weibo/users/posts/list/): $0.002 per call · about 20 posts per page
- [Weibo account followers](https://okdata.online/apis/weibo/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Weibo account search](https://okdata.online/apis/weibo/users/search/): $0.002 per call · about 20 accounts per page
- [Weibo hot search (backup)](https://okdata.online/apis/weibo/backup/trends/list/): $0.0025 per call · about 50 board entries per page
