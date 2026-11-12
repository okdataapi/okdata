# Errors

> One error shape for every endpoint. It tells you whether you were charged and whether to retry. Branch on code (and reason), never on message: message and message_zh are a fixed sentence per code, and what exactly was wrong is in problems and param.

Canonical page: https://okdata.online/docs/errors/

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

| code | HTTP | Charged | Retry | Meaning | What to do |
|---|---|---|---|---|---|
| `invalid_params` | 400 | no | after a fix | A parameter is missing, has the wrong type or value, or the method is wrong. problems lists each one; param names the first. | Fix what problems says, then send the request again. |
| `max_price_exceeded` | 400 | no | after a fix | The most this call could cost (required) is above X-Max-Price (or max_price), so it did not run. | Raise the cap to at least required, ask for fewer items, or leave the cap out. |
| `cursor_invalid` | 400 | no | no | The cursor is not one this API issued, or it was issued to another account. | Send page.next_cursor exactly as it came, or start the listing again without a cursor. |
| `cursor_mismatch` | 400 | no | after a fix | The cursor was sent to another endpoint, or with other parameters than the page it came from (view and fields may change). | Resend with the endpoint and parameters of the page it came from. |
| `unauthorized` | 401 | no | no | The key is missing, malformed, revoked, disabled or expired (reason says which when known). | Send Authorization: Bearer <key> with a live key; next_step says where to get one. |
| `insufficient_balance` | 402 | no | after a fix | The balance (available) cannot cover the most this call could cost (required). | Top up at top_up_url, then send the same request again, unchanged. |
| `key_budget_exceeded` | 402 | no | after a fix | This call would take the key past its daily, monthly or total spending limit (reason says which). | Wait for the day or month to turn (UTC), raise the limit in the console, or use another key. |
| `account_suspended` | 403 | no | no | The account this key belongs to is suspended, so none of its keys work. | Write to hello@okdata.online. |
| `key_scope_denied` | 403 | no | no | This key may not call this endpoint (its scope leaves it out). | Use a key whose scope includes it, or widen the scope in the console. |
| `unknown_endpoint` | 404 | no | no | No endpoint lives at that path. When the path is close to one that does, moved_to (or suggestion) names it. | Use moved_to when given; otherwise check the id against the catalog (the path is the id with dots turned into slashes under /v1). |
| `not_found` | 404 | no | no | The post, account or page does not exist or is not public. Endpoints whose charge_when_not_found is above 0 charge this answer (the source billed us for it): the body then says charged: true and amount. | Final answer; retrying will not change it. |
| `result_not_found` | 404 | no | no | No kept result for this request ID on this account (it failed, or was never made). | Check the request ID; only successful calls keep a result. |
| `idempotency_conflict` | 409 | no | after a fix | This Idempotency-Key was used in the last 24 h for a different request. | Use a new key for a new request. |
| `call_in_progress` | 409 | no | with the same Idempotency-Key | A call with this Idempotency-Key is still running. | Retry in a moment with the same key; you get its result, charged once. |
| `cursor_expired` | 410 | no | no | The cursor is older than the endpoint's cursor lifetime (page.cursor_expires_at said when). | Start the listing again without a cursor, and skip the ids you already have. |
| `result_expired` | 410 | no | no | The result is older than 24 hours and was deleted. | Call the endpoint again (charged as usual). |
| `rate_limited` | 429 | no | yes | The account sent too many requests this minute (reason: rate) or has too many calls running (reason: concurrency). | Wait retry_after_seconds (or for a running call to end), then send the same request. |
| `cost_cap_exceeded` | 429 | no | yes | The account reached its daily spending allowance. | Wait retry_after_seconds (the next UTC day), or write to us to raise it. |
| `uncharged_cost_limit` | 429 | no | yes | Too many uncharged calls (nothing found) today. | Check the ids you send; it opens again at the next UTC day. |
| `settlement_unknown` | 500 | unknown until looked up | with the same Idempotency-Key | The data came back, but the charge could not be confirmed. | Resend with the same Idempotency-Key to get the result without paying again, or look it up at /v1/calls/{request_id}. |
| `internal_error` | 500 | no | yes | Something went wrong on our side; nothing was charged. | Retry with backoff. |
| `upstream_failed` | 502 | no | yes | Every data source for this endpoint failed on this request. | Retry with backoff; check the status page if it persists. |
| `cursor_unavailable` | 502 | no | yes | Only the source that served the previous page can continue it, and it is not available right now. | Retry later with the same cursor, or start the listing again without one. |
| `upstream_busy` | 503 | no | yes | Every data source for this endpoint is saturated. | Retry with backoff. |
| `capability_paused` | 503 | no | yes | This endpoint is paused right now; nothing ran. | Check /v1/catalog/status and retry once it is back. |
| `timeout` | 504 | no | yes | The data did not come back in time. The hold was released, so nothing was charged. | Retry; an Idempotency-Key keeps a retry from ever being charged twice. |

## Retrying safely

Send an Idempotency-Key with every call. The same key with the same request within 24 hours returns the stored result with meta.replayed: true and no new charge, so a retry after a timeout can never bill you twice. The same key with a different request is 409 idempotency_conflict; while the first call is still running, it is 409 call_in_progress: retry with the same key.
