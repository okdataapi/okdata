# App Store app details API

> One iPhone, iPad or Mac app by App Store ID or link, in any country's store: name, price and currency, average stars and number of ratings (in reviews), developer and screenshots. ext adds the bundle ID, current version and its release notes, release dates, category, age rating, size, languages and the current version's rating.

Canonical page: https://okdata.online/apis/app_store/apps/get/

- **Endpoint**: `GET /v1/app_store/apps/get`
- **ID**: `app_store.apps.get`
- **Price**: $0.001 per call
- **Returns**: one Product object (`data.item`)
- **Status**: preview
- **Good for**: Product research, Competitor monitoring

## Price

One call costs $0.001 and returns one product. 1,000 lookups cost $1.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The app's App Store ID: the digits after id in its apps.apple.com link. Give id or url. (e.g. `6448311069`) |
| `url` | string | no |  | The app's apps.apple.com link; the ID is read from it, and so is the store's country unless country is given. (e.g. `https://apps.apple.com/us/app/chatgpt/id6448311069`) |
| `country` | string | no |  | The store, by two-letter country code (US, GB, JP, CN…): price, ratings and reviews are that store's. Default: the country in url, else US. (e.g. `US`) |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
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
curl -G "https://api.okdata.online/v1/app_store/apps/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6448311069'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/app_store/apps/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6448311069"},
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
const url = new URL('https://api.okdata.online/v1/app_store/apps/get');
url.searchParams.set('id', "6448311069");

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
    "capability": "app_store.apps.get",
    "id": "6448311069"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use App Store app details and show the price range and the five best sellers, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "6448311069",
      "url": "https://apps.apple.com/us/app/chatgpt/id6448311069",
      "title": "ChatGPT",
      "price": 0,
      "original_price": null,
      "currency": "USD",
      "sold": null,
      "rating": 4.82,
      "reviews": 12324645,
      "images": [
        "https://is1-ssl.mzstatic.com/image/thumb/example/392x696bb.png"
      ],
      "shop": {
        "id": "1684349733",
        "name": "OpenAI OpCo, LLC",
        "url": "https://apps.apple.com/us/developer/openai-opco-llc/id1684349733"
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "app_store.apps.get",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
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

### How much does the App Store app details API cost?

One call costs $0.001 and returns one product. 1,000 lookups cost $1.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a App Store account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from App Store; nothing is fetched with your own App Store account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if App Store does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More App Store endpoints

- [App Store reviews](https://okdata.online/apis/app_store/apps/reviews/list/): $0.001 per call · about 50 reviews per page
