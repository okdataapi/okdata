# XingtuCreatorScores

> A Xingtu creator's scores, each with its rank and the average of comparable creators.

Canonical page: https://okdata.online/docs/objects/xingtu_creator_scores/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `creator_id` | string | Xingtu creator ID. |
| `overall` | CreatorScore \| null | The overall Xingtu score. |
| `reach` | CreatorScore \| null | Reach score. |
| `seeding` | CreatorScore \| null | Seeding score: how well the creator's videos raise interest in products. |
| `conversion` | CreatorScore \| null | Conversion score. |
| `cooperation` | CreatorScore \| null | Cooperation score. |
| `value_for_money` | CreatorScore \| null | Value-for-money score. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

### CreatorScore

| Field | Type | Description |
|---|---|---|
| `score` | number \| null | The score, 0 to 100. |
| `average` | number \| null | Average score of comparable creators. |
| `rank` | integer \| null | Rank on this score, 1 is the highest. |
| `rank_share` | number \| null | How far from the top the rank is, 0 to 1 (0.05 is the top 5%); to four decimals, so the top hundred or so read 0. |

## Endpoints that return a XingtuCreatorScores

- [Douyin Xingtu creator scores](https://okdata.online/apis/douyin/xingtu/creators/scores/get/) (`douyin.xingtu.creators.scores.get`): $0.008 per call
