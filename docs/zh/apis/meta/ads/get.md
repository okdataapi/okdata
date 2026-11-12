# Meta 广告详情 API

> 按广告库 ID 或链接取 Meta 广告库的一条广告：广告主、文案、图片和视频、落地页、投放平台、首次和最近投放日期，以及是否仍在投放。

网页版：https://okdata.online/zh/apis/meta/ads/get/

- **接口**：`GET /v1/meta/ads/get`
- **ID**：`meta.ads.get`
- **价格**：$0.004/次
- **返回**：一个 Ad 对象（`data.item`）
- **状态**：预览
- **适合**：广告情报、竞品监控

## 价格

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 广告库 ID。id 和 url 二选一。（例：`744979408183770`） |
| `url` | string | 否 |  | 分享链接或网页地址，会从中解析出 ID。（例：`https://www.facebook.com/ads/library/?id=744979408183770`） |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

id 和 url 给一个就行。 
cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [Ad](https://okdata.online/zh/docs/objects/ad/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 广告在广告库里的 ID。 |
| `url` | string | 广告在广告库里的链接。 |
| `advertiser` | AdvertiserRef | 投放广告的广告主。 |
| `title` | string \| null | 广告标题（有的话）。 |
| `text` | string | 广告文案，纯文本；没有则为空字符串。 |
| `format` | string \| null | 素材形式；dynamic 指平台按观众动态拼装（商品目录广告）。 |
| `images` | string[] \| null | 素材图片地址。 |
| `videos` | string[] \| null | 素材视频地址。 |
| `landing_url` | string \| null | 广告落地页。 |
| `cta` | string \| null | 行动按钮文字。 |
| `platforms` | string[] \| null | 投放位置，如 facebook、instagram。 |
| `active` | boolean \| null | 是否仍在投放。 |
| `first_shown_at` | string \| null | 首次展示时间，ISO 8601，UTC。 |
| `last_shown_at` | string \| null | 最近展示时间，ISO 8601，UTC。 |
| `reach` | string \| null | 广告库公布的触达人数：区间（如 1K-10K）或人数（Meta 广告的欧盟触达）；未公布为 null。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/meta/ads/get" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=744979408183770'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/meta/ads/get",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "744979408183770"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

row = body["data"]["item"]
print(row["advertiser"]["name"], row["first_shown_at"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/meta/ads/get');
url.searchParams.set('id', "744979408183770");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

const row = body.data.item;
console.log(row.advertiser.name, row.first_shown_at, row.text.slice(0, 60));
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "meta.ads.get",
    "id": "744979408183770"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Meta 广告详情」总结这些广告主打什么卖点、推什么优惠、从什么时候开始投。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "id": "1856995242318099",
      "url": "https://www.facebook.com/ads/library/?id=1856995242318099",
      "advertiser": {
        "id": "30147264485",
        "name": "Stanley 1913",
        "url": "https://www.facebook.com/Stanley1913/"
      },
      "title": "The Holiday Collection",
      "text": "Great gifts. Under $50. No compromise.",
      "format": "carousel",
      "images": [
        "https://cdn.example.com/ad/1.jpg"
      ],
      "videos": null,
      "landing_url": "https://www.stanley1913.com/collections/gifts-under-50",
      "cta": "Shop now",
      "platforms": [
        "facebook",
        "instagram"
      ],
      "active": true,
      "first_shown_at": "2026-11-10T08:00:00Z",
      "last_shown_at": "2026-11-11T08:00:00Z",
      "reach": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "meta.ads.get",
    "billing": {
      "amount": "0.004",
      "currency": "USD",
      "balance_after": "9.996"
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

### Meta 广告详情接口多少钱？

每次调用 $0.004，返回一个结果。查 1,000 次共 $4.00。失败的调用不扣费。

### 可以直接传分享链接吗？

可以。把链接放进 url 参数，okdata 会从中解析出 ID，短链接也行。

### 需要Meta 广告库账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Meta 广告库上的公开数据，不会用到你自己的Meta 广告库账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### Meta 广告库不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Meta 广告库的其他接口

- [Meta 广告库搜索](https://okdata.online/zh/apis/meta/ads/search/)：$0.004/次 · 每页约 30 条广告
- [Meta 广告主的广告](https://okdata.online/zh/apis/meta/advertisers/ads/list/)：$0.004/次 · 每页约 30 条广告
