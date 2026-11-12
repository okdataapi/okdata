# WeChat Index API

> A keyword's WeChat Index over the last 30 days, one figure a day (points[].composite_index). The index is WeChat's attention score across Search, articles, Moments and more, not a count of searches, and does not compare with Douyin's or Xiaohongshu's; days are China calendar days (UTC+8).

Canonical page: https://okdata.online/apis/wechat/index/keywords/history/

- **Endpoint**: `GET /v1/wechat/index/keywords/history`
- **ID**: `wechat.index.keywords.history`
- **Price**: $0.15 per call · about 1 results per page
- **Returns**: a page of about 1 results (`data.items`, KeywordHistory objects)
- **Status**: preview
- **Good for**: Trend research

## Price

One call costs $0.15 and returns one page of about 1 results. Collecting 1,000 results takes about 1000 calls, $150.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `keyword` | string | yes |  | One keyword. (e.g. `咖啡`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [KeywordHistory](https://okdata.online/docs/objects/keyword_history/).

| Field | Type | Description |
|---|---|---|
| `keyword` | string | The keyword. |
| `points` | KeywordPoint[] | One entry a day, oldest first. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat/index/keywords/history" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'keyword=咖啡'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/index/keywords/history",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"keyword": "咖啡"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat/index/keywords/history');
url.searchParams.set('keyword', "咖啡");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat.index.keywords.history",
    "keyword": "咖啡"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Index and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "keyword": null,
        "points": [
          {
            "date": null,
            "search_index": null,
            "composite_index": null,
            "notes": null,
            "impressions": null,
            "views": null,
            "engagements": null
          }
        ]
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat.index.keywords.history",
    "billing": {
      "amount": "0.15",
      "currency": "USD",
      "balance_after": "9.85"
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

### How much does the WeChat Index API cost?

One call costs $0.15 and returns one page of about 1 results. Collecting 1,000 results takes about 1000 calls, $150.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.15.

### Do I need a WeChat Search account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Search; nothing is fetched with your own WeChat Search account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Search does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Search endpoints

- [WeChat Search articles and videos](https://okdata.online/apis/wechat/posts/search/): $0.02 per call · about 20 posts per page
- [WeChat Official Account live search](https://okdata.online/apis/wechat/accounts/search/): $0.02 per call · about 8 accounts per page
- [WeChat Search suggestions](https://okdata.online/apis/wechat/keywords/related/): $0.15 per call · about 9 results per page
- [WeChat mini program search](https://okdata.online/apis/wechat/miniprograms/search/): $0.15 per call · about 25 results per page
- [WeChat Search articles and videos (backup)](https://okdata.online/apis/wechat/backup/posts/search/): $0.15 per call · about 20 posts per page
