# Instagram reel transcript API

> What is said in a reel or video post, by shortcode or link, with timestamps. Videos up to two minutes long.

Canonical page: https://okdata.online/apis/instagram/posts/transcript/get/

- **Endpoint**: `GET /v1/instagram/posts/transcript/get`
- **ID**: `instagram.posts.transcript.get`
- **Price**: $0.004 per call
- **Returns**: one Transcript object (`data.item`)
- **Status**: preview
- **Good for**: Transcripts, Content research

## Price

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | no |  | The shortcode: what follows /p/ or /reel/ in the link. Give id or url. (e.g. `DeCPVhERA8e`) |
| `url` | string | no |  | A share link or page URL; the ID is read from it. (e.g. `https://www.instagram.com/p/DeCPVhERA8e/`) |
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
curl -G "https://api.okdata.online/v1/instagram/posts/transcript/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=DeCPVhERA8e'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/instagram/posts/transcript/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "DeCPVhERA8e"},
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
const url = new URL('https://api.okdata.online/v1/instagram/posts/transcript/get');
url.searchParams.set('id', "DeCPVhERA8e");

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
    "capability": "instagram.posts.transcript.get",
    "id": "DeCPVhERA8e"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Instagram reel transcript and summarise what the video says in five bullet points.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "video_id": "DeCPVhERA8e",
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
    "capability": "instagram.posts.transcript.get",
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

### How much does the Instagram reel transcript API cost?

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the platform is charged even when it is not found or the platform fails; calls stopped before reaching the platform are free.

### Can I pass a share link instead of an ID?

Yes. Put the link in url and okdata reads the ID from it. Short share links work too.

### Do I need a Instagram account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Instagram; nothing is fetched with your own Instagram account.

### Am I charged when a call fails?

Yes, once, when the call reached the platform: an empty answer, a not_found, a failure or a timeout on the platform's side costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching the platform, such as bad parameters or a low balance, cost nothing.

### What if Instagram does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Instagram endpoints

- [Instagram account profile](https://okdata.online/apis/instagram/users/get/): $0.004 per call
- [Instagram account posts](https://okdata.online/apis/instagram/users/posts/list/): $0.004 per call · about 12 posts per page
- [Instagram post detail](https://okdata.online/apis/instagram/posts/get/): $0.004 per call
- [Instagram post comments](https://okdata.online/apis/instagram/posts/comments/list/): $0.004 per call · about 15 comments per page
- [Instagram comment replies](https://okdata.online/apis/instagram/comments/replies/list/): $0.004 per call · about 15 comments per page
- [Instagram hashtag posts](https://okdata.online/apis/instagram/hashtags/posts/list/): $0.004 per call · about 10 posts per page
- [Instagram account search](https://okdata.online/apis/instagram/users/search/): $0.002 per call · about 20 accounts per page
