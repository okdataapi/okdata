# Reddit video transcript API

> The captions of a Reddit-hosted video post, with timestamps. A post without captions comes back not_found and is charged like any lookup.

Canonical page: https://okdata.online/apis/reddit/posts/transcript/get/

- **Endpoint**: `GET /v1/reddit/posts/transcript/get`
- **ID**: `reddit.posts.transcript.get`
- **Price**: $0.004 per call
- **Returns**: one Transcript object (`data.item`)
- **Status**: preview
- **Good for**: Transcripts, Content research

## Price

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The post ID, with or without the t3_ prefix. Give id or url. (e.g. `t3_1nnrvkr`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.reddit.com/r/nasa/comments/1nnrvkr/`) |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

Give id or url; one of the two is enough. 
cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Transcript](https://okdata.online/docs/objects/transcript/).

| Field | Type | Description |
|---|---|---|
| `video_id` | string | ID of the video. |
| `lang` | string | Language of this transcript. |
| `segments` | Segment[] | Timed segments in order. |
| `text` | string | All segments joined as plain text. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/reddit/posts/transcript/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=t3_1nnrvkr'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/reddit/posts/transcript/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "t3_1nnrvkr"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["text"][:200])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/reddit/posts/transcript/get');
url.searchParams.set('id', "t3_1nnrvkr");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.text.slice(0, 200));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "reddit.posts.transcript.get",
    "id": "t3_1nnrvkr"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Reddit video transcript and summarise what the video says in five bullet points.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "video_id": "dQw4w9WgXcQ",
      "lang": "en",
      "segments": [
        {
          "start": 0,
          "end": 4.2,
          "text": "Here is what I pack for a two-night trip."
        }
      ],
      "text": "Here is what I pack for a two-night trip."
    }
  },
  "warnings": [],
  "meta": {
    "capability": "reddit.posts.transcript.get",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

### How much does the Reddit video transcript API cost?

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Reddit account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Reddit; nothing is fetched with your own Reddit account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Reddit does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Reddit endpoints

- [Reddit post search](https://okdata.online/apis/reddit/posts/search/): $0.004 per call · about 25 posts per page
- [Reddit post detail](https://okdata.online/apis/reddit/posts/get/): $0.002 per call
- [Reddit post comments](https://okdata.online/apis/reddit/posts/comments/list/): $0.002 per call · about 10 comments per page
- [Reddit Popular feed](https://okdata.online/apis/reddit/popular/posts/list/): $0.002 per call · about 10 posts per page
- [Reddit community posts](https://okdata.online/apis/reddit/subreddits/posts/list/): $0.004 per call · about 25 posts per page
- [Reddit community profile](https://okdata.online/apis/reddit/subreddits/get/): $0.002 per call
- [Reddit trending searches](https://okdata.online/apis/reddit/trends/list/): $0.002 per call · about 6 board entries per page
- [Reddit user profile](https://okdata.online/apis/reddit/users/get/): $0.002 per call
- [Reddit user posts](https://okdata.online/apis/reddit/users/posts/list/): $0.002 per call · about 25 posts per page
- [Reddit user active communities](https://okdata.online/apis/reddit/users/subreddits/list/): $0.002 per call · about 30 accounts per page
