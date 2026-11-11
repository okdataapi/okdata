# X trending topics API

> Trending topics worldwide or for one country.

Canonical page: https://okdata.online/apis/x/trends/list/

- **Endpoint**: `GET /v1/x/trends/list`
- **ID**: `x.trends.list`
- **Price**: $0.009 per call · about 30 board entries per page
- **Returns**: a page of about 30 board entries (`data.items`, Trend objects)
- **Status**: beta
- **Good for**: Trend research

## Price

One call costs $0.009 and returns one page of about 30 board entries. Collecting 1,000 board entries takes about 34 calls, $0.306 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `country` | string | no |  | ISO country code; worldwide when omitted. (e.g. `US`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string | no |  | Comma-separated fields to keep, to save tokens. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Trend](https://okdata.online/docs/objects/trend/).

| Field | Type | Description |
|---|---|---|
| `rank` | integer | Position on the board, 1 is the top. |
| `name` | string | The topic or search term. |
| `heat` | number \| null | The heat score the platform shows; scales differ by platform. |
| `url` | string \| null | Link to the topic page, if there is one. |

## Request examples

### cURL

```bash
curl "https://api.okdata.online/v1/x/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/x/trends/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["rank"], row["name"], row["heat"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/x/trends/list');

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.rank, row.name, row.heat);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "endpoint": "x.trends.list",
    "params": {}
  }
}
```

Or ask an agent that has the MCP server connected:

> Use X trending topics and show me the top ten right now.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "#FirstSnow",
        "heat": 12500,
        "url": "https://x.com/search?q=%23FirstSnow"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "x.trends.list",
    "billing": {
      "amount": "0.009",
      "currency": "USD",
      "balance_after": "9.991"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape and are never charged, except a timeout, whose charge is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the X trending topics API cost?

One call costs $0.009 and returns one page of about 30 board entries. Collecting 1,000 board entries takes about 34 calls, $0.306 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.009.

### Do I need a X (Twitter) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from X (Twitter); nothing is fetched with your own X (Twitter) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if X (Twitter) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More X (Twitter) endpoints

- [X post detail](https://okdata.online/apis/x/posts/get/): $0.001 per call
- [X post search](https://okdata.online/apis/x/posts/search/): $0.006 per call · about 20 posts per page
- [X account profile](https://okdata.online/apis/x/users/get/): $0.001 per call
- [X account posts](https://okdata.online/apis/x/users/posts/list/): $0.006 per call · about 20 posts per page
