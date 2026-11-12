# 知乎 API

> 问题和回答、文章、专栏、用户和热榜。

网页版：https://okdata.online/zh/apis/zhihu/

2 个接口，每次 $0.002 到 $0.002。地区：中国大陆。不需要知乎账号或 Cookie。

| 接口 | ID | 返回 | 价格 |
|---|---|---|---|
| [知乎内容搜索](https://okdata.online/zh/apis/zhihu/posts/search/) | `zhihu.posts.search` | Post[] | $0.002/次 · 每页约 20 条帖子 |
| [知乎问题回答](https://okdata.online/zh/apis/zhihu/questions/answers/list/) | `zhihu.questions.answers.list` | Post[] | $0.002/次 · 每页约 20 条帖子 |

## 适合做什么

- 口碑分析: `zhihu.posts.search`, `zhihu.questions.answers.list`
- 内容调研: `zhihu.posts.search`, `zhihu.questions.answers.list`
