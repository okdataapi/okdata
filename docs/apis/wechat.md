# WeChat Search API

> WeChat Search across Official Account articles, Channels videos and mini programs.

Canonical page: https://okdata.online/apis/wechat/

6 endpoints, $0.02 to $0.15 per call. Region: Mainland China. No WeChat Search login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [WeChat Search articles and videos](https://okdata.online/apis/wechat/posts/search/) | `wechat.posts.search` | Post[] | $0.02 per call · about 20 posts per page |
| [WeChat Official Account live search](https://okdata.online/apis/wechat/accounts/search/) | `wechat.accounts.search` | Account[] | $0.02 per call · about 8 accounts per page |
| [WeChat Index](https://okdata.online/apis/wechat/index/keywords/history/) | `wechat.index.keywords.history` | KeywordHistory[] | $0.15 per call · about 1 results per page |
| [WeChat Search suggestions](https://okdata.online/apis/wechat/keywords/related/) | `wechat.keywords.related` | KeywordRelated[] | $0.15 per call · about 9 results per page |
| [WeChat mini program search](https://okdata.online/apis/wechat/miniprograms/search/) | `wechat.miniprograms.search` | Miniprogram[] | $0.15 per call · about 25 results per page |
| [WeChat Search articles and videos (backup)](https://okdata.online/apis/wechat/backup/posts/search/) | `wechat.backup.posts.search` | Post[] | $0.15 per call · about 20 posts per page |

## Good for

- Content research: `wechat.posts.search`, `wechat.keywords.related`, `wechat.backup.posts.search`
- Trend research: `wechat.posts.search`, `wechat.index.keywords.history`, `wechat.keywords.related`, `wechat.backup.posts.search`
- Word of mouth: `wechat.posts.search`, `wechat.backup.posts.search`
- Competitor monitoring: `wechat.accounts.search`, `wechat.miniprograms.search`
- Creator discovery: `wechat.accounts.search`
- Product research: `wechat.miniprograms.search`
