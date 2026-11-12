# KeywordRelated

> 与所查关键词相关的词、相关方式和热度。

网页版：https://okdata.online/zh/docs/objects/keyword_related/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `keyword` | string | 关联词。 |
| `related_to` | string | 所查的关键词。 |
| `relation` | string \| null | 关联方式：一起被搜（query）、在内容里一起出现（posts）、之前搜（prior）、之后搜（after），或输入时的联想词（suggestion）。 |
| `rank` | integer \| null | 在同一关联方式下的排名，从 1 开始。 |
| `relevance` | number \| null | 相关程度，0 到 1。 |
| `search_index` | integer \| null | 它的搜索指数（平台的度量，不是次数）；平台未给出时为 null。 |
| `composite_index` | integer \| null | 它的综合指数（平台对关注度的度量，不是次数）。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 KeywordRelated 的接口

- [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/) (`douyin.keywords.related`): $0.02/次 · 每页约 10 条结果
- [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/) (`douyin.index.keywords.related`): $0.002/次 · 每页约 170 条结果
- [小红书搜索联想词](https://okdata.online/zh/apis/xiaohongshu/keywords/related/) (`xiaohongshu.keywords.related`): $0.02/次 · 每页约 10 条结果
- [小红书蒲公英关联词](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/related/) (`xiaohongshu.pgy.keywords.related`): $0.04/次 · 每页约 98 条结果
- [微信搜一搜推荐词](https://okdata.online/zh/apis/wechat/keywords/related/) (`wechat.keywords.related`): $0.15/次 · 每页约 9 条结果
