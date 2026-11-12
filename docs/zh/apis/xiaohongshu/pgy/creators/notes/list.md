# 小红书蒲公英达人笔记 API

> 按蒲公英达人 ID 取一页蒲公英「笔记案例」：阅读、点赞、收藏、外溢进店人数、是否合作及合作品牌。可只看合作笔记或跨域合作笔记、只看图文或视频，按最新、阅读最多或互动最多排，按内容特征或类目筛，阅读数可只算自然流量。

网页版：https://okdata.online/zh/apis/xiaohongshu/pgy/creators/notes/list/

- **接口**：`GET /v1/xiaohongshu/pgy/creators/notes/list`
- **ID**：`xiaohongshu.pgy.creators.notes.list`
- **价格**：$0.04/次 · 每页约 8 篇笔记
- **返回**：一页约 8 篇笔记（`data.items`，PgyCreatorPost 对象）
- **状态**：预览
- **适合**：找博主、竞品监控

## 价格

每次调用 $0.04，返回一页，约 8 篇笔记。抓 1,000 篇笔记大约要 125 次调用，合计 $5.00。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 蒲公英达人 ID（24 位十六进制，与小红书用户 ID 相同），来自蒲公英达人搜索。（例：`591662306a6a6967b63e7f16`） |
| `tab` | string: all / sponsored / cross_domain | 否 | `all` | 看哪些笔记：全部（默认）、只看合作笔记，或只看跨域合作笔记（带外溢进店人数的那些）。 |
| `type` | string: image / video | 否 |  | 只看图文或视频；不填两种都要。只能和 tab=all 一起用。 |
| `sort` | string: latest / most_read / most_engaged | 否 | `latest` | 排序：最新发布在前（默认）、阅读最多在前或互动最多在前。 |
| `traffic` | string: all / organic | 否 | `all` | 阅读数算哪些流量：全部，含推广流量（默认），或只算自然流量。点赞和收藏不变。 |
| `feature_tag` | string | 否 |  | 只看带这个内容特征标签的笔记，照达人详情 ext.feature_tags 里的原文写。写错不报错，只会没有结果。（例：`vlog`） |
| `category` | string | 否 |  | 只看这个内容类目的笔记，照达人详情 categories 里的原文写。写错不报错，只会没有结果。（例：`出行旅游`） |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [PgyCreatorPost](https://okdata.online/zh/docs/objects/pgy_creator_post/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 笔记 ID。 |
| `title` | string \| null | 笔记标题。 |
| `type` | string \| null | 图文笔记或视频笔记。 |
| `published_at` | string \| null | 发布日，写成中国时间当天零点（平台只给日期）。 |
| `cover_url` | string \| null | 封面图。 |
| `is_sponsored` | boolean \| null | 是否为品牌合作笔记（见 brand）。 |
| `brand` | string \| null | 合作品牌，平台原文；非合作笔记为 null。 |
| `is_promoted` | boolean \| null | 是否含推广流量；与是否为合作笔记无关。 |
| `metrics` | PgyPostMetrics | 笔记数据。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/notes/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=591662306a6a6967b63e7f16'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/notes/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "591662306a6a6967b63e7f16"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/notes/list');
url.searchParams.set('id', "591662306a6a6967b63e7f16");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row);
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "xiaohongshu.pgy.creators.notes.list",
    "id": "591662306a6a6967b63e7f16"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「小红书蒲公英达人笔记」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": null,
        "title": null,
        "type": null,
        "published_at": null,
        "cover_url": null,
        "is_sponsored": null,
        "brand": null,
        "is_promoted": null,
        "metrics": {
          "views": null,
          "likes": null,
          "favorites": null,
          "shop_visits": null
        }
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.notes.list",
    "billing": {
      "amount": "0.04",
      "currency": "USD",
      "balance_after": "9.96"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。错误不扣费；只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 小红书蒲公英达人笔记接口多少钱？

每次调用 $0.04，返回一页，约 8 篇笔记。抓 1,000 篇笔记大约要 125 次调用，合计 $5.00。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.04 的调用。

### 需要小红书账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是小红书上的公开数据，不会用到你自己的小红书账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### 小红书不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 小红书的其他接口

- [小红书笔记搜索](https://okdata.online/zh/apis/xiaohongshu/notes/search/)：$0.02/次 · 每页约 20 篇笔记
- [小红书笔记详情](https://okdata.online/zh/apis/xiaohongshu/notes/get/)：$0.02/次
- [小红书笔记评论](https://okdata.online/zh/apis/xiaohongshu/notes/comments/list/)：$0.02/次 · 每页约 10 条评论
- [小红书博主信息](https://okdata.online/zh/apis/xiaohongshu/users/get/)：$0.02/次
- [小红书博主笔记列表](https://okdata.online/zh/apis/xiaohongshu/users/notes/list/)：$0.02/次 · 每页约 20 篇笔记
- [小红书热点话题](https://okdata.online/zh/apis/xiaohongshu/trends/list/)：$0.02/次 · 每页约 20 条榜单
- [小红书蒲公英达人搜索](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/search/)：$0.04/次 · 每页约 20 位达人
- [小红书蒲公英达人详情](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/get/)：$0.04/次
- [小红书商城商品搜索](https://okdata.online/zh/apis/xiaohongshu/shop/products/search/)：$0.02/次 · 每页约 20 个商品
- [小红书商城商品评价](https://okdata.online/zh/apis/xiaohongshu/shop/products/reviews/list/)：$0.02/次 · 每页约 12 条评价
- [小红书图片搜索](https://okdata.online/zh/apis/xiaohongshu/images/search/)：$0.02/次 · 每页约 20 条帖子
- [小红书评论回复](https://okdata.online/zh/apis/xiaohongshu/comments/replies/list/)：$0.02/次 · 每页约 5 条评论
- [小红书话题笔记](https://okdata.online/zh/apis/xiaohongshu/topics/notes/list/)：$0.02/次 · 每页约 10 篇笔记
- [小红书话题详情](https://okdata.online/zh/apis/xiaohongshu/topics/get/)：$0.02/次
- [小红书账号搜索](https://okdata.online/zh/apis/xiaohongshu/users/search/)：$0.02/次 · 每页约 20 个账号
- [小红书商城商品详情](https://okdata.online/zh/apis/xiaohongshu/shop/products/get/)：$0.02/次
- [小红书搜索联想词](https://okdata.online/zh/apis/xiaohongshu/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [小红书视频笔记详情（视频地址）](https://okdata.online/zh/apis/xiaohongshu/videos/get/)：$0.02/次
- [小红书蒲公英关键词搜索指数](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/history/)：$0.04/次
- [小红书蒲公英关联词](https://okdata.online/zh/apis/xiaohongshu/pgy/keywords/related/)：$0.04/次 · 每页约 98 条结果
- [小红书蒲公英达人粉丝画像](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/audience/get/)：$0.04/次
- [小红书蒲公英达人数据表现](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/metrics/)：$0.04/次
- [小红书蒲公英达人粉丝趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/history/)：$0.04/次
- [小红书蒲公英相似达人](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/related/)：$0.04/次 · 每页约 4 位达人
- [小红书蒲公英内容广场热门笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/trending/)：$0.04/次 · 每页约 34 篇笔记
- [小红书蒲公英达人合作成本概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/)：$0.04/次
- [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/)：$0.04/次
- [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/)：$0.04/次
- [小红书蒲公英笔记数据](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/)：$0.04/次
