# X community profile API

> A community by ID: name, description, member count, when it was created, and under ext its moderators, how people join and its topic.

Canonical page: https://okdata.online/apis/x/communities/get/

- **Endpoint**: `GET /v1/x/communities/get`
- **ID**: `x.communities.get`
- **Price**: $0.0004 per call
- **Returns**: one Community object (`data.item`)
- **Status**: preview
- **Good for**: Content research

## Price

One call costs $0.0004 and returns one community. 1,000 lookups cost $0.40. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | The community ID (the digits after /i/communities/ in its link). (e.g. `1493446837214187523`) |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [Community](https://okdata.online/docs/objects/community/).

| Field | Type | Description |
|---|---|---|
| `id` | string | ID; pass it as is to the endpoints that take one. |
| `name` | string | Name of the community. |
| `url` | string \| null | Link to the community. |
| `description` | string \| null | What the community says it is about. |
| `avatar_url` | string \| null | Icon of the community. |
| `nsfw` | boolean \| null | Whether it is marked as adult content. |
| `created_at` | string \| null | When the community was created. |
| `metrics` | CommunityMetrics | Counts at fetch time. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/x/communities/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=1493446837214187523'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/x/communities/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "1493446837214187523"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/x/communities/get');
url.searchParams.set('id', "1493446837214187523");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "x.communities.get",
    "id": "1493446837214187523"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use X community profile and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": null,
      "name": null,
      "url": null,
      "description": null,
      "avatar_url": null,
      "nsfw": null,
      "created_at": null,
      "metrics": {
        "members": null
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "x.communities.get",
    "billing": {
      "amount": "0.0004",
      "currency": "USD",
      "balance_after": "9.9996"
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

### How much does the X community profile API cost?

One call costs $0.0004 and returns one community. 1,000 lookups cost $0.40. Failed calls are not charged.

### Do I need a X (Twitter) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from X (Twitter); nothing is fetched with your own X (Twitter) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if X (Twitter) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More X (Twitter) endpoints

- [X post detail](https://okdata.online/apis/x/posts/get/): $0.0003 per call
- [X post search](https://okdata.online/apis/x/posts/search/): $0.002 per call · about 20 posts per page
- [X account profile](https://okdata.online/apis/x/users/get/): $0.0004 per account · at most $0.04 per call
- [X account posts](https://okdata.online/apis/x/users/posts/list/): $0.002 per call · about 20 posts per page
- [X trending topics](https://okdata.online/apis/x/trends/list/): $0.009 per call · about 30 board entries per page
- [X post replies](https://okdata.online/apis/x/posts/replies/list/): $0.002 per call · about 35 posts per page
- [X post quotes](https://okdata.online/apis/x/posts/quotes/list/): $0.0003 per post · at most $0.006 per call
- [X post retweeters](https://okdata.online/apis/x/posts/retweeters/list/): $0.002 per call · about 100 accounts per page
- [X article](https://okdata.online/apis/x/posts/article/get/): $0.002 per call
- [X thread](https://okdata.online/apis/x/threads/posts/list/): $0.0003 per post · at most $0.015 per call
- [X account search](https://okdata.online/apis/x/users/search/): $0.0004 per account · at most $0.008 per call
- [X account followers](https://okdata.online/apis/x/users/followers/list/): $0.0001 per account · at most $0.02 per call
- [X account following](https://okdata.online/apis/x/users/following/list/): $0.0001 per account · at most $0.02 per call
- [X account mentions](https://okdata.online/apis/x/users/mentions/list/): $0.0003 per post · at most $0.006 per call
- [X list posts](https://okdata.online/apis/x/lists/posts/list/): $0.002 per call · about 100 posts per page
- [X list members](https://okdata.online/apis/x/lists/members/list/): $0.0004 per account · at most $0.008 per call
- [X list followers](https://okdata.online/apis/x/lists/followers/list/): $0.0004 per account · at most $0.008 per call
- [X community posts](https://okdata.online/apis/x/communities/posts/list/): $0.0003 per post · at most $0.006 per call
- [X community members](https://okdata.online/apis/x/communities/members/list/): $0.0004 per account · at most $0.008 per call
