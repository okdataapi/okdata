# YouTube channel profile API

> A channel by ID or handle: name, description, avatar, verification, subscribers and video count (rounded as YouTube shows them), and under ext its total views, the day it joined, the links in its About section, country and banner. The handle comes back when you ask by handle.

Canonical page: https://okdata.online/apis/youtube/channels/get/

- **Endpoint**: `GET /v1/youtube/channels/get`
- **ID**: `youtube.channels.get`
- **Price**: $0.002 per call
- **Returns**: one Account object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery, Competitor monitoring

## Price

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The channel ID, starting with UC. Give id or username. (e.g. `UCLA_DiR1FfKNvjuUpBHmylQ`) |
| `username` | string | no |  | The channel's handle, with or without @. Give id or username. (e.g. `NASA`) |
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
curl -G "https://api.okdata.online/v1/youtube/channels/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=UCLA_DiR1FfKNvjuUpBHmylQ'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/youtube/channels/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "UCLA_DiR1FfKNvjuUpBHmylQ"},
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
const url = new URL('https://api.okdata.online/v1/youtube/channels/get');
url.searchParams.set('id', "UCLA_DiR1FfKNvjuUpBHmylQ");

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
    "capability": "youtube.channels.get",
    "id": "UCLA_DiR1FfKNvjuUpBHmylQ"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use YouTube channel profile and tell me the follower count and what the account posts about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "UCa1b2c3d4e5f6g7h8i9j0kL",
      "url": "https://www.youtube.com/@trailkit",
      "username": "@trailkit",
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
    "capability": "youtube.channels.get",
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

### How much does the YouTube channel profile API cost?

One call costs $0.002 and returns one account. 1,000 lookups cost $2.00. Failed calls are not charged.

### Do I need a YouTube account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from YouTube; nothing is fetched with your own YouTube account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if YouTube does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More YouTube endpoints

- [YouTube video search](https://okdata.online/apis/youtube/videos/search/): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/): $0.002 per call
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/): $0.002 per call · about 20 comments per page
- [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/): $0.004 per call
- [YouTube comment replies](https://okdata.online/apis/youtube/comments/replies/list/): $0.002 per call · about 10 comments per page
- [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/): $0.002 per call · about 10 posts per page
- [YouTube post detail](https://okdata.online/apis/youtube/posts/get/): $0.002 per call
- [YouTube channel search](https://okdata.online/apis/youtube/channels/search/): $0.004 per call · about 20 accounts per page
- [YouTube channel videos](https://okdata.online/apis/youtube/channels/videos/list/): $0.002 per call · about 30 videos per page
