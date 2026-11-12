# Zhihu API

> Questions and answers, articles, columns, people and the hot list.

Canonical page: https://okdata.online/apis/zhihu/

15 endpoints, $0.002 to $0.002 per call. Region: Mainland China. No Zhihu login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Zhihu search](https://okdata.online/apis/zhihu/posts/search/) | `zhihu.posts.search` | Post[] | $0.002 per call · about 20 posts per page |
| [Zhihu question answers](https://okdata.online/apis/zhihu/questions/answers/list/) | `zhihu.questions.answers.list` | Post[] | $0.002 per call · about 20 posts per page |
| [Zhihu question detail](https://okdata.online/apis/zhihu/questions/get/) | `zhihu.questions.get` | Post | $0.002 per call |
| [Zhihu answer detail](https://okdata.online/apis/zhihu/answers/get/) | `zhihu.answers.get` | Post | $0.002 per call |
| [Zhihu answer comments](https://okdata.online/apis/zhihu/answers/comments/list/) | `zhihu.answers.comments.list` | Comment[] | $0.002 per call · about 10 comments per page |
| [Zhihu comment replies](https://okdata.online/apis/zhihu/comments/replies/list/) | `zhihu.comments.replies.list` | Comment[] | $0.002 per call · about 20 comments per page |
| [Zhihu article detail](https://okdata.online/apis/zhihu/articles/get/) | `zhihu.articles.get` | Post | $0.002 per call |
| [Zhihu column articles](https://okdata.online/apis/zhihu/columns/articles/list/) | `zhihu.columns.articles.list` | Post[] | $0.002 per call · about 20 articles per page |
| [Zhihu pin detail](https://okdata.online/apis/zhihu/pins/get/) | `zhihu.pins.get` | Post | $0.002 per call |
| [Zhihu user profile](https://okdata.online/apis/zhihu/users/get/) | `zhihu.users.get` | Account | $0.002 per call |
| [Zhihu user search](https://okdata.online/apis/zhihu/users/search/) | `zhihu.users.search` | Account[] | $0.002 per call · about 20 accounts per page |
| [Zhihu user followers](https://okdata.online/apis/zhihu/users/followers/list/) | `zhihu.users.followers.list` | Account[] | $0.002 per call · about 20 accounts per page |
| [Zhihu user answers](https://okdata.online/apis/zhihu/users/answers/list/) | `zhihu.users.answers.list` | Post[] | $0.002 per call · about 20 posts per page |
| [Zhihu user articles](https://okdata.online/apis/zhihu/users/articles/list/) | `zhihu.users.articles.list` | Post[] | $0.002 per call · about 20 articles per page |
| [Zhihu user pins](https://okdata.online/apis/zhihu/users/pins/list/) | `zhihu.users.pins.list` | Post[] | $0.002 per call · about 20 posts per page |

## Good for

- Word of mouth: `zhihu.posts.search`, `zhihu.questions.answers.list`, `zhihu.questions.get`, `zhihu.answers.get`, `zhihu.answers.comments.list`, `zhihu.comments.replies.list`
- Content research: `zhihu.posts.search`, `zhihu.questions.answers.list`, `zhihu.questions.get`, `zhihu.answers.get`, `zhihu.articles.get`, `zhihu.columns.articles.list`, `zhihu.pins.get`, `zhihu.users.answers.list`, `zhihu.users.articles.list`, `zhihu.users.pins.list`
- Competitor monitoring: `zhihu.articles.get`, `zhihu.columns.articles.list`, `zhihu.pins.get`, `zhihu.users.get`, `zhihu.users.search`, `zhihu.users.followers.list`, `zhihu.users.answers.list`, `zhihu.users.articles.list`, `zhihu.users.pins.list`
- Creator discovery: `zhihu.users.get`, `zhihu.users.search`, `zhihu.users.followers.list`
