# 抖音视频详情 API

> 按 ID 或分享链接取一个视频：文案、数据、作者、音乐和话题。

网页版：https://okdata.online/zh/apis/douyin/videos/get/

- **接口**：`GET /v1/douyin/videos/get`
- **ID**：`douyin.videos.get`
- **价格**：$0.002/次
- **返回**：一个 Post 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控、内容调研

## 价格

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 视频 ID。id 和 url 二选一。（例：`7301234567890123456`） |
| `url` | string | 否 |  | 分享链接或网页地址，会从中解析出 ID。（例：`https://v.douyin.com/xxxxxx/`） |
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
| `published_at` | string \| null | 发布时间，ISO 8601，UTC；只有数据源不给时间时为 null（wechat_mp.articles.metrics、wechat_channels.videos.metrics、youtube.channels.videos.list 取 Shorts 时），并列在 meta.unavailable 里。 |
| `author` | AccountRef | 发布者。 |
| `metrics` | Metrics | 抓取时的数据；平台不公开的为 null。 |
| `images` | string[] \| null | 图文内容的图片地址。 |
| `hashtags` | string[] \| null | 话题标签，不带 #。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/douyin/videos/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=7301234567890123456'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/videos/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "7301234567890123456"},
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
const url = new URL('https://api.okdata.online/v1/douyin/videos/get');
url.searchParams.set('id', "7301234567890123456");

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
    "capability": "douyin.videos.get",
    "id": "7301234567890123456"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「抖音视频详情」找出点赞最多的五条内容，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "7436185237401447690",
      "url": "https://www.douyin.com/video/7436185237401447690",
      "type": "video",
      "title": null,
      "text": "两晚山里露营，装备清单都在这了 #露营 #户外装备",
      "lang": "zh",
      "published_at": "2026-11-02T09:30:00Z",
      "author": {
        "id": "MS4wLjABAAAAq8Xw2mKpT0",
        "username": "qingzhuang_tubu",
        "name": "轻装徒步",
        "avatar_url": "https://cdn.example.com/avatar/trailkit.jpg",
        "followers": 182300,
        "verified": true
      },
      "metrics": {
        "views": null,
        "likes": 48200,
        "comments": 1312,
        "shares": 2210,
        "favorites": 9650,
        "reposts": null
      },
      "images": null,
      "hashtags": [
        "露营",
        "户外装备"
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.videos.get",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {
      "metrics.views": "platform",
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

### 抖音视频详情接口多少钱？

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。失败的调用不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要抖音账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是抖音上的公开数据，不会用到你自己的抖音账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 抖音不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 抖音的其他接口

- [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/)：$0.02/次 · 每页约 20 条视频
- [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/)：$0.002/次
- [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/)：$0.004/次 · 每页约 20 位达人
- [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/)：$0.04/次
- [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/)：$0.002/次 · 每页约 10 条视频
- [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/)：$0.002/次 · 每页约 30 个账号
- [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/)：$0.002/次
- [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/)：$0.002/次 · 每页约 10 条视频
- [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/)：$0.002/次 · 每页约 9 条视频
- [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/)：$0.002/次
- [抖音巨量算数品牌指数对比](https://okdata.online/zh/apis/douyin/index/brands/metrics/)：$0.002/次
- [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/)：$0.002/次
- [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/)：$0.002/次
- [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/)：$0.002/次
- [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/)：$0.006/次 · 每页约 1 条结果
- [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/)：$0.002/次 · 每页约 170 条结果
- [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/)：$0.002/次 · 每页约 30 条榜单
- [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/)：$0.002/次 · 每页约 20 条视频
- [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/)：$0.002/次
- [抖音星图达人资料](https://okdata.online/zh/apis/douyin/xingtu/creators/get/)：$0.004/次
- [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/)：$0.004/次
- [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/)：$0.004/次
- [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/)：$0.004/次 · 每页约 20 条视频
- [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/)：$0.002/次
- [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/)：$0.008/次
- [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/)：$0.004/次
- [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/)：$0.004/次
- [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/)：$0.004/次 · 每页约 40 条结果
- [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/)：$0.004/次
- [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
- [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/)：$0.03/次 · 每页约 8 条视频
