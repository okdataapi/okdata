# Account

> A creator, brand or person.

Canonical page: https://okdata.online/docs/objects/account/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Account ID on the platform. |
| `url` | string | Profile link. |
| `username` | string \| null | Handle, where the platform has one. |
| `name` | string | Display name. |
| `bio` | string \| null | Profile bio. |
| `avatar_url` | string \| null | Avatar image URL. |
| `verified` | boolean \| null | Whether the platform shows a verification badge. |
| `followers` | integer \| null | Followers. |
| `following` | integer \| null | Accounts it follows. |
| `posts` | integer \| null | Posts, videos, notes or articles published. |
| `likes` | integer \| null | Total likes received, where the platform shows it. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a Account

- [Douyin account profile](https://okdata.online/apis/douyin/users/get/) (`douyin.users.get`): $0.002 per call
- [Xiaohongshu account profile](https://okdata.online/apis/xiaohongshu/users/get/) (`xiaohongshu.users.get`): $0.02 per call
- [Official Account search](https://okdata.online/apis/wechat_mp/accounts/search/) (`wechat_mp.accounts.search`): $0.058 per account · at most $0.58 per call
- [Weibo account profile](https://okdata.online/apis/weibo/users/get/) (`weibo.users.get`): $0.002 per call
- [TikTok account profile](https://okdata.online/apis/tiktok/users/get/) (`tiktok.users.get`): $0.002 per call
- [X account profile](https://okdata.online/apis/x/users/get/) (`x.users.get`): $0.0004 per account · at most $0.04 per call
- [Instagram account profile](https://okdata.online/apis/instagram/users/get/) (`instagram.users.get`): $0.004 per call
- [Instagram account search](https://okdata.online/apis/instagram/users/search/) (`instagram.users.search`): $0.002 per call · about 20 accounts per page
- [Reddit community profile](https://okdata.online/apis/reddit/subreddits/get/) (`reddit.subreddits.get`): $0.002 per call
- [Reddit user profile](https://okdata.online/apis/reddit/users/get/) (`reddit.users.get`): $0.002 per call
- [Reddit user active communities](https://okdata.online/apis/reddit/users/subreddits/list/) (`reddit.users.subreddits.list`): $0.002 per call · about 30 accounts per page
- [Kuaishou account profile](https://okdata.online/apis/kuaishou/users/get/) (`kuaishou.users.get`): $0.02 per call
- [Kuaishou account search](https://okdata.online/apis/kuaishou/users/search/) (`kuaishou.users.search`): $0.02 per call · about 20 accounts per page
- [Zhihu user profile](https://okdata.online/apis/zhihu/users/get/) (`zhihu.users.get`): $0.002 per call
- [Zhihu user search](https://okdata.online/apis/zhihu/users/search/) (`zhihu.users.search`): $0.002 per call · about 20 accounts per page
- [Zhihu user followers](https://okdata.online/apis/zhihu/users/followers/list/) (`zhihu.users.followers.list`): $0.002 per call · about 20 accounts per page
- [WeChat Channels account search](https://okdata.online/apis/wechat_channels/users/search/) (`wechat_channels.users.search`): $0.02 per call · about 1 accounts per page
- [WeChat Channels account profile](https://okdata.online/apis/wechat_channels/users/get/) (`wechat_channels.users.get`): $0.02 per call
- [Douyin account search](https://okdata.online/apis/douyin/users/search/) (`douyin.users.search`): $0.002 per call · about 30 accounts per page
- [Xiaohongshu account search](https://okdata.online/apis/xiaohongshu/users/search/) (`xiaohongshu.users.search`): $0.02 per call · about 20 accounts per page
- [Weibo post likers](https://okdata.online/apis/weibo/posts/likers/list/) (`weibo.posts.likers.list`): $0.002 per call · about 50 accounts per page
- [Weibo account followers](https://okdata.online/apis/weibo/users/followers/list/) (`weibo.users.followers.list`): $0.002 per call · about 20 accounts per page
- [Weibo account search](https://okdata.online/apis/weibo/users/search/) (`weibo.users.search`): $0.002 per call · about 20 accounts per page
- [Bilibili account profile](https://okdata.online/apis/bilibili/users/get/) (`bilibili.users.get`): $0.002 per call
- [WeChat Official Account live search](https://okdata.online/apis/wechat/accounts/search/) (`wechat.accounts.search`): $0.02 per call · about 8 accounts per page
- [Official Account profile](https://okdata.online/apis/wechat_mp/accounts/get/) (`wechat_mp.accounts.get`): $0.02 per call
- [WeChat Channels account profile (backup)](https://okdata.online/apis/wechat_channels/backup/users/get/) (`wechat_channels.backup.users.get`): $0.03 per call
- [Telegram channel profile](https://okdata.online/apis/telegram/channels/get/) (`telegram.channels.get`): $0.002 per call
- [YouTube channel profile](https://okdata.online/apis/youtube/channels/get/) (`youtube.channels.get`): $0.002 per call
- [YouTube channel search](https://okdata.online/apis/youtube/channels/search/) (`youtube.channels.search`): $0.004 per call · about 20 accounts per page
- [TikTok account search](https://okdata.online/apis/tiktok/users/search/) (`tiktok.users.search`): $0.002 per call · about 30 accounts per page
- [TikTok account followers](https://okdata.online/apis/tiktok/users/followers/list/) (`tiktok.users.followers.list`): $0.002 per call · about 20 accounts per page
- [X post retweeters](https://okdata.online/apis/x/posts/retweeters/list/) (`x.posts.retweeters.list`): $0.002 per call · about 100 accounts per page
- [X account search](https://okdata.online/apis/x/users/search/) (`x.users.search`): $0.0004 per account · at most $0.008 per call
- [X account followers](https://okdata.online/apis/x/users/followers/list/) (`x.users.followers.list`): $0.0001 per account · at most $0.02 per call
- [X account following](https://okdata.online/apis/x/users/following/list/) (`x.users.following.list`): $0.0001 per account · at most $0.02 per call
- [X list members](https://okdata.online/apis/x/lists/members/list/) (`x.lists.members.list`): $0.0004 per account · at most $0.008 per call
- [X list followers](https://okdata.online/apis/x/lists/followers/list/) (`x.lists.followers.list`): $0.0004 per account · at most $0.008 per call
- [X community members](https://okdata.online/apis/x/communities/members/list/) (`x.communities.members.list`): $0.0004 per account · at most $0.008 per call
