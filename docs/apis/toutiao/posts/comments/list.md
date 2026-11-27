# Toutiao comments API

> Top-level comments on a Toutiao article or video, 20 a page, hottest first: text, commenter, likes, reply count, time posted and the commenter's province.

Canonical page: https://okdata.online/apis/toutiao/posts/comments/list/

- **Endpoint**: `GET /v1/toutiao/posts/comments/list`
- **ID**: `toutiao.posts.comments.list`
- **Price**: $0.002 per call · about 20 comments per page
- **Returns**: a page of about 20 comments (`data.items`, Comment objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

One call costs $0.002 and returns one page of about 20 comments. Collecting 1,000 comments takes about 50 calls, $0.10 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The article or video ID: the digits after /article/ or /video/ in its toutiao.com link. Give id or url. (e.g. `7450114952884503059`) |
| `url` | string | no |  | The article's or video's toutiao.com link; the ID is read from it. Short m.toutiao.com/is/ share links are not read. (e.g. `https://www.toutiao.com/article/7450114952884503059/`) |
| `cursor` | string | no |  | Opaque cursor from page.next_cursor of the previous call. Each page is a separate call. |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
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
curl -G "https://api.okdata.online/v1/toutiao/posts/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=7450114952884503059'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/toutiao/posts/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "7450114952884503059"},
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
const url = new URL('https://api.okdata.online/v1/toutiao/posts/comments/list');
url.searchParams.set('id', "7450114952884503059");

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
    "capability": "toutiao.posts.comments.list",
    "id": "7450114952884503059"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Toutiao comments, read the first two pages and sum up what people praise and complain about.

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
        "text": "这个帐篷收起来好小，求链接",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "3876512094",
          "username": null,
          "name": "轻装徒步",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 182300,
          "verified": true
        },
        "likes": 214,
        "replies": 9,
        "ip_location": "浙江"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "toutiao.posts.comments.list",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the platform (not found, a failure or a timeout on the platform's side) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Toutiao comments API cost?

One call costs $0.002 and returns one page of about 20 comments. Collecting 1,000 comments takes about 50 calls, $0.10 in total. Each page is a separate call. A call that reached the platform is charged even when it comes back empty, not found or failed; calls stopped before reaching the platform are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.002.

### Do I need a Toutiao account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Toutiao; nothing is fetched with your own Toutiao account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Toutiao does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Toutiao endpoints

- [Toutiao article](https://okdata.online/apis/toutiao/articles/get/): $0.002 per call
- [Toutiao video](https://okdata.online/apis/toutiao/videos/get/): $0.002 per call
- [Toutiao account profile](https://okdata.online/apis/toutiao/users/get/): $0.002 per call
- [Toutiao hot board](https://okdata.online/apis/toutiao/trends/list/): $0.002 per call · about 50 board entries per page
