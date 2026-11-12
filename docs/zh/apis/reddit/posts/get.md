# Reddit 帖子详情 API

> 按 ID 或链接取一条帖子：标题、正文、作者、社区、得分、赞同比例和评论数。

网页版：https://okdata.online/zh/apis/reddit/posts/get/

- **接口**：`GET /v1/reddit/posts/get`
- **ID**：`reddit.posts.get`
- **价格**：$0.002/次
- **返回**：一个 Post 对象（`data.item`）
- **状态**：预览
- **适合**：内容调研、竞品监控

## 价格

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 帖子 ID，带不带 t3_ 前缀都行。id 和 url 二选一。（例：`t3_1nnrvkr`） |
| `url` | string | 否 |  | 分享链接或网页地址，会从中解析出 ID。（例：`https://www.reddit.com/r/nasa/comments/1nnrvkr/`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
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
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有平台不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/reddit/posts/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=t3_1nnrvkr'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/reddit/posts/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "t3_1nnrvkr"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["id"], row["metrics"]["likes"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/reddit/posts/get');
url.searchParams.set('id', "t3_1nnrvkr");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.id, row.metrics.likes, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "reddit.posts.get",
    "id": "t3_1nnrvkr"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Reddit 帖子详情」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "t3_1nnrvkr",
      "url": "https://www.reddit.com/r/CampingGear/comments/1nnrvkr/two_nights_one_backpack/",
      "type": "text",
      "title": "Two nights, one backpack: what I would pack again",
      "text": "Full list and weights in the comments.",
      "lang": "en",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "t2_1dkvvygb",
        "username": "trailkit",
        "name": "trailkit",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": null,
        "verified": true
      },
      "metrics": {
        "views": null,
        "likes": 48200,
        "comments": 1312,
        "shares": 2210,
        "favorites": null,
        "reposts": null
      },
      "images": null,
      "hashtags": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "reddit.posts.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.views": "platform",
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

### Reddit 帖子详情接口多少钱？

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要Reddit账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Reddit上的公开数据，不会用到你自己的Reddit账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### Reddit不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Reddit的其他接口

- [Reddit 帖子搜索](https://okdata.online/zh/apis/reddit/posts/search/)：$0.004/次 · 每页约 25 条帖子
- [Reddit 帖子评论](https://okdata.online/zh/apis/reddit/posts/comments/list/)：$0.002/次 · 每页约 10 条评论
- [Reddit 热门帖子](https://okdata.online/zh/apis/reddit/popular/posts/list/)：$0.002/次 · 每页约 10 条帖子
- [Reddit 社区帖子](https://okdata.online/zh/apis/reddit/subreddits/posts/list/)：$0.004/次 · 每页约 25 条帖子
- [Reddit 社区资料](https://okdata.online/zh/apis/reddit/subreddits/get/)：$0.002/次
- [Reddit 趋势搜索](https://okdata.online/zh/apis/reddit/trends/list/)：$0.002/次 · 每页约 6 条榜单
- [Reddit 用户资料](https://okdata.online/zh/apis/reddit/users/get/)：$0.002/次
- [Reddit 用户帖子](https://okdata.online/zh/apis/reddit/users/posts/list/)：$0.002/次 · 每页约 25 条帖子
- [Reddit 用户活跃社区](https://okdata.online/zh/apis/reddit/users/subreddits/list/)：$0.002/次 · 每页约 30 个账号
- [Reddit 视频字幕](https://okdata.online/zh/apis/reddit/posts/transcript/get/)：$0.004/次
