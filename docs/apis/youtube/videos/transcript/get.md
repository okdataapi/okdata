# YouTube video transcript API

> The transcript of a video with timestamps, in the original or a chosen language.

Canonical page: https://okdata.online/apis/youtube/videos/transcript/get/

- **Endpoint**: `GET /v1/youtube/videos/transcript/get`
- **ID**: `youtube.videos.transcript.get`
- **Price**: $0.004 per call
- **Returns**: one Transcript object (`data.item`)
- **Status**: preview
- **Good for**: Transcripts, Content research

## Price

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The video ID. (e.g. `dQw4w9WgXcQ`) |
| `lang` | string | no |  | Preferred transcript language. The result's lang is the track actually returned. (e.g. `en`) |
| `view` | string: brief / compact / standard / full | no | `standard` | How much of each object comes back. brief: IDs, title, the first 100 characters of the text, link, time and the main counts, for scanning a list (then get what you need by ID). compact leaves out empty fields and cuts long text at 500 characters. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

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
curl -G "https://api.okdata.online/v1/youtube/videos/transcript/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=dQw4w9WgXcQ'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/youtube/videos/transcript/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "dQw4w9WgXcQ"},
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
const url = new URL('https://api.okdata.online/v1/youtube/videos/transcript/get');
url.searchParams.set('id', "dQw4w9WgXcQ");

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
    "capability": "youtube.videos.transcript.get",
    "id": "dQw4w9WgXcQ"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use YouTube video transcript and summarise what the video says in five bullet points.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "video_id": "Zx3kP9vQm2A",
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
    "capability": "youtube.videos.transcript.get",
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

Errors share one shape: code, request_id, message and message_zh (a fixed sentence per code), charged, retry, retry_after_seconds, param and docs_url, with the specifics in problems. An error from a call that reached the data source (not found, a failure or a timeout of the source) is charged once at this endpoint's price, with charged: true and amount; errors before that, such as bad parameters, are not charged. Only settlement_unknown is unknown until looked up. The full table: https://okdata.online/docs/errors/

## Questions

### How much does the YouTube video transcript API cost?

One call costs $0.004 and returns one transcript. 1,000 lookups cost $4.00. A lookup that reached the data source is charged even when it is not found or the source fails; calls stopped before reaching a source are free.

### Do I need a YouTube account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from YouTube; nothing is fetched with your own YouTube account.

### Am I charged when a call fails?

Yes, once, when the call reached the data source: an empty answer, a not_found, a failure or a timeout of the source costs one call (one item for per-item endpoints), and the error says charged: true with amount. Calls refused before reaching a source, such as bad parameters or a low balance, cost nothing.

### What if YouTube does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More YouTube endpoints

- [YouTube video search](https://okdata.online/apis/youtube/videos/search/): $0.004 per call · about 20 videos per page
- [YouTube video detail](https://okdata.online/apis/youtube/videos/get/): $0.002 per call
- [YouTube video comments](https://okdata.online/apis/youtube/videos/comments/list/): $0.002 per call · about 20 comments per page
- [YouTube comment replies](https://okdata.online/apis/youtube/comments/replies/list/): $0.002 per call · about 10 comments per page
- [YouTube channel posts](https://okdata.online/apis/youtube/channels/posts/list/): $0.002 per call · about 10 posts per page
- [YouTube post detail](https://okdata.online/apis/youtube/posts/get/): $0.002 per call
- [YouTube channel profile](https://okdata.online/apis/youtube/channels/get/): $0.002 per call
- [YouTube channel search](https://okdata.online/apis/youtube/channels/search/): $0.004 per call · about 20 accounts per page
- [YouTube channel videos](https://okdata.online/apis/youtube/channels/videos/list/): $0.002 per call · about 30 videos per page
