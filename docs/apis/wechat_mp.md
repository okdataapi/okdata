# WeChat Official Accounts API

> Official Account articles and history, without a QR login.

Canonical page: https://okdata.online/apis/wechat_mp/

8 endpoints, $0.02 to $0.15 per call. Region: Mainland China. No WeChat Official Accounts login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/) | `wechat_mp.accounts.search` | Account[] | $0.058 per account · at most $0.58 per call |
| [Official Account article history](https://okdata.online/apis/wechat_mp/accounts/articles/list/) | `wechat_mp.accounts.articles.list` | Post[] | $0.02 per call · about 10 articles per page |
| [Official Account article detail](https://okdata.online/apis/wechat_mp/articles/get/) | `wechat_mp.articles.get` | Post | $0.02 per call |
| [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/) | `wechat_mp.accounts.get` | Account | $0.02 per call |
| [Official Account article comments](https://okdata.online/apis/wechat_mp/articles/comments/list/) | `wechat_mp.articles.comments.list` | Comment[] | $0.02 per call · about 20 comments per page |
| [Official Account article stats](https://okdata.online/apis/wechat_mp/articles/metrics/) | `wechat_mp.articles.metrics` | Post | $0.02 per call |
| [Official Account comment replies](https://okdata.online/apis/wechat_mp/comments/replies/list/) | `wechat_mp.comments.replies.list` | Comment[] | $0.02 per call · about 3 comments per page |
| [Official Account owner](https://okdata.online/apis/wechat_mp/accounts/owner/get/) | `wechat_mp.accounts.owner.get` | AccountOwner | $0.15 per call |

## Good for

- Competitor monitoring: `wechat_mp.accounts.search`, `wechat_mp.accounts.articles.list`, `wechat_mp.accounts.get`, `wechat_mp.articles.metrics`, `wechat_mp.accounts.owner.get`
- Content research: `wechat_mp.accounts.articles.list`, `wechat_mp.articles.get`, `wechat_mp.articles.metrics`
- Word of mouth: `wechat_mp.articles.comments.list`, `wechat_mp.comments.replies.list`
