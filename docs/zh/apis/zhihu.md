# 知乎 API

> 问题和回答、文章、专栏、用户和热榜。

网页版：https://okdata.online/zh/apis/zhihu/

15 个接口，每次 $0.002 到 $0.002。地区：中国大陆。不需要知乎账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [知乎内容搜索](https://okdata.online/zh/apis/zhihu/posts/search/) | `zhihu.posts.search` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [知乎问题回答](https://okdata.online/zh/apis/zhihu/questions/answers/list/) | `zhihu.questions.answers.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [知乎问题详情](https://okdata.online/zh/apis/zhihu/questions/get/) | `zhihu.questions.get` | Post | $0.002/次 |
| [知乎回答详情](https://okdata.online/zh/apis/zhihu/answers/get/) | `zhihu.answers.get` | Post | $0.002/次 |
| [知乎回答评论](https://okdata.online/zh/apis/zhihu/answers/comments/list/) | `zhihu.answers.comments.list` | Comment[] | $0.002/次 · 每页约 10 条评论 |
| [知乎评论回复](https://okdata.online/zh/apis/zhihu/comments/replies/list/) | `zhihu.comments.replies.list` | Comment[] | $0.002/次 · 每页约 20 条评论 |
| [知乎文章详情](https://okdata.online/zh/apis/zhihu/articles/get/) | `zhihu.articles.get` | Post | $0.002/次 |
| [知乎专栏文章列表](https://okdata.online/zh/apis/zhihu/columns/articles/list/) | `zhihu.columns.articles.list` | Post[] | $0.002/次 · 每页约 20 篇文章 |
| [知乎想法详情](https://okdata.online/zh/apis/zhihu/pins/get/) | `zhihu.pins.get` | Post | $0.002/次 |
| [知乎用户资料](https://okdata.online/zh/apis/zhihu/users/get/) | `zhihu.users.get` | Account | $0.002/次 |
| [知乎用户搜索](https://okdata.online/zh/apis/zhihu/users/search/) | `zhihu.users.search` | Account[] | $0.002/次 · 每页约 20 个账号 |
| [知乎用户粉丝列表](https://okdata.online/zh/apis/zhihu/users/followers/list/) | `zhihu.users.followers.list` | Account[] | $0.002/次 · 每页约 20 个账号 |
| [知乎用户回答](https://okdata.online/zh/apis/zhihu/users/answers/list/) | `zhihu.users.answers.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [知乎用户文章](https://okdata.online/zh/apis/zhihu/users/articles/list/) | `zhihu.users.articles.list` | Post[] | $0.002/次 · 每页约 20 篇文章 |
| [知乎用户想法](https://okdata.online/zh/apis/zhihu/users/pins/list/) | `zhihu.users.pins.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |

## 适合做什么

- 口碑分析: `zhihu.posts.search`, `zhihu.questions.answers.list`, `zhihu.questions.get`, `zhihu.answers.get`, `zhihu.answers.comments.list`, `zhihu.comments.replies.list`
- 内容调研: `zhihu.posts.search`, `zhihu.questions.answers.list`, `zhihu.questions.get`, `zhihu.answers.get`, `zhihu.articles.get`, `zhihu.columns.articles.list`, `zhihu.pins.get`, `zhihu.users.answers.list`, `zhihu.users.articles.list`, `zhihu.users.pins.list`
- 竞品监控: `zhihu.articles.get`, `zhihu.columns.articles.list`, `zhihu.pins.get`, `zhihu.users.get`, `zhihu.users.search`, `zhihu.users.followers.list`, `zhihu.users.answers.list`, `zhihu.users.articles.list`, `zhihu.users.pins.list`
- 找博主: `zhihu.users.get`, `zhihu.users.search`, `zhihu.users.followers.list`
