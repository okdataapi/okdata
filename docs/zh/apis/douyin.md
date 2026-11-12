# 抖音 API

> 视频、账号、评论和热搜榜。

网页版：https://okdata.online/zh/apis/douyin/

38 个接口，每次 $0.002 到 $0.04。地区：中国大陆。不需要抖音账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/) | `douyin.videos.search` | Post[] | $0.02/次 · 每页约 20 条视频 |
| [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/) | `douyin.videos.get` | Post | $0.002/次 |
| [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/) | `douyin.videos.comments.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/) | `douyin.users.get` | Account | $0.002/次 |
| [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/) | `douyin.users.videos.list` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/) | `douyin.trends.list` | Trend[] | $0.002/次 · 每页约 50 条榜单 |
| [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/) | `douyin.xingtu.creators.search` | Creator[] | $0.004/次 · 每页约 20 位达人 |
| [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/) | `douyin.xingtu.creators.rates.get` | CreatorRate | $0.04/次 |
| [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/) | `douyin.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/) | `douyin.hashtags.videos.list` | Post[] | $0.002/次 · 每页约 10 条视频 |
| [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/) | `douyin.users.search` | Account[] | $0.002/次 · 每页约 30 个账号 |
| [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/) | `douyin.videos.metrics` | Post | $0.002/次 |
| [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/) | `douyin.videos.related` | Post[] | $0.002/次 · 每页约 10 条视频 |
| [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/) | `douyin.videos.trending` | Post[] | $0.002/次 · 每页约 9 条视频 |
| [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/) | `douyin.keywords.related` | KeywordRelated[] | $0.02/次 · 每页约 10 条结果 |
| [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/) | `douyin.index.brands.history` | BrandHistory | $0.002/次 |
| [抖音巨量算数品牌指数对比](https://okdata.online/zh/apis/douyin/index/brands/metrics/) | `douyin.index.brands.metrics` | BrandMetrics | $0.002/次 |
| [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/) | `douyin.index.creators.videos.list` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/) | `douyin.index.creators.audience.get` | Audience | $0.002/次 |
| [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/) | `douyin.index.creators.metrics` | IndexCreatorMetrics | $0.002/次 |
| [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/) | `douyin.index.keywords.audience.get` | KeywordAudience | $0.002/次 |
| [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/) | `douyin.index.keywords.history` | KeywordHistory[] | $0.006/次 · 每页约 1 条结果 |
| [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/) | `douyin.index.keywords.related` | KeywordRelated[] | $0.002/次 · 每页约 170 条结果 |
| [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/) | `douyin.index.trends.list` | Trend[] | $0.002/次 · 每页约 30 条榜单 |
| [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/) | `douyin.index.videos.search` | Post[] | $0.002/次 · 每页约 20 条视频 |
| [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/) | `douyin.users.history` | AccountHistory | $0.002/次 |
| [抖音星图达人资料](https://okdata.online/zh/apis/douyin/xingtu/creators/get/) | `douyin.xingtu.creators.get` | Creator | $0.004/次 |
| [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/) | `douyin.xingtu.creators.audience.get` | Audience | $0.004/次 |
| [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/) | `douyin.xingtu.creators.metrics` | XingtuCreatorMetrics | $0.004/次 |
| [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/) | `douyin.xingtu.creators.videos.list` | XingtuCreatorPost[] | $0.004/次 · 每页约 20 条视频 |
| [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/) | `douyin.xingtu.creators.keywords.get` | XingtuCreatorKeywords | $0.002/次 |
| [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/) | `douyin.xingtu.creators.scores.get` | XingtuCreatorScores | $0.008/次 |
| [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/) | `douyin.xingtu.creators.content_mix.get` | XingtuCreatorContentMix | $0.004/次 |
| [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/) | `douyin.xingtu.creators.conversion.get` | XingtuCreatorConversion | $0.004/次 |
| [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/) | `douyin.xingtu.campaigns.list` | XingtuCampaign[] | $0.004/次 · 每页约 40 条结果 |
| [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/) | `douyin.xingtu.videos.get` | Post | $0.004/次 |
| [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/) | `douyin.backup.users.videos.list` | Post[] | $0.0025/次 · 每页约 20 条视频 |
| [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/) | `douyin.backup.videos.search` | Post[] | $0.03/次 · 每页约 8 条视频 |

## 适合做什么

- 内容调研: `douyin.videos.search`, `douyin.videos.get`, `douyin.hashtags.videos.list`, `douyin.videos.metrics`, `douyin.videos.related`, `douyin.videos.trending`, `douyin.keywords.related`, `douyin.index.creators.videos.list`, `douyin.index.keywords.related`, `douyin.index.videos.search`, `douyin.xingtu.creators.videos.list`, `douyin.backup.videos.search`
- 竞品监控: `douyin.videos.search`, `douyin.videos.get`, `douyin.users.get`, `douyin.users.videos.list`, `douyin.users.search`, `douyin.videos.metrics`, `douyin.index.brands.history`, `douyin.index.brands.metrics`, `douyin.index.creators.videos.list`, `douyin.index.creators.audience.get`, `douyin.index.creators.metrics`, `douyin.users.history`, `douyin.xingtu.videos.get`, `douyin.backup.users.videos.list`, `douyin.backup.videos.search`
- 口碑分析: `douyin.videos.comments.list`, `douyin.comments.replies.list`
- 找博主: `douyin.users.get`, `douyin.xingtu.creators.search`, `douyin.xingtu.creators.rates.get`, `douyin.users.search`, `douyin.index.creators.audience.get`, `douyin.index.creators.metrics`, `douyin.users.history`, `douyin.xingtu.creators.get`, `douyin.xingtu.creators.audience.get`, `douyin.xingtu.creators.metrics`, `douyin.xingtu.creators.videos.list`, `douyin.xingtu.creators.keywords.get`, `douyin.xingtu.creators.scores.get`, `douyin.xingtu.creators.content_mix.get`, `douyin.xingtu.creators.conversion.get`, `douyin.xingtu.videos.get`
- 热点研究: `douyin.trends.list`, `douyin.hashtags.videos.list`, `douyin.videos.related`, `douyin.videos.trending`, `douyin.keywords.related`, `douyin.index.brands.history`, `douyin.index.keywords.audience.get`, `douyin.index.keywords.history`, `douyin.index.keywords.related`, `douyin.index.trends.list`, `douyin.index.videos.search`, `douyin.xingtu.campaigns.list`
- 选品定价: `douyin.index.keywords.audience.get`, `douyin.index.keywords.history`, `douyin.xingtu.creators.conversion.get`
