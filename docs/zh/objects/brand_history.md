# BrandHistory

> 品牌在平台指数工具里的逐日搜索、内容和传播指数。

网页版：https://okdata.online/zh/docs/objects/brand_history/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `brand` | string | 品牌名。 |
| `category` | string \| null | 平台给品牌归的行业，平台原文。 |
| `points` | BrandPoint[] | 逐日数据，一天一条，从早到晚。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### BrandPoint

| 字段 | 类型 | 说明 |
|---|---|---|
| `date` | string | 日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `search_index` | integer \| null | 搜索指数：品牌的搜索热度，不是搜索次数。 |
| `content_index` | integer \| null | 内容指数：品牌相关内容的多少，不是内容条数。 |
| `spread_index` | integer \| null | 传播指数：相关内容的传播范围，不是次数。 |

## 返回 BrandHistory 的接口

- [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/) (`douyin.index.brands.history`): $0.002/次
