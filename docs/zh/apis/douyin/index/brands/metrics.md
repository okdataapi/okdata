# 抖音巨量算数品牌指数对比 API

> 按品牌名和起止日期取品牌在抖音上搜索、内容、传播指数的日均值（巨量算数），并带同行业全部品牌和前 3、5、10、15、30 名品牌的均值作对照。指数是平台算出的分，不是次数。

网页版：https://okdata.online/zh/apis/douyin/index/brands/metrics/

- **接口**：`GET /v1/douyin/index/brands/metrics`
- **ID**：`douyin.index.brands.metrics`
- **价格**：$0.002/次
- **返回**：一个 BrandMetrics 对象（`data.item`）
- **状态**：预览
- **适合**：竞品监控

## 价格

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。请求到了平台的查询，查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

## 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `brand` | string | 是 |  | 品牌名，要和巨量算数收录的写法一致。（例：`泡泡玛特`） |
| `since` | string | 是 |  | 从哪一天起（含），写 ISO 日期或时间：取它所在的中国时间（UTC+8）自然日。（例：`2026-10-01T00:00:00Z`） |
| `until` | string | 是 |  | 到哪一天止（含），取法同上。指数通常晚一到两天出，最近几天可能没有或指数为 null。（例：`2026-10-31T00:00:00Z`） |
| `view` | string: brief / compact / standard / full | 否 | `standard` | 返回多少字段。brief：只给 ID、标题、正文前 100 字、链接、时间和主要数字，适合先扫一遍列表，再按 ID 取详情；compact 去掉空字段、长正文截到 500 字；full 会在 ext 里带上平台特有字段。 |
| `fields` | string[] | 否 |  | 只保留这些字段，按路径写（如 author.name），用来省 token。放在查询参数里时用逗号分隔。 |

cursor、view、fields 的用法见 [请求说明](https://okdata.online/zh/docs/requests/)。

## 返回字段

每一条都是一个 [BrandMetrics](https://okdata.online/zh/docs/objects/brand_metrics/)。

| 字段 | 类型 | 说明 |
|---|---|---|
| `brand` | string | 品牌名。 |
| `category` | string \| null | 平台给品牌归的行业，平台原文。 |
| `search_index` | integer \| null | 期间日均搜索指数。 |
| `content_index` | integer \| null | 期间日均内容指数。 |
| `spread_index` | integer \| null | 期间日均传播指数。 |
| `benchmarks` | BrandBenchmark[] \| null | 整个行业和头部品牌的同口径均值。 |
| `ext` | object | 平台特有字段，只在 view=full 时返回。 |

## 请求示例

### cURL

```bash
curl -G "https://api.okdata.online/v1/douyin/index/brands/metrics" \
  -H "Authorization: Bearer $OKDATA_API_KEY" \
  --data-urlencode 'brand=泡泡玛特' \
  --data-urlencode 'since=2026-10-01T00:00:00Z' \
  --data-urlencode 'until=2026-10-31T00:00:00Z'
```

### Python

```python
import os
import requests

resp = requests.get(
    "https://api.okdata.online/v1/douyin/index/brands/metrics",
    headers={"Authorization": f"Bearer {os.environ['OKDATA_API_KEY']}"},
    params={"brand": "泡泡玛特", "since": "2026-10-01T00:00:00Z", "until": "2026-10-31T00:00:00Z"},
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
const url = new URL('https://api.okdata.online/v1/douyin/index/brands/metrics');
url.searchParams.set('brand', "泡泡玛特");
url.searchParams.set('since', "2026-10-01T00:00:00Z");
url.searchParams.set('until', "2026-10-31T00:00:00Z");

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
    "capability": "douyin.index.brands.metrics",
    "brand": "泡泡玛特",
    "since": "2026-10-01T00:00:00Z",
    "until": "2026-10-31T00:00:00Z"
  }
}
```

或者对接好 MCP 的智能体直接说：

> 用「抖音巨量算数品牌指数对比」查一下，总结返回的结果。

## 返回示例

```json
{
  "code": "ok",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "data": {
    "item": {
      "brand": null,
      "category": null,
      "search_index": null,
      "content_index": null,
      "spread_index": null,
      "benchmarks": [
        {
          "scope": null,
          "search_index": null,
          "content_index": null,
          "spread_index": null
        }
      ]
    }
  },
  "warnings": [],
  "meta": {
    "capability": "douyin.index.brands.metrics",
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

所有错误同一种结构：code、request_id、message 和 message_zh（每个 code 一句固定的话）、charged、retry、retry_after_seconds、param 和 docs_url，具体问题写在 problems 里。请求到了平台的调用出错（查不到、平台失败或超时）时，按这个接口的价格计一次费，charged 为 true，并给出 amount；参数错误这类还没请求到平台的错误不扣费；这个接口的 not_found 至少收 $0.002。只有 settlement_unknown 的扣费结果要查询后才知道。完整列表：https://okdata.online/zh/docs/errors/

## 常见问题

### 抖音巨量算数品牌指数对比接口多少钱？

每次调用 $0.002，返回一个结果。查 1,000 次共 $2.00。请求到了平台的查询，查不到或出错也照常计费；还没请求到平台就被拦下的不扣费。

### 需要抖音账号、Cookie 或扫码登录吗？

不需要。只要带上 okdata 的 API key。返回的是抖音上的公开数据，不会用到你自己的抖音账号。

### 调用失败会扣费吗？

请求到了平台就会扣一次：返回为空、查不到、平台出错或超时，都按一次调用计费（按条计价的按 1 条），错误里 charged 为 true，并给出 amount。参数错误、余额不足这类还没请求到平台就被拦下的不扣费。

### 抖音不展示某个字段怎么办？

这个字段会是 null，meta.unavailable 里会列出它和原因：platform（平台本来就不展示）或 capability（我们暂时取不到）。

## 抖音的其他接口

- [抖音视频搜索](https://okdata.online/zh/apis/douyin/videos/search/)：$0.02/次 · 每页约 20 条视频
- [抖音视频详情](https://okdata.online/zh/apis/douyin/videos/get/)：$0.002/次
- [抖音视频评论](https://okdata.online/zh/apis/douyin/videos/comments/list/)：$0.002/次 · 每页约 20 条评论
- [抖音账号信息](https://okdata.online/zh/apis/douyin/users/get/)：$0.002/次
- [抖音账号作品列表](https://okdata.online/zh/apis/douyin/users/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音热搜榜](https://okdata.online/zh/apis/douyin/trends/list/)：$0.002/次 · 每页约 50 条榜单
- [抖音星图达人搜索](https://okdata.online/zh/apis/douyin/xingtu/creators/search/)：$0.004/次 · 每页约 20 位达人
- [抖音星图达人报价](https://okdata.online/zh/apis/douyin/xingtu/creators/rates/get/)：$0.04/次
- [抖音评论回复](https://okdata.online/zh/apis/douyin/comments/replies/list/)：$0.002/次 · 每页约 20 条评论
- [抖音话题视频](https://okdata.online/zh/apis/douyin/hashtags/videos/list/)：$0.002/次 · 每页约 10 条视频
- [抖音账号搜索](https://okdata.online/zh/apis/douyin/users/search/)：$0.002/次 · 每页约 30 个账号
- [抖音视频播放量](https://okdata.online/zh/apis/douyin/videos/metrics/)：$0.002/次
- [抖音相关视频](https://okdata.online/zh/apis/douyin/videos/related/)：$0.002/次 · 每页约 10 条视频
- [抖音视频榜](https://okdata.online/zh/apis/douyin/videos/trending/)：$0.002/次 · 每页约 9 条视频
- [抖音搜索框联想词](https://okdata.online/zh/apis/douyin/keywords/related/)：$0.02/次 · 每页约 10 条结果
- [抖音巨量算数品牌指数趋势](https://okdata.online/zh/apis/douyin/index/brands/history/)：$0.002/次
- [抖音巨量算数达人热门视频](https://okdata.online/zh/apis/douyin/index/creators/videos/list/)：$0.002/次 · 每页约 20 条视频
- [抖音巨量算数达人粉丝画像](https://okdata.online/zh/apis/douyin/index/creators/audience/get/)：$0.002/次
- [抖音巨量算数达人核心指标](https://okdata.online/zh/apis/douyin/index/creators/metrics/)：$0.002/次
- [抖音巨量算数关键词人群画像](https://okdata.online/zh/apis/douyin/index/keywords/audience/get/)：$0.002/次
- [抖音巨量算数关键词热度趋势](https://okdata.online/zh/apis/douyin/index/keywords/history/)：$0.006/次 · 每页约 1 条结果
- [抖音巨量算数关联词](https://okdata.online/zh/apis/douyin/index/keywords/related/)：$0.002/次 · 每页约 170 条结果
- [抖音巨量算数实时热点](https://okdata.online/zh/apis/douyin/index/trends/list/)：$0.002/次 · 每页约 30 条榜单
- [抖音巨量算数关键词热门视频](https://okdata.online/zh/apis/douyin/index/videos/search/)：$0.002/次 · 每页约 20 条视频
- [抖音达人互动与粉丝趋势](https://okdata.online/zh/apis/douyin/users/history/)：$0.002/次
- [抖音星图达人资料](https://okdata.online/zh/apis/douyin/xingtu/creators/get/)：$0.004/次
- [抖音星图达人粉丝画像](https://okdata.online/zh/apis/douyin/xingtu/creators/audience/get/)：$0.004/次
- [抖音星图达人传播数据](https://okdata.online/zh/apis/douyin/xingtu/creators/metrics/)：$0.004/次
- [抖音星图达人作品表现](https://okdata.online/zh/apis/douyin/xingtu/creators/videos/list/)：$0.004/次 · 每页约 20 条视频
- [抖音星图达人内容热词](https://okdata.online/zh/apis/douyin/xingtu/creators/keywords/get/)：$0.002/次
- [抖音星图达人星图指数](https://okdata.online/zh/apis/douyin/xingtu/creators/scores/get/)：$0.008/次
- [抖音星图达人内容分布](https://okdata.online/zh/apis/douyin/xingtu/creators/content_mix/get/)：$0.004/次
- [抖音星图达人转化能力](https://okdata.online/zh/apis/douyin/xingtu/creators/conversion/get/)：$0.004/次
- [抖音星图营销活动日历](https://okdata.online/zh/apis/douyin/xingtu/campaigns/list/)：$0.004/次 · 每页约 40 条结果
- [抖音星图视频数据报告](https://okdata.online/zh/apis/douyin/xingtu/videos/get/)：$0.004/次
- [抖音用户视频（备用版）](https://okdata.online/zh/apis/douyin/backup/users/videos/list/)：$0.0025/次 · 每页约 20 条视频
- [抖音视频搜索（备用版）](https://okdata.online/zh/apis/douyin/backup/videos/search/)：$0.03/次 · 每页约 8 条视频
