# 小红书蒲公英达人合作成本概览 API

> 按蒲公英达人 ID 取预估合作成本：图文和视频笔记的预估 CPM、单次互动、单次阅读和单个进店成本，各带优于多少同类达人；单篇笔记曝光、阅读、互动和进店的中位数；近 30 天粉丝增长和发文数；邀约回复率、「好联系」和「活跃」标记；蒲公英标注的亮点、内容类目占比和合作过的行业。可看日常或合作笔记口径。

网页版：https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/metrics/

- **接口**：`GET /v1/xiaohongshu/pgy/creators/costs/metrics`
- **ID**：`xiaohongshu.pgy.creators.costs.metrics`
- **价格**：$0.04/次
- **返回**：一个 PgyCreatorCosts 对象（`data.item`）
- **状态**：预览
- **适合**：找博主

## 价格

每次调用 $0.04，返回一个结果。查 1,000 次共 $40.00。失败的调用不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `id` | string | 是 |  | 蒲公英达人 ID（24 位十六进制，与小红书用户 ID 相同），来自蒲公英达人搜索。（例：`591662306a6a6967b63e7f16`） |
| `tab` | string: everyday / sponsored | 否 | `everyday` | 看哪类笔记的数据：日常笔记（默认）或合作笔记，和蒲公英达人主页的两个分栏一样。 |
| `view` | string: compact / standard / full | 否 | `standard` | 返回多少字段。full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [PgyCreatorCosts](https://okdata.online/zh/docs/objects/pgy_creator_costs/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `creator_id` | string | 蒲公英达人 ID。 |
| `date` | string \| null | 数据所属日期：中国时间（UTC+8）的一个自然日，写成该日期的 UTC 零点。 |
| `currency` | string \| null | 成本的货币（ISO 4217）。 |
| `image_cpm` | number \| null | 图文笔记的预估千次曝光成本（CPM）（元）；蒲公英没有估值时为 null。 |
| `image_cpm_percentile` | number \| null | 图文笔记千次曝光成本（CPM）高于该达人的同类达人比例，0 到 1。 |
| `video_cpm` | number \| null | 视频笔记的预估千次曝光成本（CPM）（元）；蒲公英没有估值时为 null。 |
| `video_cpm_percentile` | number \| null | 视频笔记千次曝光成本（CPM）高于该达人的同类达人比例，0 到 1。 |
| `image_cpe` | number \| null | 图文笔记的预估单次互动成本（元）；蒲公英没有估值时为 null。 |
| `image_cpe_percentile` | number \| null | 图文笔记单次互动成本高于该达人的同类达人比例，0 到 1。 |
| `video_cpe` | number \| null | 视频笔记的预估单次互动成本（元）；蒲公英没有估值时为 null。 |
| `video_cpe_percentile` | number \| null | 视频笔记单次互动成本高于该达人的同类达人比例，0 到 1。 |
| `image_read_cost` | number \| null | 图文笔记的预估单次阅读成本（元）；蒲公英没有估值时为 null。 |
| `image_read_cost_percentile` | number \| null | 图文笔记单次阅读成本高于该达人的同类达人比例，0 到 1。 |
| `video_read_cost` | number \| null | 视频笔记的预估单次阅读成本（元）；蒲公英没有估值时为 null。 |
| `video_read_cost_percentile` | number \| null | 视频笔记单次阅读成本高于该达人的同类达人比例，0 到 1。 |
| `image_shop_visit_cost` | number \| null | 图文笔记的预估单个进店访客成本（元）；蒲公英没有估值时为 null。 |
| `image_shop_visit_cost_percentile` | number \| null | 图文笔记单个进店访客成本高于该达人的同类达人比例，0 到 1。 |
| `video_shop_visit_cost` | number \| null | 视频笔记的预估单个进店访客成本（元）；蒲公英没有估值时为 null。 |
| `video_shop_visit_cost_percentile` | number \| null | 视频笔记单个进店访客成本高于该达人的同类达人比例，0 到 1。 |
| `median_impressions` | integer \| null | 笔记曝光中位数。 |
| `median_impressions_percentile` | number \| null | 曝光中位数超过的同类达人比例，0 到 1。 |
| `median_reads` | integer \| null | 笔记阅读中位数。 |
| `median_reads_percentile` | number \| null | 阅读中位数超过的同类达人比例，0 到 1。 |
| `median_engagements` | integer \| null | 笔记互动中位数。 |
| `median_engagements_percentile` | number \| null | 互动中位数超过的同类达人比例，0 到 1。 |
| `median_shop_visits` | integer \| null | 笔记带来进店人数的中位数。 |
| `median_shop_visits_percentile` | number \| null | 进店人数中位数超过的同类达人比例，0 到 1。 |
| `follower_growth` | number \| null | 近 30 天粉丝增长率：0.037 即增长 3.7%；掉粉时为负数。 |
| `follower_growth_percentile` | number \| null | 粉丝增长率超过的同类达人比例，0 到 1。 |
| `invite_reply_rate` | number \| null | 48 小时内回复合作邀约的比例，0 到 1。 |
| `easy_to_reach` | boolean \| null | 蒲公英是否标注「好联系」。 |
| `active_days_7d` | integer \| null | 近 7 天活跃天数。 |
| `is_active` | boolean \| null | 蒲公英是否标注「活跃」。 |
| `notes_30d` | integer \| null | 近 30 天发布的笔记数，日常和合作都算。 |
| `highlight` | string \| null | 蒲公英标注的达人亮点，平台原文；没有时为 null。 |
| `highlight_reason` | string \| null | 蒲公英给出的亮点理由，平台原文。 |
| `content_mix` | CategoryShare[] \| null | 达人笔记的内容类目占比，从大到小。 |
| `industries` | string[] \| null | 达人合作过的行业，平台原文。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'id=591662306a6a6967b63e7f16'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"id": "591662306a6a6967b63e7f16"},
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
const url = new URL('https://api.okdata.online/v1/xiaohongshu/pgy/creators/costs/metrics');
url.searchParams.set('id', "591662306a6a6967b63e7f16");

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
    "capability": "xiaohongshu.pgy.creators.costs.metrics",
    "id": "591662306a6a6967b63e7f16"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「小红书蒲公英达人合作成本概览」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "creator_id": null,
      "date": null,
      "currency": null,
      "image_cpm": null,
      "image_cpm_percentile": null,
      "video_cpm": null,
      "video_cpm_percentile": null,
      "image_cpe": null,
      "image_cpe_percentile": null,
      "video_cpe": null,
      "video_cpe_percentile": null,
      "image_read_cost": null,
      "image_read_cost_percentile": null,
      "video_read_cost": null,
      "video_read_cost_percentile": null,
      "image_shop_visit_cost": null,
      "image_shop_visit_cost_percentile": null,
      "video_shop_visit_cost": null,
      "video_shop_visit_cost_percentile": null,
      "median_impressions": null,
      "median_impressions_percentile": null,
      "median_reads": null,
      "median_reads_percentile": null,
      "median_engagements": null,
      "median_engagements_percentile": null,
      "median_shop_visits": null,
      "median_shop_visits_percentile": null,
      "follower_growth": null,
      "follower_growth_percentile": null,
      "invite_reply_rate": null,
      "easy_to_reach": null,
      "active_days_7d": null,
      "is_active": null,
      "notes_30d": null,
      "highlight": null,
      "highlight_reason": null,
      "content_mix": [
        {
          "category": null,
          "share": null
        }
      ],
      "industries": null
    }
  },
  "warnings": [],
  "meta": {
    "capability": "xiaohongshu.pgy.creators.costs.metrics",
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

### 小红书蒲公英达人合作成本概览接口多少钱？

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
- [小红书蒲公英达人粉丝概览](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/followers/metrics/)：$0.04/次
- [小红书蒲公英达人核心数据趋势](https://okdata.online/zh/apis/xiaohongshu/pgy/creators/costs/history/)：$0.04/次
- [小红书蒲公英笔记数据](https://okdata.online/zh/apis/xiaohongshu/pgy/notes/get/)：$0.04/次
