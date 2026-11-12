# Advertiser

> 公开广告库里的一个广告主。

网页版：https://okdata.online/zh/docs/objects/advertiser/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 广告主在广告库里的 ID。 |
| `url` | string | 广告主在广告库里的页面。 |
| `name` | string | 广告库显示的名称，常是公司主体名。 |
| `region` | string \| null | 注册国家或地区（ISO 代码）。 |
| `ads` | integer \| null | 广告库估计的广告数量。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 返回 Advertiser 的接口

- [Google 广告透明中心广告主搜索](https://okdata.online/zh/apis/google/advertisers/search/) (`google.advertisers.search`): $0.004/次 · 每页约 10 个广告主
