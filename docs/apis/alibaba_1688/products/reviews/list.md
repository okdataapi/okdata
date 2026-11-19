# 1688 product reviews API

> Buyers' reviews of a 1688 offer: stars, text, date and the variant bought, in 1688's order or newest first.

Canonical page: https://okdata.online/apis/alibaba_1688/products/reviews/list/

- **Endpoint**: `GET /v1/alibaba_1688/products/reviews/list`
- **ID**: `alibaba_1688.products.reviews.list`
- **Price**: $0.022 per call · about 10 reviews per page
- **Returns**: a page of about 10 reviews (`data.items`, Review objects)
- **Status**: preview
- **Good for**: Word of mouth, Product research

## Price

One call costs $0.022 and returns one page of about 10 reviews. Collecting 1,000 reviews takes about 100 calls, $2.20 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The 1688 offer ID: the number in detail.1688.com/offer/<id>.html. (e.g. `1083411694147`) |
| `sort` | string: default / recent | no | `default` | 1688's order (the default) or newest first. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
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
| `translation` | string \| null | The review in English, as the store translates it; null where the store gives no translation. |
| `published_at` | string \| null | When it was posted, ISO 8601 in UTC (a day for platforms that show only the date). |
| `author_name` | string \| null | Reviewer name as the shop shows it, often masked. |
| `variant` | string \| null | The variant bought. |
| `images` | string[] \| null | Photos attached to the review. |
| `likes` | integer \| null | Likes on the review. |
| `verified_purchase` | boolean \| null | Whether the shop marks it as a verified purchase. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/alibaba_1688/products/reviews/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1083411694147'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/alibaba_1688/products/reviews/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1083411694147"},
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
const url = new URL('https://api.okdata.online/v1/alibaba_1688/products/reviews/list');
url.searchParams.set('id', "1083411694147");

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
    "capability": "alibaba_1688.products.reviews.list",
    "id": "1083411694147"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use 1688 product reviews, read the first two pages and sum up what buyers like and what they complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "41113904141",
        "product_id": "1083411694147",
        "rating": 5,
        "text": "能调节粗细，手冲或者法压都能适配，转动起来很顺滑。",
        "translation": "Great grinder, the espresso comes out much better.",
        "published_at": "2026-10-13T11:40:02Z",
        "author_name": "t**2",
        "variant": "规格:手摇咖啡研磨器（黑色）",
        "images": [
          "https://cdn.example.com/review/1.jpg"
        ],
        "likes": 42,
        "verified_purchase": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "alibaba_1688.products.reviews.list",
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

### How much does the 1688 product reviews API cost?

One call costs $0.022 and returns one page of about 10 reviews. Collecting 1,000 reviews takes about 100 calls, $2.20 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

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
- [1688 supplier products](https://okdata.online/apis/alibaba_1688/shops/products/list/): $0.022 per call · about 20 products per page
