# WeChat Channels video share link API

> A link that opens a Channels video in WeChat (weixin.qq.com/sph/…), made from the video's ID. Each call makes a new link and older ones keep working; a link cannot be built from the ID by hand.

Canonical page: https://okdata.online/apis/wechat_channels/videos/share_link/get/

- **Endpoint**: `GET /v1/wechat_channels/videos/share_link/get`
- **ID**: `wechat_channels.videos.share_link.get`
- **Price**: $0.02 per call
- **Returns**: one ChannelsShareLink object (`data.item`)
- **Status**: preview
- **Good for**: Content research

## Price

One call costs $0.02 and returns one channels_share_link. 1,000 lookups cost $20.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The video ID (digits): the id a video list or detail gives. A search result's export/… ID goes through wechat_channels.videos.get first. (e.g. `15051893554318805499`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [ChannelsShareLink](https://okdata.online/docs/objects/channels_share_link/).

| Field | Type | Description |
|---|---|---|
| `id` | string | The video's ID. |
| `url` | string | The share link (weixin.qq.com/sph/…). |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_channels/videos/share_link/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=15051893554318805499'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_channels/videos/share_link/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "15051893554318805499"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/wechat_channels/videos/share_link/get');
url.searchParams.set('id', "15051893554318805499");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "wechat_channels.videos.share_link.get",
    "id": "15051893554318805499"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use WeChat Channels video share link and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": null,
      "url": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_channels.videos.share_link.get",
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

### How much does the WeChat Channels video share link API cost?

One call costs $0.02 and returns one channels_share_link. 1,000 lookups cost $20.00. Failed calls are not charged.

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
- [WeChat Channels account collections](https://okdata.online/apis/wechat_channels/users/collections/list/): $0.02 per call · about 7 results per page
- [WeChat Channels collection videos](https://okdata.online/apis/wechat_channels/collections/videos/list/): $0.02 per call · about 20 videos per page
- [WeChat Channels video stats](https://okdata.online/apis/wechat_channels/videos/metrics/): $0.015 per call
- [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/): $0.03 per call
- [WeChat Channels account videos (backup)](https://okdata.online/apis/wechat_channels/backup/users/videos/list/): $0.06 per call · about 15 videos per page
- [WeChat Channels video search (backup)](https://okdata.online/apis/wechat_channels/backup/videos/search/): $0.15 per call · about 10 videos per page
