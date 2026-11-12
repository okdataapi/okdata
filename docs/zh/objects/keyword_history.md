# KeywordHistory

> 关键词在平台指数工具里的逐日指数。

网页版：https://okdata.online/zh/docs/objects/keyword_history/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `keyword` | string | 关键词。 |
| `points` | KeywordPoint[] | 逐日数据，一天一条，从早到晚。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### KeywordPoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `date` | string | 日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `search_index` | integer \| null | 当天的搜索指数：平台对搜索热度的度量，不是搜索次数。 |
| `composite_index` | integer \| null | 当天的综合指数：平台对相关内容关注度的度量，不是次数。 |
| `notes` | integer \| null | 当天与该词相关的内容数。 |
| `impressions` | integer \| null | 这些内容当天的曝光次数。 |
| `views` | integer \| null | 这些内容当天的阅读次数。 |
| `engagements` | integer \| null | 这些内容当天的互动数。 |

## 返回 KeywordHistory 的接口

- [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/) (`douyin.index.keywords.history`): $0.006/次 · 每页约 1 条结果
- [小红书蒲公英关键词搜索指数](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/history/) (`xiaohongshu.pgy.keywords.history`): $0.04/次
- [微信指数](https://okdata.online/zh/apis/wechat/index/keywords/history/) (`wechat.index.keywords.history`): $0.15/次 · 每页约 1 条结果
