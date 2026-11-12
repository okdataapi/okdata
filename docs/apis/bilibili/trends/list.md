# Bilibili hot searches API

> Bilibili's hot search terms right now, up to 50, with rank and heat.

Canonical page: https://okdata.online/apis/bilibili/trends/list/

- **Endpoint**: `GET /v1/bilibili/trends/list`
- **ID**: `bilibili.trends.list`
- **Price**: $0.002 per call · about 50 board entries per page
- **Returns**: a page of about 50 board entries (`data.items`, Trend objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.002 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `board` | string: hot_search | no | `hot_search` | Which list: hot searches is the only one. |
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
curl "https://api.okdata.online/v1/bilibili/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bilibili/trends/list",
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
const url = new URL('https://api.okdata.online/v1/bilibili/trends/list');

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
    "capability": "bilibili.trends.list"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bilibili hot searches and show me the top ten right now.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "用 Claude Code 半小时做完一个爬虫面板",
        "heat": 1250000,
        "url": "https://www.bilibili.com/video/BV1Gx4y1H7kQ"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bilibili.trends.list",
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

### How much does the Bilibili hot searches API cost?

One call costs $0.002 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Bilibili account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bilibili; nothing is fetched with your own Bilibili account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Bilibili does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bilibili endpoints

- [Bilibili video search](https://okdata.online/apis/bilibili/videos/search/): $0.002 per call · about 20 videos per page
- [Bilibili video detail](https://okdata.online/apis/bilibili/videos/get/): $0.002 per call
- [Bilibili video comments](https://okdata.online/apis/bilibili/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Bilibili account profile](https://okdata.online/apis/bilibili/users/get/): $0.002 per call
- [Bilibili account videos](https://okdata.online/apis/bilibili/users/videos/list/): $0.002 per call · about 30 videos per page
- [Bilibili comment replies](https://okdata.online/apis/bilibili/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Bilibili popular videos](https://okdata.online/apis/bilibili/videos/trending/): $0.002 per call · about 20 videos per page
- [Bilibili account videos (backup)](https://okdata.online/apis/bilibili/backup/users/videos/list/): $0.0025 per call · about 20 videos per page
