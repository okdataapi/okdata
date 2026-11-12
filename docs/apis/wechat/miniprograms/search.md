# WeChat mini program search API

> Mini programs for keywords through WeChat Search, the first page (about 25): name, description, icon, original ID and AppID, the owner and whether verified, recent users as WeChat shows them, and whether it is a mini game.

Canonical page: https://okdata.online/apis/wechat/miniprograms/search/

- **Endpoint**: `GET /v1/wechat/miniprograms/search`
- **ID**: `wechat.miniprograms.search`
- **Price**: $0.15 per call · about 25 results per page
- **Returns**: a page of about 25 results (`data.items`, Miniprogram objects)
- **Status**: preview
- **Good for**: Competitor monitoring, Product research

## Price

One call costs $0.15 and returns one page of about 25 results. Collecting 1,000 results takes about 40 calls, $6.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | yes |  | Keywords, as a person would type them into the platform search box. (e.g. `外卖`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Miniprogram](https://okdata.online/docs/objects/miniprogram/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Original ID (gh_…). |
| `app_id` | string \| null | AppID (wx…), used to open or link to it; null where none is given. |
| `name` | string | Name. |
| `description` | string \| null | Description. |
| `icon_url` | string \| null | Icon. |
| `owner_name` | string \| null | The company or body that runs it. |
| `owner_verified` | boolean \| null | Whether the owner is verified. |
| `recent_users` | integer \| null | Recent users as the platform shows them; a figure like 1万+ is a lower bound; null where none is shown. |
| `is_game` | boolean \| null | Whether it is a mini game. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat/miniprograms/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=外卖'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat/miniprograms/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "外卖"},
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
const url = new URL('https://api.okdata.online/v1/wechat/miniprograms/search');
url.searchParams.set('query', "外卖");

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
    "capability": "wechat.miniprograms.search",
    "query": "外卖"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat mini program search and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": null,
        "app_id": null,
        "name": null,
        "description": null,
        "icon_url": null,
        "owner_name": null,
        "owner_verified": null,
        "recent_users": null,
        "is_game": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat.miniprograms.search",
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

### How much does the WeChat mini program search API cost?

One call costs $0.15 and returns one page of about 25 results. Collecting 1,000 results takes about 40 calls, $6.00 in total. Each page is a separate call; failed calls are not charged.

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
- [WeChat Index](https://okdata.online/apis/wechat/index/keywords/history/): $0.15 per call · about 1 results per page
- [WeChat Search suggestions](https://okdata.online/apis/wechat/keywords/related/): $0.15 per call · about 9 results per page
- [WeChat Search articles and videos (backup)](https://okdata.online/apis/wechat/backup/posts/search/): $0.15 per call · about 20 posts per page
