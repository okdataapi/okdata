# Bluesky post API

> One post by its at:// URI or bsky.app link: text, language, pictures or video, hashtags, author, time, and likes, replies, reposts, quotes and saves. ext names the post it replies to or quotes, and any link card.

Canonical page: https://okdata.online/apis/bluesky/posts/get/

- **Endpoint**: `GET /v1/bluesky/posts/get`
- **ID**: `bluesky.posts.get`
- **Price**: $0.001 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Content research, Competitor monitoring

## Price

One call costs $0.001 and returns one post. 1,000 lookups cost $1.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

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

Each item is a [Post](https://okdata.online/docs/objects/post/).

| Field | Type | Description |
|---|---|---|
| `id` | string | Post ID on the platform. |
| `url` | string | Link to the post. |
| `type` | string | What kind of post it is. |
| `title` | string \| null | Title, where the platform has one (videos, notes, articles). |
| `text` | string | Caption, body or description as plain text; articles come as Markdown. |
| `lang` | string \| null | Language code, as reported or detected. |
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the platform gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/bluesky/posts/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/posts/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/bluesky/posts/get');
url.searchParams.set('id', "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "bluesky.posts.get",
    "id": "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3n22yg6lg2k2f"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Bluesky post and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "at://did:plc:trailkitexample2qz7xk4mb/app.bsky.feed.post/3m2abcd7xyz2k",
      "url": "https://bsky.app/profile/trailkit.bsky.social/post/3m2abcd7xyz2k",
      "type": "image",
      "title": null,
      "text": "Two nights, one backpack. Full list below. #camping",
      "lang": "en",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "did:plc:trailkitexample2qz7xk4mb",
        "username": "trailkit.bsky.social",
        "name": "Trail Kit",
        "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
        "followers": null,
        "verified": false
      },
      "metrics": {
        "views": null,
        "likes": 48200,
        "comments": 1312,
        "shares": null,
        "favorites": 9650,
        "reposts": 640
      },
      "images": [
        "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiexample@jpeg"
      ],
      "hashtags": [
        "camping"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "bluesky.posts.get",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
    },
    "unavailable": {
      "metrics.views": "platform",
      "metrics.shares": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## Errors

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the platform (not found, a failure or a timeout on the platform's side) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the Bluesky post API cost?

One call costs $0.001 and returns one post. 1,000 lookups cost $1.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Bluesky account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Bluesky; nothing is fetched with your own Bluesky account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Bluesky does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Bluesky endpoints

- [Bluesky profile](https://okdata.online/apis/bluesky/users/get/): $0.001 per call
- [Bluesky account search](https://okdata.online/apis/bluesky/users/search/): $0.001 per call · about 25 accounts per page
- [Bluesky account posts](https://okdata.online/apis/bluesky/users/posts/list/): $0.001 per call · about 30 posts per page
- [Bluesky post replies](https://okdata.online/apis/bluesky/posts/comments/list/): $0.001 per call · about 200 comments per page
