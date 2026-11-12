# Google advertiser ads API

> An advertiser's ads in the Google Ads Transparency Center (Search, YouTube, Display, Shopping, Maps, Play), by advertiser ID or by the brand's website domain: format, preview image, first and last time shown. 40 ads a page.

Canonical page: https://okdata.online/apis/google/advertisers/ads/list/

- **Endpoint**: `GET /v1/google/advertisers/ads/list`
- **ID**: `google.advertisers.ads.list`
- **Price**: $0.004 per call · about 40 ads per page
- **Returns**: a page of about 40 ads (`data.items`, Ad objects)
- **Status**: preview
- **Good for**: Ad intelligence, Competitor monitoring

## Price

One call costs $0.004 and returns one page of about 40 ads. Collecting 1,000 ads takes about 25 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The advertiser ID (AR…), from the advertiser search. Give id or domain. (e.g. `AR17172796163137470465`) |
| `domain` | string | no |  | The brand's website domain. Give id or domain. (e.g. `stanley1913.com`) |
| `country` | string | no |  | Only ads shown in this country (ISO code); anywhere when left out. (e.g. `US`) |
| `format` | string: all / text / image / video | no | `all` | Only text, image or video ads; all by default. |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Ad](https://okdata.online/docs/objects/ad/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Ad ID in the library. |
| `url` | string | Link to the ad in the library. |
| `advertiser` | AdvertiserRef | Who runs the ad. |
| `title` | string \| null | Headline, where the ad has one. |
| `text` | string | Ad copy as plain text; empty when the ad has none. |
| `format` | string \| null | Creative format; dynamic means the platform assembles it per viewer (catalog ads). |
| `images` | string[] \| null | Image URLs of the creative. |
| `videos` | string[] \| null | Video URLs of the creative. |
| `landing_url` | string \| null | Where the ad leads. |
| `cta` | string \| null | Call-to-action button text. |
| `platforms` | string[] \| null | Where it is delivered, e.g. facebook, instagram. |
| `active` | boolean \| null | Whether the ad is still running. |
| `first_shown_at` | string \| null | First time or day shown, ISO 8601 in UTC. |
| `last_shown_at` | string \| null | Last time or day shown, ISO 8601 in UTC. |
| `reach` | string \| null | People reached, as the library publishes it: a bracket such as 1K-10K, or a count (the EU reach of a Meta ad); null where none is published. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/google/advertisers/ads/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=AR17172796163137470465'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/google/advertisers/ads/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "AR17172796163137470465"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["advertiser"]["name"], row["first_shown_at"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/google/advertisers/ads/list');
url.searchParams.set('id', "AR17172796163137470465");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.advertiser.name, row.first_shown_at, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "google.advertisers.ads.list",
    "id": "AR17172796163137470465"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Google advertiser ads and sum up what these ads promise, which offers they push and since when.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "CR06859729393586012161",
        "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465/creative/CR06859729393586012161",
        "advertiser": {
          "id": "AR17172796163137470465",
          "name": "PACIFIC MARKET INTERNATIONAL, LLC",
          "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465"
        },
        "title": null,
        "text": "",
        "format": "image",
        "images": null,
        "videos": null,
        "landing_url": null,
        "cta": null,
        "platforms": null,
        "active": null,
        "first_shown_at": "2026-10-16T20:42:14Z",
        "last_shown_at": "2026-11-11T15:09:13Z",
        "reach": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "google.advertisers.ads.list",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Google advertiser ads API cost?

One call costs $0.004 and returns one page of about 40 ads. Collecting 1,000 ads takes about 25 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.004.

### Do I need a Google Ads Transparency account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Google Ads Transparency; nothing is fetched with your own Google Ads Transparency account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Google Ads Transparency does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Google Ads Transparency endpoints

- [Google Ads Transparency advertiser search](https://okdata.online/apis/google/advertisers/search/): $0.004 per call · about 10 advertisers per page
