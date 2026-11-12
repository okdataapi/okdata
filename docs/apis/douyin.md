# Douyin API

> China’s TikTok: videos, accounts, comments and the hot search board.

Canonical page: https://okdata.online/apis/douyin/

38 endpoints, $0.002 to $0.04 per call. Region: Mainland China. No Douyin login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Douyin video search](https://okdata.online/apis/douyin/videos/search/) | `douyin.videos.search` | Post[] | $0.02 per call · about 20 videos per page |
| [Douyin video detail](https://okdata.online/apis/douyin/videos/get/) | `douyin.videos.get` | Post | $0.002 per call |
| [Douyin video comments](https://okdata.online/apis/douyin/videos/comments/list/) | `douyin.videos.comments.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Douyin account profile](https://okdata.online/apis/douyin/users/get/) | `douyin.users.get` | Account | $0.002 per call |
| [Douyin account videos](https://okdata.online/apis/douyin/users/videos/list/) | `douyin.users.videos.list` | Post[] | $0.002 per call · about 20 videos per page |
| [Douyin hot search board](https://okdata.online/apis/douyin/trends/list/) | `douyin.trends.list` | Trend[] | $0.002 per call · about 50 board entries per page |
| [Douyin Xingtu creator search](https://okdata.online/apis/douyin/xingtu/creators/search/) | `douyin.xingtu.creators.search` | Creator[] | $0.004 per call · about 20 creators per page |
| [Douyin Xingtu creator rate card](https://okdata.online/apis/douyin/xingtu/creators/rates/get/) | `douyin.xingtu.creators.rates.get` | CreatorRate | $0.04 per call |
| [Douyin comment replies](https://okdata.online/apis/douyin/comments/replies/list/) | `douyin.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Douyin hashtag videos](https://okdata.online/apis/douyin/hashtags/videos/list/) | `douyin.hashtags.videos.list` | Post[] | $0.002 per call · about 10 videos per page |
| [Douyin account search](https://okdata.online/apis/douyin/users/search/) | `douyin.users.search` | Account[] | $0.002 per call · about 30 accounts per page |
| [Douyin video play count](https://okdata.online/apis/douyin/videos/metrics/) | `douyin.videos.metrics` | Post | $0.002 per call |
| [Douyin related videos](https://okdata.online/apis/douyin/videos/related/) | `douyin.videos.related` | Post[] | $0.002 per call · about 10 videos per page |
| [Douyin video boards](https://okdata.online/apis/douyin/videos/trending/) | `douyin.videos.trending` | Post[] | $0.002 per call · about 9 videos per page |
| [Douyin search suggestions](https://okdata.online/apis/douyin/keywords/related/) | `douyin.keywords.related` | KeywordRelated[] | $0.02 per call · about 10 results per page |
| [Douyin index: brand trends](https://okdata.online/apis/douyin/index/brands/history/) | `douyin.index.brands.history` | BrandHistory | $0.002 per call |
| [Douyin index: brand vs industry](https://okdata.online/apis/douyin/index/brands/metrics/) | `douyin.index.brands.metrics` | BrandMetrics | $0.002 per call |
| [Douyin index: account top videos](https://okdata.online/apis/douyin/index/creators/videos/list/) | `douyin.index.creators.videos.list` | Post[] | $0.002 per call · about 20 videos per page |
| [Douyin index: account followers](https://okdata.online/apis/douyin/index/creators/audience/get/) | `douyin.index.creators.audience.get` | Audience | $0.002 per call |
| [Douyin index: account daily averages](https://okdata.online/apis/douyin/index/creators/metrics/) | `douyin.index.creators.metrics` | IndexCreatorMetrics | $0.002 per call |
| [Douyin index: keyword audience](https://okdata.online/apis/douyin/index/keywords/audience/get/) | `douyin.index.keywords.audience.get` | KeywordAudience | $0.002 per call |
| [Douyin index: keyword trends](https://okdata.online/apis/douyin/index/keywords/history/) | `douyin.index.keywords.history` | KeywordHistory[] | $0.006 per call · about 1 results per page |
| [Douyin index: related keywords](https://okdata.online/apis/douyin/index/keywords/related/) | `douyin.index.keywords.related` | KeywordRelated[] | $0.002 per call · about 170 results per page |
| [Douyin index: live hot topics](https://okdata.online/apis/douyin/index/trends/list/) | `douyin.index.trends.list` | Trend[] | $0.002 per call · about 30 board entries per page |
| [Douyin index: top videos for a keyword](https://okdata.online/apis/douyin/index/videos/search/) | `douyin.index.videos.search` | Post[] | $0.002 per call · about 20 videos per page |
| [Douyin account growth](https://okdata.online/apis/douyin/users/history/) | `douyin.users.history` | AccountHistory | $0.002 per call |
| [Douyin Xingtu creator profile](https://okdata.online/apis/douyin/xingtu/creators/get/) | `douyin.xingtu.creators.get` | Creator | $0.004 per call |
| [Douyin Xingtu creator audience](https://okdata.online/apis/douyin/xingtu/creators/audience/get/) | `douyin.xingtu.creators.audience.get` | Audience | $0.004 per call |
| [Douyin Xingtu creator reach](https://okdata.online/apis/douyin/xingtu/creators/metrics/) | `douyin.xingtu.creators.metrics` | XingtuCreatorMetrics | $0.004 per call |
| [Douyin Xingtu creator videos](https://okdata.online/apis/douyin/xingtu/creators/videos/list/) | `douyin.xingtu.creators.videos.list` | XingtuCreatorPost[] | $0.004 per call · about 20 videos per page |
| [Douyin Xingtu creator keywords](https://okdata.online/apis/douyin/xingtu/creators/keywords/get/) | `douyin.xingtu.creators.keywords.get` | XingtuCreatorKeywords | $0.002 per call |
| [Douyin Xingtu creator scores](https://okdata.online/apis/douyin/xingtu/creators/scores/get/) | `douyin.xingtu.creators.scores.get` | XingtuCreatorScores | $0.008 per call |
| [Douyin Xingtu creator content mix](https://okdata.online/apis/douyin/xingtu/creators/content_mix/get/) | `douyin.xingtu.creators.content_mix.get` | XingtuCreatorContentMix | $0.004 per call |
| [Douyin Xingtu creator conversion](https://okdata.online/apis/douyin/xingtu/creators/conversion/get/) | `douyin.xingtu.creators.conversion.get` | XingtuCreatorConversion | $0.004 per call |
| [Douyin Xingtu marketing calendar](https://okdata.online/apis/douyin/xingtu/campaigns/list/) | `douyin.xingtu.campaigns.list` | XingtuCampaign[] | $0.004 per call · about 40 results per page |
| [Douyin Xingtu video report](https://okdata.online/apis/douyin/xingtu/videos/get/) | `douyin.xingtu.videos.get` | Post | $0.004 per call |
| [Douyin account videos (backup)](https://okdata.online/apis/douyin/backup/users/videos/list/) | `douyin.backup.users.videos.list` | Post[] | $0.0025 per call · about 20 videos per page |
| [Douyin video search (backup)](https://okdata.online/apis/douyin/backup/videos/search/) | `douyin.backup.videos.search` | Post[] | $0.03 per call · about 8 videos per page |

## Good for

- Content research: `douyin.videos.search`, `douyin.videos.get`, `douyin.hashtags.videos.list`, `douyin.videos.metrics`, `douyin.videos.related`, `douyin.videos.trending`, `douyin.keywords.related`, `douyin.index.creators.videos.list`, `douyin.index.keywords.related`, `douyin.index.videos.search`, `douyin.xingtu.creators.videos.list`, `douyin.backup.videos.search`
- Competitor monitoring: `douyin.videos.search`, `douyin.videos.get`, `douyin.users.get`, `douyin.users.videos.list`, `douyin.users.search`, `douyin.videos.metrics`, `douyin.index.brands.history`, `douyin.index.brands.metrics`, `douyin.index.creators.videos.list`, `douyin.index.creators.audience.get`, `douyin.index.creators.metrics`, `douyin.users.history`, `douyin.xingtu.videos.get`, `douyin.backup.users.videos.list`, `douyin.backup.videos.search`
- Word of mouth: `douyin.videos.comments.list`, `douyin.comments.replies.list`
- Creator discovery: `douyin.users.get`, `douyin.xingtu.creators.search`, `douyin.xingtu.creators.rates.get`, `douyin.users.search`, `douyin.index.creators.audience.get`, `douyin.index.creators.metrics`, `douyin.users.history`, `douyin.xingtu.creators.get`, `douyin.xingtu.creators.audience.get`, `douyin.xingtu.creators.metrics`, `douyin.xingtu.creators.videos.list`, `douyin.xingtu.creators.keywords.get`, `douyin.xingtu.creators.scores.get`, `douyin.xingtu.creators.content_mix.get`, `douyin.xingtu.creators.conversion.get`, `douyin.xingtu.videos.get`
- Trend research: `douyin.trends.list`, `douyin.hashtags.videos.list`, `douyin.videos.related`, `douyin.videos.trending`, `douyin.keywords.related`, `douyin.index.brands.history`, `douyin.index.keywords.audience.get`, `douyin.index.keywords.history`, `douyin.index.keywords.related`, `douyin.index.trends.list`, `douyin.index.videos.search`, `douyin.xingtu.campaigns.list`
- Product research: `douyin.index.keywords.audience.get`, `douyin.index.keywords.history`, `douyin.xingtu.creators.conversion.get`
