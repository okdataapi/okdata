# AliExpress product details API

> One AliExpress product by ID: title, price, units sold, rating, number of reviews, images and the store.

Canonical page: https://okdata.online/apis/aliexpress/products/get/

- **Endpoint**: `GET /v1/aliexpress/products/get`
- **ID**: `aliexpress.products.get`
- **Price**: $0.002 per call
- **Returns**: one Product object (`data.item`)
- **Status**: preview
- **Good for**: Product research

## Price

One call costs $0.002 and returns one product. 1,000 lookups cost $2.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The AliExpress item ID: the number in /item/<id>.html. (e.g. `3256805498946261`) |
| `country` | string | no | `US` | Ship-to country as an ISO code; prices and availability follow it. Prices are in US dollars. (e.g. `US`) |
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
curl -G "https://api.okdata.online/v1/aliexpress/products/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=3256805498946261'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/aliexpress/products/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "3256805498946261"},
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
const url = new URL('https://api.okdata.online/v1/aliexpress/products/get');
url.searchParams.set('id', "3256805498946261");

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
    "capability": "aliexpress.products.get",
    "id": "3256805498946261"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use AliExpress product details and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "3256805498946261",
      "url": "https://www.aliexpress.com/item/3256805498946261.html",
      "title": "HiBREW G5 48mm Conical Burr Electric Coffee Grinder",
      "price": 233.91,
      "original_price": null,
      "currency": "USD",
      "sold": 15335,
      "rating": 4.8,
      "reviews": null,
      "images": [
        "https://cdn.example.com/product/1.jpg"
      ],
      "shop": {
        "id": null,
        "name": null,
        "url": null
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "aliexpress.products.get",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the AliExpress product details API cost?

One call costs $0.002 and returns one product. 1,000 lookups cost $2.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

### Do I need a AliExpress account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from AliExpress; nothing is fetched with your own AliExpress account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if AliExpress does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More AliExpress endpoints

- [AliExpress product search](https://okdata.online/apis/aliexpress/products/search/): $0.002 per call · about 20 products per page
- [AliExpress product reviews](https://okdata.online/apis/aliexpress/products/reviews/list/): $0.002 per call · about 20 reviews per page
