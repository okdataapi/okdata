# Audience

> 达人粉丝的性别、年龄、地域、兴趣、设备和消费分布。

网页版：https://okdata.online/zh/docs/objects/audience/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 所查的达人 ID。 |
| `measured_at` | string \| null | 数据所属日期，写成中国时间当天零点。 |
| `gender` | AudienceSegment[] \| null | 按性别。 |
| `age` | AudienceSegment[] \| null | 按年龄段。 |
| `province` | AudienceSegment[] \| null | 按省份。 |
| `city` | AudienceSegment[] \| null | 按城市，只列占比最高的。 |
| `interest` | AudienceSegment[] \| null | 按兴趣。 |
| `device` | AudienceSegment[] \| null | 按手机品牌。 |
| `city_tier` | AudienceSegment[] \| null | 按城市等级。 |
| `crowd` | AudienceSegment[] \| null | 按平台划分的消费人群。 |
| `purchase_category` | AudienceSegment[] \| null | 按购买的商品类目。 |
| `purchase_amount` | AudienceSegment[] \| null | 按客单价。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### AudienceSegment

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 分段名，平台原文（性别为小写英文）。 |
| `share` | number \| null | 该段在所列各段中的占比，0 到 1。 |
| `count` | integer \| null | 该段的粉丝数。 |

## 返回 Audience 的接口

- [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/) (`douyin.index.creators.audience.get`): $0.002/次
- [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/) (`douyin.xingtu.creators.audience.get`): $0.004/次
- [小红书蒲公英达人粉丝画像](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/audience/get/) (`xiaohongshu.pgy.creators.audience.get`): $0.04/次
