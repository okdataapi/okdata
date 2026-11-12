# X（推特） API

> 帖子、账号、搜索和趋势。

网页版：https://okdata.online/zh/apis/x/

20 个接口，每次 $0.0001 到 $0.009。地区：海外。不需要X（推特）账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [X 帖子详情](https://okdata.online/zh/apis/x/posts/get/) | `x.posts.get` | Post | $0.0003/次 |
| [X 帖子搜索](https://okdata.online/zh/apis/x/posts/search/) | `x.posts.search` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [X 账号信息](https://okdata.online/zh/apis/x/users/get/) | `x.users.get` | Account | $0.0004/条 · 每次最多 $0.04 |
| [X 账号帖子列表](https://okdata.online/zh/apis/x/users/posts/list/) | `x.users.posts.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [X 趋势](https://okdata.online/zh/apis/x/trends/list/) | `x.trends.list` | Trend[] | $0.009/次 · 每页约 30 条榜单 |
| [X 帖子回复](https://okdata.online/zh/apis/x/posts/replies/list/) | `x.posts.replies.list` | Post[] | $0.002/次 · 每页约 35 条帖子 |
| [X 帖子引用](https://okdata.online/zh/apis/x/posts/quotes/list/) | `x.posts.quotes.list` | Post[] | $0.0003/条 · 每次最多 $0.006 |
| [X 帖子转推用户](https://okdata.online/zh/apis/x/posts/retweeters/list/) | `x.posts.retweeters.list` | Account[] | $0.002/次 · 每页约 100 个账号 |
| [X 长文](https://okdata.online/zh/apis/x/posts/article/get/) | `x.posts.article.get` | Post | $0.002/次 |
| [X 对话串](https://okdata.online/zh/apis/x/threads/posts/list/) | `x.threads.posts.list` | Post[] | $0.0003/条 · 每次最多 $0.015 |
| [X 账号搜索](https://okdata.online/zh/apis/x/users/search/) | `x.users.search` | Account[] | $0.0004/条 · 每次最多 $0.008 |
| [X 账号粉丝](https://okdata.online/zh/apis/x/users/followers/list/) | `x.users.followers.list` | Account[] | $0.0001/条 · 每次最多 $0.02 |
| [X 账号关注](https://okdata.online/zh/apis/x/users/following/list/) | `x.users.following.list` | Account[] | $0.0001/条 · 每次最多 $0.02 |
| [X 账号被提及](https://okdata.online/zh/apis/x/users/mentions/list/) | `x.users.mentions.list` | Post[] | $0.0003/条 · 每次最多 $0.006 |
| [X 列表帖子](https://okdata.online/zh/apis/x/lists/posts/list/) | `x.lists.posts.list` | Post[] | $0.002/次 · 每页约 100 条帖子 |
| [X 列表成员](https://okdata.online/zh/apis/x/lists/members/list/) | `x.lists.members.list` | Account[] | $0.0004/条 · 每次最多 $0.008 |
| [X 列表关注者](https://okdata.online/zh/apis/x/lists/followers/list/) | `x.lists.followers.list` | Account[] | $0.0004/条 · 每次最多 $0.008 |
| [X 社群资料](https://okdata.online/zh/apis/x/communities/get/) | `x.communities.get` | Community | $0.0004/次 |
| [X 社群帖子](https://okdata.online/zh/apis/x/communities/posts/list/) | `x.communities.posts.list` | Post[] | $0.0003/条 · 每次最多 $0.006 |
| [X 社群成员](https://okdata.online/zh/apis/x/communities/members/list/) | `x.communities.members.list` | Account[] | $0.0004/条 · 每次最多 $0.008 |

## 适合做什么

- 竞品监控: `x.posts.get`, `x.users.get`, `x.users.posts.list`, `x.users.search`, `x.users.followers.list`, `x.users.following.list`, `x.users.mentions.list`, `x.lists.posts.list`
- 内容调研: `x.posts.get`, `x.posts.article.get`, `x.threads.posts.list`, `x.communities.get`, `x.communities.posts.list`
- 口碑分析: `x.posts.search`, `x.posts.replies.list`, `x.posts.quotes.list`, `x.posts.retweeters.list`, `x.users.mentions.list`, `x.communities.posts.list`
- 热点研究: `x.posts.search`, `x.trends.list`
- 找博主: `x.users.get`, `x.posts.retweeters.list`, `x.users.search`, `x.users.followers.list`, `x.users.following.list`, `x.lists.members.list`, `x.lists.followers.list`, `x.communities.members.list`
