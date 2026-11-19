# 1688 店铺商品 API

> 按会员 ID 列出 1688 供应商在卖的商品：标题、批发价和代发价、销量、类目和上架时间，可按销量、价格或时间排序。

网页版：https://okdata.online/zh/apis/alibaba_1688/shops/products/list/

- **接口**：`GET /v1/alibaba_1688/shops/products/list`
- **ID**：`alibaba_1688.shops.products.list`
- **价格**：$0.022/次 · 每页约 20 个商品
- **返回**：一页约 20 个商品（`data.items`，Product 对象）
- **状态**：预览
- **适合**：竞品监控、选品定价

## 价格

每次调用 $0.022，返回一页，约 20 个商品。抓 1,000 个商品大约要 50 次调用，合计 $1.10。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 供应商会员 ID，以 b2b- 开头：搜索结果或商品详情里的 shop.id。（例：`b2b-2222843280068b7e78`） |
| `sort` | string: default / sales / price_asc / price_desc / newest / oldest | 否 | `default` | 店铺默认顺序（默认）、销量、按价格，或按上架时间。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Product](https://okdata.online/zh/docs/objects/product/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 商品在商城里的 ID。 |
| `url` | string | 商品页面。 |
| `title` | string | 商品标题。 |
| `price` | number \| null | 现价（最低规格），单位见 currency。 |
| `original_price` | number \| null | 折前原价（有的话）。 |
| `currency` | string \| null | ISO 4217 货币代码。 |
| `sold` | integer \| null | 销量，以商城显示为准。 |
| `rating` | number \| null | 平均星级，0 到 5。 |
| `reviews` | integer \| null | 评价数。 |
| `images` | string[] \| null | 商品图片地址。 |
| `shop` | ShopRef | 卖家店铺。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/alibaba_1688/shops/products/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=b2b-2222843280068b7e78'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/alibaba_1688/shops/products/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "b2b-2222843280068b7e78"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["price"], row["currency"], row["sold"], row["title"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/alibaba_1688/shops/products/list');
url.searchParams.set('id', "b2b-2222843280068b7e78");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.price, row.currency, row.sold, row.title.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "alibaba_1688.shops.products.list",
    "id": "b2b-2222843280068b7e78"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「1688 店铺商品」看价格区间和销量前五的商品，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1083411694147",
        "url": "https://detail.1688.com/offer/1083411694147.html",
        "title": "跨境户外露营迷你便携手摇咖啡研磨器",
        "price": 9.8,
        "original_price": null,
        "currency": "CNY",
        "sold": 100,
        "rating": 5,
        "reviews": null,
        "images": [
          "https://cdn.example.com/product/1.jpg"
        ],
        "shop": {
          "id": "b2b-2222843280068b7e78",
          "name": "徐州朗安玻璃制品有限公司",
          "url": "http://shop058381625t017.1688.com"
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
    "capability": "alibaba_1688.shops.products.list",
    "billing": {
      "amount": "0.022",
      "currency": "USD",
      "balance_after": "9.978"
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

### 1688 店铺商品接口多少钱？

每次调用 $0.022，返回一页，约 20 个商品。抓 1,000 个商品大约要 50 次调用，合计 $1.10。每翻一页是一次单独的调用。请求到了数据源的调用，返回为空、查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.022 的调用。

### 需要1688账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是1688上的公开数据，不会用到你自己的1688账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### 1688不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 1688的其他接口

- [1688 商品搜索](https://okdata.online/zh/apis/alibaba_1688/products/search/)：$0.022/次 · 每页约 20 个商品
- [1688 商品详情](https://okdata.online/zh/apis/alibaba_1688/products/get/)：$0.022/次
- [1688 商品评价](https://okdata.online/zh/apis/alibaba_1688/products/reviews/list/)：$0.022/次 · 每页约 10 条评价
