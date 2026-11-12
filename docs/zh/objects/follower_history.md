# FollowerHistory

> 达人一段时间内的逐日粉丝数。

网页版：https://okdata.online/zh/docs/objects/follower_history/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 所查的达人 ID。 |
| `days` | integer | 数据覆盖最近多少天。 |
| `gained` | integer \| null | 期间净增粉丝；掉粉时为负数。 |
| `growth` | number \| null | 净增占期初粉丝的比例：0.01 即增长 1%。 |
| `points` | FollowerPoint[] | 逐日数据，一天一条，从早到晚。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### FollowerPoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `date` | string | 日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `followers` | integer \| null | 当天粉丝数。 |

## 返回 FollowerHistory 的接口

- [小红书蒲公英达人粉丝趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/history/) (`xiaohongshu.pgy.creators.followers.history`): $0.04/次
