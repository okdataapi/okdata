# 错误码

> 所有接口同一种错误结构，告诉你有没有扣费、要不要重试。

网页版：https://okdata.online/zh/docs/errors/

```json
{
  "code": "invalid_params",
  "message": "缺少 query 参数",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "charged": false,
  "retry": "after_fix",
  "retry_after_seconds": null
}
```

| code | HTTP | 扣费 | 重试 | 含义 | 怎么办 |
|---|---|---|---|---|---|
| `unauthorized` | 401 | 否 | 修正后重试 | Key 缺失、格式不对或已吊销。 | 带上 Authorization: Bearer <key>，用有效的 key。 |
| `invalid_params` | 400 | 否 | 修正后重试 | 参数缺失或类型不对，或同一个 Idempotency-Key 用在了不同的请求上。 | 看 message，改好请求再发。 |
| `unknown_endpoint` | 404 | 否 | 不要重试 | 这个路径下没有接口。 | 对照目录检查 id；路径是 /v1 加上把点换成斜杠的 id。 |
| `insufficient_balance` | 402 | 否 | 修正后重试 | 余额不够这次调用的最高费用。 | 充值后重试。 |
| `not_found` | 404 | 否 | 不要重试 | 内容、账号或页面不存在或不公开。 | 这是最终结果，重试也一样。 |
| `rate_limited` | 429 | 否 | 可以重试 | 这个 key 当前请求太多。 | 等 retry_after_seconds 秒后再发。 |
| `upstream_busy` | 503 | 否 | 可以重试 | 这个接口的所有数据源都在满负荷。 | 退避后重试。 |
| `upstream_failed` | 502 | 否 | 可以重试 | 这个接口的所有数据源这次都失败了。 | 退避后重试；持续失败就看状态页。 |
| `timeout` | 504 | 查询后才知道 | 用同一个 Idempotency-Key 重试 | 没有及时返回，是否扣费暂时未知。 | 在 /v1/calls/{request_id} 查询，或带同一个 Idempotency-Key 重发，不会重复扣费。 |

## 安全重试

每次调用都带上 Idempotency-Key。24 小时内同一个 key、同一个请求会直接返回保存的结果（meta.replayed: true），不再扣费，所以超时后重试绝不会重复收费。同一个 key 换了请求内容会返回 invalid_params。
