# Official Account article history API

> An Official Account's published articles, newest first, without a QR login: the articles tab of its page by default, or its videos or pictures tab.

Canonical page: https://okdata.online/apis/wechat_mp/accounts/articles/list/

- **Endpoint**: `GET /v1/wechat_mp/accounts/articles/list`
- **ID**: `wechat_mp.accounts.articles.list`
- **Price**: $0.02 per call · about 10 articles per page
- **Returns**: a page of about 10 articles (`data.items`, Post objects)
- **Status**: preview
- **Good for**: Competitor monitoring, Content research

## Price

One call costs $0.02 and returns one page of about 10 articles. Collecting 1,000 articles takes about 100 calls, $2.00 in total. Each page is a separate call; failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The account original ID (gh_…) from accounts.search, or its WeChat ID. (e.g. `gh_363b924965e9`) |
| `tab` | string: articles / videos / images | no | `articles` | Which tab of the account's page: articles (the default), videos or pictures. |
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
| `published_at` | string \| null | When it was published, ISO 8601 in UTC; null only where the platform gives no time (wechat_mp.articles.metrics, wechat_channels.videos.metrics), then listed in meta.unavailable. |
| `author` | AccountRef | Who posted it. |
| `metrics` | Metrics | Counts at fetch time; a count the platform hides is null. |
| `images` | string[] \| null | Image URLs for image posts and notes. |
| `hashtags` | string[] \| null | Hashtags or topics, without the # sign. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_mp/accounts/articles/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=gh_363b924965e9'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/accounts/articles/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "gh_363b924965e9"},
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
const url = new URL('https://api.okdata.online/v1/wechat_mp/accounts/articles/list');
url.searchParams.set('id', "gh_363b924965e9");

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
    "capability": "wechat_mp.accounts.articles.list",
    "id": "gh_363b924965e9"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Official Account article history and list the five posts with the most likes, with links.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "MzA5NTI3MjIwMA==_2650981234_1",
        "url": "https://mp.weixin.qq.com/s/k3Fq9xYbT0aP2mWnR8sVdA",
        "type": "article",
        "title": "一家 12 人的出海团队，怎么做第一年的增长",
        "text": "## 先说结论\n\n第一年最值钱的不是投放，而是……",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "MzA5NTI3MjIwMA==",
          "username": "chuhai_growth",
          "name": "出海增长笔记",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": null,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": null,
          "shares": null,
          "favorites": null,
          "reposts": null
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
    "capability": "wechat_mp.accounts.articles.list",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
    },
    "unavailable": {
      "metrics.comments": "platform",
      "metrics.shares": "platform",
      "metrics.favorites": "platform",
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

### How much does the Official Account article history API cost?

One call costs $0.02 and returns one page of about 10 articles. Collecting 1,000 articles takes about 100 calls, $2.00 in total. Each page is a separate call; failed calls are not charged.

### How do I get the next page?

Pass page.next_cursor from the response back as the cursor parameter. When page.has_more is false there is nothing left. Every page is its own call at $0.02.

### Do I need a WeChat Official Accounts account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from WeChat Official Accounts; nothing is fetched with your own WeChat Official Accounts account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if WeChat Official Accounts does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More WeChat Official Accounts endpoints

- [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/): $0.058 per account · at most $0.58 per call
- [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/): $0.02 per call
- [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/): $0.02 per call
- [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/): $0.02 per call · about 20 comments per page
- [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/): $0.02 per call
- [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/): $0.02 per call · about 3 comments per page
- [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/): $0.15 per call
