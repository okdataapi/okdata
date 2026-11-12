# TikTok API

> Videos, accounts and comments worldwide.

Canonical page: https://okdata.online/apis/tiktok/

15 endpoints, $0.002 to $0.004 per call. Region: Global. No TikTok login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [TikTok video search](https://okdata.online/apis/tiktok/videos/search/) | `tiktok.videos.search` | Post[] | $0.002 per call · about 30 videos per page |
| [TikTok video detail](https://okdata.online/apis/tiktok/videos/get/) | `tiktok.videos.get` | Post | $0.002 per call |
| [TikTok video comments](https://okdata.online/apis/tiktok/videos/comments/list/) | `tiktok.videos.comments.list` | Comment[] | $0.002 per call · about 50 comments per page |
| [TikTok account profile](https://okdata.online/apis/tiktok/users/get/) | `tiktok.users.get` | Account | $0.002 per call |
| [TikTok Ads Library search](https://okdata.online/apis/tiktok/ads/search/) | `tiktok.ads.search` | Ad[] | $0.004 per call · about 12 ads per page |
| [TikTok Creative Center top ads](https://okdata.online/apis/tiktok/creative_center/ads/search/) | `tiktok.creative_center.ads.search` | Ad[] | $0.002 per call · about 20 ads per page |
| [TikTok Shop product search](https://okdata.online/apis/tiktok/shop/products/search/) | `tiktok.shop.products.search` | Product[] | $0.004 per call · about 20 products per page |
| [TikTok Shop product detail](https://okdata.online/apis/tiktok/shop/products/get/) | `tiktok.shop.products.get` | Product | $0.002 per call |
| [TikTok Shop product reviews](https://okdata.online/apis/tiktok/shop/products/reviews/list/) | `tiktok.shop.products.reviews.list` | Review[] | $0.002 per call · about 20 reviews per page |
| [TikTok video transcript](https://okdata.online/apis/tiktok/videos/transcript/get/) | `tiktok.videos.transcript.get` | Transcript | $0.002 per call |
| [TikTok comment replies](https://okdata.online/apis/tiktok/comments/replies/list/) | `tiktok.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [TikTok account search](https://okdata.online/apis/tiktok/users/search/) | `tiktok.users.search` | Account[] | $0.002 per call · about 30 accounts per page |
| [TikTok account videos](https://okdata.online/apis/tiktok/users/videos/list/) | `tiktok.users.videos.list` | Post[] | $0.002 per call · about 10 videos per page |
| [TikTok Creative Center top ad](https://okdata.online/apis/tiktok/creative_center/ads/get/) | `tiktok.creative_center.ads.get` | Ad | $0.002 per call |
| [TikTok Shop seller products](https://okdata.online/apis/tiktok/shop/sellers/products/list/) | `tiktok.shop.sellers.products.list` | Product[] | $0.002 per call · about 20 products per page |

## Good for

- Content research: `tiktok.videos.search`, `tiktok.creative_center.ads.search`, `tiktok.videos.transcript.get`, `tiktok.users.videos.list`, `tiktok.creative_center.ads.get`
- Trend research: `tiktok.videos.search`
- Competitor monitoring: `tiktok.videos.get`, `tiktok.users.get`, `tiktok.ads.search`, `tiktok.shop.products.search`, `tiktok.shop.products.get`, `tiktok.users.search`, `tiktok.users.videos.list`, `tiktok.shop.sellers.products.list`
- Word of mouth: `tiktok.videos.comments.list`, `tiktok.shop.products.reviews.list`, `tiktok.comments.replies.list`
- Creator discovery: `tiktok.users.get`, `tiktok.users.search`
- Ad intelligence: `tiktok.ads.search`, `tiktok.creative_center.ads.search`, `tiktok.creative_center.ads.get`
- Product research: `tiktok.shop.products.search`, `tiktok.shop.products.get`, `tiktok.shop.products.reviews.list`, `tiktok.shop.sellers.products.list`
- Transcripts: `tiktok.videos.transcript.get`
