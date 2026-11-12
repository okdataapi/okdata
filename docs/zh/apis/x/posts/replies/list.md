# X 帖子回复 API

> 一条帖子下面的回复，按 X 自己的相关度排，每页最多约 60 条。X 的回复本身就是帖子，所以按帖子返回：正文、作者、发布时间、浏览、点赞和它自己的回复数。

网页版：https://okdata.online/zh/apis/x/posts/replies/list/

- **接口**：`GET /v1/x/posts/replies/list`
- **ID**：`x.posts.replies.list`
- **价格**：$0.002/次 · 每页约 35 条帖子
- **返回**：一页约 35 条帖子（`data.items`，Post 对象）
- **状态**：预览
- **适合**：口碑分析

## 价格

每次调用 $0.002，返回一页，约 35 条帖子。抓 1,000 条帖子大约要 29 次调用，合计 $0.058。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 帖子 ID（链接里 /status/ 后面那串数字）。（例：`2120216592395174382`） |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

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
curl -G "https://api.okdata.online/v1/x/posts/replies/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=2120216592395174382'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/x/posts/replies/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "2120216592395174382"},
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
const url = new URL('https://api.okdata.online/v1/x/posts/replies/list');
url.searchParams.set('id', "2120216592395174382");

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
    "capability": "x.posts.replies.list",
    "id": "2120216592395174382"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「X 帖子回复」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1856012345678901234",
        "url": "https://x.com/trailkit/status/1856012345678901234",
        "type": "text",
        "title": null,
        "text": "Shipped the lighter tent today. 1.1 kg packed, same footprint.",
        "lang": "en",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "1450012345678901248",
          "username": "trailkit",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 18230,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": 9650,
          "reposts": 640
        },
        "images": null,
        "hashtags": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "x.posts.replies.list",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.shares": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### X 帖子回复接口多少钱？

每次调用 $0.002，返回一页，约 35 条帖子。抓 1,000 条帖子大约要 29 次调用，合计 $0.058。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要X（推特）账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是X（推特）上的公开数据，不会用到你自己的X（推特）账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### X（推特）不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## X（推特）的其他接口

- [X 帖子详情](https://okdata.online/zh/apis/x/posts/get/)：$0.0003/次
- [X 帖子搜索](https://okdata.online/zh/apis/x/posts/search/)：$0.002/次 · 每页约 20 条帖子
- [X 账号信息](https://okdata.online/zh/apis/x/users/get/)：$0.0004/条 · 每次最多 $0.04
- [X 账号帖子列表](https://okdata.online/zh/apis/x/users/posts/list/)：$0.002/次 · 每页约 20 条帖子
- [X 趋势](https://okdata.online/zh/apis/x/trends/list/)：$0.009/次 · 每页约 30 条榜单
- [X 帖子引用](https://okdata.online/zh/apis/x/posts/quotes/list/)：$0.0003/条 · 每次最多 $0.006
- [X 帖子转推用户](https://okdata.online/zh/apis/x/posts/retweeters/list/)：$0.002/次 · 每页约 100 个账号
- [X 长文](https://okdata.online/zh/apis/x/posts/article/get/)：$0.002/次
- [X 对话串](https://okdata.online/zh/apis/x/threads/posts/list/)：$0.0003/条 · 每次最多 $0.015
- [X 账号搜索](https://okdata.online/zh/apis/x/users/search/)：$0.0004/条 · 每次最多 $0.008
- [X 账号粉丝](https://okdata.online/zh/apis/x/users/followers/list/)：$0.0001/条 · 每次最多 $0.02
- [X 账号关注](https://okdata.online/zh/apis/x/users/following/list/)：$0.0001/条 · 每次最多 $0.02
- [X 账号被提及](https://okdata.online/zh/apis/x/users/mentions/list/)：$0.0003/条 · 每次最多 $0.006
- [X 列表帖子](https://okdata.online/zh/apis/x/lists/posts/list/)：$0.002/次 · 每页约 100 条帖子
- [X 列表成员](https://okdata.online/zh/apis/x/lists/members/list/)：$0.0004/条 · 每次最多 $0.008
- [X 列表关注者](https://okdata.online/zh/apis/x/lists/followers/list/)：$0.0004/条 · 每次最多 $0.008
- [X 社群资料](https://okdata.online/zh/apis/x/communities/get/)：$0.0004/次
- [X 社群帖子](https://okdata.online/zh/apis/x/communities/posts/list/)：$0.0003/条 · 每次最多 $0.006
- [X 社群成员](https://okdata.online/zh/apis/x/communities/members/list/)：$0.0004/条 · 每次最多 $0.008
