# App Store reviews API

> Written customer reviews of an app in one country's store, newest or most helpful first, 50 a page and at most 10 pages (about 500 a country): stars, title and text, the app version reviewed (in variant), the reviewer's name, date and helpful votes (in likes).

Canonical page: https://okdata.online/apis/app_store/apps/reviews/list/

- **Endpoint**: `GET /v1/app_store/apps/reviews/list`
- **ID**: `app_store.apps.reviews.list`
- **Price**: $0.001 per call · about 50 reviews per page
- **Returns**: a page of about 50 reviews (`data.items`, Review objects)
- **Status**: preview
- **Good for**: Word of mouth, Product research

## Price

One call costs $0.001 and returns one page of about 50 reviews. Collecting 1,000 reviews takes about 20 calls, $0.02 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The app's App Store ID: the digits after id in its apps.apple.com link. Give id or url. (e.g. `6448311069`) |
| `url` | string | no |  | The app's apps.apple.com link; the ID is read from it, and so is the store's country unless country is given. (e.g. `https://apps.apple.com/us/app/chatgpt/id6448311069`) |
| `country` | string | no |  | The store, by two-letter country code (US, GB, JP, CN…): price, ratings and reviews are that store's. Default: the country in url, else US. (e.g. `US`) |
| `sort` | string: recent / helpful | no | `recent` | Newest first (the default) or most helpful first. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
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
curl -G "https://api.okdata.online/v1/app_store/apps/reviews/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6448311069'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/app_store/apps/reviews/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6448311069"},
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
const url = new URL('https://api.okdata.online/v1/app_store/apps/reviews/list');
url.searchParams.set('id', "6448311069");

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
    "capability": "app_store.apps.reviews.list",
    "id": "6448311069"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use App Store reviews, read the first two pages and sum up what buyers like and what they complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "14799937673",
        "product_id": "6448311069",
        "rating": 5,
        "text": "Plans my whole week\n\nI paste in my notes on Sunday and get a schedule back in a minute.",
        "translation": null,
        "published_at": "2026-11-17T01:41:26Z",
        "author_name": "trailrunner_88",
        "variant": "1.2026.307",
        "images": null,
        "likes": 3,
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
    "capability": "app_store.apps.reviews.list",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the platform (not found, a failure or a timeout on the platform's side) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the App Store reviews API cost?

One call costs $0.001 and returns one page of about 50 reviews. Collecting 1,000 reviews takes about 20 calls, $0.02 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.001.

### Do I need a App Store account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from App Store; nothing is fetched with your own App Store account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if App Store does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More App Store endpoints

- [App Store app details](https://okdata.online/apis/app_store/apps/get/): $0.001 per call
