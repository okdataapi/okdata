# TikTok Shop product detail API

> One TikTok Shop product by ID or link: title, price and discount, units sold, rating, number of reviews, all images, and the shop with its rating and followers.

Canonical page: https://okdata.online/apis/tiktok/shop/products/get/

- **Endpoint**: `GET /v1/tiktok/shop/products/get`
- **ID**: `tiktok.shop.products.get`
- **Price**: $0.002 per call
- **Returns**: one Product object (`data.item`)
- **Status**: preview
- **Good for**: Product research, Competitor monitoring

## Price

One call costs $0.002 and returns one product. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The product ID. Give id or url. (e.g. `1732296652516463425`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.tiktok.com/shop/pdp/1732296652516463425`) |
| `country` | string | no |  | Shop region as an ISO country code; US by default and the most complete. (e.g. `US`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Product](https://okdata.online/docs/objects/product/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Product ID in the shop. |
| `url` | string | Product page. |
| `title` | string | Product title. |
| `price` | number \| null | Current price (the lowest variant), in the currency given. |
| `original_price` | number \| null | List price before discount, where shown. |
| `currency` | string \| null | ISO 4217 currency code. |
| `sold` | integer \| null | Units sold, as the shop shows it. |
| `rating` | number \| null | Average stars, 0 to 5. |
| `reviews` | integer \| null | Number of reviews. |
| `images` | string[] \| null | Product image URLs. |
| `shop` | ShopRef | Who sells it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/tiktok/shop/products/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1732296652516463425'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/shop/products/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1732296652516463425"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["price"], row["currency"], row["sold"], row["title"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/tiktok/shop/products/get');
url.searchParams.set('id', "1732296652516463425");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.price, row.currency, row.sold, row.title.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "tiktok.shop.products.get",
    "id": "1732296652516463425"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use TikTok Shop product detail and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1732296652516463425",
      "url": "https://www.tiktok.com/shop/pdp/1732296652516463425",
      "title": "Fanttik Cafein 11 Portable Espresso Machine",
      "price": 181.99,
      "original_price": 207.99,
      "currency": "USD",
      "sold": 2092,
      "rating": 4.7,
      "reviews": 214,
      "images": [
        "https://cdn.example.com/product/1.jpg"
      ],
      "shop": {
        "id": "7495128284160625473",
        "name": "Fanttik",
        "url": null
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.shop.products.get",
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

### How much does the TikTok Shop product detail API cost?

One call costs $0.002 and returns one product. 1,000 lookups cost $2.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

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
- [TikTok Shop product reviews](https://okdata.online/apis/tiktok/shop/products/reviews/list/): $0.002 per call · about 20 reviews per page
- [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/): $0.002 per call
- [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/): $0.002 per call · about 20 comments per page
- [TikTok account search](https://okdata.online/apis/tiktok/users/search/): $0.002 per call · about 30 accounts per page
- [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/): $0.002 per call · about 10 videos per page
- [TikTok Creative Center top ad](https://okdata.online/apis/tiktok/creative_center/ads/get/): $0.002 per call
- [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/): $0.002 per call · about 20 products per page
- [TikTok account followers](https://okdata.online/apis/tiktok/users/followers/list/): $0.002 per call · about 20 accounts per page
- [TikTok hashtag videos](https://okdata.online/apis/tiktok/hashtags/videos/list/): $0.002 per call · about 20 videos per page
