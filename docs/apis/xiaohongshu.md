# Xiaohongshu (RedNote) API

> Lifestyle notes, creators and what people search for.

Canonical page: https://okdata.online/apis/xiaohongshu/

30 endpoints, $0.02 to $0.04 per call. Region: Mainland China. No Xiaohongshu (RedNote) login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Xiaohongshu note search](https://okdata.online/apis/xiaohongshu/notes/search/) | `xiaohongshu.notes.search` | Post[] | $0.02 per call · about 20 notes per page |
| [Xiaohongshu note detail](https://okdata.online/apis/xiaohongshu/notes/get/) | `xiaohongshu.notes.get` | Post | $0.02 per call |
| [Xiaohongshu note comments](https://okdata.online/apis/xiaohongshu/notes/comments/list/) | `xiaohongshu.notes.comments.list` | Comment[] | $0.02 per call · about 10 comments per page |
| [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/) | `xiaohongshu.users.get` | Account | $0.02 per call |
| [Xiaohongshu account notes](https://okdata.online/apis/xiaohongshu/users/notes/list/) | `xiaohongshu.users.notes.list` | Post[] | $0.02 per call · about 20 notes per page |
| [Xiaohongshu hot topics](https://okdata.online/apis/xiaohongshu/trends/list/) | `xiaohongshu.trends.list` | Trend[] | $0.02 per call · about 20 board entries per page |
| [Xiaohongshu PGY creator search](https://okdata.online/apis/xiaohongshu/pgy/creators/search/) | `xiaohongshu.pgy.creators.search` | Creator[] | $0.04 per call · about 20 creators per page |
| [Xiaohongshu PGY creator detail](https://okdata.online/apis/xiaohongshu/pgy/creators/get/) | `xiaohongshu.pgy.creators.get` | Creator | $0.04 per call |
| [Xiaohongshu shop product search](https://okdata.online/apis/xiaohongshu/shop/products/search/) | `xiaohongshu.shop.products.search` | Product[] | $0.02 per call · about 20 products per page |
| [Xiaohongshu shop product reviews](https://okdata.online/apis/xiaohongshu/shop/products/reviews/list/) | `xiaohongshu.shop.products.reviews.list` | Review[] | $0.02 per call · about 12 reviews per page |
| [Xiaohongshu image search](https://okdata.online/apis/xiaohongshu/images/search/) | `xiaohongshu.images.search` | Post[] | $0.02 per call · about 20 posts per page |
| [Xiaohongshu comment replies](https://okdata.online/apis/xiaohongshu/comments/replies/list/) | `xiaohongshu.comments.replies.list` | Comment[] | $0.02 per call · about 5 comments per page |
| [Xiaohongshu topic notes](https://okdata.online/apis/xiaohongshu/topics/notes/list/) | `xiaohongshu.topics.notes.list` | Post[] | $0.02 per call · about 10 notes per page |
| [Xiaohongshu topic detail](https://okdata.online/apis/xiaohongshu/topics/get/) | `xiaohongshu.topics.get` | Topic | $0.02 per call |
| [Xiaohongshu account search](https://okdata.online/apis/xiaohongshu/users/search/) | `xiaohongshu.users.search` | Account[] | $0.02 per call · about 20 accounts per page |
| [Xiaohongshu shop product detail](https://okdata.online/apis/xiaohongshu/shop/products/get/) | `xiaohongshu.shop.products.get` | Product | $0.02 per call |
| [Xiaohongshu search suggestions](https://okdata.online/apis/xiaohongshu/keywords/related/) | `xiaohongshu.keywords.related` | KeywordRelated[] | $0.02 per call · about 10 results per page |
| [Xiaohongshu video note with its video](https://okdata.online/apis/xiaohongshu/videos/get/) | `xiaohongshu.videos.get` | Post | $0.02 per call |
| [Xiaohongshu PGY keyword search index](https://okdata.online/apis/xiaohongshu/pgy/keywords/history/) | `xiaohongshu.pgy.keywords.history` | KeywordHistory | $0.04 per call |
| [Xiaohongshu PGY related keywords](https://okdata.online/apis/xiaohongshu/pgy/keywords/related/) | `xiaohongshu.pgy.keywords.related` | KeywordRelated[] | $0.04 per call · about 98 results per page |
| [Xiaohongshu PGY creator audience](https://okdata.online/apis/xiaohongshu/pgy/creators/audience/get/) | `xiaohongshu.pgy.creators.audience.get` | Audience | $0.04 per call |
| [Xiaohongshu PGY creator note metrics](https://okdata.online/apis/xiaohongshu/pgy/creators/metrics/) | `xiaohongshu.pgy.creators.metrics` | PgyCreatorMetrics | $0.04 per call |
| [Xiaohongshu PGY creator notes](https://okdata.online/apis/xiaohongshu/pgy/creators/notes/list/) | `xiaohongshu.pgy.creators.notes.list` | PgyCreatorPost[] | $0.04 per call · about 8 notes per page |
| [Xiaohongshu PGY creator follower history](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/history/) | `xiaohongshu.pgy.creators.followers.history` | FollowerHistory | $0.04 per call |
| [Xiaohongshu PGY similar creators](https://okdata.online/apis/xiaohongshu/pgy/creators/related/) | `xiaohongshu.pgy.creators.related` | Creator[] | $0.04 per call · about 4 creators per page |
| [Xiaohongshu PGY trending notes](https://okdata.online/apis/xiaohongshu/pgy/notes/trending/) | `xiaohongshu.pgy.notes.trending` | Post[] | $0.04 per call · about 34 notes per page |
| [Xiaohongshu PGY creator costs and summary](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/metrics/) | `xiaohongshu.pgy.creators.costs.metrics` | PgyCreatorCosts | $0.04 per call |
| [Xiaohongshu PGY creator follower quality](https://okdata.online/apis/xiaohongshu/pgy/creators/followers/metrics/) | `xiaohongshu.pgy.creators.followers.metrics` | PgyCreatorFollowers | $0.04 per call |
| [Xiaohongshu PGY creator core figures history](https://okdata.online/apis/xiaohongshu/pgy/creators/costs/history/) | `xiaohongshu.pgy.creators.costs.history` | PgyCreatorCostHistory | $0.04 per call |
| [Xiaohongshu PGY note figures](https://okdata.online/apis/xiaohongshu/pgy/notes/get/) | `xiaohongshu.pgy.notes.get` | PgyNote | $0.04 per call |

## Good for

- Content research: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.images.search`, `xiaohongshu.topics.notes.list`, `xiaohongshu.keywords.related`, `xiaohongshu.videos.get`, `xiaohongshu.pgy.keywords.history`, `xiaohongshu.pgy.keywords.related`, `xiaohongshu.pgy.notes.trending`
- Word of mouth: `xiaohongshu.notes.search`, `xiaohongshu.notes.comments.list`, `xiaohongshu.shop.products.reviews.list`, `xiaohongshu.comments.replies.list`
- Competitor monitoring: `xiaohongshu.notes.search`, `xiaohongshu.notes.get`, `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`, `xiaohongshu.shop.products.search`, `xiaohongshu.users.search`, `xiaohongshu.shop.products.get`, `xiaohongshu.pgy.creators.notes.list`, `xiaohongshu.pgy.notes.get`
- Creator discovery: `xiaohongshu.users.get`, `xiaohongshu.users.notes.list`, `xiaohongshu.pgy.creators.search`, `xiaohongshu.pgy.creators.get`, `xiaohongshu.users.search`, `xiaohongshu.pgy.creators.audience.get`, `xiaohongshu.pgy.creators.metrics`, `xiaohongshu.pgy.creators.notes.list`, `xiaohongshu.pgy.creators.followers.history`, `xiaohongshu.pgy.creators.related`, `xiaohongshu.pgy.creators.costs.metrics`, `xiaohongshu.pgy.creators.followers.metrics`, `xiaohongshu.pgy.creators.costs.history`, `xiaohongshu.pgy.notes.get`
- Trend research: `xiaohongshu.trends.list`, `xiaohongshu.images.search`, `xiaohongshu.topics.notes.list`, `xiaohongshu.topics.get`, `xiaohongshu.keywords.related`, `xiaohongshu.pgy.keywords.history`, `xiaohongshu.pgy.keywords.related`, `xiaohongshu.pgy.notes.trending`
- Product research: `xiaohongshu.shop.products.search`, `xiaohongshu.shop.products.reviews.list`, `xiaohongshu.shop.products.get`
- Transcripts: `xiaohongshu.videos.get`
