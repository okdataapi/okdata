# TikTok Creative Center top ad API

> One Top Ad of TikTok's Creative Center by its ID: the ad's video and cover, caption, brand, landing page, and under ext its likes, comments, shares, length, objective, industry and the countries it ran in. A showcase entry, without run dates.

Canonical page: https://okdata.online/apis/tiktok/creative_center/ads/get/

- **Endpoint**: `GET /v1/tiktok/creative_center/ads/get`
- **ID**: `tiktok.creative_center.ads.get`
- **Price**: $0.002 per call
- **Returns**: one Ad object (`data.item`)
- **Status**: preview
- **Good for**: Ad intelligence, Content research

## Price

One call costs $0.002 and returns one ad. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The Top Ad ID (digits), from the Creative Center top ads search. (e.g. `7686210433094729735`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Ad](https://okdata.online/docs/objects/ad/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Ad ID in the library. |
| `url` | string | Link to the ad in the library. |
| `advertiser` | AdvertiserRef | Who runs the ad. |
| `title` | string \| null | Headline, where the ad has one. |
| `text` | string | Ad copy as plain text; empty when the ad has none. |
| `format` | string \| null | Creative format; dynamic means the platform assembles it per viewer (catalog ads). |
| `images` | string[] \| null | Image URLs of the creative. |
| `videos` | string[] \| null | Video URLs of the creative. |
| `landing_url` | string \| null | Where the ad leads. |
| `cta` | string \| null | Call-to-action button text. |
| `platforms` | string[] \| null | Where it is delivered, e.g. facebook, instagram. |
| `active` | boolean \| null | Whether the ad is still running. |
| `first_shown_at` | string \| null | First time or day shown, ISO 8601 in UTC. |
| `last_shown_at` | string \| null | Last time or day shown, ISO 8601 in UTC. |
| `reach` | string \| null | People reached, as the library publishes it: a bracket such as 1K-10K, or a count (the EU reach of a Meta ad); null where none is published. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/tiktok/creative_center/ads/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=7686210433094729735'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/creative_center/ads/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "7686210433094729735"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["advertiser"]["name"], row["first_shown_at"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/tiktok/creative_center/ads/get');
url.searchParams.set('id', "7686210433094729735");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.advertiser.name, row.first_shown_at, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "tiktok.creative_center.ads.get",
    "id": "7686210433094729735"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use TikTok Creative Center top ad and sum up what these ads promise, which offers they push and since when.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1879699044062290",
      "url": "https://library.tiktok.com/ads/detail/?ad_id=1879699044062290",
      "advertiser": {
        "id": null,
        "name": "Trail Kit Outdoors Ltd",
        "url": null
      },
      "title": "Espresso is Back",
      "text": "Espresso is Back",
      "format": "video",
      "images": null,
      "videos": [
        "https://library.tiktok.com/api/v1/cdn/video/1879699044062290.mp4"
      ],
      "landing_url": null,
      "cta": null,
      "platforms": [
        "tiktok"
      ],
      "active": null,
      "first_shown_at": "2026-11-10T08:00:00Z",
      "last_shown_at": "2026-11-11T08:00:00Z",
      "reach": "1K-10K"
    }
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.creative_center.ads.get",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged, except not_found here, which costs $0.002 because the source bills it (charged: true with amount); only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the TikTok Creative Center top ad API cost?

One call costs $0.002 and returns one ad. 1,000 lookups cost $2.00. Failed calls are not charged.

### Do I need a TikTok account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from TikTok; nothing is fetched with your own TikTok account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if TikTok does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More TikTok endpoints

- [TikTok video search](https://okdata.online/apis/tiktok/videos/search/): $0.002 per call · about 30 videos per page
- [TikTok video detail](https://okdata.online/apis/tiktok/videos/get/): $0.002 per call
- [TikTok video comments](https://okdata.online/apis/tiktok/videos/comments/list/): $0.002 per call · about 50 comments per page
- [TikTok account profile](https://okdata.online/apis/tiktok/users/get/): $0.002 per call
- [TikTok Ads Library search](https://okdata.online/apis/tiktok/ads/search/): $0.004 per call · about 12 ads per page
- [TikTok Creative Center top ads](https://okdata.online/apis/tiktok/creative_center/ads/search/): $0.002 per call · about 20 ads per page
- [TikTok Shop product search](https://okdata.online/apis/tiktok/shop/products/search/): $0.004 per call · about 20 products per page
- [TikTok Shop product detail](https://okdata.online/apis/tiktok/shop/products/get/): $0.002 per call
- [TikTok Shop product reviews](https://okdata.online/apis/tiktok/shop/products/reviews/list/): $0.002 per call · about 20 reviews per page
- [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/): $0.002 per call
- [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/): $0.002 per call · about 20 comments per page
- [TikTok account search](https://okdata.online/apis/tiktok/users/search/): $0.002 per call · about 30 accounts per page
- [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/): $0.002 per call · about 10 videos per page
- [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/): $0.002 per call · about 20 products per page
- [TikTok account followers](https://okdata.online/apis/tiktok/users/followers/list/): $0.002 per call · about 20 accounts per page
- [TikTok hashtag videos](https://okdata.online/apis/tiktok/hashtags/videos/list/): $0.002 per call · about 20 videos per page
