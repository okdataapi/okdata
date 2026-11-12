# TikTok API

> 全球的视频、账号和评论。

网页版：https://okdata.online/zh/apis/tiktok/

15 个接口，每次 $0.002 到 $0.004。地区：海外。不需要TikTok账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/) | `tiktok.videos.search` | Post[] | $0.002/次 · 每页约 30 条视频 |
| [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/) | `tiktok.videos.get` | Post | $0.002/次 |
| [TikTok 视频评论](https://okdata.online/zh/apis/tiktok/videos/comments/list/) | `tiktok.videos.comments.list` | Comment[] | $0.002/次 · 每页约 50 条评论 |
| [TikTok 账号信息](https://okdata.online/zh/apis/tiktok/users/get/) | `tiktok.users.get` | Account | $0.002/次 |
| [TikTok 广告库搜索](https://okdata.online/zh/apis/tiktok/ads/search/) | `tiktok.ads.search` | Ad[] | $0.004/次 · 每页约 12 条广告 |
| [TikTok 创意中心热门广告](https://okdata.online/zh/apis/tiktok/creative_center/ads/search/) | `tiktok.creative_center.ads.search` | Ad[] | $0.002/次 · 每页约 20 条广告 |
| [TikTok Shop 商品搜索](https://okdata.online/zh/apis/tiktok/shop/products/search/) | `tiktok.shop.products.search` | Product[] | $0.004/次 · 每页约 20 个商品 |
| [TikTok Shop 商品详情](https://okdata.online/zh/apis/tiktok/shop/products/get/) | `tiktok.shop.products.get` | Product | $0.002/次 |
| [TikTok Shop 商品评价](https://okdata.online/zh/apis/tiktok/shop/products/reviews/list/) | `tiktok.shop.products.reviews.list` | Review[] | $0.002/次 · 每页约 20 条评价 |
| [TikTok 视频字幕](https://okdata.online/zh/apis/tiktok/videos/transcript/get/) | `tiktok.videos.transcript.get` | Transcript | $0.002/次 |
| [TikTok 评论回复](https://okdata.online/zh/apis/tiktok/comments/replies/list/) | `tiktok.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [TikTok 账号搜索](https://okdata.online/zh/apis/tiktok/users/search/) | `tiktok.users.search` | Account[] | $0.002/次 · 每页约 30 个账号 |
| [TikTok 账号作品](https://okdata.online/zh/apis/tiktok/users/videos/list/) | `tiktok.users.videos.list` | Post[] | $0.002/次 · 每页约 10 条视频 |
| [TikTok 创意中心热门广告详情](https://okdata.online/zh/apis/tiktok/creative_center/ads/get/) | `tiktok.creative_center.ads.get` | Ad | $0.002/次 |
| [TikTok Shop 店铺商品](https://okdata.online/zh/apis/tiktok/shop/sellers/products/list/) | `tiktok.shop.sellers.products.list` | Product[] | $0.002/次 · 每页约 20 个商品 |

## 适合做什么

- 内容调研: `tiktok.videos.search`, `tiktok.creative_center.ads.search`, `tiktok.videos.transcript.get`, `tiktok.users.videos.list`, `tiktok.creative_center.ads.get`
- 热点研究: `tiktok.videos.search`
- 竞品监控: `tiktok.videos.get`, `tiktok.users.get`, `tiktok.ads.search`, `tiktok.shop.products.search`, `tiktok.shop.products.get`, `tiktok.users.search`, `tiktok.users.videos.list`, `tiktok.shop.sellers.products.list`
- 口碑分析: `tiktok.videos.comments.list`, `tiktok.shop.products.reviews.list`, `tiktok.comments.replies.list`
- 找博主: `tiktok.users.get`, `tiktok.users.search`
- 广告情报: `tiktok.ads.search`, `tiktok.creative_center.ads.search`, `tiktok.creative_center.ads.get`
- 选品定价: `tiktok.shop.products.search`, `tiktok.shop.products.get`, `tiktok.shop.products.reviews.list`, `tiktok.shop.sellers.products.list`
- 视频转文字: `tiktok.videos.transcript.get`
