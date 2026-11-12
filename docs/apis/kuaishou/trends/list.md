# Kuaishou hot list API

> Kuaishou's hot list: 50 trending topics and the one pinned above them, with heat.

Canonical page: https://okdata.online/apis/kuaishou/trends/list/

- **Endpoint**: `GET /v1/kuaishou/trends/list`
- **ID**: `kuaishou.trends.list`
- **Price**: $0.002 per call · about 51 board entries per page
- **Returns**: a page of about 51 board entries (`data.items`, Trend objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.002 and returns one page of about 51 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

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
curl "https://api.okdata.online/v1/kuaishou/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/kuaishou/trends/list",
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
const url = new URL('https://api.okdata.online/v1/kuaishou/trends/list');

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
    "capability": "kuaishou.trends.list"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Kuaishou hot list and show me the top ten right now.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "初雪",
        "heat": 12389000,
        "url": "https://www.kuaishou.com/search/video?searchKey=%E5%88%9D%E9%9B%AA"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "kuaishou.trends.list",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Kuaishou hot list API cost?

One call costs $0.002 and returns one page of about 51 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Kuaishou account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Kuaishou; nothing is fetched with your own Kuaishou account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Kuaishou does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Kuaishou endpoints

- [Kuaishou video search](https://okdata.online/apis/kuaishou/videos/search/): $0.02 per call · about 10 videos per page
- [Kuaishou video detail](https://okdata.online/apis/kuaishou/videos/get/): $0.002 per call
- [Kuaishou video comments](https://okdata.online/apis/kuaishou/videos/comments/list/): $0.002 per call · about 10 comments per page
- [Kuaishou comment replies](https://okdata.online/apis/kuaishou/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Kuaishou account profile](https://okdata.online/apis/kuaishou/users/get/): $0.02 per call
- [Kuaishou account search](https://okdata.online/apis/kuaishou/users/search/): $0.02 per call · about 20 accounts per page
- [Kuaishou account videos](https://okdata.online/apis/kuaishou/users/videos/list/): $0.02 per call · about 20 videos per page
