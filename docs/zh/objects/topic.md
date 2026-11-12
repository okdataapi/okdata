# Topic

> 一个话题（标签）页及其数据。

网页版：https://okdata.online/zh/docs/objects/topic/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | ID，可原样传给需要它的接口。 |
| `name` | string | 话题名称。 |
| `url` | string \| null | 话题页链接。 |
| `description` | string \| null | 话题简介；没有时为 null。 |
| `metrics` | TopicMetrics | 抓取时的数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### TopicMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `views` | integer \| null | 话题浏览量。 |
| `posts` | integer \| null | 话题下的内容数。 |

## 返回 Topic 的接口

- [小红书话题详情](https://okdata.online/zh/apis/xiaohongshu/topics/get/) (`xiaohongshu.topics.get`): $0.02/次
