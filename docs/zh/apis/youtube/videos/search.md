# YouTube 视频搜索 API

> 按关键词搜视频，带播放量、时长和频道。

网页版：https://okdata.online/zh/apis/youtube/videos/search/

- **接口**：`GET /v1/youtube/videos/search`
- **ID**：`youtube.videos.search`
- **价格**：$0.004/次 · 每页约 20 条视频
- **返回**：一页约 20 条视频（`data.items`，Post 对象）
- **状态**：预览
- **适合**：内容调研

## 价格

每次调用 $0.004，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $0.20。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 是 |  | 关键词，和在平台搜索框里输入的一样。（例：`claude code tutorial`） |
| `sort` | string: relevance / latest / most_viewed | 否 | `relevance` | 排序方式。 |
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
curl -G "https://api.okdata.online/v1/youtube/videos/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'query=claude code tutorial'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/youtube/videos/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"query": "claude code tutorial"},
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
const url = new URL('https://api.okdata.online/v1/youtube/videos/search');
url.searchParams.set('query', "claude code tutorial");

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
    "capability": "youtube.videos.search",
    "query": "claude code tutorial"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「YouTube 视频搜索」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "Zx3kP9vQm2A",
        "url": "https://www.youtube.com/watch?v=Zx3kP9vQm2A",
        "type": "video",
        "title": "Two nights, one backpack: my full camping kit",
        "text": "What I packed, what I would leave at home, and what it all weighs.",
        "lang": "en",
        "published_at": "2026-11-02T09:30:00Z",
        "author": {
          "id": "UCa1b2c3d4e5f6g7h8i9j0kL",
          "username": "@trailkit",
          "name": "Trail Kit",
          "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
          "followers": 412000,
          "verified": true
        },
        "metrics": {
          "views": 1250000,
          "likes": 48200,
          "comments": 1312,
          "shares": null,
          "favorites": null,
          "reposts": null
        },
        "images": null,
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
    "capability": "youtube.videos.search",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
    },
    "unavailable": {
      "metrics.shares": "platform",
      "metrics.favorites": "platform",
      "metrics.reposts": "platform"
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

### YouTube 视频搜索接口多少钱？

每次调用 $0.004，返回一页，约 20 条视频。抓 1,000 条视频大约要 50 次调用，合计 $0.20。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.004 的调用。

### 需要YouTube账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是YouTube上的公开数据，不会用到你自己的YouTube账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### YouTube不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## YouTube的其他接口

- [YouTube 视频详情](https://okdata.online/zh/apis/youtube/videos/get/)：$0.002/次
- [YouTube 视频评论](https://okdata.online/zh/apis/youtube/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [YouTube 视频字幕](https://okdata.online/zh/apis/youtube/videos/transcript/get/)：$0.004/次
- [YouTube 评论回复](https://okdata.online/zh/apis/youtube/comments/replies/list/)：$0.002/次 · 每页约 10 条评论
- [YouTube 频道帖子](https://okdata.online/zh/apis/youtube/channels/posts/list/)：$0.002/次 · 每页约 10 条帖子
- [YouTube 帖子详情](https://okdata.online/zh/apis/youtube/posts/get/)：$0.002/次
- [YouTube 频道资料](https://okdata.online/zh/apis/youtube/channels/get/)：$0.002/次
- [YouTube 频道搜索](https://okdata.online/zh/apis/youtube/channels/search/)：$0.004/次 · 每页约 20 个账号
- [YouTube 频道视频](https://okdata.online/zh/apis/youtube/channels/videos/list/)：$0.002/次 · 每页约 30 条视频
