# Creator

> 达人在星图、蒲公英等达人广场里的样子：粉丝、互动和报价。

网页版：https://okdata.online/zh/docs/objects/creator/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 达人广场里的达人 ID，其他达人广场接口用它。 |
| `url` | string | 达人在达人广场的主页。 |
| `account_id` | string \| null | 达人在平台上的账号 ID（达人广场给出时）：抖音是 douyin.users.get 用的 sec_uid（MS4w 开头），小红书是用户 ID。 |
| `username` | string \| null | 平台上的用户名或号（有的话）。 |
| `name` | string | 昵称。 |
| `avatar_url` | string \| null | 头像图片地址。 |
| `location` | string \| null | 达人所在地。 |
| `gender` | string \| null | 达人广场标注的性别。 |
| `followers` | integer \| null | 粉丝数。 |
| `categories` | string[] \| null | 达人广场的内容类目，平台原文。 |
| `engagement_rate` | number \| null | 近期作品的互动率，0 到 1（0.038 即 3.8%）。 |
| `median_views` | integer \| null | 近期日常作品的播放或阅读中位数。 |
| `median_engagements` | integer \| null | 近期日常作品的互动中位数（赞、评、藏、转）。 |
| `rates` | Rate[] \| null | 公开的合作报价；达人广场不展示时为 null。 |
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

## 返回 Creator 的接口

- [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/) (`douyin.xingtu.creators.search`): $0.004/次 · 每页约 20 位达人
- [小红书蒲公英达人搜索](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/search/) (`xiaohongshu.pgy.creators.search`): $0.04/次 · 每页约 20 位达人
- [小红书蒲公英达人详情](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/get/) (`xiaohongshu.pgy.creators.get`): $0.04/次
- [抖音星图达人资料](https://okdata.online/zh/apis/douyin/xingtu/creators/get/) (`douyin.xingtu.creators.get`): $0.004/次
- [小红书蒲公英相似达人](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/related/) (`xiaohongshu.pgy.creators.related`): $0.04/次 · 每页约 4 位达人
