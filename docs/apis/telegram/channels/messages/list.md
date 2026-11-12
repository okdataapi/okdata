# Telegram channel messages API

> A public channel's messages, newest first, 20 a page: text, time posted, views (rounded from a thousand up, as t.me shows them) and images, video covers included. Each id (handle/number, as in telegram/401) goes straight to the message endpoint.

Canonical page: https://okdata.online/apis/telegram/channels/messages/list/

- **Endpoint**: `GET /v1/telegram/channels/messages/list`
- **ID**: `telegram.channels.messages.list`
- **Price**: $0.002 per call · about 20 posts per page
- **Returns**: a page of about 20 posts (`data.items`, Post objects)
- **Status**: stable
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.002 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `username` | string | yes |  | The public channel's handle (what follows t.me/), with or without @. (e.g. `telegram`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Post](https://okdata.online/docs/objects/post/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Post ID on the platform. |
| `url` | string | Link to the post. |
| `type` | string | What kind of post it is. |
| `title` | string \| null | Title, where the platform has one (videos, notes, articles). |
| `text` | string | Caption, body or description as plain text; articles come as Markdown. |
| `lang` | string \| null | Language code, as reported or detected. |
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the source gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/telegram/channels/messages/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'username=telegram'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/telegram/channels/messages/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"username": "telegram"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/telegram/channels/messages/list');
url.searchParams.set('username', "telegram");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "telegram.channels.messages.list",
    "username": "telegram"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Telegram channel messages and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "trailkit/401",
        "url": "https://t.me/trailkit/401",
        "type": "text",
        "title": null,
        "text": "New gear list for winter trips is up.",
        "lang": "en",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "trailkit",
          "username": "trailkit",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 9800,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": null,
          "comments": null,
          "shares": null,
          "favorites": null,
          "reposts": 640
        },
        "images": null,
        "hashtags": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "telegram.channels.messages.list",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.likes": "platform",
      "metrics.comments": "platform",
      "metrics.shares": "platform",
      "metrics.favorites": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. They are not charged; only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Telegram channel messages API cost?

One call costs $0.002 and returns one page of about 20 posts. Collecting 1,000 posts takes about 50 calls, $0.10 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Telegram account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Telegram; nothing is fetched with your own Telegram account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Telegram does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Telegram endpoints

- [Telegram channel profile](https://okdata.online/apis/telegram/channels/get/): $0.002 per call
- [Telegram message detail](https://okdata.online/apis/telegram/messages/get/): $0.002 per call
