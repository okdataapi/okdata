# Amazon Best Sellers API

> An Amazon Best Sellers list for a category, in rank order: rank, title, price, rating, number of ratings and photo. Also New Releases, Movers & Shakers, Most Wished For and Gift Ideas.

Canonical page: https://okdata.online/apis/amazon/bestsellers/list/

- **Endpoint**: `GET /v1/amazon/bestsellers/list`
- **ID**: `amazon.bestsellers.list`
- **Price**: $0.006 per call · about 50 products per page
- **Returns**: a page of about 50 products (`data.items`, Product objects)
- **Status**: preview
- **Good for**: Product research, Trend research

## Price

One call costs $0.006 and returns one page of about 50 products. Collecting 1,000 products takes about 20 calls, $0.12 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `category` | string | yes |  | The category as it appears in the Best Sellers link: kitchen, electronics, beauty, sporting-goods, pet-supplies… (e.g. `kitchen`) |
| `list` | string: best_sellers / new_releases / movers_and_shakers / most_wished_for / gift_ideas | no | `best_sellers` | Which list: Best Sellers (the default), New Releases, Movers & Shakers, Most Wished For or Gift Ideas. |
| `country` | string: US / GB / DE / FR / IT / ES / NL / BE / PL / SE / CA / MX / BR / AU / JP / IN / SG / AE / SA / TR / EG / CN | no | `US` | The Amazon store, by country: US (amazon.com, the default), GB (amazon.co.uk), DE, JP and others. Prices come in that store's currency. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

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
curl -G "https://api.okdata.online/v1/amazon/bestsellers/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'category=kitchen'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/amazon/bestsellers/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"category": "kitchen"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["price"], row["currency"], row["sold"], row["title"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/amazon/bestsellers/list');
url.searchParams.set('category', "kitchen");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.price, row.currency, row.sold, row.title.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "amazon.bestsellers.list",
    "category": "kitchen"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Amazon Best Sellers and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "B0GTS6KPPB",
        "url": "https://www.amazon.com/dp/B0GTS6KPPB",
        "title": "Fanttik Cafein 11 Portable Espresso Maker, 20 Bar",
        "price": 109.99,
        "original_price": 159.99,
        "currency": "USD",
        "sold": null,
        "rating": 4.3,
        "reviews": 119,
        "images": [
          "https://cdn.example.com/product/1.jpg"
        ],
        "shop": {
          "id": null,
          "name": "Fanttik",
          "url": null
        }
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "amazon.bestsellers.list",
    "billing": {
      "amount": "0.006",
      "currency": "USD",
      "balance_after": "9.994"
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

### How much does the Amazon Best Sellers API cost?

One call costs $0.006 and returns one page of about 50 products. Collecting 1,000 products takes about 20 calls, $0.12 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.006.

### Do I need a Amazon account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Amazon; nothing is fetched with your own Amazon account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Amazon does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Amazon endpoints

- [Amazon product search](https://okdata.online/apis/amazon/products/search/): $0.006 per call · about 48 products per page
- [Amazon product details](https://okdata.online/apis/amazon/products/get/): $0.006 per call
- [Amazon product reviews](https://okdata.online/apis/amazon/products/reviews/list/): $0.006 per call · about 10 reviews per page
