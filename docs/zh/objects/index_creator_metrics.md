# IndexCreatorMetrics

> 账号在平台指数工具里近一周和近一月的日均数据及变化。

网页版：https://okdata.online/zh/docs/objects/index_creator_metrics/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 账号的数字 ID（即所查的那个）。 |
| `average_7d` | IndexDailyAverages \| null | 近 7 天日均。 |
| `average_30d` | IndexDailyAverages \| null | 近 30 天日均。 |
| `change_7d` | IndexDailyChange \| null | 近 7 天与前 7 天相比的变化：0.3 即多 30%。 |
| `change_30d` | IndexDailyChange \| null | 近 30 天与前 30 天相比的变化。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### IndexDailyAverages

| 字段 | 类型 | 说明 |
|---|---|---|
| `likes` | number \| null | 日均新增点赞。 |
| `follows` | number \| null | 日均关注（平台口径的关注数，不是净增粉丝）。 |
| `shares` | number \| null | 日均新增分享。 |
| `comments` | number \| null | 日均新增评论。 |

### IndexDailyChange

| 字段 | 类型 | 说明 |
|---|---|---|
| `likes` | number \| null | 日均新增点赞的变化。 |
| `follows` | number \| null | 日均关注的变化（平台口径的关注数，不是净增粉丝）。 |
| `shares` | number \| null | 日均新增分享的变化。 |
| `comments` | number \| null | 日均新增评论的变化。 |

## 返回 IndexCreatorMetrics 的接口

- [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/) (`douyin.index.creators.metrics`): $0.002/次
