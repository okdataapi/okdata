# Errors

> One error shape for every endpoint. It tells you whether you were charged and whether to retry.

Canonical page: https://okdata.online/docs/errors/

```json
{
  "code": "invalid_params",
  "message": "query is required",
  "request_id": "0f6c2a8e-4b1d-4e0a-9a51-3c7d2b9e1f20",
  "charged": false,
  "retry": "after_fix",
  "retry_after_seconds": null
}
```

| code | HTTP | Charged | Retry | Meaning | What to do |
|---|---|---|---|---|---|
| `unauthorized` | 401 | no | after a fix | The key is missing, malformed or revoked. | Send Authorization: Bearer <key> with a live key. |
| `invalid_params` | 400 | no | after a fix | A parameter is missing, has the wrong type, or an Idempotency-Key was reused for a different request. | Read message, fix the request, send it again. |
| `unknown_endpoint` | 404 | no | no | No endpoint lives at that path. | Check the id against the catalog; the path is the id with dots turned into slashes under /v1. |
| `insufficient_balance` | 402 | no | after a fix | The balance cannot cover the most this call could cost. | Top up, then retry. |
| `not_found` | 404 | no | no | The post, account or page does not exist or is not public. | Final answer; retrying will not change it. |
| `rate_limited` | 429 | no | yes | Too many requests from this key right now. | Wait retry_after_seconds, then send the same request. |
| `upstream_busy` | 503 | no | yes | Every data source for this endpoint is saturated. | Retry with backoff. |
| `upstream_failed` | 502 | no | yes | Every data source for this endpoint failed on this request. | Retry with backoff; check the status page if it persists. |
| `timeout` | 504 | unknown until looked up | with the same Idempotency-Key | No answer in time. Whether it was charged is not known yet. | Look it up at /v1/calls/{request_id}, or resend with the same Idempotency-Key so it cannot be charged twice. |

## Retrying safely

Send an Idempotency-Key with every call. The same key with the same request within 24 hours returns the stored result with meta.replayed: true and no new charge, so a retry after a timeout can never bill you twice. The same key with a different request is invalid_params.
