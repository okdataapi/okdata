# App Store 用户评论 API

> 某个国家/地区商店里用户写的应用评论，最新或最有帮助的在前，每页 50 条，最多 10 页（每个国家约 500 条）：星级、标题和正文、评论针对的应用版本（在 variant 里）、评论人昵称、日期和"有用"票数（在 likes 里）。

网页版：https://okdata.online/zh/apis/app_store/apps/reviews/list/

- **接口**：`GET /v1/app_store/apps/reviews/list`
- **ID**：`app_store.apps.reviews.list`
- **价格**：$0.001/次 · 每页约 50 条评价
- **返回**：一页约 50 条评价（`data.items`，Review 对象）
- **状态**：预览
- **适合**：口碑分析、选品定价

## 价格

每次调用 $0.001，返回一页，约 50 条评价。抓 1,000 条评价大约要 20 次调用，合计 $0.02。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 应用的 App Store ID：apps.apple.com 链接里 id 后面那串数字。id 和 url 二选一。（例：`6448311069`） |
| `url` | string | 否 |  | 应用的 apps.apple.com 链接，会从中读出 ID；没传 country 时也按链接里的国家/地区商店查。（例：`https://apps.apple.com/us/app/chatgpt/id6448311069`） |
| `country` | string | 否 |  | 哪个国家/地区的商店，用两位代码（US、GB、JP、CN……）：价格、评分和评论都按这个商店的来。默认用 url 里的国家，没有就是 US。（例：`US`） |
| `sort` | string: recent / helpful | 否 | `recent` | 最新的在前（默认），或最有帮助的在前。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
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
curl -G "https://api.okdata.online/v1/app_store/apps/reviews/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6448311069'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/app_store/apps/reviews/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6448311069"},
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
const url = new URL('https://api.okdata.online/v1/app_store/apps/reviews/list');
url.searchParams.set('id', "6448311069");

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
    "capability": "app_store.apps.reviews.list",
    "id": "6448311069"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「App Store 用户评论」读前两页评价，总结买家满意和不满意的地方。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "14799937673",
        "product_id": "6448311069",
        "rating": 5,
        "text": "Plans my whole week\n\nI paste in my notes on Sunday and get a schedule back in a minute.",
        "translation": null,
        "published_at": "2026-11-17T01:41:26Z",
        "author_name": "trailrunner_88",
        "variant": "1.2026.307",
        "images": null,
        "likes": 3,
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
    "capability": "app_store.apps.reviews.list",
    "billing": {
      "amount": "0.001",
      "currency": "USD",
      "balance_after": "9.999"
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

### App Store 用户评论接口多少钱？

每次调用 $0.001，返回一页，约 50 条评价。抓 1,000 条评价大约要 20 次调用，合计 $0.02。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.001 的调用。

### 需要苹果应用商店账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是苹果应用商店上的公开数据，不会用到你自己的苹果应用商店账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### 苹果应用商店不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 苹果应用商店的其他接口

- [App Store 应用详情](https://okdata.online/zh/apis/app_store/apps/get/)：$0.001/次
