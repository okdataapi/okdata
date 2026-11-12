# Xiaohongshu PGY creator note metrics API

> How a creator’s everyday or sponsored notes did over the last 30 or 90 days, by PGY creator ID: notes and video notes, median impressions, reads, interactions and follows, engagement and completion rates, the share of notes past 100 and 1,000 likes, the standing among comparable creators, and where impressions and reads came from. The full view adds each note’s figures and long-term reads of notes from about half a year back.

Canonical page: https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/

- **Endpoint**: `GET /v1/xiaohongshu/pgy/creators/metrics`
- **ID**: `xiaohongshu.pgy.creators.metrics`
- **Price**: $0.04 per call
- **Returns**: one PgyCreatorMetrics object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.04 and returns one pgy_creator_metrics. 1,000 lookups cost $40.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | PGY creator ID (24 hex characters, the same as the Xiaohongshu user ID), from the PGY creator search. (e.g. `591662306a6a6967b63e7f16`) |
| `window` | string: 30d / 90d | no | `30d` | The period: the last 30 or 90 days. |
| `tab` | string: everyday / sponsored | no | `everyday` | Whose figures: the creator’s everyday notes (the default) or sponsored notes, as the two tabs of the PGY creator page. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [PgyCreatorMetrics](https://okdata.online/docs/objects/pgy_creator_metrics/).

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `notes` | integer \| null | Notes in the period. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_likes` | integer \| null | Median likes of a note. |
| `median_favorites` | integer \| null | Median saves of a note. |
| `median_comments` | integer \| null | Median comments of a note. |
| `median_shares` | integer \| null | Median shares of a note. |
| `engagement_rate` | number \| null | Interactions per read, 0 to 1. |
| `video_completion_rate` | number \| null | Completion rate of video notes, 0 to 1. |
| `image_3s_read_rate` | number \| null | Share of image-note reads that lasted 3 seconds, 0 to 1. |
| `hundred_like_share` | number \| null | Share of notes with 100 likes or more, 0 to 1. |
| `thousand_like_share` | number \| null | Share of notes with 1,000 likes or more, 0 to 1. |
| `impressions_percentile` | number \| null | Share of comparable creators this one beats on median impressions, 0 to 1. |
| `reads_percentile` | number \| null | Share of comparable creators this one beats on median reads, 0 to 1. |
| `engagements_percentile` | number \| null | Share of comparable creators this one beats on median interactions, 0 to 1. |
| `video_notes` | integer \| null | Video notes in the period (included in notes). |
| `video_completion_percentile` | number \| null | Share of comparable creators this one beats on video completion rate, 0 to 1. |
| `median_follows` | integer \| null | Median new followers a note brought. |
| `traffic_sources` | PgyTrafficSources \| null | Where the notes got their impressions and reads; each set adds up to 1. |
| `long_term` | PgyLongTerm \| null | Long-term performance of notes from about half a year back: recent and long-term reads, standing and sources. |
| `note_list` | PgyNoteFigures[] \| null | The period's notes one by one, oldest first, 15 at most; null when there is none. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/metrics" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=591662306a6a6967b63e7f16'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/metrics",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "591662306a6a6967b63e7f16"},
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
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/metrics');
url.searchParams.set('id', "591662306a6a6967b63e7f16");

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
    "capability": "xiaohongshu.pgy.creators.metrics",
    "id": "591662306a6a6967b63e7f16"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Xiaohongshu PGY creator note metrics and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "creator_id": null,
      "notes": null,
      "median_impressions": null,
      "median_reads": null,
      "median_engagements": null,
      "median_likes": null,
      "median_favorites": null,
      "median_comments": null,
      "median_shares": null,
      "engagement_rate": null,
      "video_completion_rate": null,
      "image_3s_read_rate": null,
      "hundred_like_share": null,
      "thousand_like_share": null,
      "impressions_percentile": null,
      "reads_percentile": null,
      "engagements_percentile": null,
      "video_notes": null,
      "video_completion_percentile": null,
      "median_follows": null,
      "traffic_sources": {
        "impressions": {
          "homefeed": null,
          "search": null,
          "follow": null,
          "detail": null,
          "nearby": null,
          "other": null
        },
        "reads": {
          "homefeed": null,
          "search": null,
          "follow": null,
          "detail": null,
          "nearby": null,
          "other": null
        }
      },
      "long_term": {
        "published_from": null,
        "published_to": null,
        "notes": null,
        "recent_reads": null,
        "recent_reads_percentile": null,
        "long_term_reads": null,
        "long_term_reads_percentile": null,
        "recent_sources": {
          "homefeed": null,
          "search": null,
          "profile": null,
          "follow": null,
          "other": null
        },
        "long_term_sources": {
          "homefeed": null,
          "search": null,
          "profile": null,
          "follow": null,
          "other": null
        }
      },
      "note_list": [
        {
          "id": null,
          "title": null,
          "type": null,
          "published_at": null,
          "cover_url": null,
          "impressions": null,
          "reads": null,
          "engagements": null,
          "likes": null,
          "favorites": null,
          "impressions_vs_median": null,
          "reads_vs_median": null,
          "engagements_vs_median": null,
          "likes_vs_median": null,
          "favorites_vs_median": null
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.metrics",
    "billing": {
      "amount": "0.04",
      "currency": "USD",
      "balance_after": "9.96"
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

### How much does the Xiaohongshu PGY creator note metrics API cost?

One call costs $0.04 and returns one pgy_creator_metrics. 1,000 lookups cost $40.00. Failed calls are not charged.

### Do I need a Xiaohongshu (RedNote) account, cookies or a QR login?

No. You send only your okdata API key. The data is public data from Xiaohongshu (RedNote); nothing is fetched with your own Xiaohongshu (RedNote) account.

### Am I charged when a call fails?

No. Every error response says charged: false, except a timeout, which says charged: null until the outcome is known. Resend with the same Idempotency-Key and you are never charged twice.

### What if Xiaohongshu (RedNote) does not show a field?

The field is null, and meta.unavailable names it with the reason: platform (the platform never shows it) or capability (we cannot fetch it yet).

## More Xiaohongshu (RedNote) endpoints

- [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/): $0.02 per call · about 20 notes per page
- [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/): $0.02 per call
- [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/): $0.02 per call · about 10 comments per page
- [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/): $0.02 per call
- [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/): $0.02 per call · about 20 notes per page
- [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/): $0.02 per call · about 20 board entries per page
- [Xiaohongshu PGY creator search](https://okdata.online/apis/xiaohongshu/pgy/creators/search/): $0.04 per call · about 20 creators per page
- [Xiaohongshu PGY creator detail](https://okdata.online/apis/xiaohongshu/pgy/creators/get/): $0.04 per call
- [Xiaohongshu shop product search](https://okdata.online/apis/xiaohongshu/shop/products/search/): $0.02 per call · about 20 products per page
- [Xiaohongshu shop product reviews](https://okdata.online/apis/xiaohongshu/shop/products/reviews/list/): $0.02 per call · about 12 reviews per page
- [Xiaohongshu image search](https://okdata.online/apis/xiaohongshu/images/search/): $0.02 per call · about 20 posts per page
- [Xiaohongshu comment replies](https://okdata.online/apis/xiaohongshu/comments/replies/list/): $0.02 per call · about 5 comments per page
- [Xiaohongshu topic notes](https://okdata.online/apis/xiaohongshu/topics/notes/list/): $0.02 per call · about 10 notes per page
- [Xiaohongshu topic detail](https://okdata.online/apis/xiaohongshu/topics/get/): $0.02 per call
- [Xiaohongshu account search](https://okdata.online/apis/xiaohongshu/users/search/): $0.02 per call · about 20 accounts per page
- [Xiaohongshu shop product detail](https://okdata.online/apis/xiaohongshu/shop/products/get/): $0.02 per call
- [Xiaohongshu search suggestions](https://okdata.online/apis/xiaohongshu/keywords/related/): $0.02 per call · about 10 results per page
- [Xiaohongshu video note with its video](https://okdata.online/apis/xiaohongshu/videos/get/): $0.02 per call
- [Xiaohongshu PGY keyword search index](https://okdata.online/apis/xiaohongshu/pgy/keywords/history/): $0.04 per call
- [Xiaohongshu PGY related keywords](https://okdata.online/apis/xiaohongshu/pgy/keywords/related/): $0.04 per call · about 98 results per page
- [Xiaohongshu PGY creator audience](https://okdata.online/apis/xiaohongshu/pgy/creators/audience/get/): $0.04 per call
- [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/): $0.04 per call · about 8 notes per page
- [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/): $0.04 per call
- [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/): $0.04 per call · about 4 creators per page
- [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/): $0.04 per call · about 34 notes per page
- [Xiaohongshu PGY creator costs and summary](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/): $0.04 per call
- [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/): $0.04 per call
- [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/): $0.04 per call
- [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/): $0.04 per call
