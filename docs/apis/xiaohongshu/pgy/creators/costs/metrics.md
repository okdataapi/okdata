# Xiaohongshu PGY creator costs and summary API

> What a creator is expected to cost, by PGY creator ID: the estimated CPM, cost per interaction, per read and per shop visitor of an image note and of a video note, each against comparable creators; median impressions, reads, interactions and shop visitors of a note; follower growth and notes over 30 days; invitation reply rate and the easy-to-reach and active marks; PGY’s highlight, the content mix and the industries worked with. Of everyday or sponsored notes.

Canonical page: https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/

- **Endpoint**: `GET /v1/xiaohongshu/pgy/creators/costs/metrics`
- **ID**: `xiaohongshu.pgy.creators.costs.metrics`
- **Price**: $0.04 per call
- **Returns**: one PgyCreatorCosts object (`data.item`)
- **Status**: preview
- **Good for**: Creator discovery

## Price

One call costs $0.04 and returns one pgy_creator_costs. 1,000 lookups cost $40.00. Failed calls are not charged.

## Parameters

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes |  | PGY creator ID (24 hex characters, the same as the Xiaohongshu user ID), from the PGY creator search. (e.g. `591662306a6a6967b63e7f16`) |
| `tab` | string: everyday / sponsored | no | `everyday` | Whose figures: the creator’s everyday notes (the default) or sponsored notes, as the two tabs of the PGY creator page. |
| `view` | string: compact / standard / full | no | `standard` | How much of each object comes back. full adds platform-specific fields under ext. |
| `fields` | string[] | no |  | Fields to keep, by path (author.name), to save tokens. In a query string: comma-separated. |

cursor, view and fields work as described in [Requests](https://okdata.online/docs/requests/).

## Returned fields

Each item is a [PgyCreatorCosts](https://okdata.online/docs/objects/pgy_creator_costs/).

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | PGY creator ID. |
| `date` | string \| null | The day the figures are of: a calendar day in China time (UTC+8), written as 00:00 UTC of that date. |
| `currency` | string \| null | Currency of the costs (ISO 4217). |
| `image_cpm` | number \| null | Estimated CPM (cost of a thousand impressions) of a image note, in yuan; null where PGY has no estimate. |
| `image_cpm_percentile` | number \| null | Share of comparable creators whose image note CPM (cost of a thousand impressions) is higher, 0 to 1. |
| `video_cpm` | number \| null | Estimated CPM (cost of a thousand impressions) of a video note, in yuan; null where PGY has no estimate. |
| `video_cpm_percentile` | number \| null | Share of comparable creators whose video note CPM (cost of a thousand impressions) is higher, 0 to 1. |
| `image_cpe` | number \| null | Estimated cost per interaction of a image note, in yuan; null where PGY has no estimate. |
| `image_cpe_percentile` | number \| null | Share of comparable creators whose image note cost per interaction is higher, 0 to 1. |
| `video_cpe` | number \| null | Estimated cost per interaction of a video note, in yuan; null where PGY has no estimate. |
| `video_cpe_percentile` | number \| null | Share of comparable creators whose video note cost per interaction is higher, 0 to 1. |
| `image_read_cost` | number \| null | Estimated cost per read of a image note, in yuan; null where PGY has no estimate. |
| `image_read_cost_percentile` | number \| null | Share of comparable creators whose image note cost per read is higher, 0 to 1. |
| `video_read_cost` | number \| null | Estimated cost per read of a video note, in yuan; null where PGY has no estimate. |
| `video_read_cost_percentile` | number \| null | Share of comparable creators whose video note cost per read is higher, 0 to 1. |
| `image_shop_visit_cost` | number \| null | Estimated cost per shop visitor of a image note, in yuan; null where PGY has no estimate. |
| `image_shop_visit_cost_percentile` | number \| null | Share of comparable creators whose image note cost per shop visitor is higher, 0 to 1. |
| `video_shop_visit_cost` | number \| null | Estimated cost per shop visitor of a video note, in yuan; null where PGY has no estimate. |
| `video_shop_visit_cost_percentile` | number \| null | Share of comparable creators whose video note cost per shop visitor is higher, 0 to 1. |
| `median_impressions` | integer \| null | Median impressions of a note. |
| `median_impressions_percentile` | number \| null | Share of comparable creators this one beats on median impressions, 0 to 1. |
| `median_reads` | integer \| null | Median reads of a note. |
| `median_reads_percentile` | number \| null | Share of comparable creators this one beats on median reads, 0 to 1. |
| `median_engagements` | integer \| null | Median interactions of a note. |
| `median_engagements_percentile` | number \| null | Share of comparable creators this one beats on median interactions, 0 to 1. |
| `median_shop_visits` | integer \| null | Median shop visitors a note brings. |
| `median_shop_visits_percentile` | number \| null | Share of comparable creators this one beats on median shop visitors, 0 to 1. |
| `follower_growth` | number \| null | Follower growth over the last 30 days: 0.037 is 3.7% more; negative when followers were lost. |
| `follower_growth_percentile` | number \| null | Share of comparable creators this one beats on follower growth, 0 to 1. |
| `invite_reply_rate` | number \| null | Share of collaboration invitations answered within 48 hours, 0 to 1. |
| `easy_to_reach` | boolean \| null | Whether PGY marks the creator as easy to reach (好联系). |
| `active_days_7d` | integer \| null | Days active in the last 7. |
| `is_active` | boolean \| null | Whether PGY marks the creator as active (活跃). |
| `notes_30d` | integer \| null | Notes published in the last 30 days, everyday and sponsored alike. |
| `highlight` | string \| null | The strength PGY credits the creator with, in its words; null when none. |
| `highlight_reason` | string \| null | PGY's reason for that strength, in its words. |
| `content_mix` | CategoryShare[] \| null | Share of the creator's notes per content category, largest first. |
| `industries` | string[] \| null | Industries the creator has worked with, in the platform's words. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Request examples

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=591662306a6a6967b63e7f16'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics",
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
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics');
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
    "capability": "xiaohongshu.pgy.creators.costs.metrics",
    "id": "591662306a6a6967b63e7f16"
  }
}
```

Or ask an agent that has the MCP server connected:

> Use Xiaohongshu PGY creator costs and summary and sum up what comes back.

## Response example

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "creator_id": null,
      "date": null,
      "currency": null,
      "image_cpm": null,
      "image_cpm_percentile": null,
      "video_cpm": null,
      "video_cpm_percentile": null,
      "image_cpe": null,
      "image_cpe_percentile": null,
      "video_cpe": null,
      "video_cpe_percentile": null,
      "image_read_cost": null,
      "image_read_cost_percentile": null,
      "video_read_cost": null,
      "video_read_cost_percentile": null,
      "image_shop_visit_cost": null,
      "image_shop_visit_cost_percentile": null,
      "video_shop_visit_cost": null,
      "video_shop_visit_cost_percentile": null,
      "median_impressions": null,
      "median_impressions_percentile": null,
      "median_reads": null,
      "median_reads_percentile": null,
      "median_engagements": null,
      "median_engagements_percentile": null,
      "median_shop_visits": null,
      "median_shop_visits_percentile": null,
      "follower_growth": null,
      "follower_growth_percentile": null,
      "invite_reply_rate": null,
      "easy_to_reach": null,
      "active_days_7d": null,
      "is_active": null,
      "notes_30d": null,
      "highlight": null,
      "highlight_reason": null,
      "content_mix": [
        {
          "category": null,
          "share": null
        }
      ],
      "industries": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.costs.metrics",
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

### How much does the Xiaohongshu PGY creator costs and summary API cost?

One call costs $0.04 and returns one pgy_creator_costs. 1,000 lookups cost $40.00. Failed calls are not charged.

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
- [Xiaohongshu PGY creator note metrics](https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/): $0.04 per call
- [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/): $0.04 per call · about 8 notes per page
- [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/): $0.04 per call
- [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/): $0.04 per call · about 4 creators per page
- [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/): $0.04 per call · about 34 notes per page
- [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/): $0.04 per call
- [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/): $0.04 per call
- [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/): $0.04 per call
