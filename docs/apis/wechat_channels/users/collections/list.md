# WeChat Channels account collections API

> Every public collection (playlist) of a Channels account, in one answer: name, description, cover, number of videos and when it was last updated. A collection's id is what wechat_channels.collections.videos.list takes.

Canonical page: https://okdata.online/apis/wechat_channels/users/collections/list/

- **Endpoint**: `GET /v1/wechat_channels/users/collections/list`
- **ID**: `wechat_channels.users.collections.list`
- **Price**: $0.02 per call · about 7 results per page
- **Returns**: a page of about 7 results (`data.items`, ChannelsCollection objects)
- **Status**: preview
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.02 and returns one page of about 7 results. Collecting 1,000 results takes about 143 calls, $2.86 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The account ID: starts with v2_ and ends with @finder. Find it with wechat_channels.users.search, or read a video's author.id. The sph… ID the app shows is not it. (e.g. `v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [ChannelsCollection](https://okdata.online/docs/objects/channels_collection/).

| Field | Type | Description |
|---|---|---|
| `id` | string | The collection's ID; pass it as is to the endpoint that lists its videos. |
| `name` | string | Name of the collection. |
| `description` | string \| null | What the collection says it is about; null when nothing. |
| `cover_url` | string \| null | Cover image. |
| `updated_at` | string \| null | When the collection was last updated. |
| `metrics` | CollectionMetrics | Counts at fetch time. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_channels/users/collections/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/users/collections/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder"},
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
const url = new URL('https://api.okdata.online/v1/wechat_channels/users/collections/list');
url.searchParams.set('id', "v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder");

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
    "capability": "wechat_channels.users.collections.list",
    "id": "v2_060000231003b20faec8c6e4811dc1d4c602ee30b0771bbcf220c67926bb76ab7702ac335a53@finder"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Channels account collections and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": null,
        "name": null,
        "description": null,
        "cover_url": null,
        "updated_at": null,
        "metrics": {
          "videos": null
        }
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_channels.users.collections.list",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
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

### How much does the WeChat Channels account collections API cost?

One call costs $0.02 and returns one page of about 7 results. Collecting 1,000 results takes about 143 calls, $2.86 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.02.

### Do I need a WeChat Channels account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Channels; nothing is fetched with your own WeChat Channels account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Channels does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Channels endpoints

- [WeChat Channels video search](https://okdata.online/apis/wechat_channels/videos/search/): $0.02 per call · about 10 videos per page
- [WeChat Channels account search](https://okdata.online/apis/wechat_channels/users/search/): $0.02 per call · about 1 accounts per page
- [WeChat Channels account profile](https://okdata.online/apis/wechat_channels/users/get/): $0.02 per call
- [WeChat Channels account videos](https://okdata.online/apis/wechat_channels/users/videos/list/): $0.02 per call · about 15 videos per page
- [WeChat Channels video detail](https://okdata.online/apis/wechat_channels/videos/get/): $0.02 per call
- [WeChat Channels video comments](https://okdata.online/apis/wechat_channels/videos/comments/list/): $0.015 per call · about 25 comments per page
- [WeChat Channels comment replies](https://okdata.online/apis/wechat_channels/comments/replies/list/): $0.015 per call · about 20 comments per page
- [WeChat Channels live replays](https://okdata.online/apis/wechat_channels/users/live_replays/list/): $0.02 per call · about 48 posts per page
- [WeChat Channels video share link](https://okdata.online/apis/wechat_channels/videos/share_link/get/): $0.02 per call
- [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/): $0.02 per call · about 20 videos per page
- [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/): $0.015 per call
- [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/): $0.03 per call
- [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/): $0.06 per call · about 15 videos per page
- [WeChat Channels video search (backup)](https://okdata.online/apis/wechat_channels/backup/videos/search/): $0.15 per call · about 10 videos per page
