# Google 广告主的广告 API

> 按广告主 ID 或品牌官网域名取 Google 广告透明中心里的广告（搜索、YouTube、展示、购物、地图、Play）：格式、预览图、首次和最近展示时间。每页 40 条。

网页版：https://okdata.online/zh/apis/google/advertisers/ads/list/

- **接口**：`GET /v1/google/advertisers/ads/list`
- **ID**：`google.advertisers.ads.list`
- **价格**：$0.004/次 · 每页约 40 条广告
- **返回**：一页约 40 条广告（`data.items`，Ad 对象）
- **状态**：预览
- **适合**：广告情报、竞品监控

## 价格

每次调用 $0.004，返回一页，约 40 条广告。抓 1,000 条广告大约要 25 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 否 |  | 广告主 ID（AR…），来自广告主搜索。id 和 domain 二选一。（例：`AR17172796163137470465`） |
| `domain` | string | 否 |  | 品牌官网域名。id 和 domain 二选一。（例：`stanley1913.com`） |
| `country` | string | 否 |  | 只看在这个国家展示的广告（ISO 代码）；不填为全部。（例：`US`） |
| `format` | string: all / text / image / video | 否 | `all` | 只看文字、图片或视频广告；默认全部。 |
| `cursor` | string | 否 |  | 上一次返回的 page.next_cursor，原样传回。每翻一页都是一次单独的调用。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

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
curl -G "https://api.okdata.online/v1/google/advertisers/ads/list" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=AR17172796163137470465'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/google/advertisers/ads/list",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "AR17172796163137470465"},
    timeout=60,
)
body = resp.json()
if body["code"] != "ok":
    raise RuntimeError(f"{body['code']}: {body['message']} (charged: {body['charged']})")

for row in body["data"]["items"]:
    print(row["advertiser"]["name"], row["first_shown_at"], row["text"][:60])
print("cost: $" + body["meta"]["billing"]["amount"])
```

### TypeScript

```ts
const url = new URL('https://api.okdata.online/v1/google/advertisers/ads/list');
url.searchParams.set('id', "AR17172796163137470465");

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.OKDATA_API_KEY}`,
  },
});
const body = await res.json();
if (body.code !== 'ok') throw new Error(`${body.code}: ${body.message}`);

for (const row of body.data.items) {
  console.log(row.advertiser.name, row.first_shown_at, row.text.slice(0, 60));
}
console.log('cost: $' + body.meta.billing.amount);
```

### MCP

```json
{
  "name": "call",
  "arguments": {
    "capability": "google.advertisers.ads.list",
    "id": "AR17172796163137470465"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「Google 广告主的广告」总结这些广告主打什么卖点、推什么优惠、从什么时候开始投。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "CR06859729393586012161",
        "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465/creative/CR06859729393586012161",
        "advertiser": {
          "id": "AR17172796163137470465",
          "name": "PACIFIC MARKET INTERNATIONAL, LLC",
          "url": "https://adstransparency.google.com/advertiser/AR17172796163137470465"
        },
        "title": null,
        "text": "",
        "format": "image",
        "images": null,
        "videos": null,
        "landing_url": null,
        "cta": null,
        "platforms": null,
        "active": null,
        "first_shown_at": "2026-10-16T20:42:14Z",
        "last_shown_at": "2026-11-11T15:09:13Z",
        "reach": null
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "google.advertisers.ads.list",
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

### Google 广告主的广告接口多少钱？

每次调用 $0.004，返回一页，约 40 条广告。抓 1,000 条广告大约要 25 次调用，合计 $0.10。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.004 的调用。

### 需要Google 广告透明中心账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是Google 广告透明中心上的公开数据，不会用到你自己的Google 广告透明中心账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### Google 广告透明中心不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## Google 广告透明中心的其他接口

- [Google 广告透明中心广告主搜索](https://okdata.online/zh/apis/google/advertisers/search/)：$0.004/次 · 每页约 10 个广告主
