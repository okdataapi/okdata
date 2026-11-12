# Community

> 平台上的社区或群组，如 Reddit 版块、X 社区。

网页版：https://okdata.online/zh/docs/objects/community/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | ID，可原样传给需要它的接口。 |
| `name` | string | 社区名称。 |
| `url` | string \| null | 社区链接。 |
| `description` | string \| null | 社区简介。 |
| `avatar_url` | string \| null | 社区图标。 |
| `nsfw` | boolean \| null | 是否标为成人内容。 |
| `created_at` | string \| null | 社区创建时间。 |
| `metrics` | CommunityMetrics | 抓取时的数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### CommunityMetrics

| 字段 | 类型 | 说明 |
|---|---|---|
| `members` | integer \| null | 成员数。 |

## 返回 Community 的接口

- [X 社群资料](https://okdata.online/zh/apis/x/communities/get/) (`x.communities.get`): $0.0004/次
