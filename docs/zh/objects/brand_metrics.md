# BrandMetrics

> 品牌一段时间的指数均值，以及行业均值作对照。

网页版：https://okdata.online/zh/docs/objects/brand_metrics/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `brand` | string | 品牌名。 |
| `category` | string \| null | 平台给品牌归的行业，平台原文。 |
| `search_index` | integer \| null | 期间日均搜索指数。 |
| `content_index` | integer \| null | 期间日均内容指数。 |
| `spread_index` | integer \| null | 期间日均传播指数。 |
| `benchmarks` | BrandBenchmark[] \| null | 整个行业和头部品牌的同口径均值。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### BrandBenchmark

| 字段 | 类型 | 说明 |
|---|---|---|
| `scope` | string | 取平均的品牌范围：整个行业，或行业前 3、5、10、15、30 名。 |
| `search_index` | integer \| null | 这些品牌的日均搜索指数。 |
| `content_index` | integer \| null | 这些品牌的日均内容指数。 |
| `spread_index` | integer \| null | 这些品牌的日均传播指数。 |

## 返回 BrandMetrics 的接口

- [抖音巨量算数品牌指数对比](https://okdata.online/zh/apis/douyin/index/brands/metrics/) (`douyin.index.brands.metrics`): $0.002/次
