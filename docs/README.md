# okdata docs

<!-- Generated from the okdata catalog by scripts/export-public.mjs in the okdata monorepo. Do not edit by hand. -->

196 endpoints on 17 platforms (6 of them listed as coming soon and not callable yet), catalog revision 2fb7095ff6401e35, price book f4f90b4727f4840a. The same pages are at https://okdata.online/apis/. 中文在下面。

## Files for agents and code

- [agents.md](agents.md): set okdata up in an AI agent (MCP or HTTP), step by step
- [llms.txt](llms.txt) and [llms-full.txt](llms-full.txt): the whole API as an AI reads it
- [openapi.json](openapi.json): OpenAPI 3.1 for every endpoint
- [prices.json](prices.json): every price, the billing rules and the cost of 1,000 items
- [mcp-tools.json](mcp-tools.json): the tools the MCP server exposes
- [catalog.json](catalog.json): endpoints, parameters and prices as data (what `GET /v1/catalog` answers)
- [errors.md](errors.md) and [errors.json](errors.json): every error code, whether it is charged and whether to retry
- Objects: [post](objects/post.md), [account](objects/account.md), [comment](objects/comment.md), [trend](objects/trend.md), [transcript](objects/transcript.md), [creator](objects/creator.md), [creator_rate](objects/creator_rate.md), [ad](objects/ad.md), [advertiser](objects/advertiser.md), [product](objects/product.md), [review](objects/review.md), [community](objects/community.md), [topic](objects/topic.md), [keyword_history](objects/keyword_history.md), [keyword_related](objects/keyword_related.md), [keyword_audience](objects/keyword_audience.md), [account_history](objects/account_history.md), [brand_history](objects/brand_history.md), [brand_metrics](objects/brand_metrics.md), [index_creator_metrics](objects/index_creator_metrics.md), [audience](objects/audience.md), [follower_history](objects/follower_history.md), [xingtu_creator_metrics](objects/xingtu_creator_metrics.md), [xingtu_creator_post](objects/xingtu_creator_post.md), [xingtu_creator_keywords](objects/xingtu_creator_keywords.md), [xingtu_creator_scores](objects/xingtu_creator_scores.md), [xingtu_creator_content_mix](objects/xingtu_creator_content_mix.md), [xingtu_creator_conversion](objects/xingtu_creator_conversion.md), [xingtu_campaign](objects/xingtu_campaign.md), [pgy_creator_metrics](objects/pgy_creator_metrics.md), [pgy_creator_post](objects/pgy_creator_post.md), [pgy_note](objects/pgy_note.md), [pgy_creator_costs](objects/pgy_creator_costs.md), [pgy_creator_followers](objects/pgy_creator_followers.md), [pgy_creator_cost_history](objects/pgy_creator_cost_history.md), [channels_collection](objects/channels_collection.md), [channels_share_link](objects/channels_share_link.md), [account_owner](objects/account_owner.md), [miniprogram](objects/miniprogram.md)

## Endpoints

**Douyin**

| Endpoint | ID | Price |
|---|---|---|
| [Douyin video search](apis/douyin/videos/search.md) | `douyin.videos.search` | $0.02 per call · about 20 videos per page |
| [Douyin video detail](apis/douyin/videos/get.md) | `douyin.videos.get` | $0.002 per call |
| [Douyin video comments](apis/douyin/videos/comments/list.md) | `douyin.videos.comments.list` | $0.002 per call · about 20 comments per page |
| [Douyin account profile](apis/douyin/users/get.md) | `douyin.users.get` | $0.002 per call |
| [Douyin account videos](apis/douyin/users/videos/list.md) | `douyin.users.videos.list` | $0.002 per call · about 20 videos per page |
| [Douyin hot search board](apis/douyin/trends/list.md) | `douyin.trends.list` | $0.002 per call · about 50 board entries per page |
| [Douyin Xingtu creator search](apis/douyin/xingtu/creators/search.md) | `douyin.xingtu.creators.search` | $0.004 per call · about 20 creators per page |
| [Douyin Xingtu creator rate card](apis/douyin/xingtu/creators/rates/get.md) | `douyin.xingtu.creators.rates.get` | $0.04 per call |
| [Douyin comment replies](apis/douyin/comments/replies/list.md) | `douyin.comments.replies.list` | $0.002 per call · about 20 comments per page |
| [Douyin hashtag videos](apis/douyin/hashtags/videos/list.md) | `douyin.hashtags.videos.list` | $0.002 per call · about 10 videos per page |
| [Douyin account search](apis/douyin/users/search.md) | `douyin.users.search` | $0.002 per call · about 30 accounts per page |
| [Douyin video play count](apis/douyin/videos/metrics.md) | `douyin.videos.metrics` | $0.002 per call |
| [Douyin related videos](apis/douyin/videos/related.md) | `douyin.videos.related` | $0.002 per call · about 10 videos per page |
| [Douyin video boards](apis/douyin/videos/trending.md) | `douyin.videos.trending` | $0.002 per call · about 9 videos per page |
| [Douyin search suggestions](apis/douyin/keywords/related.md) | `douyin.keywords.related` | $0.02 per call · about 10 results per page |
| [Douyin index: brand trends](apis/douyin/index/brands/history.md) | `douyin.index.brands.history` | $0.002 per call |
| [Douyin index: brand vs industry](apis/douyin/index/brands/metrics.md) | `douyin.index.brands.metrics` | $0.002 per call |
| [Douyin index: account top videos](apis/douyin/index/creators/videos/list.md) | `douyin.index.creators.videos.list` | $0.002 per call · about 20 videos per page |
| [Douyin index: account followers](apis/douyin/index/creators/audience/get.md) | `douyin.index.creators.audience.get` | $0.002 per call |
| [Douyin index: account daily averages](apis/douyin/index/creators/metrics.md) | `douyin.index.creators.metrics` | $0.002 per call |
| [Douyin index: keyword audience](apis/douyin/index/keywords/audience/get.md) | `douyin.index.keywords.audience.get` | $0.002 per call |
| [Douyin index: keyword trends](apis/douyin/index/keywords/history.md) | `douyin.index.keywords.history` | $0.006 per call · about 1 results per page |
| [Douyin index: related keywords](apis/douyin/index/keywords/related.md) | `douyin.index.keywords.related` | $0.002 per call · about 170 results per page |
| [Douyin index: live hot topics](apis/douyin/index/trends/list.md) | `douyin.index.trends.list` | $0.002 per call · about 30 board entries per page |
| [Douyin index: top videos for a keyword](apis/douyin/index/videos/search.md) | `douyin.index.videos.search` | $0.002 per call · about 20 videos per page |
| [Douyin account growth](apis/douyin/users/history.md) | `douyin.users.history` | $0.002 per call |
| [Douyin Xingtu creator profile](apis/douyin/xingtu/creators/get.md) | `douyin.xingtu.creators.get` | $0.004 per call |
| [Douyin Xingtu creator audience](apis/douyin/xingtu/creators/audience/get.md) | `douyin.xingtu.creators.audience.get` | $0.004 per call |
| [Douyin Xingtu creator reach](apis/douyin/xingtu/creators/metrics.md) | `douyin.xingtu.creators.metrics` | $0.004 per call |
| [Douyin Xingtu creator videos](apis/douyin/xingtu/creators/videos/list.md) | `douyin.xingtu.creators.videos.list` | $0.004 per call · about 20 videos per page |
| [Douyin Xingtu creator keywords](apis/douyin/xingtu/creators/keywords/get.md) | `douyin.xingtu.creators.keywords.get` | $0.002 per call |
| [Douyin Xingtu creator scores](apis/douyin/xingtu/creators/scores/get.md) | `douyin.xingtu.creators.scores.get` | $0.008 per call |
| [Douyin Xingtu creator content mix](apis/douyin/xingtu/creators/content_mix/get.md) | `douyin.xingtu.creators.content_mix.get` | $0.004 per call |
| [Douyin Xingtu creator conversion](apis/douyin/xingtu/creators/conversion/get.md) | `douyin.xingtu.creators.conversion.get` | $0.004 per call |
| [Douyin Xingtu marketing calendar](apis/douyin/xingtu/campaigns/list.md) | `douyin.xingtu.campaigns.list` | $0.004 per call · about 40 results per page |
| [Douyin Xingtu video report](apis/douyin/xingtu/videos/get.md) | `douyin.xingtu.videos.get` | $0.004 per call |
| [Douyin account videos (backup)](apis/douyin/backup/users/videos/list.md) | `douyin.backup.users.videos.list` | $0.0025 per call · about 20 videos per page |
| [Douyin video search (backup)](apis/douyin/backup/videos/search.md) | `douyin.backup.videos.search` | $0.03 per call · about 8 videos per page |

**Xiaohongshu (RedNote)**

| Endpoint | ID | Price |
|---|---|---|
| [Xiaohongshu note search](apis/xiaohongshu/notes/search.md) | `xiaohongshu.notes.search` | $0.02 per call · about 20 notes per page |
| [Xiaohongshu note detail](apis/xiaohongshu/notes/get.md) | `xiaohongshu.notes.get` | $0.02 per call |
| [Xiaohongshu note comments](apis/xiaohongshu/notes/comments/list.md) | `xiaohongshu.notes.comments.list` | $0.02 per call · about 10 comments per page |
| [Xiaohongshu account profile](apis/xiaohongshu/users/get.md) | `xiaohongshu.users.get` | $0.02 per call |
| [Xiaohongshu account notes](apis/xiaohongshu/users/notes/list.md) | `xiaohongshu.users.notes.list` | $0.02 per call · about 20 notes per page |
| [Xiaohongshu hot topics](apis/xiaohongshu/trends/list.md) | `xiaohongshu.trends.list` | $0.02 per call · about 20 board entries per page |
| [Xiaohongshu PGY creator search](apis/xiaohongshu/pgy/creators/search.md) | `xiaohongshu.pgy.creators.search` | $0.04 per call · about 20 creators per page |
| [Xiaohongshu PGY creator detail](apis/xiaohongshu/pgy/creators/get.md) | `xiaohongshu.pgy.creators.get` | $0.04 per call |
| [Xiaohongshu shop product search](apis/xiaohongshu/shop/products/search.md) | `xiaohongshu.shop.products.search` | $0.02 per call · about 20 products per page |
| [Xiaohongshu shop product reviews](apis/xiaohongshu/shop/products/reviews/list.md) | `xiaohongshu.shop.products.reviews.list` | $0.02 per call · about 12 reviews per page |
| [Xiaohongshu image search](apis/xiaohongshu/images/search.md) | `xiaohongshu.images.search` | $0.02 per call · about 20 posts per page |
| [Xiaohongshu comment replies](apis/xiaohongshu/comments/replies/list.md) | `xiaohongshu.comments.replies.list` | $0.02 per call · about 5 comments per page |
| [Xiaohongshu topic notes](apis/xiaohongshu/topics/notes/list.md) | `xiaohongshu.topics.notes.list` | $0.02 per call · about 10 notes per page |
| [Xiaohongshu topic detail](apis/xiaohongshu/topics/get.md) | `xiaohongshu.topics.get` | $0.02 per call |
| [Xiaohongshu account search](apis/xiaohongshu/users/search.md) | `xiaohongshu.users.search` | $0.02 per call · about 20 accounts per page |
| [Xiaohongshu shop product detail](apis/xiaohongshu/shop/products/get.md) | `xiaohongshu.shop.products.get` | $0.02 per call |
| [Xiaohongshu search suggestions](apis/xiaohongshu/keywords/related.md) | `xiaohongshu.keywords.related` | $0.02 per call · about 10 results per page |
| [Xiaohongshu video note with its video](apis/xiaohongshu/videos/get.md) | `xiaohongshu.videos.get` | $0.02 per call |
| [Xiaohongshu PGY keyword search index](apis/xiaohongshu/pgy/keywords/history.md) | `xiaohongshu.pgy.keywords.history` | $0.04 per call |
| [Xiaohongshu PGY related keywords](apis/xiaohongshu/pgy/keywords/related.md) | `xiaohongshu.pgy.keywords.related` | $0.04 per call · about 98 results per page |
| [Xiaohongshu PGY creator audience](apis/xiaohongshu/pgy/creators/audience/get.md) | `xiaohongshu.pgy.creators.audience.get` | $0.04 per call |
| [Xiaohongshu PGY creator note metrics](apis/xiaohongshu/pgy/creators/metrics.md) | `xiaohongshu.pgy.creators.metrics` | $0.04 per call |
| [Xiaohongshu PGY creator notes](apis/xiaohongshu/pgy/creators/notes/list.md) | `xiaohongshu.pgy.creators.notes.list` | $0.04 per call · about 8 notes per page |
| [Xiaohongshu PGY creator follower history](apis/xiaohongshu/pgy/creators/followers/history.md) | `xiaohongshu.pgy.creators.followers.history` | $0.04 per call |
| [Xiaohongshu PGY similar creators](apis/xiaohongshu/pgy/creators/related.md) | `xiaohongshu.pgy.creators.related` | $0.04 per call · about 4 creators per page |
| [Xiaohongshu PGY trending notes](apis/xiaohongshu/pgy/notes/trending.md) | `xiaohongshu.pgy.notes.trending` | $0.04 per call · about 34 notes per page |
| [Xiaohongshu PGY creator costs and summary](apis/xiaohongshu/pgy/creators/costs/metrics.md) | `xiaohongshu.pgy.creators.costs.metrics` | $0.04 per call |
| [Xiaohongshu PGY creator follower quality](apis/xiaohongshu/pgy/creators/followers/metrics.md) | `xiaohongshu.pgy.creators.followers.metrics` | $0.04 per call |
| [Xiaohongshu PGY creator core figures history](apis/xiaohongshu/pgy/creators/costs/history.md) | `xiaohongshu.pgy.creators.costs.history` | $0.04 per call |
| [Xiaohongshu PGY note figures](apis/xiaohongshu/pgy/notes/get.md) | `xiaohongshu.pgy.notes.get` | $0.04 per call |

**WeChat Official Accounts**

| Endpoint | ID | Price |
|---|---|---|
| [Official Account search](apis/wechat_mp/accounts/search.md) | `wechat_mp.accounts.search` | $0.058 per account · at most $0.58 per call |
| [Official Account article history](apis/wechat_mp/accounts/articles/list.md) | `wechat_mp.accounts.articles.list` | $0.02 per call · about 10 articles per page |
| [Official Account article detail](apis/wechat_mp/articles/get.md) | `wechat_mp.articles.get` | $0.02 per call |
| [Official Account profile](apis/wechat_mp/accounts/get.md) | `wechat_mp.accounts.get` | $0.02 per call |
| [Official Account article comments](apis/wechat_mp/articles/comments/list.md) | `wechat_mp.articles.comments.list` | $0.02 per call · about 20 comments per page |
| [Official Account article stats](apis/wechat_mp/articles/metrics.md) | `wechat_mp.articles.metrics` | $0.02 per call |
| [Official Account comment replies](apis/wechat_mp/comments/replies/list.md) | `wechat_mp.comments.replies.list` | $0.02 per call · about 3 comments per page |
| [Official Account owner](apis/wechat_mp/accounts/owner/get.md) (coming soon) | `wechat_mp.accounts.owner.get` | $0.15 per call |

**Bilibili**

| Endpoint | ID | Price |
|---|---|---|
| [Bilibili video search](apis/bilibili/videos/search.md) | `bilibili.videos.search` | $0.002 per call · about 20 videos per page |
| [Bilibili video detail](apis/bilibili/videos/get.md) | `bilibili.videos.get` | $0.002 per call |
| [Bilibili video comments](apis/bilibili/videos/comments/list.md) | `bilibili.videos.comments.list` | $0.002 per call · about 20 comments per page |
| [Bilibili hot searches](apis/bilibili/trends/list.md) | `bilibili.trends.list` | $0.002 per call · about 50 board entries per page |
| [Bilibili account profile](apis/bilibili/users/get.md) | `bilibili.users.get` | $0.002 per call |
| [Bilibili account videos](apis/bilibili/users/videos/list.md) | `bilibili.users.videos.list` | $0.002 per call · about 30 videos per page |
| [Bilibili comment replies](apis/bilibili/comments/replies/list.md) | `bilibili.comments.replies.list` | $0.002 per call · about 20 comments per page |
| [Bilibili popular videos](apis/bilibili/videos/trending.md) | `bilibili.videos.trending` | $0.002 per call · about 20 videos per page |
| [Bilibili account videos (backup)](apis/bilibili/backup/users/videos/list.md) | `bilibili.backup.users.videos.list` | $0.0025 per call · about 20 videos per page |

**Weibo**

| Endpoint | ID | Price |
|---|---|---|
| [Weibo post search](apis/weibo/posts/search.md) | `weibo.posts.search` | $0.002 per call · about 10 posts per page |
| [Weibo hot search](apis/weibo/trends/list.md) | `weibo.trends.list` | $0.002 per call · about 50 board entries per page |
| [Weibo account profile](apis/weibo/users/get.md) | `weibo.users.get` | $0.002 per call |
| [Weibo post detail](apis/weibo/posts/get.md) | `weibo.posts.get` | $0.002 per call |
| [Weibo post comments](apis/weibo/posts/comments/list.md) | `weibo.posts.comments.list` | $0.002 per call · about 20 comments per page |
| [Weibo comment replies](apis/weibo/comments/replies/list.md) | `weibo.comments.replies.list` | $0.002 per call · about 20 comments per page |
| [Weibo post likers](apis/weibo/posts/likers/list.md) | `weibo.posts.likers.list` | $0.002 per call · about 50 accounts per page |
| [Weibo account posts](apis/weibo/users/posts/list.md) | `weibo.users.posts.list` | $0.002 per call · about 20 posts per page |
| [Weibo account followers](apis/weibo/users/followers/list.md) | `weibo.users.followers.list` | $0.002 per call · about 20 accounts per page |
| [Weibo account search](apis/weibo/users/search.md) | `weibo.users.search` | $0.002 per call · about 20 accounts per page |
| [Weibo hot search (backup)](apis/weibo/backup/trends/list.md) | `weibo.backup.trends.list` | $0.0025 per call · about 50 board entries per page |

**TikTok**

| Endpoint | ID | Price |
|---|---|---|
| [TikTok video search](apis/tiktok/videos/search.md) | `tiktok.videos.search` | $0.002 per call · about 30 videos per page |
| [TikTok video detail](apis/tiktok/videos/get.md) | `tiktok.videos.get` | $0.002 per call |
| [TikTok video comments](apis/tiktok/videos/comments/list.md) | `tiktok.videos.comments.list` | $0.002 per call · about 50 comments per page |
| [TikTok account profile](apis/tiktok/users/get.md) | `tiktok.users.get` | $0.002 per call |
| [TikTok Ads Library search](apis/tiktok/ads/search.md) | `tiktok.ads.search` | $0.004 per call · about 12 ads per page |
| [TikTok Creative Center top ads](apis/tiktok/creative_center/ads/search.md) | `tiktok.creative_center.ads.search` | $0.002 per call · about 20 ads per page |
| [TikTok Shop product search](apis/tiktok/shop/products/search.md) | `tiktok.shop.products.search` | $0.004 per call · about 20 products per page |
| [TikTok Shop product detail](apis/tiktok/shop/products/get.md) | `tiktok.shop.products.get` | $0.002 per call |
| [TikTok Shop product reviews](apis/tiktok/shop/products/reviews/list.md) | `tiktok.shop.products.reviews.list` | $0.002 per call · about 20 reviews per page |
| [TikTok video transcript](apis/tiktok/videos/transcript/get.md) | `tiktok.videos.transcript.get` | $0.002 per call |
| [TikTok comment replies](apis/tiktok/comments/replies/list.md) | `tiktok.comments.replies.list` | $0.002 per call · about 20 comments per page |
| [TikTok account search](apis/tiktok/users/search.md) | `tiktok.users.search` | $0.002 per call · about 30 accounts per page |
| [TikTok account videos](apis/tiktok/users/videos/list.md) | `tiktok.users.videos.list` | $0.002 per call · about 10 videos per page |
| [TikTok Creative Center top ad](apis/tiktok/creative_center/ads/get.md) | `tiktok.creative_center.ads.get` | $0.002 per call |
| [TikTok Shop seller products](apis/tiktok/shop/sellers/products/list.md) | `tiktok.shop.sellers.products.list` | $0.002 per call · about 20 products per page |

**X (Twitter)**

| Endpoint | ID | Price |
|---|---|---|
| [X post detail](apis/x/posts/get.md) | `x.posts.get` | $0.0003 per call |
| [X post search](apis/x/posts/search.md) | `x.posts.search` | $0.002 per call · about 20 posts per page |
| [X account profile](apis/x/users/get.md) | `x.users.get` | $0.0004 per account · at most $0.04 per call |
| [X account posts](apis/x/users/posts/list.md) | `x.users.posts.list` | $0.002 per call · about 20 posts per page |
| [X trending topics](apis/x/trends/list.md) | `x.trends.list` | $0.009 per call · about 30 board entries per page |
| [X post replies](apis/x/posts/replies/list.md) | `x.posts.replies.list` | $0.002 per call · about 35 posts per page |
| [X post quotes](apis/x/posts/quotes/list.md) | `x.posts.quotes.list` | $0.0003 per post · at most $0.006 per call |
| [X post retweeters](apis/x/posts/retweeters/list.md) | `x.posts.retweeters.list` | $0.002 per call · about 100 accounts per page |
| [X article](apis/x/posts/article/get.md) | `x.posts.article.get` | $0.002 per call |
| [X thread](apis/x/threads/posts/list.md) | `x.threads.posts.list` | $0.0003 per post · at most $0.015 per call |
| [X account search](apis/x/users/search.md) | `x.users.search` | $0.0004 per account · at most $0.008 per call |
| [X account followers](apis/x/users/followers/list.md) | `x.users.followers.list` | $0.0001 per account · at most $0.02 per call |
| [X account following](apis/x/users/following/list.md) | `x.users.following.list` | $0.0001 per account · at most $0.02 per call |
| [X account mentions](apis/x/users/mentions/list.md) | `x.users.mentions.list` | $0.0003 per post · at most $0.006 per call |
| [X list posts](apis/x/lists/posts/list.md) | `x.lists.posts.list` | $0.002 per call · about 100 posts per page |
| [X list members](apis/x/lists/members/list.md) | `x.lists.members.list` | $0.0004 per account · at most $0.008 per call |
| [X list followers](apis/x/lists/followers/list.md) | `x.lists.followers.list` | $0.0004 per account · at most $0.008 per call |
| [X community profile](apis/x/communities/get.md) | `x.communities.get` | $0.0004 per call |
| [X community posts](apis/x/communities/posts/list.md) | `x.communities.posts.list` | $0.0003 per post · at most $0.006 per call |
| [X community members](apis/x/communities/members/list.md) | `x.communities.members.list` | $0.0004 per account · at most $0.008 per call |

**YouTube**

| Endpoint | ID | Price |
|---|---|---|
| [YouTube video search](apis/youtube/videos/search.md) | `youtube.videos.search` | $0.004 per call · about 20 videos per page |
| [YouTube video detail](apis/youtube/videos/get.md) | `youtube.videos.get` | $0.002 per call |
| [YouTube video comments](apis/youtube/videos/comments/list.md) | `youtube.videos.comments.list` | $0.002 per call · about 20 comments per page |
| [YouTube video transcript](apis/youtube/videos/transcript/get.md) | `youtube.videos.transcript.get` | $0.004 per call |
| [YouTube comment replies](apis/youtube/comments/replies/list.md) | `youtube.comments.replies.list` | $0.002 per call · about 10 comments per page |
| [YouTube channel posts](apis/youtube/channels/posts/list.md) | `youtube.channels.posts.list` | $0.002 per call · about 10 posts per page |
| [YouTube post detail](apis/youtube/posts/get.md) | `youtube.posts.get` | $0.002 per call |

**Meta Ad Library**

| Endpoint | ID | Price |
|---|---|---|
| [Meta Ad Library search](apis/meta/ads/search.md) | `meta.ads.search` | $0.004 per call · about 30 ads per page |
| [Meta Ad Library ad detail](apis/meta/ads/get.md) | `meta.ads.get` | $0.004 per call |
| [Meta advertiser ads](apis/meta/advertisers/ads/list.md) | `meta.advertisers.ads.list` | $0.004 per call · about 30 ads per page |

**Google Ads Transparency**

| Endpoint | ID | Price |
|---|---|---|
| [Google Ads Transparency advertiser search](apis/google/advertisers/search.md) | `google.advertisers.search` | $0.004 per call · about 10 advertisers per page |
| [Google advertiser ads](apis/google/advertisers/ads/list.md) | `google.advertisers.ads.list` | $0.004 per call · about 40 ads per page |

**Instagram**

| Endpoint | ID | Price |
|---|---|---|
| [Instagram account profile](apis/instagram/users/get.md) | `instagram.users.get` | $0.004 per call |
| [Instagram account posts](apis/instagram/users/posts/list.md) | `instagram.users.posts.list` | $0.004 per call · about 12 posts per page |
| [Instagram post detail](apis/instagram/posts/get.md) | `instagram.posts.get` | $0.004 per call |
| [Instagram post comments](apis/instagram/posts/comments/list.md) | `instagram.posts.comments.list` | $0.004 per call · about 15 comments per page |
| [Instagram comment replies](apis/instagram/comments/replies/list.md) | `instagram.comments.replies.list` | $0.004 per call · about 15 comments per page |
| [Instagram hashtag posts](apis/instagram/hashtags/posts/list.md) | `instagram.hashtags.posts.list` | $0.004 per call · about 10 posts per page |
| [Instagram reel transcript](apis/instagram/posts/transcript/get.md) | `instagram.posts.transcript.get` | $0.004 per call |
| [Instagram account search](apis/instagram/users/search.md) | `instagram.users.search` | $0.002 per call · about 20 accounts per page |

**Reddit**

| Endpoint | ID | Price |
|---|---|---|
| [Reddit post search](apis/reddit/posts/search.md) | `reddit.posts.search` | $0.004 per call · about 25 posts per page |
| [Reddit post detail](apis/reddit/posts/get.md) | `reddit.posts.get` | $0.002 per call |
| [Reddit post comments](apis/reddit/posts/comments/list.md) | `reddit.posts.comments.list` | $0.002 per call · about 10 comments per page |
| [Reddit Popular feed](apis/reddit/popular/posts/list.md) | `reddit.popular.posts.list` | $0.002 per call · about 10 posts per page |
| [Reddit community posts](apis/reddit/subreddits/posts/list.md) | `reddit.subreddits.posts.list` | $0.004 per call · about 25 posts per page |
| [Reddit community profile](apis/reddit/subreddits/get.md) | `reddit.subreddits.get` | $0.002 per call |
| [Reddit trending searches](apis/reddit/trends/list.md) | `reddit.trends.list` | $0.002 per call · about 6 board entries per page |
| [Reddit user profile](apis/reddit/users/get.md) | `reddit.users.get` | $0.002 per call |
| [Reddit user posts](apis/reddit/users/posts/list.md) | `reddit.users.posts.list` | $0.002 per call · about 25 posts per page |
| [Reddit user active communities](apis/reddit/users/subreddits/list.md) | `reddit.users.subreddits.list` | $0.002 per call · about 30 accounts per page |
| [Reddit video transcript](apis/reddit/posts/transcript/get.md) | `reddit.posts.transcript.get` | $0.004 per call |

**Kuaishou**

| Endpoint | ID | Price |
|---|---|---|
| [Kuaishou video search](apis/kuaishou/videos/search.md) | `kuaishou.videos.search` | $0.02 per call · about 10 videos per page |
| [Kuaishou video detail](apis/kuaishou/videos/get.md) | `kuaishou.videos.get` | $0.002 per call |
| [Kuaishou video comments](apis/kuaishou/videos/comments/list.md) | `kuaishou.videos.comments.list` | $0.002 per call · about 10 comments per page |
| [Kuaishou comment replies](apis/kuaishou/comments/replies/list.md) | `kuaishou.comments.replies.list` | $0.002 per call · about 20 comments per page |
| [Kuaishou account profile](apis/kuaishou/users/get.md) | `kuaishou.users.get` | $0.02 per call |
| [Kuaishou account search](apis/kuaishou/users/search.md) | `kuaishou.users.search` | $0.02 per call · about 20 accounts per page |
| [Kuaishou account videos](apis/kuaishou/users/videos/list.md) | `kuaishou.users.videos.list` | $0.02 per call · about 20 videos per page |
| [Kuaishou hot list](apis/kuaishou/trends/list.md) | `kuaishou.trends.list` | $0.002 per call · about 51 board entries per page |

**Zhihu**

| Endpoint | ID | Price |
|---|---|---|
| [Zhihu search](apis/zhihu/posts/search.md) | `zhihu.posts.search` | $0.002 per call · about 20 posts per page |
| [Zhihu question answers](apis/zhihu/questions/answers/list.md) | `zhihu.questions.answers.list` | $0.002 per call · about 20 posts per page |

**WeChat Channels**

| Endpoint | ID | Price |
|---|---|---|
| [WeChat Channels video search](apis/wechat_channels/videos/search.md) | `wechat_channels.videos.search` | $0.02 per call · about 10 videos per page |
| [WeChat Channels account search](apis/wechat_channels/users/search.md) | `wechat_channels.users.search` | $0.02 per call · about 1 accounts per page |
| [WeChat Channels account profile](apis/wechat_channels/users/get.md) | `wechat_channels.users.get` | $0.02 per call |
| [WeChat Channels account videos](apis/wechat_channels/users/videos/list.md) | `wechat_channels.users.videos.list` | $0.02 per call · about 15 videos per page |
| [WeChat Channels video detail](apis/wechat_channels/videos/get.md) | `wechat_channels.videos.get` | $0.02 per call |
| [WeChat Channels video comments](apis/wechat_channels/videos/comments/list.md) | `wechat_channels.videos.comments.list` | $0.015 per call · about 25 comments per page |
| [WeChat Channels comment replies](apis/wechat_channels/comments/replies/list.md) | `wechat_channels.comments.replies.list` | $0.015 per call · about 20 comments per page |
| [WeChat Channels live replays](apis/wechat_channels/users/live_replays/list.md) | `wechat_channels.users.live_replays.list` | $0.02 per call · about 48 posts per page |
| [WeChat Channels video share link](apis/wechat_channels/videos/share_link/get.md) | `wechat_channels.videos.share_link.get` | $0.02 per call |
| [WeChat Channels account collections](apis/wechat_channels/users/collections/list.md) | `wechat_channels.users.collections.list` | $0.02 per call · about 7 results per page |
| [WeChat Channels collection videos](apis/wechat_channels/collections/videos/list.md) | `wechat_channels.collections.videos.list` | $0.02 per call · about 20 videos per page |
| [WeChat Channels video stats](apis/wechat_channels/videos/metrics.md) | `wechat_channels.videos.metrics` | $0.015 per call |
| [WeChat Channels account profile (backup)](apis/wechat_channels/backup/users/get.md) | `wechat_channels.backup.users.get` | $0.03 per call |
| [WeChat Channels account videos (backup)](apis/wechat_channels/backup/users/videos/list.md) | `wechat_channels.backup.users.videos.list` | $0.06 per call · about 15 videos per page |
| [WeChat Channels video search (backup)](apis/wechat_channels/backup/videos/search.md) (coming soon) | `wechat_channels.backup.videos.search` | $0.15 per call · about 10 videos per page |

**WeChat Search**

| Endpoint | ID | Price |
|---|---|---|
| [WeChat Search articles and videos](apis/wechat/posts/search.md) | `wechat.posts.search` | $0.02 per call · about 20 posts per page |
| [WeChat Official Account live search](apis/wechat/accounts/search.md) | `wechat.accounts.search` | $0.02 per call · about 8 accounts per page |
| [WeChat Index](apis/wechat/index/keywords/history.md) (coming soon) | `wechat.index.keywords.history` | $0.15 per call · about 1 results per page |
| [WeChat Search suggestions](apis/wechat/keywords/related.md) (coming soon) | `wechat.keywords.related` | $0.15 per call · about 9 results per page |
| [WeChat mini program search](apis/wechat/miniprograms/search.md) (coming soon) | `wechat.miniprograms.search` | $0.15 per call · about 25 results per page |
| [WeChat Search articles and videos (backup)](apis/wechat/backup/posts/search.md) (coming soon) | `wechat.backup.posts.search` | $0.15 per call · about 20 posts per page |

**Telegram**

| Endpoint | ID | Price |
|---|---|---|
| [Telegram channel profile](apis/telegram/channels/get.md) | `telegram.channels.get` | $0.002 per call |
| [Telegram channel messages](apis/telegram/channels/messages/list.md) | `telegram.channels.messages.list` | $0.002 per call · about 20 posts per page |
| [Telegram message detail](apis/telegram/messages/get.md) | `telegram.messages.get` | $0.002 per call |

## 中文文档

- [zh/agents.md](zh/agents.md)：在智能体里配置 okdata
- [zh/llms.txt](zh/llms.txt)、[zh/llms-full.txt](zh/llms-full.txt)：给 AI 读的全部说明
- [zh/errors.md](zh/errors.md)：错误码、是否扣费、要不要重试
- 数据对象：[post](zh/objects/post.md)、[account](zh/objects/account.md)、[comment](zh/objects/comment.md)、[trend](zh/objects/trend.md)、[transcript](zh/objects/transcript.md)、[creator](zh/objects/creator.md)、[creator_rate](zh/objects/creator_rate.md)、[ad](zh/objects/ad.md)、[advertiser](zh/objects/advertiser.md)、[product](zh/objects/product.md)、[review](zh/objects/review.md)、[community](zh/objects/community.md)、[topic](zh/objects/topic.md)、[keyword_history](zh/objects/keyword_history.md)、[keyword_related](zh/objects/keyword_related.md)、[keyword_audience](zh/objects/keyword_audience.md)、[account_history](zh/objects/account_history.md)、[brand_history](zh/objects/brand_history.md)、[brand_metrics](zh/objects/brand_metrics.md)、[index_creator_metrics](zh/objects/index_creator_metrics.md)、[audience](zh/objects/audience.md)、[follower_history](zh/objects/follower_history.md)、[xingtu_creator_metrics](zh/objects/xingtu_creator_metrics.md)、[xingtu_creator_post](zh/objects/xingtu_creator_post.md)、[xingtu_creator_keywords](zh/objects/xingtu_creator_keywords.md)、[xingtu_creator_scores](zh/objects/xingtu_creator_scores.md)、[xingtu_creator_content_mix](zh/objects/xingtu_creator_content_mix.md)、[xingtu_creator_conversion](zh/objects/xingtu_creator_conversion.md)、[xingtu_campaign](zh/objects/xingtu_campaign.md)、[pgy_creator_metrics](zh/objects/pgy_creator_metrics.md)、[pgy_creator_post](zh/objects/pgy_creator_post.md)、[pgy_note](zh/objects/pgy_note.md)、[pgy_creator_costs](zh/objects/pgy_creator_costs.md)、[pgy_creator_followers](zh/objects/pgy_creator_followers.md)、[pgy_creator_cost_history](zh/objects/pgy_creator_cost_history.md)、[channels_collection](zh/objects/channels_collection.md)、[channels_share_link](zh/objects/channels_share_link.md)、[account_owner](zh/objects/account_owner.md)、[miniprogram](zh/objects/miniprogram.md)

**抖音**

| 接口 | ID | 价格 |
|---|---|---|
| [抖音视频搜索](zh/apis/douyin/videos/search.md) | `douyin.videos.search` | $0.02/次 · 每页约 20 条视频 |
| [抖音视频详情](zh/apis/douyin/videos/get.md) | `douyin.videos.get` | $0.002/次 |
| [抖音视频评论](zh/apis/douyin/videos/comments/list.md) | `douyin.videos.comments.list` | $0.002/次 · 每页约 20 条评论 |
| [抖音账号信息](zh/apis/douyin/users/get.md) | `douyin.users.get` | $0.002/次 |
| [抖音账号作品列表](zh/apis/douyin/users/videos/list.md) | `douyin.users.videos.list` | $0.002/次 · 每页约 20 条视频 |
| [抖音热搜榜](zh/apis/douyin/trends/list.md) | `douyin.trends.list` | $0.002/次 · 每页约 50 条榜单 |
| [抖音星图达人搜索](zh/apis/douyin/xingtu/creators/search.md) | `douyin.xingtu.creators.search` | $0.004/次 · 每页约 20 位达人 |
| [抖音星图达人报价](zh/apis/douyin/xingtu/creators/rates/get.md) | `douyin.xingtu.creators.rates.get` | $0.04/次 |
| [抖音评论回复](zh/apis/douyin/comments/replies/list.md) | `douyin.comments.replies.list` | $0.002/次 · 每页约 20 条评论 |
| [抖音话题视频](zh/apis/douyin/hashtags/videos/list.md) | `douyin.hashtags.videos.list` | $0.002/次 · 每页约 10 条视频 |
| [抖音账号搜索](zh/apis/douyin/users/search.md) | `douyin.users.search` | $0.002/次 · 每页约 30 个账号 |
| [抖音视频播放量](zh/apis/douyin/videos/metrics.md) | `douyin.videos.metrics` | $0.002/次 |
| [抖音相关视频](zh/apis/douyin/videos/related.md) | `douyin.videos.related` | $0.002/次 · 每页约 10 条视频 |
| [抖音视频榜](zh/apis/douyin/videos/trending.md) | `douyin.videos.trending` | $0.002/次 · 每页约 9 条视频 |
| [抖音搜索框联想词](zh/apis/douyin/keywords/related.md) | `douyin.keywords.related` | $0.02/次 · 每页约 10 条结果 |
| [抖音巨量算数品牌指数趋势](zh/apis/douyin/index/brands/history.md) | `douyin.index.brands.history` | $0.002/次 |
| [抖音巨量算数品牌指数对比](zh/apis/douyin/index/brands/metrics.md) | `douyin.index.brands.metrics` | $0.002/次 |
| [抖音巨量算数达人热门视频](zh/apis/douyin/index/creators/videos/list.md) | `douyin.index.creators.videos.list` | $0.002/次 · 每页约 20 条视频 |
| [抖音巨量算数达人粉丝画像](zh/apis/douyin/index/creators/audience/get.md) | `douyin.index.creators.audience.get` | $0.002/次 |
| [抖音巨量算数达人核心指标](zh/apis/douyin/index/creators/metrics.md) | `douyin.index.creators.metrics` | $0.002/次 |
| [抖音巨量算数关键词人群画像](zh/apis/douyin/index/keywords/audience/get.md) | `douyin.index.keywords.audience.get` | $0.002/次 |
| [抖音巨量算数关键词热度趋势](zh/apis/douyin/index/keywords/history.md) | `douyin.index.keywords.history` | $0.006/次 · 每页约 1 条结果 |
| [抖音巨量算数关联词](zh/apis/douyin/index/keywords/related.md) | `douyin.index.keywords.related` | $0.002/次 · 每页约 170 条结果 |
| [抖音巨量算数实时热点](zh/apis/douyin/index/trends/list.md) | `douyin.index.trends.list` | $0.002/次 · 每页约 30 条榜单 |
| [抖音巨量算数关键词热门视频](zh/apis/douyin/index/videos/search.md) | `douyin.index.videos.search` | $0.002/次 · 每页约 20 条视频 |
| [抖音达人互动与粉丝趋势](zh/apis/douyin/users/history.md) | `douyin.users.history` | $0.002/次 |
| [抖音星图达人资料](zh/apis/douyin/xingtu/creators/get.md) | `douyin.xingtu.creators.get` | $0.004/次 |
| [抖音星图达人粉丝画像](zh/apis/douyin/xingtu/creators/audience/get.md) | `douyin.xingtu.creators.audience.get` | $0.004/次 |
| [抖音星图达人传播数据](zh/apis/douyin/xingtu/creators/metrics.md) | `douyin.xingtu.creators.metrics` | $0.004/次 |
| [抖音星图达人作品表现](zh/apis/douyin/xingtu/creators/videos/list.md) | `douyin.xingtu.creators.videos.list` | $0.004/次 · 每页约 20 条视频 |
| [抖音星图达人内容热词](zh/apis/douyin/xingtu/creators/keywords/get.md) | `douyin.xingtu.creators.keywords.get` | $0.002/次 |
| [抖音星图达人星图指数](zh/apis/douyin/xingtu/creators/scores/get.md) | `douyin.xingtu.creators.scores.get` | $0.008/次 |
| [抖音星图达人内容分布](zh/apis/douyin/xingtu/creators/content_mix/get.md) | `douyin.xingtu.creators.content_mix.get` | $0.004/次 |
| [抖音星图达人转化能力](zh/apis/douyin/xingtu/creators/conversion/get.md) | `douyin.xingtu.creators.conversion.get` | $0.004/次 |
| [抖音星图营销活动日历](zh/apis/douyin/xingtu/campaigns/list.md) | `douyin.xingtu.campaigns.list` | $0.004/次 · 每页约 40 条结果 |
| [抖音星图视频数据报告](zh/apis/douyin/xingtu/videos/get.md) | `douyin.xingtu.videos.get` | $0.004/次 |
| [抖音用户视频（备用版）](zh/apis/douyin/backup/users/videos/list.md) | `douyin.backup.users.videos.list` | $0.0025/次 · 每页约 20 条视频 |
| [抖音视频搜索（备用版）](zh/apis/douyin/backup/videos/search.md) | `douyin.backup.videos.search` | $0.03/次 · 每页约 8 条视频 |

**小红书**

| 接口 | ID | 价格 |
|---|---|---|
| [小红书笔记搜索](zh/apis/xiaohongshu/notes/search.md) | `xiaohongshu.notes.search` | $0.02/次 · 每页约 20 篇笔记 |
| [小红书笔记详情](zh/apis/xiaohongshu/notes/get.md) | `xiaohongshu.notes.get` | $0.02/次 |
| [小红书笔记评论](zh/apis/xiaohongshu/notes/comments/list.md) | `xiaohongshu.notes.comments.list` | $0.02/次 · 每页约 10 条评论 |
| [小红书博主信息](zh/apis/xiaohongshu/users/get.md) | `xiaohongshu.users.get` | $0.02/次 |
| [小红书博主笔记列表](zh/apis/xiaohongshu/users/notes/list.md) | `xiaohongshu.users.notes.list` | $0.02/次 · 每页约 20 篇笔记 |
| [小红书热点话题](zh/apis/xiaohongshu/trends/list.md) | `xiaohongshu.trends.list` | $0.02/次 · 每页约 20 条榜单 |
| [小红书蒲公英达人搜索](zh/apis/xiaohongshu/pgy/creators/search.md) | `xiaohongshu.pgy.creators.search` | $0.04/次 · 每页约 20 位达人 |
| [小红书蒲公英达人详情](zh/apis/xiaohongshu/pgy/creators/get.md) | `xiaohongshu.pgy.creators.get` | $0.04/次 |
| [小红书商城商品搜索](zh/apis/xiaohongshu/shop/products/search.md) | `xiaohongshu.shop.products.search` | $0.02/次 · 每页约 20 个商品 |
| [小红书商城商品评价](zh/apis/xiaohongshu/shop/products/reviews/list.md) | `xiaohongshu.shop.products.reviews.list` | $0.02/次 · 每页约 12 条评价 |
| [小红书图片搜索](zh/apis/xiaohongshu/images/search.md) | `xiaohongshu.images.search` | $0.02/次 · 每页约 20 条帖子 |
| [小红书评论回复](zh/apis/xiaohongshu/comments/replies/list.md) | `xiaohongshu.comments.replies.list` | $0.02/次 · 每页约 5 条评论 |
| [小红书话题笔记](zh/apis/xiaohongshu/topics/notes/list.md) | `xiaohongshu.topics.notes.list` | $0.02/次 · 每页约 10 篇笔记 |
| [小红书话题详情](zh/apis/xiaohongshu/topics/get.md) | `xiaohongshu.topics.get` | $0.02/次 |
| [小红书账号搜索](zh/apis/xiaohongshu/users/search.md) | `xiaohongshu.users.search` | $0.02/次 · 每页约 20 个账号 |
| [小红书商城商品详情](zh/apis/xiaohongshu/shop/products/get.md) | `xiaohongshu.shop.products.get` | $0.02/次 |
| [小红书搜索联想词](zh/apis/xiaohongshu/keywords/related.md) | `xiaohongshu.keywords.related` | $0.02/次 · 每页约 10 条结果 |
| [小红书视频笔记详情（视频地址）](zh/apis/xiaohongshu/videos/get.md) | `xiaohongshu.videos.get` | $0.02/次 |
| [小红书蒲公英关键词搜索指数](zh/apis/xiaohongshu/pgy/keywords/history.md) | `xiaohongshu.pgy.keywords.history` | $0.04/次 |
| [小红书蒲公英关联词](zh/apis/xiaohongshu/pgy/keywords/related.md) | `xiaohongshu.pgy.keywords.related` | $0.04/次 · 每页约 98 条结果 |
| [小红书蒲公英达人粉丝画像](zh/apis/xiaohongshu/pgy/creators/audience/get.md) | `xiaohongshu.pgy.creators.audience.get` | $0.04/次 |
| [小红书蒲公英达人数据表现](zh/apis/xiaohongshu/pgy/creators/metrics.md) | `xiaohongshu.pgy.creators.metrics` | $0.04/次 |
| [小红书蒲公英达人笔记](zh/apis/xiaohongshu/pgy/creators/notes/list.md) | `xiaohongshu.pgy.creators.notes.list` | $0.04/次 · 每页约 8 篇笔记 |
| [小红书蒲公英达人粉丝趋势](zh/apis/xiaohongshu/pgy/creators/followers/history.md) | `xiaohongshu.pgy.creators.followers.history` | $0.04/次 |
| [小红书蒲公英相似达人](zh/apis/xiaohongshu/pgy/creators/related.md) | `xiaohongshu.pgy.creators.related` | $0.04/次 · 每页约 4 位达人 |
| [小红书蒲公英内容广场热门笔记](zh/apis/xiaohongshu/pgy/notes/trending.md) | `xiaohongshu.pgy.notes.trending` | $0.04/次 · 每页约 34 篇笔记 |
| [小红书蒲公英达人合作成本概览](zh/apis/xiaohongshu/pgy/creators/costs/metrics.md) | `xiaohongshu.pgy.creators.costs.metrics` | $0.04/次 |
| [小红书蒲公英达人粉丝概览](zh/apis/xiaohongshu/pgy/creators/followers/metrics.md) | `xiaohongshu.pgy.creators.followers.metrics` | $0.04/次 |
| [小红书蒲公英达人核心数据趋势](zh/apis/xiaohongshu/pgy/creators/costs/history.md) | `xiaohongshu.pgy.creators.costs.history` | $0.04/次 |
| [小红书蒲公英笔记数据](zh/apis/xiaohongshu/pgy/notes/get.md) | `xiaohongshu.pgy.notes.get` | $0.04/次 |

**微信公众号**

| 接口 | ID | 价格 |
|---|---|---|
| [公众号搜索](zh/apis/wechat_mp/accounts/search.md) | `wechat_mp.accounts.search` | $0.058/条 · 每次最多 $0.58 |
| [公众号历史文章](zh/apis/wechat_mp/accounts/articles/list.md) | `wechat_mp.accounts.articles.list` | $0.02/次 · 每页约 10 篇文章 |
| [公众号文章详情](zh/apis/wechat_mp/articles/get.md) | `wechat_mp.articles.get` | $0.02/次 |
| [公众号资料](zh/apis/wechat_mp/accounts/get.md) | `wechat_mp.accounts.get` | $0.02/次 |
| [公众号文章评论](zh/apis/wechat_mp/articles/comments/list.md) | `wechat_mp.articles.comments.list` | $0.02/次 · 每页约 20 条评论 |
| [公众号文章互动数据](zh/apis/wechat_mp/articles/metrics.md) | `wechat_mp.articles.metrics` | $0.02/次 |
| [公众号评论回复](zh/apis/wechat_mp/comments/replies/list.md) | `wechat_mp.comments.replies.list` | $0.02/次 · 每页约 3 条评论 |
| [公众号主体信息](zh/apis/wechat_mp/accounts/owner/get.md)（即将上线） | `wechat_mp.accounts.owner.get` | $0.15/次 |

**B站**

| 接口 | ID | 价格 |
|---|---|---|
| [B站视频搜索](zh/apis/bilibili/videos/search.md) | `bilibili.videos.search` | $0.002/次 · 每页约 20 条视频 |
| [B站视频详情](zh/apis/bilibili/videos/get.md) | `bilibili.videos.get` | $0.002/次 |
| [B站视频评论](zh/apis/bilibili/videos/comments/list.md) | `bilibili.videos.comments.list` | $0.002/次 · 每页约 20 条评论 |
| [B站热搜榜](zh/apis/bilibili/trends/list.md) | `bilibili.trends.list` | $0.002/次 · 每页约 50 条榜单 |
| [B站用户资料](zh/apis/bilibili/users/get.md) | `bilibili.users.get` | $0.002/次 |
| [B站用户投稿](zh/apis/bilibili/users/videos/list.md) | `bilibili.users.videos.list` | $0.002/次 · 每页约 30 条视频 |
| [B站评论回复](zh/apis/bilibili/comments/replies/list.md) | `bilibili.comments.replies.list` | $0.002/次 · 每页约 20 条评论 |
| [B站综合热门](zh/apis/bilibili/videos/trending.md) | `bilibili.videos.trending` | $0.002/次 · 每页约 20 条视频 |
| [B站用户投稿（备用版）](zh/apis/bilibili/backup/users/videos/list.md) | `bilibili.backup.users.videos.list` | $0.0025/次 · 每页约 20 条视频 |

**微博**

| 接口 | ID | 价格 |
|---|---|---|
| [微博搜索](zh/apis/weibo/posts/search.md) | `weibo.posts.search` | $0.002/次 · 每页约 10 条帖子 |
| [微博热搜](zh/apis/weibo/trends/list.md) | `weibo.trends.list` | $0.002/次 · 每页约 50 条榜单 |
| [微博账号信息](zh/apis/weibo/users/get.md) | `weibo.users.get` | $0.002/次 |
| [微博详情](zh/apis/weibo/posts/get.md) | `weibo.posts.get` | $0.002/次 |
| [微博评论](zh/apis/weibo/posts/comments/list.md) | `weibo.posts.comments.list` | $0.002/次 · 每页约 20 条评论 |
| [微博评论回复](zh/apis/weibo/comments/replies/list.md) | `weibo.comments.replies.list` | $0.002/次 · 每页约 20 条评论 |
| [微博点赞用户](zh/apis/weibo/posts/likers/list.md) | `weibo.posts.likers.list` | $0.002/次 · 每页约 50 个账号 |
| [微博用户微博](zh/apis/weibo/users/posts/list.md) | `weibo.users.posts.list` | $0.002/次 · 每页约 20 条帖子 |
| [微博用户粉丝列表](zh/apis/weibo/users/followers/list.md) | `weibo.users.followers.list` | $0.002/次 · 每页约 20 个账号 |
| [微博用户搜索](zh/apis/weibo/users/search.md) | `weibo.users.search` | $0.002/次 · 每页约 20 个账号 |
| [微博热搜榜（备用版）](zh/apis/weibo/backup/trends/list.md) | `weibo.backup.trends.list` | $0.0025/次 · 每页约 50 条榜单 |

**TikTok**

| 接口 | ID | 价格 |
|---|---|---|
| [TikTok 视频搜索](zh/apis/tiktok/videos/search.md) | `tiktok.videos.search` | $0.002/次 · 每页约 30 条视频 |
| [TikTok 视频详情](zh/apis/tiktok/videos/get.md) | `tiktok.videos.get` | $0.002/次 |
| [TikTok 视频评论](zh/apis/tiktok/videos/comments/list.md) | `tiktok.videos.comments.list` | $0.002/次 · 每页约 50 条评论 |
| [TikTok 账号信息](zh/apis/tiktok/users/get.md) | `tiktok.users.get` | $0.002/次 |
| [TikTok 广告库搜索](zh/apis/tiktok/ads/search.md) | `tiktok.ads.search` | $0.004/次 · 每页约 12 条广告 |
| [TikTok 创意中心热门广告](zh/apis/tiktok/creative_center/ads/search.md) | `tiktok.creative_center.ads.search` | $0.002/次 · 每页约 20 条广告 |
| [TikTok Shop 商品搜索](zh/apis/tiktok/shop/products/search.md) | `tiktok.shop.products.search` | $0.004/次 · 每页约 20 个商品 |
| [TikTok Shop 商品详情](zh/apis/tiktok/shop/products/get.md) | `tiktok.shop.products.get` | $0.002/次 |
| [TikTok Shop 商品评价](zh/apis/tiktok/shop/products/reviews/list.md) | `tiktok.shop.products.reviews.list` | $0.002/次 · 每页约 20 条评价 |
| [TikTok 视频字幕](zh/apis/tiktok/videos/transcript/get.md) | `tiktok.videos.transcript.get` | $0.002/次 |
| [TikTok 评论回复](zh/apis/tiktok/comments/replies/list.md) | `tiktok.comments.replies.list` | $0.002/次 · 每页约 20 条评论 |
| [TikTok 账号搜索](zh/apis/tiktok/users/search.md) | `tiktok.users.search` | $0.002/次 · 每页约 30 个账号 |
| [TikTok 账号作品](zh/apis/tiktok/users/videos/list.md) | `tiktok.users.videos.list` | $0.002/次 · 每页约 10 条视频 |
| [TikTok 创意中心热门广告详情](zh/apis/tiktok/creative_center/ads/get.md) | `tiktok.creative_center.ads.get` | $0.002/次 |
| [TikTok Shop 店铺商品](zh/apis/tiktok/shop/sellers/products/list.md) | `tiktok.shop.sellers.products.list` | $0.002/次 · 每页约 20 个商品 |

**X（推特）**

| 接口 | ID | 价格 |
|---|---|---|
| [X 帖子详情](zh/apis/x/posts/get.md) | `x.posts.get` | $0.0003/次 |
| [X 帖子搜索](zh/apis/x/posts/search.md) | `x.posts.search` | $0.002/次 · 每页约 20 条帖子 |
| [X 账号信息](zh/apis/x/users/get.md) | `x.users.get` | $0.0004/条 · 每次最多 $0.04 |
| [X 账号帖子列表](zh/apis/x/users/posts/list.md) | `x.users.posts.list` | $0.002/次 · 每页约 20 条帖子 |
| [X 趋势](zh/apis/x/trends/list.md) | `x.trends.list` | $0.009/次 · 每页约 30 条榜单 |
| [X 帖子回复](zh/apis/x/posts/replies/list.md) | `x.posts.replies.list` | $0.002/次 · 每页约 35 条帖子 |
| [X 帖子引用](zh/apis/x/posts/quotes/list.md) | `x.posts.quotes.list` | $0.0003/条 · 每次最多 $0.006 |
| [X 帖子转推用户](zh/apis/x/posts/retweeters/list.md) | `x.posts.retweeters.list` | $0.002/次 · 每页约 100 个账号 |
| [X 长文](zh/apis/x/posts/article/get.md) | `x.posts.article.get` | $0.002/次 |
| [X 对话串](zh/apis/x/threads/posts/list.md) | `x.threads.posts.list` | $0.0003/条 · 每次最多 $0.015 |
| [X 账号搜索](zh/apis/x/users/search.md) | `x.users.search` | $0.0004/条 · 每次最多 $0.008 |
| [X 账号粉丝](zh/apis/x/users/followers/list.md) | `x.users.followers.list` | $0.0001/条 · 每次最多 $0.02 |
| [X 账号关注](zh/apis/x/users/following/list.md) | `x.users.following.list` | $0.0001/条 · 每次最多 $0.02 |
| [X 账号被提及](zh/apis/x/users/mentions/list.md) | `x.users.mentions.list` | $0.0003/条 · 每次最多 $0.006 |
| [X 列表帖子](zh/apis/x/lists/posts/list.md) | `x.lists.posts.list` | $0.002/次 · 每页约 100 条帖子 |
| [X 列表成员](zh/apis/x/lists/members/list.md) | `x.lists.members.list` | $0.0004/条 · 每次最多 $0.008 |
| [X 列表关注者](zh/apis/x/lists/followers/list.md) | `x.lists.followers.list` | $0.0004/条 · 每次最多 $0.008 |
| [X 社群资料](zh/apis/x/communities/get.md) | `x.communities.get` | $0.0004/次 |
| [X 社群帖子](zh/apis/x/communities/posts/list.md) | `x.communities.posts.list` | $0.0003/条 · 每次最多 $0.006 |
| [X 社群成员](zh/apis/x/communities/members/list.md) | `x.communities.members.list` | $0.0004/条 · 每次最多 $0.008 |

**YouTube**

| 接口 | ID | 价格 |
|---|---|---|
| [YouTube 视频搜索](zh/apis/youtube/videos/search.md) | `youtube.videos.search` | $0.004/次 · 每页约 20 条视频 |
| [YouTube 视频详情](zh/apis/youtube/videos/get.md) | `youtube.videos.get` | $0.002/次 |
| [YouTube 视频评论](zh/apis/youtube/videos/comments/list.md) | `youtube.videos.comments.list` | $0.002/次 · 每页约 20 条评论 |
| [YouTube 视频字幕](zh/apis/youtube/videos/transcript/get.md) | `youtube.videos.transcript.get` | $0.004/次 |
| [YouTube 评论回复](zh/apis/youtube/comments/replies/list.md) | `youtube.comments.replies.list` | $0.002/次 · 每页约 10 条评论 |
| [YouTube 频道帖子](zh/apis/youtube/channels/posts/list.md) | `youtube.channels.posts.list` | $0.002/次 · 每页约 10 条帖子 |
| [YouTube 帖子详情](zh/apis/youtube/posts/get.md) | `youtube.posts.get` | $0.002/次 |

**Meta 广告库**

| 接口 | ID | 价格 |
|---|---|---|
| [Meta 广告库搜索](zh/apis/meta/ads/search.md) | `meta.ads.search` | $0.004/次 · 每页约 30 条广告 |
| [Meta 广告详情](zh/apis/meta/ads/get.md) | `meta.ads.get` | $0.004/次 |
| [Meta 广告主的广告](zh/apis/meta/advertisers/ads/list.md) | `meta.advertisers.ads.list` | $0.004/次 · 每页约 30 条广告 |

**Google 广告透明中心**

| 接口 | ID | 价格 |
|---|---|---|
| [Google 广告透明中心广告主搜索](zh/apis/google/advertisers/search.md) | `google.advertisers.search` | $0.004/次 · 每页约 10 个广告主 |
| [Google 广告主的广告](zh/apis/google/advertisers/ads/list.md) | `google.advertisers.ads.list` | $0.004/次 · 每页约 40 条广告 |

**Instagram**

| 接口 | ID | 价格 |
|---|---|---|
| [Instagram 账号信息](zh/apis/instagram/users/get.md) | `instagram.users.get` | $0.004/次 |
| [Instagram 账号帖子](zh/apis/instagram/users/posts/list.md) | `instagram.users.posts.list` | $0.004/次 · 每页约 12 条帖子 |
| [Instagram 帖子详情](zh/apis/instagram/posts/get.md) | `instagram.posts.get` | $0.004/次 |
| [Instagram 帖子评论](zh/apis/instagram/posts/comments/list.md) | `instagram.posts.comments.list` | $0.004/次 · 每页约 15 条评论 |
| [Instagram 评论回复](zh/apis/instagram/comments/replies/list.md) | `instagram.comments.replies.list` | $0.004/次 · 每页约 15 条评论 |
| [Instagram 话题帖子](zh/apis/instagram/hashtags/posts/list.md) | `instagram.hashtags.posts.list` | $0.004/次 · 每页约 10 条帖子 |
| [Instagram 视频字幕](zh/apis/instagram/posts/transcript/get.md) | `instagram.posts.transcript.get` | $0.004/次 |
| [Instagram 账号搜索](zh/apis/instagram/users/search.md) | `instagram.users.search` | $0.002/次 · 每页约 20 个账号 |

**Reddit**

| 接口 | ID | 价格 |
|---|---|---|
| [Reddit 帖子搜索](zh/apis/reddit/posts/search.md) | `reddit.posts.search` | $0.004/次 · 每页约 25 条帖子 |
| [Reddit 帖子详情](zh/apis/reddit/posts/get.md) | `reddit.posts.get` | $0.002/次 |
| [Reddit 帖子评论](zh/apis/reddit/posts/comments/list.md) | `reddit.posts.comments.list` | $0.002/次 · 每页约 10 条评论 |
| [Reddit 热门帖子](zh/apis/reddit/popular/posts/list.md) | `reddit.popular.posts.list` | $0.002/次 · 每页约 10 条帖子 |
| [Reddit 社区帖子](zh/apis/reddit/subreddits/posts/list.md) | `reddit.subreddits.posts.list` | $0.004/次 · 每页约 25 条帖子 |
| [Reddit 社区资料](zh/apis/reddit/subreddits/get.md) | `reddit.subreddits.get` | $0.002/次 |
| [Reddit 趋势搜索](zh/apis/reddit/trends/list.md) | `reddit.trends.list` | $0.002/次 · 每页约 6 条榜单 |
| [Reddit 用户资料](zh/apis/reddit/users/get.md) | `reddit.users.get` | $0.002/次 |
| [Reddit 用户帖子](zh/apis/reddit/users/posts/list.md) | `reddit.users.posts.list` | $0.002/次 · 每页约 25 条帖子 |
| [Reddit 用户活跃社区](zh/apis/reddit/users/subreddits/list.md) | `reddit.users.subreddits.list` | $0.002/次 · 每页约 30 个账号 |
| [Reddit 视频字幕](zh/apis/reddit/posts/transcript/get.md) | `reddit.posts.transcript.get` | $0.004/次 |

**快手**

| 接口 | ID | 价格 |
|---|---|---|
| [快手视频搜索](zh/apis/kuaishou/videos/search.md) | `kuaishou.videos.search` | $0.02/次 · 每页约 10 条视频 |
| [快手作品详情](zh/apis/kuaishou/videos/get.md) | `kuaishou.videos.get` | $0.002/次 |
| [快手作品评论](zh/apis/kuaishou/videos/comments/list.md) | `kuaishou.videos.comments.list` | $0.002/次 · 每页约 10 条评论 |
| [快手评论回复](zh/apis/kuaishou/comments/replies/list.md) | `kuaishou.comments.replies.list` | $0.002/次 · 每页约 20 条评论 |
| [快手账号信息](zh/apis/kuaishou/users/get.md) | `kuaishou.users.get` | $0.02/次 |
| [快手账号搜索](zh/apis/kuaishou/users/search.md) | `kuaishou.users.search` | $0.02/次 · 每页约 20 个账号 |
| [快手账号作品](zh/apis/kuaishou/users/videos/list.md) | `kuaishou.users.videos.list` | $0.02/次 · 每页约 20 条视频 |
| [快手热榜](zh/apis/kuaishou/trends/list.md) | `kuaishou.trends.list` | $0.002/次 · 每页约 51 条榜单 |

**知乎**

| 接口 | ID | 价格 |
|---|---|---|
| [知乎内容搜索](zh/apis/zhihu/posts/search.md) | `zhihu.posts.search` | $0.002/次 · 每页约 20 条帖子 |
| [知乎问题回答](zh/apis/zhihu/questions/answers/list.md) | `zhihu.questions.answers.list` | $0.002/次 · 每页约 20 条帖子 |

**微信视频号**

| 接口 | ID | 价格 |
|---|---|---|
| [视频号视频搜索](zh/apis/wechat_channels/videos/search.md) | `wechat_channels.videos.search` | $0.02/次 · 每页约 10 条视频 |
| [视频号账号搜索](zh/apis/wechat_channels/users/search.md) | `wechat_channels.users.search` | $0.02/次 · 每页约 1 个账号 |
| [视频号账号信息](zh/apis/wechat_channels/users/get.md) | `wechat_channels.users.get` | $0.02/次 |
| [视频号账号作品](zh/apis/wechat_channels/users/videos/list.md) | `wechat_channels.users.videos.list` | $0.02/次 · 每页约 15 条视频 |
| [视频号作品详情](zh/apis/wechat_channels/videos/get.md) | `wechat_channels.videos.get` | $0.02/次 |
| [视频号作品评论](zh/apis/wechat_channels/videos/comments/list.md) | `wechat_channels.videos.comments.list` | $0.015/次 · 每页约 25 条评论 |
| [视频号评论回复](zh/apis/wechat_channels/comments/replies/list.md) | `wechat_channels.comments.replies.list` | $0.015/次 · 每页约 20 条评论 |
| [视频号直播回放](zh/apis/wechat_channels/users/live_replays/list.md) | `wechat_channels.users.live_replays.list` | $0.02/次 · 每页约 48 条帖子 |
| [视频号作品分享链接](zh/apis/wechat_channels/videos/share_link/get.md) | `wechat_channels.videos.share_link.get` | $0.02/次 |
| [视频号账号合集](zh/apis/wechat_channels/users/collections/list.md) | `wechat_channels.users.collections.list` | $0.02/次 · 每页约 7 条结果 |
| [视频号合集视频](zh/apis/wechat_channels/collections/videos/list.md) | `wechat_channels.collections.videos.list` | $0.02/次 · 每页约 20 条视频 |
| [视频号作品互动数据](zh/apis/wechat_channels/videos/metrics.md) | `wechat_channels.videos.metrics` | $0.015/次 |
| [视频号账号信息（备用版）](zh/apis/wechat_channels/backup/users/get.md) | `wechat_channels.backup.users.get` | $0.03/次 |
| [视频号账号作品（备用版）](zh/apis/wechat_channels/backup/users/videos/list.md) | `wechat_channels.backup.users.videos.list` | $0.06/次 · 每页约 15 条视频 |
| [视频号视频搜索（备用版）](zh/apis/wechat_channels/backup/videos/search.md)（即将上线） | `wechat_channels.backup.videos.search` | $0.15/次 · 每页约 10 条视频 |

**微信搜一搜**

| 接口 | ID | 价格 |
|---|---|---|
| [微信搜一搜综合搜索](zh/apis/wechat/posts/search.md) | `wechat.posts.search` | $0.02/次 · 每页约 20 条帖子 |
| [微信公众号实时查找](zh/apis/wechat/accounts/search.md) | `wechat.accounts.search` | $0.02/次 · 每页约 8 个账号 |
| [微信指数](zh/apis/wechat/index/keywords/history.md)（即将上线） | `wechat.index.keywords.history` | $0.15/次 · 每页约 1 条结果 |
| [微信搜一搜推荐词](zh/apis/wechat/keywords/related.md)（即将上线） | `wechat.keywords.related` | $0.15/次 · 每页约 9 条结果 |
| [微信小程序搜索](zh/apis/wechat/miniprograms/search.md)（即将上线） | `wechat.miniprograms.search` | $0.15/次 · 每页约 25 条结果 |
| [微信搜一搜综合搜索（备用版）](zh/apis/wechat/backup/posts/search.md)（即将上线） | `wechat.backup.posts.search` | $0.15/次 · 每页约 20 条帖子 |

**Telegram**

| 接口 | ID | 价格 |
|---|---|---|
| [Telegram 频道资料](zh/apis/telegram/channels/get.md) | `telegram.channels.get` | $0.002/次 |
| [Telegram 频道消息](zh/apis/telegram/channels/messages/list.md) | `telegram.channels.messages.list` | $0.002/次 · 每页约 20 条帖子 |
| [Telegram 单条消息](zh/apis/telegram/messages/get.md) | `telegram.messages.get` | $0.002/次 |
