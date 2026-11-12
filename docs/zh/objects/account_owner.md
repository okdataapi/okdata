# AccountOwner

> 账号背后的主体：注册的公司、机构或个人及其认证情况。

网页版：https://okdata.online/zh/docs/objects/account_owner/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string \| null | 主体名称：公司或机构全称，或个人姓名。 |
| `type` | string \| null | 主体类型。 |
| `registration_id` | string \| null | 注册号（统一社会信用代码、营业执照或组织机构代码）；未给出时为 null。 |
| `country` | string \| null | 国家或地区，平台原文。 |
| `verification` | string \| null | 账号认证状态。 |
| `verification_type` | string \| null | 认证类型，平台原文；未认证时为 null。 |
| `verified_at` | string \| null | 认证日期，写成 UTC 零点。 |
| `account_id` | string | 所查账号的 ID。 |
| `account_created_at` | string \| null | 账号注册日期，写成 UTC 零点。 |
| `authorized_services` | string[] \| null | 账号授权的第三方服务，平台原文。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 AccountOwner 的接口

- [公众号主体信息](https://okdata.online/zh/apis/wechat_mp/accounts/owner/get/) (`wechat_mp.accounts.owner.get`): $0.15/次
