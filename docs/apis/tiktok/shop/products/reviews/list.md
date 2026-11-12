# TikTok Shop product reviews API

> Buyers' reviews of a TikTok Shop product: stars, text, the variant bought, photos and whether the purchase is verified.

Canonical page: https://okdata.online/apis/tiktok/shop/products/reviews/list/

- **Endpoint**: `GET /v1/tiktok/shop/products/reviews/list`
- **ID**: `tiktok.shop.products.reviews.list`
- **Price**: $0.002 per call · about 20 reviews per page
- **Returns**: a page of about 20 reviews (`data.items`, Review objects)
- **Status**: preview
- **Good for**: Product research, Word of mouth

## Price

One call costs $0.002 and returns one page of about 20 reviews. Collecting 1,000 reviews takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The product ID. (e.g. `1732296652516463425`) |
| `country` | string | no |  | Shop region as an ISO country code; US by default and the most complete. (e.g. `US`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Review](https://okdata.online/docs/objects/review/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Review ID. |
| `product_id` | string | ID of the product reviewed. |
| `rating` | number \| null | Stars, 1 to 5. |
| `text` | string | Review text; empty when the buyer left only stars. |
| `published_at` | string \| null | When it was posted, ISO 8601 in UTC (a day for platforms that show only the date). |
| `author_name` | string \| null | Reviewer name as the shop shows it, often masked. |
| `variant` | string \| null | The variant bought. |
| `images` | string[] \| null | Photos attached to the review. |
| `likes` | integer \| null | Likes on the review. |
| `verified_purchase` | boolean \| null | Whether the shop marks it as a verified purchase. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/tiktok/shop/products/reviews/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1732296652516463425'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/shop/products/reviews/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1732296652516463425"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["rating"], row["text"][:80])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/tiktok/shop/products/reviews/list');
url.searchParams.set('id', "1732296652516463425");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.rating, row.text.slice(0, 80));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "tiktok.shop.products.reviews.list",
    "id": "1732296652516463425"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use TikTok Shop product reviews, read the first two pages and sum up what buyers like and what they complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "7667220239340095245",
        "product_id": "1732296652516463425",
        "rating": 5,
        "text": "Charges on the USB in my car. Excellent for coffee on the go.",
        "published_at": "2026-07-27T14:10:24Z",
        "author_name": "T** M**h",
        "variant": "Default",
        "images": [
          "https://cdn.example.com/review/1.jpg"
        ],
        "likes": 42,
        "verified_purchase": true
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.shop.products.reviews.list",
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

### How much does the TikTok Shop product reviews API cost?

One call costs $0.002 and returns one page of about 20 reviews. Collecting 1,000 reviews takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

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
- [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/): $0.002 per call
- [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/): $0.002 per call · about 20 comments per page
- [TikTok account search](https://okdata.online/apis/tiktok/users/search/): $0.002 per call · about 30 accounts per page
- [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/): $0.002 per call · about 10 videos per page
- [TikTok Creative Center top ad](https://okdata.online/apis/tiktok/creative_center/ads/get/): $0.002 per call
- [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/): $0.002 per call · about 20 products per page
- [TikTok account followers](https://okdata.online/apis/tiktok/users/followers/list/): $0.002 per call · about 20 accounts per page
- [TikTok hashtag videos](https://okdata.online/apis/tiktok/hashtags/videos/list/): $0.002 per call · about 20 videos per page
