# 小红书蒲公英笔记数据 API

> 按笔记 ID 取蒲公英给品牌看的这篇笔记数据：曝光、阅读、点赞、收藏、评论、分享和带来的关注，报备的合作品牌，品牌组件的点击率档位，以及标题、正文、图片、发布时间和达人。蒲公英只有自己达人的笔记数据，没有数据的笔记返回不存在。

网页版：https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/

- **接口**：`GET /v1/xiaohongshu/pgy/notes/get`
- **ID**：`xiaohongshu.pgy.notes.get`
- **价格**：$0.04/次
- **返回**：一个 PgyNote 对象（`data.item`）
- **状态**：预览
- **适合**：找博主、竞品监控

## 价格

每次调用 $0.04，返回一个结果。查 1,000 次共 $40.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 笔记 ID（24 位十六进制）：笔记链接 explore/ 后面那段，或蒲公英达人笔记返回的 id。（例：`6ad04eaa000000000b0065ba`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [PgyNote](https://okdata.online/zh/docs/objects/pgy_note/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 笔记 ID。 |
| `url` | string \| null | 笔记链接，带可直接打开的访问令牌。 |
| `type` | string \| null | 图文笔记或视频笔记。 |
| `title` | string \| null | 笔记标题。 |
| `text` | string \| null | 笔记正文。 |
| `published_at` | string \| null | 发布时间。 |
| `images` | string[] \| null | 图片地址，按笔记顺序。 |
| `creator_id` | string \| null | 达人的蒲公英 ID。 |
| `creator_name` | string \| null | 达人昵称。 |
| `brand` | string \| null | 报备的合作品牌，平台原文；非报备合作笔记为 null。 |
| `brand_id` | string \| null | 该品牌的小红书账号 ID；没有时为 null。 |
| `metrics` | PgyNoteMetrics | 蒲公英给出的笔记数据。 |
| `component_clicks` | PgyComponentClicks \| null | 品牌组件的点击率档位；没有时为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/notes/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6ad04eaa000000000b0065ba'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/notes/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6ad04eaa000000000b0065ba"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row)
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/notes/get');
url.searchParams.set('id', "6ad04eaa000000000b0065ba");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row);
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "xiaohongshu.pgy.notes.get",
    "id": "6ad04eaa000000000b0065ba"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「小红书蒲公英笔记数据」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": null,
      "url": null,
      "type": null,
      "title": null,
      "text": null,
      "published_at": null,
      "images": null,
      "creator_id": null,
      "creator_name": null,
      "brand": null,
      "brand_id": null,
      "metrics": {
        "impressions": null,
        "views": null,
        "likes": null,
        "favorites": null,
        "comments": null,
        "shares": null,
        "follows": null
      },
      "component_clicks": {
        "comment_area": null,
        "content": null,
        "note_bottom": null
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.notes.get",
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

### 小红书蒲公英笔记数据接口多少钱？

每次调用 $0.04，返回一个结果。查 1,000 次共 $40.00。失败的调用不扣费。

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
- [小红书蒲公英达人笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/notes/list/)：$0.04/次 · 每页约 8 篇笔记
- [小红书蒲公英达人粉丝趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/history/)：$0.04/次
- [小红书蒲公英相似达人](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/related/)：$0.04/次 · 每页约 4 位达人
- [小红书蒲公英内容广场热门笔记](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/trending/)：$0.04/次 · 每页约 34 篇笔记
- [小红书蒲公英达人合作成本概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/)：$0.04/次
- [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/)：$0.04/次
- [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/)：$0.04/次
