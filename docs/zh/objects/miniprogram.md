# Miniprogram

> 一个微信小程序或小游戏。

网页版：https://okdata.online/zh/docs/objects/miniprogram/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 原始 ID（gh_ 开头）。 |
| `app_id` | string \| null | AppID（wx 开头），用于打开或跳转；未给出时为 null。 |
| `name` | string | 名称。 |
| `description` | string \| null | 简介。 |
| `icon_url` | string \| null | 图标。 |
| `owner_name` | string \| null | 运营主体名称。 |
| `owner_verified` | boolean \| null | 主体是否认证。 |
| `recent_users` | integer \| null | 平台显示的近期使用人数；「1万+」这类是下限；未显示时为 null。 |
| `is_game` | boolean \| null | 是否为小游戏。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 Miniprogram 的接口

- [微信小程序搜索](https://okdata.online/zh/apis/wechat/miniprograms/search/) (`wechat.miniprograms.search`): $0.15/次 · 每页约 25 条结果
