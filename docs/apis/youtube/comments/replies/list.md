# YouTube comment replies API

> The replies under a comment, by the comment's replies token, about 10 at a time: text, replier (handle, avatar, verification), likes, and roughly when it was posted (YouTube says "6 years ago"). post_id and parent_id are read from the token.

Canonical page: https://okdata.online/apis/youtube/comments/replies/list/

- **Endpoint**: `GET /v1/youtube/comments/replies/list`
- **ID**: `youtube.comments.replies.list`
- **Price**: $0.002 per call · about 10 comments per page
- **Returns**: a page of about 10 comments (`data.items`, Comment objects)
- **Status**: stable
- **Good for**: Word of mouth

## Price

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The comment's replies token (YouTube's continuation for its replies, starting Eg0S), not the comment ID: ext.replies_token of the comment in youtube.videos.comments.list with view=full. (e.g. `Eg0SC2RRdzR3OVdnWGNRGAYygwEaUBIaVWd6S1lrc3FlUTVnQTN0MGcwRjRBYUFCQWciAggAKhhVQ3VBWEZrZ3N3MUw3eGFDZm5kNUpKT3cyC2RRdzR3OVdnWGNRQAFICoIBAggBQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3pLWWtzcWVRNWdBM3QwZzBGNEFhQUJBZw%3D%3D`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Comment](https://okdata.online/docs/objects/comment/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Comment ID. |
| `post_id` | string | ID of the post it is under. |
| `parent_id` | string \| null | The comment it replies to; null for top-level comments. |
| `text` | string | Comment text. |
| `published_at` | string | When it was posted, ISO 8601 in UTC. |
| `author` | AccountRef | Who wrote it. |
| `likes` | integer \| null | Likes on the comment. |
| `replies` | integer \| null | Replies under it. |
| `ip_location` | string \| null | Region label the platform shows next to the comment, if any. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/youtube/comments/replies/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=Eg0SC2RRdzR3OVdnWGNRGAYygwEaUBIaVWd6S1lrc3FlUTVnQTN0MGcwRjRBYUFCQWciAggAKhhVQ3VBWEZrZ3N3MUw3eGFDZm5kNUpKT3cyC2RRdzR3OVdnWGNRQAFICoIBAggBQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3pLWWtzcWVRNWdBM3QwZzBGNEFhQUJBZw%3D%3D'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/youtube/comments/replies/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "Eg0SC2RRdzR3OVdnWGNRGAYygwEaUBIaVWd6S1lrc3FlUTVnQTN0MGcwRjRBYUFCQWciAggAKhhVQ3VBWEZrZ3N3MUw3eGFDZm5kNUpKT3cyC2RRdzR3OVdnWGNRQAFICoIBAggBQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3pLWWtzcWVRNWdBM3QwZzBGNEFhQUJBZw%3D%3D"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["likes"], row["text"])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/youtube/comments/replies/list');
url.searchParams.set('id', "Eg0SC2RRdzR3OVdnWGNRGAYygwEaUBIaVWd6S1lrc3FlUTVnQTN0MGcwRjRBYUFCQWciAggAKhhVQ3VBWEZrZ3N3MUw3eGFDZm5kNUpKT3cyC2RRdzR3OVdnWGNRQAFICoIBAggBQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3pLWWtzcWVRNWdBM3QwZzBGNEFhQUJBZw%3D%3D");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.likes, row.text);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "youtube.comments.replies.list",
    "id": "Eg0SC2RRdzR3OVdnWGNRGAYygwEaUBIaVWd6S1lrc3FlUTVnQTN0MGcwRjRBYUFCQWciAggAKhhVQ3VBWEZrZ3N3MUw3eGFDZm5kNUpKT3cyC2RRdzR3OVdnWGNRQAFICoIBAggBQi9jb21tZW50LXJlcGxpZXMtaXRlbS1VZ3pLWWtzcWVRNWdBM3QwZzBGNEFhQUJBZw%3D%3D"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use YouTube comment replies, read the first two pages and sum up what people praise and complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "7302000000000000001",
        "post_id": "7301234567890123456",
        "parent_id": null,
        "text": "Which tent is that? Looks tiny packed.",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "UCa1b2c3d4e5f6g7h8i9j0kL",
          "username": "@trailkit",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 412000,
          "verified": true
        },
        "likes": 214,
        "replies": 9,
        "ip_location": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "youtube.comments.replies.list",
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

### How much does the YouTube comment replies API cost?

One call costs $0.002 and returns one page of about 10 comments. Collecting 1,000 comments takes about 100 calls, $0.20 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a YouTube account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from YouTube; nothing is fetched with your own YouTube account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if YouTube does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More YouTube endpoints

- [YouTube video search](https://okdata.online/apis/youtube/videos/search/): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/): $0.002 per call
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/): $0.002 per call · about 20 comments per page
- [YouTube video transcript](https://okdata.online/apis/youtube/videos/transcript/get/): $0.004 per call
- [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/): $0.002 per call · about 10 posts per page
- [YouTube post detail](https://okdata.online/apis/youtube/posts/get/): $0.002 per call
- [YouTube channel profile](https://okdata.online/apis/youtube/channels/get/): $0.002 per call
- [YouTube channel search](https://okdata.online/apis/youtube/channels/search/): $0.004 per call · about 20 accounts per page
- [YouTube channel videos](https://okdata.online/apis/youtube/channels/videos/list/): $0.002 per call · about 30 videos per page
