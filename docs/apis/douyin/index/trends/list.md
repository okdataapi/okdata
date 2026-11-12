# Douyin index: live hot topics API

> 巨量算数's live hot-topic board or its fastest-rising board, about 30 each: place, topic and topic index (the heat). The topic index is the platform's score, not a count.

Canonical page: https://okdata.online/apis/douyin/index/trends/list/

- **Endpoint**: `GET /v1/douyin/index/trends/list`
- **ID**: `douyin.index.trends.list`
- **Price**: $0.002 per call · about 30 board entries per page
- **Returns**: a page of about 30 board entries (`data.items`, Trend objects)
- **Status**: stable
- **Good for**: Trend research

## Price

One call costs $0.002 and returns one page of about 30 board entries. Collecting 1,000 board entries takes about 34 calls, $0.068 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `board` | string: topics / rising | no | `topics` | Which board: the hottest topics now (the default) or the fastest rising. |
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
curl "https://api.okdata.online/v1/douyin/index/trends/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/index/trends/list",
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
const url = new URL('https://api.okdata.online/v1/douyin/index/trends/list');

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
    "capability": "douyin.index.trends.list"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Douyin index: live hot topics and show me the top ten right now.

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
        "heat": 11820450,
        "url": "https://www.douyin.com/hot/2163450"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.index.trends.list",
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

### How much does the Douyin index: live hot topics API cost?

One call costs $0.002 and returns one page of about 30 board entries. Collecting 1,000 board entries takes about 34 calls, $0.068 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Douyin account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Douyin; nothing is fetched with your own Douyin account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Douyin does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Douyin endpoints

- [Douyin video search](https://okdata.online/apis/douyin/videos/search/): $0.02 per call · about 20 videos per page
- [Douyin video detail](https://okdata.online/apis/douyin/videos/get/): $0.002 per call
- [Douyin video comments](https://okdata.online/apis/douyin/videos/comments/list/): $0.002 per call · about 20 comments per page
- [Douyin account profile](https://okdata.online/apis/douyin/users/get/): $0.002 per call
- [Douyin account videos](https://okdata.online/apis/douyin/users/videos/list/): $0.002 per call · about 20 videos per page
- [Douyin hot search board](https://okdata.online/apis/douyin/trends/list/): $0.002 per call · about 50 board entries per page
- [Douyin Xingtu creator search](https://okdata.online/apis/douyin/xingtu/creators/search/): $0.004 per call · about 20 creators per page
- [Douyin Xingtu creator rate card](https://okdata.online/apis/douyin/xingtu/creators/rates/get/): $0.04 per call
- [Douyin comment replies](https://okdata.online/apis/douyin/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Douyin hashtag videos](https://okdata.online/apis/douyin/hashtags/videos/list/): $0.002 per call · about 10 videos per page
- [Douyin account search](https://okdata.online/apis/douyin/users/search/): $0.002 per call · about 30 accounts per page
- [Douyin video play count](https://okdata.online/apis/douyin/videos/metrics/): $0.002 per call
- [Douyin related videos](https://okdata.online/apis/douyin/videos/related/): $0.002 per call · about 10 videos per page
- [Douyin video boards](https://okdata.online/apis/douyin/videos/trending/): $0.002 per call · about 9 videos per page
- [Douyin search suggestions](https://okdata.online/apis/douyin/keywords/related/): $0.02 per call · about 10 results per page
- [Douyin index: brand trends](https://okdata.online/apis/douyin/index/brands/history/): $0.002 per call
- [Douyin index: brand vs industry](https://okdata.online/apis/douyin/index/brands/metrics/): $0.002 per call
- [Douyin index: account top videos](https://okdata.online/apis/douyin/index/creators/videos/list/): $0.002 per call · about 20 videos per page
- [Douyin index: account followers](https://okdata.online/apis/douyin/index/creators/audience/get/): $0.002 per call
- [Douyin index: account daily averages](https://okdata.online/apis/douyin/index/creators/metrics/): $0.002 per call
- [Douyin index: keyword audience](https://okdata.online/apis/douyin/index/keywords/audience/get/): $0.002 per call
- [Douyin index: keyword trends](https://okdata.online/apis/douyin/index/keywords/history/): $0.006 per call · about 1 results per page
- [Douyin index: related keywords](https://okdata.online/apis/douyin/index/keywords/related/): $0.002 per call · about 170 results per page
- [Douyin index: top videos for a keyword](https://okdata.online/apis/douyin/index/videos/search/): $0.002 per call · about 20 videos per page
- [Douyin account growth](https://okdata.online/apis/douyin/users/history/): $0.002 per call
- [Douyin Xingtu creator profile](https://okdata.online/apis/douyin/xingtu/creators/get/): $0.004 per call
- [Douyin Xingtu creator audience](https://okdata.online/apis/douyin/xingtu/creators/audience/get/): $0.004 per call
- [Douyin Xingtu creator reach](https://okdata.online/apis/douyin/xingtu/creators/metrics/): $0.004 per call
- [Douyin Xingtu creator videos](https://okdata.online/apis/douyin/xingtu/creators/videos/list/): $0.004 per call · about 20 videos per page
- [Douyin Xingtu creator keywords](https://okdata.online/apis/douyin/xingtu/creators/keywords/get/): $0.002 per call
- [Douyin Xingtu creator scores](https://okdata.online/apis/douyin/xingtu/creators/scores/get/): $0.008 per call
- [Douyin Xingtu creator content mix](https://okdata.online/apis/douyin/xingtu/creators/content_mix/get/): $0.004 per call
- [Douyin Xingtu creator conversion](https://okdata.online/apis/douyin/xingtu/creators/conversion/get/): $0.004 per call
- [Douyin Xingtu marketing calendar](https://okdata.online/apis/douyin/xingtu/campaigns/list/): $0.004 per call · about 40 results per page
- [Douyin Xingtu video report](https://okdata.online/apis/douyin/xingtu/videos/get/): $0.004 per call
- [Douyin account videos (backup)](https://okdata.online/apis/douyin/backup/users/videos/list/): $0.0025 per call · about 20 videos per page
- [Douyin video search (backup)](https://okdata.online/apis/douyin/backup/videos/search/): $0.03 per call · about 8 videos per page
