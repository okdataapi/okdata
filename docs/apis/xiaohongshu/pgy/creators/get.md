# Xiaohongshu PGY creator detail API

> A Xiaohongshu creator's PGY profile: followers, likes and saves, median reads and engagements, content and feature tags, and what an image note and a video note cost (in yuan) and whether each is open.

Canonical page: https://okdata.online/apis/xiaohongshu/pgy/creators/get/

- **Endpoint**: `GET /v1/xiaohongshu/pgy/creators/get`
- **ID**: `xiaohongshu.pgy.creators.get`
- **Price**: $0.04 per call
- **Returns**: one Creator object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.04 and returns one creator. 1,000 lookups cost $40.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | PGY creator ID (24 hex characters, the same as the Xiaohongshu user ID), from the PGY creator search. (e.g. `5dfa1ee20000000001001cb3`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Creator](https://okdata.online/docs/objects/creator/).

| Field | Type | Description |
|---|---|---|
| `id` | string | The marketplace's creator ID; the other marketplace endpoints take it. |
| `url` | string | The creator's page on the marketplace. |
| `account_id` | string \| null | The creator's own account ID on the platform, where the marketplace gives it: on Douyin the sec_uid (MS4w…) that douyin.users.get takes, on Xiaohongshu the user ID. |
| `username` | string \| null | Handle on the platform, where given. |
| `name` | string | Display name. |
| `avatar_url` | string \| null | Avatar image URL. |
| `location` | string \| null | Where the creator says they are. |
| `gender` | string \| null | The creator's gender as the marketplace lists it. |
| `followers` | integer \| null | Followers. |
| `categories` | string[] \| null | Content categories in the marketplace’s own words. |
| `engagement_rate` | number \| null | Interactions per view of recent posts, 0 to 1 (0.038 is 3.8%). |
| `median_views` | integer \| null | Median views or reads of recent everyday posts. |
| `median_engagements` | integer \| null | Median interactions (likes, comments, saves, shares) of recent everyday posts. |
| `rates` | Rate[] \| null | Published rates for sponsored work; null when the marketplace hides them. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=5dfa1ee20000000001001cb3'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "5dfa1ee20000000001001cb3"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["name"], row["followers"], row["engagement_rate"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/get');
url.searchParams.set('id', "5dfa1ee20000000001001cb3");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.name, row.followers, row.engagement_rate);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "xiaohongshu.pgy.creators.get",
    "id": "5dfa1ee20000000001001cb3"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Xiaohongshu PGY creator detail and shortlist ten creators with the best engagement for the money, with their rates.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "5dfa1ee20000000001001cb3",
      "url": "https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/5dfa1ee20000000001001cb3",
      "account_id": "5dfa1ee20000000001001cb3",
      "username": "shaka521",
      "name": "山野轻装",
      "avatar_url": "https://cdn.example.com/avatar/creator.jpg",
      "location": "江苏 苏州",
      "gender": "male",
      "followers": 176970,
      "categories": [
        "出行旅游",
        "旅行"
      ],
      "engagement_rate": null,
      "median_views": 198469,
      "median_engagements": 15935,
      "rates": [
        {
          "type": "image_note",
          "name": "图文笔记",
          "price": 16000,
          "currency": "CNY",
          "available": true,
          "settlement": null
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.get",
    "billing": {
      "amount": "0.04",
      "currency": "USD",
      "balance_after": "9.96"
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

### How much does the Xiaohongshu PGY creator detail API cost?

One call costs $0.04 and returns one creator. 1,000 lookups cost $40.00. Failed calls are not charged.

### Do I need a Xiaohongshu (RedNote) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Xiaohongshu (RedNote); nothing is fetched with your own Xiaohongshu (RedNote) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Xiaohongshu (RedNote) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Xiaohongshu (RedNote) endpoints

- [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/): $0.02 per call · about 20 notes per page
- [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/): $0.02 per call
- [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/): $0.02 per call · about 10 comments per page
- [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/): $0.02 per call
- [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/): $0.02 per call · about 20 notes per page
- [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/): $0.02 per call · about 20 board entries per page
- [Xiaohongshu PGY creator search](https://okdata.online/apis/xiaohongshu/pgy/creators/search/): $0.04 per call · about 20 creators per page
- [Xiaohongshu shop product search](https://okdata.online/apis/xiaohongshu/shop/products/search/): $0.02 per call · about 20 products per page
- [Xiaohongshu shop product reviews](https://okdata.online/apis/xiaohongshu/shop/products/reviews/list/): $0.02 per call · about 12 reviews per page
- [Xiaohongshu image search](https://okdata.online/apis/xiaohongshu/images/search/): $0.02 per call · about 20 posts per page
- [Xiaohongshu comment replies](https://okdata.online/apis/xiaohongshu/comments/replies/list/): $0.02 per call · about 5 comments per page
- [Xiaohongshu topic notes](https://okdata.online/apis/xiaohongshu/topics/notes/list/): $0.02 per call · about 10 notes per page
- [Xiaohongshu topic detail](https://okdata.online/apis/xiaohongshu/topics/get/): $0.02 per call
- [Xiaohongshu account search](https://okdata.online/apis/xiaohongshu/users/search/): $0.02 per call · about 20 accounts per page
- [Xiaohongshu shop product detail](https://okdata.online/apis/xiaohongshu/shop/products/get/): $0.02 per call
- [Xiaohongshu search suggestions](https://okdata.online/apis/xiaohongshu/keywords/related/): $0.02 per call · about 10 results per page
- [Xiaohongshu video note with its video](https://okdata.online/apis/xiaohongshu/videos/get/): $0.02 per call
- [Xiaohongshu PGY keyword search index](https://okdata.online/apis/xiaohongshu/pgy/keywords/history/): $0.04 per call
- [Xiaohongshu PGY related keywords](https://okdata.online/apis/xiaohongshu/pgy/keywords/related/): $0.04 per call · about 98 results per page
- [Xiaohongshu PGY creator audience](https://okdata.online/apis/xiaohongshu/pgy/creators/audience/get/): $0.04 per call
- [Xiaohongshu PGY creator note metrics](https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/): $0.04 per call
- [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/): $0.04 per call · about 8 notes per page
- [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/): $0.04 per call
- [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/): $0.04 per call · about 4 creators per page
- [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/): $0.04 per call · about 34 notes per page
- [Xiaohongshu PGY creator costs and summary](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/): $0.04 per call
- [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/): $0.04 per call
- [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/): $0.04 per call
- [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/): $0.04 per call
