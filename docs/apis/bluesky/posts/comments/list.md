# Bluesky post replies API

> The direct replies to a post in Bluesky's order, all in one answer (up to about 200, no further page): text, author, likes, reply count and time. A reply is a post too: pass its id here for the replies under it.

Canonical page: https://okdata.online/apis/bluesky/posts/comments/list/

- **Endpoint**: `GET /v1/bluesky/posts/comments/list`
- **ID**: `bluesky.posts.comments.list`
- **Price**: $0.001 per call · about 200 comments per page
- **Returns**: a page of about 200 comments (`data.items`, Comment objects)
- **Status**: preview
- **Good for**: Word of mouth

## Price

One call costs $0.001 and returns one page of about 200 comments. Collecting 1,000 comments takes about 5 calls, $0.005 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The post's at:// URI, as the id of any Bluesky post in our answers (at://<DID>/app.bsky.feed.post/<key>). Give id or url. (e.g. `at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f`) |
| `url` | string | no |  | The bsky.app post link (/profile/<handle>/post/<key>). (e.g. `https://bsky.app/profile/bsky.app/post/3n22yg6lg2k2f`) |
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
curl -G "https://api.okdata.online/v1/bluesky/posts/comments/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/posts/comments/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"},
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
const url = new URL('https://api.okdata.online/v1/bluesky/posts/comments/list');
url.searchParams.set('id', "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f");

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
    "capability": "bluesky.posts.comments.list",
    "id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bluesky post replies, read the first two pages and sum up what people praise and complain about.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "at://did:plc:hikerexample5mq3zt7kw2rdx/app.bsky.feed.post/3m2abcf4lmn2p",
        "post_id": "at://did:plc:trailkitexample2qz7xk4mb/app.bsky.feed.post/3m2abcd7xyz2k",
        "parent_id": null,
        "text": "Which tent is that? Looks tiny packed.",
        "published_at": "2026-11-02T11:04:00Z",
        "author": {
          "id": "did:plc:trailkitexample2qz7xk4mb",
          "username": "trailkit.bsky.social",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
          "followers": null,
          "verified": false
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
    "capability": "bluesky.posts.comments.list",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Bluesky post replies API cost?

One call costs $0.001 and returns one page of about 200 comments. Collecting 1,000 comments takes about 5 calls, $0.005 in total. Each page is a separate call. A call that reached the data source is charged even when it comes back empty, not found or failed; calls stopped before reaching a source are free.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.001.

### Do I need a Bluesky account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bluesky; nothing is fetched with your own Bluesky account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if Bluesky does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bluesky endpoints

- [Bluesky profile](https://okdata.online/apis/bluesky/users/get/): $0.001 per call
- [Bluesky account search](https://okdata.online/apis/bluesky/users/search/): $0.001 per call · about 25 accounts per page
- [Bluesky account posts](https://okdata.online/apis/bluesky/users/posts/list/): $0.001 per call · about 30 posts per page
- [Bluesky post](https://okdata.online/apis/bluesky/posts/get/): $0.001 per call
