# TikTok 广告库搜索 API

> 按关键词或广告主名称搜 TikTok 公开广告库（在欧洲投放的广告）：广告主、标题、视频和图片、首次和最近投放日期，以及广告库给出的触达人数区间。这是全部广告的透明记录，不是创意中心的精选。

网页版：https://okdata.online/zh/apis/tiktok/ads/search/

- **接口**：`GET /v1/tiktok/ads/search`
- **ID**：`tiktok.ads.search`
- **价格**：$0.004/次 · 每页约 12 条广告
- **返回**：一页约 12 条广告（`data.items`，Ad 对象）
- **状态**：预览
- **适合**：广告情报、竞品监控

## 价格

每次调用 $0.004，返回一页，约 12 条广告。抓 1,000 条广告大约要 84 次调用，合计 $0.336。每翻一页是一次单独的调用；失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `query` | string | 否 |  | 关键词。query 和 advertiser 二选一。（例：`espresso`） |
| `advertiser` | string | 否 |  | 广告主名称。query 和 advertiser 二选一。（例：`FIGS INC`） |
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
curl "https://api.okdata.online/v1/tiktok/ads/search" \
  -H "Authorization: Bearer $OKDATA_API_KEY"
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/tiktok/ads/search",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={},
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
const url = new URL('https://api.okdata.online/v1/tiktok/ads/search');

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
    "capability": "tiktok.ads.search"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「TikTok 广告库搜索」总结这些广告主打什么卖点、推什么优惠、从什么时候开始投。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "items": [
      {
        "id": "1879699044062290",
        "url": "https://library.tiktok.com/ads/detail/?ad_id=1879699044062290",
        "advertiser": {
          "id": null,
          "name": "Trail Kit Outdoors Ltd",
          "url": null
        },
        "title": "Espresso is Back",
        "text": "Espresso is Back",
        "format": "video",
        "images": null,
        "videos": [
          "https://library.tiktok.com/api/v1/cdn/video/1879699044062290.mp4"
        ],
        "landing_url": null,
        "cta": null,
        "platforms": [
          "tiktok"
        ],
        "active": null,
        "first_shown_at": "2026-11-10T08:00:00Z",
        "last_shown_at": "2026-11-11T08:00:00Z",
        "reach": "1K-10K"
      }
    ]
  },
  "page": {
    "next_cursor": "eyJvIjoyMH0",
    "has_more": true
  },
  "warnings": [],
  "meta": {
    "capability": "tiktok.ads.search",
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

### TikTok 广告库搜索接口多少钱？

每次调用 $0.004，返回一页，约 12 条广告。抓 1,000 条广告大约要 84 次调用，合计 $0.336。每翻一页是一次单独的调用；失败的调用不扣费。

### 怎么翻页？

把返回里的 page.next_cursor 原样作为 cursor 参数传回去。page.has_more 为 false 时就没有下一页了。每一页都是一次 $0.004 的调用。

### 需要TikTok账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是TikTok上的公开数据，不会用到你自己的TikTok账号。

### 调用失败会扣费吗？

不会。所有错误都会返回 charged: false；只有超时返回 charged: null，表示结果还没确定。带同一个 Idempotency-Key 重发，绝不会重复扣费。

### TikTok不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## TikTok的其他接口

- [TikTok 视频搜索](https://okdata.online/zh/apis/tiktok/videos/search/)：$0.002/次 · 每页约 30 条视频
- [TikTok 视频详情](https://okdata.online/zh/apis/tiktok/videos/get/)：$0.002/次
- [TikTok 视频评论](https://okdata.online/zh/apis/tiktok/videos/comments/list/)：$0.002/次 · 每页约 50 条评论
- [TikTok 账号信息](https://okdata.online/zh/apis/tiktok/users/get/)：$0.002/次
- [TikTok 创意中心热门广告](https://okdata.online/zh/apis/tiktok/creative_center/ads/search/)：$0.002/次 · 每页约 20 条广告
- [TikTok Shop 商品搜索](https://okdata.online/zh/apis/tiktok/shop/products/search/)：$0.004/次 · 每页约 20 个商品
- [TikTok Shop 商品详情](https://okdata.online/zh/apis/tiktok/shop/products/get/)：$0.002/次
- [TikTok Shop 商品评价](https://okdata.online/zh/apis/tiktok/shop/products/reviews/list/)：$0.002/次 · 每页约 20 条评价
- [TikTok 视频字幕](https://okdata.online/zh/apis/tiktok/videos/transcript/get/)：$0.002/次
- [TikTok 评论回复](https://okdata.online/zh/apis/tiktok/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [TikTok 账号搜索](https://okdata.online/zh/apis/tiktok/users/search/)：$0.002/次 · 每页约 30 个账号
- [TikTok 账号作品](https://okdata.online/zh/apis/tiktok/users/videos/list/)：$0.002/次 · 每页约 10 条视频
- [TikTok 创意中心热门广告详情](https://okdata.online/zh/apis/tiktok/creative_center/ads/get/)：$0.002/次
- [TikTok Shop 店铺商品](https://okdata.online/zh/apis/tiktok/shop/sellers/products/list/)：$0.002/次 · 每页约 20 个商品
- [TikTok 账号粉丝列表](https://okdata.online/zh/apis/tiktok/users/followers/list/)：$0.002/次 · 每页约 20 个账号
- [TikTok 话题作品](https://okdata.online/zh/apis/tiktok/hashtags/videos/list/)：$0.002/次 · 每页约 20 条视频
