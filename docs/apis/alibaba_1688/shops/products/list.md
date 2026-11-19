# 1688 supplier products API

> The offers a 1688 supplier sells, by its member ID: title, wholesale and dropshipping price, units sold, category and listing date, sorted by sales, price or date.

Canonical page: https://okdata.online/apis/alibaba_1688/shops/products/list/

- **Endpoint**: `GET /v1/alibaba_1688/shops/products/list`
- **ID**: `alibaba_1688.shops.products.list`
- **Price**: $0.022 per call · about 20 products per page
- **Returns**: a page of about 20 products (`data.items`, Product objects)
- **Status**: preview
- **Good for**: Competitor monitoring, Product research

## Price

One call costs $0.022 and returns one page of about 20 products. Collecting 1,000 products takes about 50 calls, $1.10 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The supplier's member ID, starting b2b-: the shop.id in search results or product details. (e.g. `b2b-2222843280068b7e78`) |
| `sort` | string: default / sales / price_asc / price_desc / newest / oldest | no | `default` | The supplier's order (the default), best selling, by price, or by listing date. |
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
curl -G "https://api.okdata.online/v1/alibaba_1688/shops/products/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=b2b-2222843280068b7e78'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/alibaba_1688/shops/products/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "b2b-2222843280068b7e78"},
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
const url = new URL('https://api.okdata.online/v1/alibaba_1688/shops/products/list');
url.searchParams.set('id', "b2b-2222843280068b7e78");

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
    "capability": "alibaba_1688.shops.products.list",
    "id": "b2b-2222843280068b7e78"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use 1688 supplier products and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1083411694147",
        "url": "https://detail.1688.com/offer/1083411694147.html",
        "title": "跨境户外露营迷你便携手摇咖啡研磨器",
        "price": 9.8,
        "original_price": null,
        "currency": "CNY",
        "sold": 100,
        "rating": 5,
        "reviews": null,
        "images": [
          "https://cdn.example.com/product/1.jpg"
        ],
        "shop": {
          "id": "b2b-2222843280068b7e78",
          "name": "徐州朗安玻璃制品有限公司",
          "url": "http://shop058381625t017.1688.com"
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
    "capability": "alibaba_1688.shops.products.list",
    "billing": {
      "amount": "0.022",
      "currency": "USD",
      "balance_after": "9.978"
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

### How much does the 1688 supplier products API cost?

One call costs $0.022 and returns one page of about 20 products. Collecting 1,000 products takes about 50 calls, $1.10 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.022.

### Do I need a 1688 account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from 1688; nothing is fetched with your own 1688 account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if 1688 does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More 1688 endpoints

- [1688 product search](https://okdata.online/apis/alibaba_1688/products/search/): $0.022 per call · about 20 products per page
- [1688 product details](https://okdata.online/apis/alibaba_1688/products/get/): $0.022 per call
- [1688 product reviews](https://okdata.online/apis/alibaba_1688/products/reviews/list/): $0.022 per call · about 10 reviews per page
