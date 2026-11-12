# Douyin Xingtu creator profile API

> A Douyin creator's profile on Xingtu by Xingtu creator ID: name, avatar, location, gender, followers and content categories. One ID also gives the Douyin account ID (sec_uid), handle, agency and content labels; several IDs (up to 50 in one call) give the integrated and custom video rates, their expected CPMs (in yuan) and the views a video is expected to get instead.

Canonical page: https://okdata.online/apis/douyin/xingtu/creators/get/

- **Endpoint**: `GET /v1/douyin/xingtu/creators/get`
- **ID**: `douyin.xingtu.creators.get`
- **Price**: $0.004 per call
- **Returns**: one Creator object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.004 and returns one creator. 1,000 lookups cost $4.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The Xingtu creator ID (digits), from the Xingtu creator search; not the Douyin account ID. Give id or ids. (e.g. `6763236383382306828`) |
| `ids` | string[] | no |  | Up to 50 Xingtu creator IDs. Give id or ids. (e.g. `6763236383382306828,6816144920949030920`) |
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
curl -G "https://api.okdata.online/v1/douyin/xingtu/creators/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6763236383382306828'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/xingtu/creators/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6763236383382306828"},
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
const url = new URL('https://api.okdata.online/v1/douyin/xingtu/creators/get');
url.searchParams.set('id', "6763236383382306828");

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
    "capability": "douyin.xingtu.creators.get",
    "id": "6763236383382306828"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Douyin Xingtu creator profile and shortlist ten creators with the best engagement for the money, with their rates.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "7283826197740388415",
      "url": "https://www.xingtu.cn/ad/creator/author-homepage/douyin-video/7283826197740388415",
      "account_id": "MS4wLjABAAAADCLMXvMISjsdNz2uITW-Jhir0LZCy31nBIgahVn-yIc",
      "username": "shaka521",
      "name": "二许趣野营",
      "avatar_url": "https://cdn.example.com/avatar/creator.jpg",
      "location": "天津",
      "gender": "male",
      "followers": 103008,
      "categories": [
        "户外运动",
        "户外露营"
      ],
      "engagement_rate": 0.0384,
      "median_views": 15231,
      "median_engagements": 1601,
      "rates": [
        {
          "type": "integrated_video",
          "name": "植入视频",
          "price": 6800,
          "currency": "CNY",
          "available": true,
          "settlement": "固定价格"
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.xingtu.creators.get",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

### How much does the Douyin Xingtu creator profile API cost?

One call costs $0.004 and returns one creator. 1,000 lookups cost $4.00. Failed calls are not charged.

### Do I need a Douyin account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Douyin; nothing is fetched with your own Douyin account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Douyin does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Douyin endpoints

- [Douyin video search](https://okdata.online/apis/douyin/videos/search/): $0.02 per call · about 20 videos per page
- [Douyin video detail](https://okdata.online/apis/douyin/videos/get/): $0.002 per call
- [Douyin video comments](https://okdata.online/apis/douyin/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Douyin account profile](https://okdata.online/apis/douyin/users/get/): $0.002 per call
- [Douyin account videos](https://okdata.online/apis/douyin/users/videos/list/): $0.002 per call · about 20 videos per page
- [Douyin hot search board](https://okdata.online/apis/douyin/trends/list/): $0.002 per call · about 50 board entries per page
- [Douyin Xingtu creator search](https://okdata.online/apis/douyin/xingtu/creators/search/): $0.004 per call · about 20 creators per page
- [Douyin Xingtu creator rate card](https://okdata.online/apis/douyin/xingtu/creators/rates/get/): $0.04 per call
- [Douyin comment replies](https://okdata.online/apis/douyin/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Douyin hashtag videos](https://okdata.online/apis/douyin/hashtags/videos/list/): $0.002 per call · about 10 videos per page
- [Douyin account search](https://okdata.online/apis/douyin/users/search/): $0.002 per call · about 30 accounts per page
- [Douyin video play count](https://okdata.online/apis/douyin/videos/metrics/): $0.002 per call
- [Douyin related videos](https://okdata.online/apis/douyin/videos/related/): $0.002 per call · about 10 videos per page
- [Douyin video boards](https://okdata.online/apis/douyin/videos/trending/): $0.002 per call · about 9 videos per page
- [Douyin search suggestions](https://okdata.online/apis/douyin/keywords/related/): $0.02 per call · about 10 results per page
- [Douyin index: brand trends](https://okdata.online/apis/douyin/index/brands/history/): $0.002 per call
- [Douyin index: brand vs industry](https://okdata.online/apis/douyin/index/brands/metrics/): $0.002 per call
- [Douyin index: account top videos](https://okdata.online/apis/douyin/index/creators/videos/list/): $0.002 per call · about 20 videos per page
- [Douyin index: account followers](https://okdata.online/apis/douyin/index/creators/audience/get/): $0.002 per call
- [Douyin index: account daily averages](https://okdata.online/apis/douyin/index/creators/metrics/): $0.002 per call
- [Douyin index: keyword audience](https://okdata.online/apis/douyin/index/keywords/audience/get/): $0.002 per call
- [Douyin index: keyword trends](https://okdata.online/apis/douyin/index/keywords/history/): $0.006 per call · about 1 results per page
- [Douyin index: related keywords](https://okdata.online/apis/douyin/index/keywords/related/): $0.002 per call · about 170 results per page
- [Douyin index: live hot topics](https://okdata.online/apis/douyin/index/trends/list/): $0.002 per call · about 30 board entries per page
- [Douyin index: top videos for a keyword](https://okdata.online/apis/douyin/index/videos/search/): $0.002 per call · about 20 videos per page
- [Douyin account growth](https://okdata.online/apis/douyin/users/history/): $0.002 per call
- [Douyin Xingtu creator audience](https://okdata.online/apis/douyin/xingtu/creators/audience/get/): $0.004 per call
- [Douyin Xingtu creator reach](https://okdata.online/apis/douyin/xingtu/creators/metrics/): $0.004 per call
- [Douyin Xingtu creator videos](https://okdata.online/apis/douyin/xingtu/creators/videos/list/): $0.004 per call · about 20 videos per page
- [Douyin Xingtu creator keywords](https://okdata.online/apis/douyin/xingtu/creators/keywords/get/): $0.002 per call
- [Douyin Xingtu creator scores](https://okdata.online/apis/douyin/xingtu/creators/scores/get/): $0.008 per call
- [Douyin Xingtu creator content mix](https://okdata.online/apis/douyin/xingtu/creators/content_mix/get/): $0.004 per call
- [Douyin Xingtu creator conversion](https://okdata.online/apis/douyin/xingtu/creators/conversion/get/): $0.004 per call
- [Douyin Xingtu marketing calendar](https://okdata.online/apis/douyin/xingtu/campaigns/list/): $0.004 per call · about 40 results per page
- [Douyin Xingtu video report](https://okdata.online/apis/douyin/xingtu/videos/get/): $0.004 per call
- [Douyin account videos (backup)](https://okdata.online/apis/douyin/backup/users/videos/list/): $0.0025 per call · about 20 videos per page
- [Douyin video search (backup)](https://okdata.online/apis/douyin/backup/videos/search/): $0.03 per call · about 8 videos per page
