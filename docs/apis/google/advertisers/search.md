# Google Ads Transparency advertiser search API

> Find advertisers in the Google Ads Transparency Center by name: advertiser ID, the name Google verified, the country it is registered in and the center's estimate of how many ads it has. The verified name is often the legal entity, not the brand.

Canonical page: https://okdata.online/apis/google/advertisers/search/

- **Endpoint**: `GET /v1/google/advertisers/search`
- **ID**: `google.advertisers.search`
- **Price**: $0.004 per call · about 10 advertisers per page
- **Returns**: a page of about 10 advertisers (`data.items`, Advertiser objects)
- **Status**: preview
- **Good for**: Ad intelligence

## Price

One call costs $0.004 and returns one page of about 10 advertisers. Collecting 1,000 advertisers takes about 100 calls, $0.40 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `Stanley`) |
| `country` | string | no |  | Country to search in (ISO code); US by default. (e.g. `US`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Advertiser](https://okdata.online/docs/objects/advertiser/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Advertiser ID in the library. |
| `url` | string | The advertiser's page in the library. |
| `name` | string | The name the library shows, often the legal entity. |
| `region` | string \| null | Country or region it is registered in (ISO code). |
| `ads` | integer \| null | The library's estimate of how many ads it has. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/google/advertisers/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=Stanley'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/google/advertisers/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "Stanley"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["name"], row["ads"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/google/advertisers/search');
url.searchParams.set('query', "Stanley");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.name, row.ads);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "google.advertisers.search",
    "query": "Stanley"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Google Ads Transparency advertiser search and find the advertiser ID of this brand.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "AR17172796163137470465",
        "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465",
        "name": "PACIFIC MARKET INTERNATIONAL, LLC",
        "region": "US",
        "ads": 2000
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "google.advertisers.search",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

### How much does the Google Ads Transparency advertiser search API cost?

One call costs $0.004 and returns one page of about 10 advertisers. Collecting 1,000 advertisers takes about 100 calls, $0.40 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.004.

### Do I need a Google Ads Transparency account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Google Ads Transparency; nothing is fetched with your own Google Ads Transparency account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Google Ads Transparency does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Google Ads Transparency endpoints

- [Google advertiser ads](https://okdata.online/apis/google/advertisers/ads/list/): $0.004 per call · about 40 ads per page
