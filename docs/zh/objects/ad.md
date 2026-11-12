# Ad

> 公开广告库里的一条广告：广告主、文案、素材、落地页和投放时间。

网页版：https://okdata.online/zh/docs/objects/ad/

所有平台同一种结构。平台没有的字段为 null，meta.unavailable 会说明原因。用 fields= 只取需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 广告在广告库里的 ID。 |
| `url` | string | 广告在广告库里的链接。 |
| `advertiser` | AdvertiserRef | 投放广告的广告主。 |
| `title` | string \| null | 广告标题（有的话）。 |
| `text` | string | 广告文案，纯文本；没有则为空字符串。 |
| `format` | string \| null | 素材形式；dynamic 指平台按观众动态拼装（商品目录广告）。 |
| `images` | string[] \| null | 素材图片地址。 |
| `videos` | string[] \| null | 素材视频地址。 |
| `landing_url` | string \| null | 广告落地页。 |
| `cta` | string \| null | 行动按钮文字。 |
| `platforms` | string[] \| null | 投放位置，如 facebook、instagram。 |
| `active` | boolean \| null | 是否仍在投放。 |
| `first_shown_at` | string \| null | 首次展示时间，ISO 8601，UTC。 |
| `last_shown_at` | string \| null | 最近展示时间，ISO 8601，UTC。 |
| `reach` | string \| null | 广告库公布的触达人数：区间（如 1K-10K）或人数（Meta 广告的欧盟触达）；未公布为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

### AdvertiserRef

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string \| null | 广告主在广告库里的 ID。 |
| `name` | string \| null | 广告主名称。 |
| `url` | string \| null | 广告主页面。 |

## 返回 Ad 的接口

- [Meta 广告库搜索](https://okdata.online/zh/apis/meta/ads/search/) (`meta.ads.search`): $0.004/次 · 每页约 30 条广告
- [Meta 广告详情](https://okdata.online/zh/apis/meta/ads/get/) (`meta.ads.get`): $0.004/次
- [Meta 广告主的广告](https://okdata.online/zh/apis/meta/advertisers/ads/list/) (`meta.advertisers.ads.list`): $0.004/次 · 每页约 30 条广告
- [Google 广告主的广告](https://okdata.online/zh/apis/google/advertisers/ads/list/) (`google.advertisers.ads.list`): $0.004/次 · 每页约 40 条广告
- [TikTok 广告库搜索](https://okdata.online/zh/apis/tiktok/ads/search/) (`tiktok.ads.search`): $0.004/次 · 每页约 12 条广告
- [TikTok 创意中心热门广告](https://okdata.online/zh/apis/tiktok/creative_center/ads/search/) (`tiktok.creative_center.ads.search`): $0.002/次 · 每页约 20 条广告
- [TikTok 创意中心热门广告详情](https://okdata.online/zh/apis/tiktok/creative_center/ads/get/) (`tiktok.creative_center.ads.get`): $0.002/次
