# Zhihu article detail API

> One column article by ID or link: title, full text, author, upvotes, comment count and the topics it is filed under (as hashtags).

Canonical page: https://okdata.online/apis/zhihu/articles/get/

- **Endpoint**: `GET /v1/zhihu/articles/get`
- **ID**: `zhihu.articles.get`
- **Price**: $0.002 per call
- **Returns**: one Post object (`data.item`)
- **Status**: preview
- **Good for**: Content research, Competitor monitoring

## Price

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The article ID (digits): the number after zhuanlan.zhihu.com/p/. Give id or url. (e.g. `521711978`) |
| `url` | string | no |  | The article link: zhuanlan.zhihu.com/p/…. (e.g. `https://zhuanlan.zhihu.com/p/521711978`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
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
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the source gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics, youtube.channels.videos.list with type=short), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/zhihu/articles/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=521711978'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/zhihu/articles/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "521711978"},
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
const url = new URL('https://api.okdata.online/v1/zhihu/articles/get');
url.searchParams.set('id', "521711978");

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
    "capability": "zhihu.articles.get",
    "id": "521711978"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Zhihu article detail and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "3283784039",
      "url": "https://www.zhihu.com/question/568657112/answer/3283784039",
      "type": "text",
      "title": "预算 3000 元左右，有哪些不错的露营装备推荐？",
      "text": "先说结论：帐篷和睡袋别省，其他都可以慢慢换。",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "b32409944256dfd62a963434fcda6aa9",
        "username": "qingzhuang-tubu",
        "name": "轻装徒步",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": 15700,
        "verified": true
      },
      "metrics": {
        "views": null,
        "likes": 48200,
        "comments": 1312,
        "shares": null,
        "favorites": 9650,
        "reposts": null
      },
      "images": null,
      "hashtags": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "zhihu.articles.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.views": "platform",
      "metrics.shares": "platform",
      "metrics.reposts": "platform"
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

### How much does the Zhihu article detail API cost?

One call costs $0.002 and returns one post. 1,000 lookups cost $2.00. Failed calls are not charged.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Zhihu account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Zhihu; nothing is fetched with your own Zhihu account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Zhihu does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Zhihu endpoints

- [Zhihu search](https://okdata.online/apis/zhihu/posts/search/): $0.002 per call · about 20 posts per page
- [Zhihu question answers](https://okdata.online/apis/zhihu/questions/answers/list/): $0.002 per call · about 20 posts per page
- [Zhihu question detail](https://okdata.online/apis/zhihu/questions/get/): $0.002 per call
- [Zhihu answer detail](https://okdata.online/apis/zhihu/answers/get/): $0.002 per call
- [Zhihu answer comments](https://okdata.online/apis/zhihu/answers/comments/list/): $0.002 per call · about 10 comments per page
- [Zhihu comment replies](https://okdata.online/apis/zhihu/comments/replies/list/): $0.002 per call · about 20 comments per page
- [Zhihu column articles](https://okdata.online/apis/zhihu/columns/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu pin detail](https://okdata.online/apis/zhihu/pins/get/): $0.002 per call
- [Zhihu user profile](https://okdata.online/apis/zhihu/users/get/): $0.002 per call
- [Zhihu user search](https://okdata.online/apis/zhihu/users/search/): $0.002 per call · about 20 accounts per page
- [Zhihu user followers](https://okdata.online/apis/zhihu/users/followers/list/): $0.002 per call · about 20 accounts per page
- [Zhihu user answers](https://okdata.online/apis/zhihu/users/answers/list/): $0.002 per call · about 20 posts per page
- [Zhihu user articles](https://okdata.online/apis/zhihu/users/articles/list/): $0.002 per call · about 20 articles per page
- [Zhihu user pins](https://okdata.online/apis/zhihu/users/pins/list/): $0.002 per call · about 20 posts per page
