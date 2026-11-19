# App Store 应用详情 API

> 按 App Store ID 或链接取一个 iPhone、iPad 或 Mac 应用，可选国家/地区商店：名称、价格和币种、平均星级和评分人数（在 reviews 里）、开发者和截图。ext 里还有 Bundle ID、当前版本和更新说明、上架和更新日期、分类、年龄分级、安装包大小、支持语言和当前版本的评分。

网页版：https://okdata.online/zh/apis/app_store/apps/get/

- **接口**：`GET /v1/app_store/apps/get`
- **ID**：`app_store.apps.get`
- **价格**：$0.001/次
- **返回**：一个 Product 对象（`data.item`）
- **状态**：预览
- **适合**：选品定价、竞品监控

## 价格

每次调用 $0.001，返回一个结果。查 1,000 次共 $1.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 应用的 App Store ID：apps.apple.com 链接里 id 后面那串数字。id 和 url 二选一。（例：`6448311069`） |
| `url` | string | 否 |  | 应用的 apps.apple.com 链接，会从中读出 ID；没传 country 时也按链接里的国家/地区商店查。（例：`https://apps.apple.com/us/app/chatgpt/id6448311069`） |
| `country` | string | 否 |  | 哪个国家/地区的商店，用两位代码（US、GB、JP、CN……）：价格、评分和评论都按这个商店的来。默认用 url 里的国家，没有就是 US。（例：`US`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
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
curl -G "https://api.okdata.online/v1/app_store/apps/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=6448311069'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/app_store/apps/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "6448311069"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["price"], row["currency"], row["sold"], row["title"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/app_store/apps/get');
url.searchParams.set('id', "6448311069");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.price, row.currency, row.sold, row.title.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "app_store.apps.get",
    "id": "6448311069"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「App Store 应用详情」看价格区间和销量前五的商品，附链接。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "6448311069",
      "url": "https://apps.apple.com/us/app/chatgpt/id6448311069",
      "title": "ChatGPT",
      "price": 0,
      "original_price": null,
      "currency": "USD",
      "sold": null,
      "rating": 4.82,
      "reviews": 12324645,
      "images": [
        "https://is1-ssl.mzstatic.com/image/thumb/example/392x696bb.png"
      ],
      "shop": {
        "id": "1684349733",
        "name": "OpenAI OpCo, LLC",
        "url": "https://apps.apple.com/us/developer/openai-opco-llc/id1684349733"
      }
    }
  },
  "warnings": [],
  "meta": {
    "capability": "app_store.apps.get",
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

### App Store 应用详情接口多少钱？

每次调用 $0.001，返回一个结果。查 1,000 次共 $1.00。请求到了数据源的查询，查不到或出错也照常计费；还没请求数据源就被拦下的不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要苹果应用商店账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是苹果应用商店上的公开数据，不会用到你自己的苹果应用商店账号。

### 调用失败会扣费吗？

请求到了数据源就会扣一次：返回为空、查不到、数据源出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求数据源就被拦下的不扣费。

### 苹果应用商店不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 苹果应用商店的其他接口

- [App Store 用户评论](https://okdata.online/zh/apis/app_store/apps/reviews/list/)：$0.001/次 · 每页约 50 条评价
