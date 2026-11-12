# KeywordAudience

> 搜索或关注一个关键词的人群：年龄、性别、地域和兴趣。

网页版：https://okdata.online/zh/docs/objects/keyword_audience/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `keyword` | string | 关键词。 |
| `age` | KeywordSegment[] \| null | 按年龄段。 |
| `gender` | KeywordSegment[] \| null | 按性别。 |
| `province` | KeywordSegment[] \| null | 按省份。 |
| `city` | KeywordSegment[] \| null | 按城市：只列占比最高的，加起来不一定是 1。 |
| `city_tier` | KeywordSegment[] \| null | 按城市等级。 |
| `interest` | KeywordSegment[] \| null | 按兴趣；加起来不一定是 1。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### KeywordSegment

| 字段 | 类型 | 说明 |
|---|---|---|
| `label` | string | 人群分组名，平台原文。 |
| `share` | number \| null | 该组在关键词人群中的占比，0 到 1。 |
| `tgi` | number \| null | TGI：该组对关键词的偏好程度，100 为平台平均。 |

## 返回 KeywordAudience 的接口

- [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/) (`douyin.index.keywords.audience.get`): $0.002/次
