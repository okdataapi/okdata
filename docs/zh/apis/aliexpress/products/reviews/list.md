# 速卖通商品评价 API

> 速卖通商品的买家评价：星级、内容（附英文翻译）、日期、购买的款式、晒图和"有用"票数。

网页版：https://okdata.online/zh/apis/aliexpress/products/reviews/list/

- **接口**：`GET /v1/aliexpress/products/reviews/list`
- **ID**：`aliexpress.products.reviews.list`
- **价格**：$0.002/次 · 每页约 20 条评价
- **返回**：一页约 20 条评价（`data.items`，Review 对象）
- **状态**：预览
- **适合**：口碑分析、选品定价

## 价格

每次调用 $0.002，返回一页，约 20 条评价。抓 1,000 条评价大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 速卖通商品 ID：链接 /item/<id>.html 里的数字。（例：`3256805498946261`） |
| `filter` | string: all / with_images | 否 | `all` | 全部评价（默认），或只看带图的。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Review](https://okdata.online/zh/docs/objects/review/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 评价 ID。 |
| `product_id` | string | 被评价商品的 ID。 |
| `rating` | number \| null | 星级，1 到 5。 |
| `text` | string | 评价内容；只打星没写字时为空字符串。 |
| `translation` | string \| null | 商城给出的英文译文；商城没给译文时为 null。 |
| `published_at` | string \| null | 发布时间，ISO 8601，UTC（平台只显示日期的为当天）。 |
| `author_name` | string \| null | 商城显示的评价人昵称，常为打码。 |
| `variant` | string \| null | 购买的款式规格。 |
| `images` | string[] \| null | 晒图地址。 |
| `likes` | integer \| null | 评价的点赞数。 |
| `verified_purchase` | boolean \| null | 商城是否标为已验证购买。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/aliexpress/products/reviews/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=3256805498946261'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/aliexpress/products/reviews/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "3256805498946261"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["rating"], row["text"][:80])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/aliexpress/products/reviews/list');
url.searchParams.set('id', "3256805498946261");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.rating, row.text.slice(0, 80));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "aliexpress.products.reviews.list",
    "id": "3256805498946261"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「速卖通商品评价」读前两页评价，总结买家满意和不满意的地方。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "60094611289235391",
        "product_id": "3256805498946261",
        "rating": 5,
        "text": "Works good, grinds espresso amazing and compact on counter tops.",
        "translation": "Great grinder, the espresso comes out much better.",
        "published_at": "2025-12-23T00:00:00Z",
        "author_name": "AliExpress Shopper",
        "variant": "Color:G5 Grinder Ships From:United States",
        "images": [
          "https://cdn.example.com/review/1.jpg"
        ],
        "likes": 42,
        "verified_purchase": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "aliexpress.products.reviews.list",
    "billing": {
      "amount": "0.002",
      "currency": "USD",
      "balance_after": "9.998"
    },
    "unavailable": {},
    "cached": false,
    "replayed": false,
    "fetched_at": "2026-11-11T08:00:00Z"
  }
}
```

## 错误

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。请求到了数据源的调用出错（查不到、数据源失败或超时）时，按这个接口的价格计一次费，charged 为 true，并给出 amount；参数错误这类还没请求数据源的错误不扣费。只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 速卖通商品评价接口多少钱？

每次调用 $0.002，返回一页，约 20 条评价。抓 1,000 条评价大约要 50 次调用，合计 $0.10。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.002 的调用。

### 需要速卖通账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是速卖通上的公开数据，不会用到你自己的速卖通账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### 速卖通不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 速卖通的其他接口

- [速卖通商品搜索](https://okdata.online/zh/apis/aliexpress/products/search/)：$0.002/次 · 每页约 20 个商品
- [速卖通商品详情](https://okdata.online/zh/apis/aliexpress/products/get/)：$0.002/次
