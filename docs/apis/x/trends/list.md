# X trending topics API

> Trending topics worldwide or for one country.

Canonical page: https://okdata.online/apis/x/trends/list/

- **Endpoint**: `GET /v1/x/trends/list`
- **ID**: `x.trends.list`
- **Price**: $0.009 per call · about 30 board entries per page
- **Returns**: a page of about 30 board entries (`data.items`, Trend objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.009 and returns one page of about 30 board entries. Collecting 1,000 board entries takes about 34 calls, $0.306 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `country` | string | no |  | ISO country code; worldwide when omitted. (e.g. `US`) |
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
    "capability": "x.trends.list"
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

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

- [X post detail](https://okdata.online/apis/x/posts/get/): $0.0003 per call
- [X post search](https://okdata.online/apis/x/posts/search/): $0.002 per call · about 20 posts per page
- [X account profile](https://okdata.online/apis/x/users/get/): $0.0004 per account · at most $0.04 per call
- [X account posts](https://okdata.online/apis/x/users/posts/list/): $0.002 per call · about 20 posts per page
- [X post replies](https://okdata.online/apis/x/posts/replies/list/): $0.002 per call · about 35 posts per page
- [X post quotes](https://okdata.online/apis/x/posts/quotes/list/): $0.0003 per post · at most $0.006 per call
- [X post retweeters](https://okdata.online/apis/x/posts/retweeters/list/): $0.002 per call · about 100 accounts per page
- [X article](https://okdata.online/apis/x/posts/article/get/): $0.002 per call
- [X thread](https://okdata.online/apis/x/threads/posts/list/): $0.0003 per post · at most $0.015 per call
- [X account search](https://okdata.online/apis/x/users/search/): $0.0004 per account · at most $0.008 per call
- [X account followers](https://okdata.online/apis/x/users/followers/list/): $0.0001 per account · at most $0.02 per call
- [X account following](https://okdata.online/apis/x/users/following/list/): $0.0001 per account · at most $0.02 per call
- [X account mentions](https://okdata.online/apis/x/users/mentions/list/): $0.0003 per post · at most $0.006 per call
- [X list posts](https://okdata.online/apis/x/lists/posts/list/): $0.002 per call · about 100 posts per page
- [X list members](https://okdata.online/apis/x/lists/members/list/): $0.0004 per account · at most $0.008 per call
- [X list followers](https://okdata.online/apis/x/lists/followers/list/): $0.0004 per account · at most $0.008 per call
- [X community profile](https://okdata.online/apis/x/communities/get/): $0.0004 per call
- [X community posts](https://okdata.online/apis/x/communities/posts/list/): $0.0003 per post · at most $0.006 per call
- [X community members](https://okdata.online/apis/x/communities/members/list/): $0.0004 per account · at most $0.008 per call
