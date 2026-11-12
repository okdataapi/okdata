# XingtuCreatorScores

> 星图达人的各项指数，带排名和同类达人平均值。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_scores/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 星图达人 ID。 |
| `overall` | CreatorScore \| null | 星图综合指数。 |
| `reach` | CreatorScore \| null | 传播指数。 |
| `seeding` | CreatorScore \| null | 种草指数：视频带动商品兴趣的能力。 |
| `conversion` | CreatorScore \| null | 转化指数。 |
| `cooperation` | CreatorScore \| null | 合作指数。 |
| `value_for_money` | CreatorScore \| null | 性价比指数。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### CreatorScore

| 字段 | 类型 | 说明 |
|---|---|---|
| `score` | number \| null | 分数，0 到 100。 |
| `average` | number \| null | 同类达人的平均分。 |
| `rank` | integer \| null | 该项排名，1 为最高。 |
| `rank_share` | number \| null | 排名所处位置，0 到 1（0.05 即前 5%）；保留四位小数，约前一百名显示为 0。 |

## 返回 XingtuCreatorScores 的接口

- [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/) (`douyin.xingtu.creators.scores.get`): $0.008/次
