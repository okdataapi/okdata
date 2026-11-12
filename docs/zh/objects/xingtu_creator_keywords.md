# XingtuCreatorKeywords

> 星图达人内容里出现最多的词。

网页版：https://okdata.online/zh/docs/objects/xingtu_creator_keywords/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 星图达人 ID。 |
| `keywords` | CreatorKeyword[] | 每个词一条。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### CreatorKeyword

| 字段 | 类型 | 说明 |
|---|---|---|
| `keyword` | string | 关键词。 |
| `mentions` | integer \| null | 达人广场统计的出现次数；数值很小，只适合排序。 |

## 返回 XingtuCreatorKeywords 的接口

- [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/) (`douyin.xingtu.creators.keywords.get`): $0.002/次
