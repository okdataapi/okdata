# Bluesky 账号发帖 API

> 账号发的帖子，从新到旧，每页 30 条，和主页上的标签页一致：帖子（默认）、帖子和回复、只看媒体。每条带正文、图片或视频、点赞、回复、转发、收藏和发布时间。转发的帖子和主页上一样列出：给出原帖，ext.reposted_at 是转发时间。

网页版：https://okdata.online/zh/apis/bluesky/users/posts/list/

- **接口**：`GET /v1/bluesky/users/posts/list`
- **ID**：`bluesky.users.posts.list`
- **价格**：$0.001/次 · 每页约 30 条帖子
- **返回**：一页约 30 条帖子（`data.items`，Post 对象）
- **状态**：预览
- **适合**：竞品监控、内容调研

## 价格

每次调用 $0.001，返回一页，约 30 条帖子。抓 1,000 条帖子大约要 34 次调用，合计 $0.034。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 账号的用户名（handle，如 bsky.app、name.bsky.social，带不带 @ 都行）或 DID（did:plc: 开头）；只写名字会按 name.bsky.social 查。id 和 url 二选一。（例：`bsky.app`） |
| `url` | string | 否 |  | bsky.app 主页链接，会从中读出用户名或 DID。（例：`https://bsky.app/profile/bsky.app`） |
| `tab` | string: posts / replies / media | 否 | `posts` | 看主页哪个标签：posts（默认，账号的帖子和转发，不含回复）、replies（连回复一起）、media（只看带图片或视频的帖子）。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Post](https://okdata.online/zh/docs/objects/post/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 内容在平台上的 ID。 |
| `url` | string | 内容链接。 |
| `type` | string | 内容类型。 |
| `title` | string \| null | 标题（视频、笔记、文章才有）。 |
| `text` | string | 文案、正文或简介，纯文本；文章为 Markdown。 |
| `lang` | string \| null | 语言代码，平台给出或检测得到。 |
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有数据源不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics、youtube.channels.videos.list 取 Shorts 时），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/bluesky/users/posts/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=bsky.app'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/bluesky/users/posts/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "bsky.app"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/bluesky/users/posts/list');
url.searchParams.set('id', "bsky.app");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "bluesky.users.posts.list",
    "id": "bsky.app"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Bluesky 账号发帖」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "at://did:plc:trailkitexample2qz7xk4mb/app.bsky.feed.post/3m2abcd7xyz2k",
        "url": "https://bsky.app/profile/trailkit.bsky.social/post/3m2abcd7xyz2k",
        "type": "image",
        "title": null,
        "text": "Two nights, one backpack. Full list below. #camping",
        "lang": "en",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "did:plc:trailkitexample2qz7xk4mb",
          "username": "trailkit.bsky.social",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.bsky.app/img/avatar/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiavatar@jpeg",
          "followers": null,
          "verified": false
        },
        "metrics": {
          "views": null,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": 9650,
          "reposts": 640
        },
        "images": [
          "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:trailkitexample2qz7xk4mb/bafkreiexample@jpeg"
        ],
        "hashtags": [
          "camping"
        ]
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "bluesky.users.posts.list",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
    },
    "unavailable": {
      "metrics.views": "platform",
      "metrics.shares": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。请求到了数据源的调用出错（查不到、数据源失败或超时）时，按这个接口的价格计一次费，charged 为 true，并给出 amount；参数错误这类还没请求数据源的错误不扣费。只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### Bluesky 账号发帖接口多少钱？

每次调用 $0.001，返回一页，约 30 条帖子。抓 1,000 条帖子大约要 34 次调用，合计 $0.034。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.001 的调用。

### 需要Bluesky账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Bluesky上的公开数据，不会用到你自己的Bluesky账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### Bluesky不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Bluesky的其他接口

- [Bluesky 账号资料](https://okdata.online/zh/apis/bluesky/users/get/)：$0.001/次
- [Bluesky 找账号](https://okdata.online/zh/apis/bluesky/users/search/)：$0.001/次 · 每页约 25 个账号
- [Bluesky 帖子详情](https://okdata.online/zh/apis/bluesky/posts/get/)：$0.001/次
- [Bluesky 帖子回复](https://okdata.online/zh/apis/bluesky/posts/comments/list/)：$0.001/次 · 每页约 200 条评论
