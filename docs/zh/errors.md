# 错误码

> 所有接口同一种错误结构，告诉你有没有扣费、要不要重试。判断时看 code（和 reason），不要看 message：message 和 message_zh 是每个 code 固定的一句话，具体哪里不对写在 problems 和 param 里。

网页版：https://okdata.online/zh/docs/errors/

```json
{
  "code": "invalid_params",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "message": "A parameter is invalid",
  "message_zh": "参数不合法",
  "charged": false,
  "retry": "after_fix",
  "retry_after_seconds": null,
  "param": "query",
  "problems": [
    "query is required"
  ],
  "docs_url": "https://okdata.online/docs/errors/#invalid_params"
}
```

| code | HTTP | 扣费 | 重试 | 含义 | 怎么办 |
|---|---|---|---|---|---|
| `invalid_params` | 400 | 否 | 修正后重试 | 参数缺失、类型或取值不对，或者请求方法不对。problems 列出每一处问题，param 是第一个出错的参数。 | 按 problems 改好再发。 |
| `max_price_exceeded` | 400 | 否 | 修正后重试 | 这次调用最多可能花的钱（required）超过了 X-Max-Price（或 max_price），所以没有执行。 | 把上限调到 required 以上、少要一些条目，或者不设上限。 |
| `cursor_invalid` | 400 | 否 | 不要重试 | 这个 cursor 不是我们发出的，或者是发给别的账户的。 | 把 page.next_cursor 原样传回，或者不带 cursor 从头开始。 |
| `cursor_mismatch` | 400 | 否 | 修正后重试 | cursor 发到了别的接口，或者参数和它所在那一页不一样（view 和 fields 可以变）。 | 用它所在那一页的接口和参数重新发。 |
| `unauthorized` | 401 | 否 | 不要重试 | Key 缺失、格式不对、已撤销、已停用或已过期（知道原因时 reason 会写明）。 | 带上 Authorization: Bearer <key>，用有效的 key；next_step 写了去哪里拿。 |
| `insufficient_balance` | 402 | 否 | 修正后重试 | 余额（available）不够这次调用的最高费用（required）。 | 到 top_up_url 充值，到账后把同一个请求原样再发一次。 |
| `key_budget_exceeded` | 402 | 否 | 修正后重试 | 这次调用会超出这个 key 的每日、每月或总额花费上限（reason 说明是哪个）。 | 等到下一天或下个月（UTC），在控制台调高上限，或换一个 key。 |
| `account_suspended` | 403 | 否 | 不要重试 | 这个 key 所属的账号已停用，账号下的 key 都不能用。 | 发邮件到 hello@okdata.online。 |
| `key_scope_denied` | 403 | 否 | 不要重试 | 这个 key 的可用范围里没有这个接口。 | 换一个包含这个接口的 key，或在控制台放宽它的范围。 |
| `unknown_endpoint` | 404 | 否 | 不要重试 | 这个路径下没有接口。路径和某个接口很接近时，moved_to（或 suggestion）会给出正确的路径。 | 有 moved_to 就用它；否则对照目录检查 id（路径是 /v1 加上把点换成斜杠的 id）。 |
| `not_found` | 404 | 否 | 不要重试 | 内容、账号或页面不存在或不公开。charge_when_not_found 大于 0 的接口会对这个结果计费（数据源也向我们收了钱）：这时返回体里 charged 为 true，并给出 amount。 | 这是最终结果，重试也一样。 |
| `result_not_found` | 404 | 否 | 不要重试 | 这个账号下没有这个请求号的结果（调用失败了，或从没发生）。 | 核对请求号；只有成功的调用会保留结果。 |
| `idempotency_conflict` | 409 | 否 | 修正后重试 | 这个 Idempotency-Key 在 24 小时内已用于另一个请求。 | 新请求用新的 key。 |
| `call_in_progress` | 409 | 否 | 用同一个 Idempotency-Key 重试 | 带这个 Idempotency-Key 的调用还在进行。 | 稍后用同一个 key 重试，拿到它的结果，只扣一次费。 |
| `cursor_expired` | 410 | 否 | 不要重试 | cursor 超过了这个接口的有效期（page.cursor_expires_at 写了到期时间）。 | 不带 cursor 从头开始，跳过已经拿到的 id。 |
| `result_expired` | 410 | 否 | 不要重试 | 结果已超过 24 小时，已删除。 | 重新调用接口（照常计费）。 |
| `rate_limited` | 429 | 否 | 可以重试 | 账号这一分钟请求太多（reason: rate），或同时进行的调用太多（reason: concurrency）。 | 等 retry_after_seconds 秒（或等进行中的调用结束），再发同一个请求。 |
| `cost_cap_exceeded` | 429 | 否 | 可以重试 | 账号今天的花费已到每日上限。 | 等 retry_after_seconds 秒（下一个 UTC 日），或联系我们调高。 |
| `uncharged_cost_limit` | 429 | 否 | 可以重试 | 今天没扣费的调用（查无结果）太多了。 | 检查发送的 id；下一个 UTC 日恢复。 |
| `settlement_unknown` | 500 | 查询后才知道 | 用同一个 Idempotency-Key 重试 | 数据已返回，但没能确认是否扣费。 | 带同一个 Idempotency-Key 重发，拿到结果且不会再扣费；或在 /v1/calls/{request_id} 查询。 |
| `internal_error` | 500 | 否 | 可以重试 | 我们这边出错了，这次没有扣费。 | 退避后重试。 |
| `upstream_failed` | 502 | 否 | 可以重试 | 这个接口的所有数据源这次都失败了。 | 退避后重试；持续失败就看状态页。 |
| `cursor_unavailable` | 502 | 否 | 可以重试 | 只有返回上一页的数据源能接着翻，它现在不可用。 | 稍后用同一个 cursor 重试，或者不带 cursor 从头开始。 |
| `upstream_busy` | 503 | 否 | 可以重试 | 这个接口的所有数据源都在满负荷。 | 退避后重试。 |
| `capability_paused` | 503 | 否 | 可以重试 | 这个接口暂时停用了，这次没有执行。 | 看 /v1/catalog/status，恢复后再调用。 |
| `timeout` | 504 | 否 | 可以重试 | 数据没有及时返回。预扣已退回，这次没有扣费。 | 直接重试；带 Idempotency-Key 重试，永远不会重复扣费。 |

## 安全重试

每次调用都带上 Idempotency-Key。24 小时内同一个 key、同一个请求会直接返回保存的结果（meta.replayed: true），不再扣费，所以超时后重试绝不会重复收费。同一个 key 换了请求内容会返回 409 idempotency_conflict；第一次调用还没跑完时重发，返回 409 call_in_progress，稍等后用同一个 key 再试。
