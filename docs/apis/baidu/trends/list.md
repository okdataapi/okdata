# Baidu hot search API

> Baidu hot search: the 50 searches rising most across China right now, with rank and heat.

Canonical page: https://okdata.online/apis/baidu/trends/list/

- **Endpoint**: `GET /v1/baidu/trends/list`
- **ID**: `baidu.trends.list`
- **Price**: $0.002 per call · about 50 board entries per page
- **Returns**: a page of about 50 board entries (`data.items`, Trend objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.002 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
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
| `platform` | string | The platform whose list the entry is on, e.g. weibo: what tells entries apart on all.trends.list. |

## Request examples

### cURL

```bash
curl "https://api.okdata.online/v1/baidu/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/baidu/trends/list",
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
const url = new URL('https://api.okdata.online/v1/baidu/trends/list');

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
    "capability": "baidu.trends.list"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Baidu hot search and show me the top ten right now.

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
        "heat": 4921380,
        "url": "https://www.baidu.com/s?wd=%E5%88%9D%E9%9B%AA",
        "platform": "baidu"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "baidu.trends.list",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Baidu hot search API cost?

One call costs $0.002 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.04 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Baidu account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Baidu; nothing is fetched with your own Baidu account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Baidu does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).
