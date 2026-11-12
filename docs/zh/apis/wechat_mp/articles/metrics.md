# 公众号文章互动数据 API

> 按文章链接取这篇文章此刻的数字：阅读、点赞、在看（ext.recommends）、分享、收藏和评论。只有数字：标题和正文用 wechat_mp.articles.get 取。

网页版：https://okdata.online/zh/apis/wechat_mp/articles/metrics/

- **接口**：`GET /v1/wechat_mp/articles/metrics`
- **ID**：`wechat_mp.articles.metrics`
- **价格**：$0.02/次
- **返回**：一个 Post 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控、内容调研

## 价格

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `url` | string | 是 |  | 文章链接：带 __biz、mid、idx、sn 的长链接，或 /s/ 开头的短链接。（例：`https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec`） |
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
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有平台不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/wechat_mp/articles/metrics" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'url=https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/wechat_mp/articles/metrics",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"url": "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec"},
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
const url = new URL('https://api.okdata.online/v1/wechat_mp/articles/metrics');
url.searchParams.set('url', "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec");

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
    "capability": "wechat_mp.articles.metrics",
    "url": "https://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&mid=2667044935&idx=1&sn=05212d520417484f4402bdad73f527ec"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「公众号文章互动数据」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "MzA5NTI3MjIwMA==_2650981234_1",
      "url": "https://mp.weixin.qq.com/s/k3Fq9xYbT0aP2mWnR8sVdA",
      "type": "article",
      "title": "一家 12 人的出海团队，怎么做第一年的增长",
      "text": "## 先说结论\n\n第一年最值钱的不是投放，而是……",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "MzA5NTI3MjIwMA==",
        "username": "chuhai_growth",
        "name": "出海增长笔记",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": null,
        "verified": true
      },
      "metrics": {
        "views": 1250000,
        "likes": 48200,
        "comments": null,
        "shares": null,
        "favorites": null,
        "reposts": null
      },
      "images": null,
      "hashtags": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "wechat_mp.articles.metrics",
    "billing": {
      "amount": "0.02",
      "currency": "USD",
      "balance_after": "9.98"
    },
    "unavailable": {
      "metrics.comments": "platform",
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

### 公众号文章互动数据接口多少钱？

每次调用 $0.02，返回一个结果。查 1,000 次共 $20.00。失败的调用不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要微信公众号账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是微信公众号上的公开数据，不会用到你自己的微信公众号账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 微信公众号不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 微信公众号的其他接口

- [公众号搜索](https://okdata.online/zh/apis/wechat_mp/accounts/search/)：$0.058/条 · 每次最多 $0.58
- [公众号历史文章](https://okdata.online/zh/apis/wechat_mp/accounts/articles/list/)：$0.02/次 · 每页约 10 篇文章
- [公众号文章详情](https://okdata.online/zh/apis/wechat_mp/articles/get/)：$0.02/次
- [公众号资料](https://okdata.online/zh/apis/wechat_mp/accounts/get/)：$0.02/次
- [公众号文章评论](https://okdata.online/zh/apis/wechat_mp/articles/comments/list/)：$0.02/次 · 每页约 20 条评论
- [公众号评论回复](https://okdata.online/zh/apis/wechat_mp/comments/replies/list/)：$0.02/次 · 每页约 3 条评论
- [公众号主体信息](https://okdata.online/zh/apis/wechat_mp/accounts/owner/get/)：$0.15/次
