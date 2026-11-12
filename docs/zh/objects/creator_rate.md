# CreatorRate

> 达人在达人广场上的完整报价单。

网页版：https://okdata.online/zh/docs/objects/creator_rate/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 达人广场达人 ID。 |
| `url` | string | 达人在达人广场的主页。 |
| `rates` | Rate[] | 报价单上的每一项。 |
| `industries` | string[] \| null | 达人广场给达人标注的行业。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### Rate

| 字段 | 类型 | 说明 |
|---|---|---|
| `type` | string | 合作形式，跨平台统一的分类。 |
| `name` | string | 平台自己的叫法。 |
| `price` | number \| null | 标价，单位见 currency；未公开为 null。 |
| `currency` | string | ISO 4217 货币代码。 |
| `available` | boolean \| null | 达人现在是否接这种单。 |
| `settlement` | string \| null | 结算方式，平台原文。 |

## 返回 CreatorRate 的接口

- [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/) (`douyin.xingtu.creators.rates.get`): $0.04/次
