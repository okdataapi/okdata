# Taobao product search API

> Search Taobao and Tmall by keyword: title, price and list price, buyers in the last month, the shop and where it ships from, by sales, price or Taobao's own order, with a price range and a Tmall-only switch.

Canonical page: https://okdata.online/apis/taobao/products/search/

- **Endpoint**: `GET /v1/taobao/products/search`
- **ID**: `taobao.products.search`
- **Price**: $0.043 per call · about 10 products per page
- **Returns**: a page of about 10 products (`data.items`, Product objects)
- **Status**: preview
- **Good for**: Product research, Competitor monitoring

## Price

One call costs $0.043 and returns one page of about 10 products. Collecting 1,000 products takes about 100 calls, $4.30 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `咖啡磨豆机`) |
| `sort` | string: sales / default / price_asc / price_desc | no | `sales` | By sales (the default), Taobao's overall order, or by price. |
| `tmall_only` | boolean | no | `false` | Only Tmall shops. |
| `price_min` | string | no |  | Lowest price in yuan, inclusive. (e.g. `50`) |
| `price_max` | string | no |  | Highest price in yuan, inclusive. (e.g. `300`) |
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
curl -G "https://api.okdata.online/v1/taobao/products/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=咖啡磨豆机'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/taobao/products/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "咖啡磨豆机"},
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
const url = new URL('https://api.okdata.online/v1/taobao/products/search');
url.searchParams.set('query', "咖啡磨豆机");

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
    "capability": "taobao.products.search",
    "query": "咖啡磨豆机"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Taobao product search and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "708174321498",
        "url": "https://detail.tmall.com/item.htm?id=708174321498",
        "title": "Cliton电动磨豆机家用便携式手冲咖啡研磨机",
        "price": 80,
        "original_price": 218,
        "currency": "CNY",
        "sold": 1000,
        "rating": null,
        "reviews": null,
        "images": [
          "https://cdn.example.com/product/1.jpg"
        ],
        "shop": {
          "id": "4219453987",
          "name": "cliton旗舰店",
          "url": "https://shop425752538.taobao.com"
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
    "capability": "taobao.products.search",
    "billing": {
      "amount": "0.043",
      "currency": "USD",
      "balance_after": "9.957"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the platform (not found, a failure or a timeout on the platform's side) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Taobao product search API cost?

One call costs $0.043 and returns one page of about 10 products. Collecting 1,000 products takes about 100 calls, $4.30 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.043.

### Do I need a Taobao & Tmall account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Taobao & Tmall; nothing is fetched with your own Taobao & Tmall account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Taobao & Tmall does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Taobao & Tmall endpoints

- [Taobao product details](https://okdata.online/apis/taobao/products/get/): $0.033 per call
- [Taobao product reviews](https://okdata.online/apis/taobao/products/reviews/list/): $0.043 per call · about 20 reviews per page
- [Taobao shop products](https://okdata.online/apis/taobao/shops/products/list/): $0.043 per call · about 60 products per page
