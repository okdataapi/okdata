# Weibo hot search (backup) API

> The backup of weibo.trends.list, for when it cannot serve: the Weibo hot search list from a separate data path (the app's), at a little more. The 50 ranked topics at their places, with heat; the pinned topic and paid rows are left out.

Canonical page: https://okdata.online/apis/weibo/backup/trends/list/

- **Endpoint**: `GET /v1/weibo/backup/trends/list`
- **ID**: `weibo.backup.trends.list`
- **Price**: $0.0025 per call · about 50 board entries per page
- **Returns**: a page of about 50 board entries (`data.items`, Trend objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.0025 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.05 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `board` | string: hot_search | no | `hot_search` | Which list: the hot search list is the only one. |
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
curl "https://api.okdata.online/v1/weibo/backup/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/weibo/backup/trends/list",
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
const url = new URL('https://api.okdata.online/v1/weibo/backup/trends/list');

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
    "capability": "weibo.backup.trends.list"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Weibo hot search (backup) and show me the top ten right now.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "rank": 1,
        "name": "#初雪#",
        "heat": 1203423,
        "url": "https://s.weibo.com/weibo?q=%23%E5%88%9D%E9%9B%AA%23"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "weibo.backup.trends.list",
    "billing": {
      "amount": "0.0025",
      "currency": "USD",
      "balance_after": "9.9975"
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

### How much does the Weibo hot search (backup) API cost?

One call costs $0.0025 and returns one page of about 50 board entries. Collecting 1,000 board entries takes about 20 calls, $0.05 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.0025.

### Do I need a Weibo account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Weibo; nothing is fetched with your own Weibo account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Weibo does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Weibo endpoints

- [Weibo post search](https://okdata.online/apis/weibo/posts/search/): $0.002 per call · about 10 posts per page
- [Weibo hot search](https://okdata.online/apis/weibo/trends/list/): $0.002 per call · about 50 board entries per page
- [Weibo account profile](https://okdata.online/apis/weibo/users/get/): $0.002 per call
- [Weibo post detail](https://okdata.online/apis/weibo/posts/get/): $0.002 per call
- [Weibo post comments](https://okdata.online/apis/weibo/posts/comments/list/): $0.002 per call · about 20 comments per page
- [Weibo comment replies](https://okdata.online/apis/weibo/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Weibo post likers](https://okdata.online/apis/weibo/posts/likers/list/): $0.002 per call · about 50 accounts per page
- [Weibo account posts](https://okdata.online/apis/weibo/users/posts/list/): $0.002 per call · about 20 posts per page
- [Weibo account followers](https://okdata.online/apis/weibo/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Weibo account search](https://okdata.online/apis/weibo/users/search/): $0.002 per call · about 20 accounts per page
