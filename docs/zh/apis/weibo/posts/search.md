# 微博搜索 API

> 按关键词搜微博，可按实时或热门，带转发、评论和点赞。

网页版：https://okdata.online/zh/apis/weibo/posts/search/

- **接口**：`GET /v1/weibo/posts/search`
- **ID**：`weibo.posts.search`
- **价格**：$0.002/次 · 每页约 10 条帖子
- **返回**：一页约 10 条帖子（`data.items`，Post 对象）
- **状态**：公测
- **适合**：口碑分析、热点研究

## 价格

每次调用 $0.002，返回一页，约 10 条帖子。抓 1,000 条帖子大约要 100 次调用，合计 $0.20。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`新品发布`） |
| `sort` | string: hot / latest | 否 | `hot` | 排序方式。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string | 否 |  | 只保留这些字段，逗号分隔，用来省 token。 |

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
| `published_at` | string | 发布时间，ISO 8601，UTC。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/weibo/posts/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=新品发布'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/weibo/posts/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "新品发布"},
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
const url = new URL('https://api.okdata.online/v1/weibo/posts/search');
url.searchParams.set('query', "新品发布");

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
    "endpoint": "weibo.posts.search",
    "params": {
      "query": "新品发布"
    }
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「微博搜索」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "5098765432109876",
        "url": "https://weibo.com/1234567890/PbQ7rT2xZ",
        "type": "text",
        "title": null,
        "text": "新品今天开售，评论区抽三位送同款。",
        "lang": "zh",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "1234567890",
          "username": null,
          "name": "轻装户外官方",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 532000,
          "verified": true
        },
        "metrics": {
          "views": null,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": null,
          "reposts": 640
        },
        "images": [
          "https://wx1.sinaimg.example.com/large/abc123.jpg"
        ],
        "hashtags": [
          "新品发布"
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
    "capability": "weibo.posts.search",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.views": "platform",
      "metrics.shares": "platform",
      "metrics.favorites": "platform"
    },
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构，都不扣费；只有超时的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 微博搜索接口多少钱？

每次调用 $0.002，返回一页，约 10 条帖子。抓 1,000 条帖子大约要 100 次调用，合计 $0.20。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要微博账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微博上的公开数据，不会用到你自己的微博账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微博不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微博的其他接口

- [微博热搜](https://okdata.online/zh/apis/weibo/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [微博账号信息](https://okdata.online/zh/apis/weibo/users/get/)：$0.002/次
