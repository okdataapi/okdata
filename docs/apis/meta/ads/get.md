# Meta Ad Library ad detail API

> One ad of the Meta Ad Library by its library ID or link: advertiser, copy, images and videos, landing page, platforms, first and last day shown, and whether it is still running.

Canonical page: https://okdata.online/apis/meta/ads/get/

- **Endpoint**: `GET /v1/meta/ads/get`
- **ID**: `meta.ads.get`
- **Price**: $0.004 per call
- **Returns**: one Ad object (`data.item`)
- **Status**: preview
- **Good for**: Ad intelligence, Competitor monitoring

## Price

One call costs $0.004 and returns one ad. 1,000 lookups cost $4.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The Ad Library ID. Give id or url. (e.g. `744979408183770`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.facebook.com/ads/library/?id=744979408183770`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
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
curl -G "https://api.okdata.online/v1/meta/ads/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=744979408183770'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/meta/ads/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "744979408183770"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["advertiser"]["name"], row["first_shown_at"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/meta/ads/get');
url.searchParams.set('id', "744979408183770");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.advertiser.name, row.first_shown_at, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "meta.ads.get",
    "id": "744979408183770"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Meta Ad Library ad detail and sum up what these ads promise, which offers they push and since when.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1856995242318099",
      "url": "https://www.facebook.com/ads/library/?id=1856995242318099",
      "advertiser": {
        "id": "30147264485",
        "name": "Stanley 1913",
        "url": "https://www.facebook.com/Stanley1913/"
      },
      "title": "The Holiday Collection",
      "text": "Great gifts. Under $50. No compromise.",
      "format": "carousel",
      "images": [
        "https://cdn.example.com/ad/1.jpg"
      ],
      "videos": null,
      "landing_url": "https://www.stanley1913.com/collections/gifts-under-50",
      "cta": "Shop now",
      "platforms": [
        "facebook",
        "instagram"
      ],
      "active": true,
      "first_shown_at": "2026-11-10T08:00:00Z",
      "last_shown_at": "2026-11-11T08:00:00Z",
      "reach": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "meta.ads.get",
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

### How much does the Meta Ad Library ad detail API cost?

One call costs $0.004 and returns one ad. 1,000 lookups cost $4.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Meta Ad Library account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Meta Ad Library; nothing is fetched with your own Meta Ad Library account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Meta Ad Library does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Meta Ad Library endpoints

- [Meta Ad Library search](https://okdata.online/apis/meta/ads/search/): $0.004 per call · about 30 ads per page
- [Meta advertiser ads](https://okdata.online/apis/meta/advertisers/ads/list/): $0.004 per call · about 30 ads per page
