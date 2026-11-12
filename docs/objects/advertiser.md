# Advertiser

> An advertiser in a public ad library.

Canonical page: https://okdata.online/docs/objects/advertiser/

The same shape on every platform. A field a platform does not have is null, and meta.unavailable says why. Use fields= to keep only what you need.

| Field | Type | Description |
|---|---|---|
| `id` | string | Advertiser ID in the library. |
| `url` | string | The advertiser's page in the library. |
| `name` | string | The name the library shows, often the legal entity. |
| `region` | string \| null | Country or region it is registered in (ISO code). |
| `ads` | integer \| null | The library's estimate of how many ads it has. |
| `ext` | object | Platform-specific extras. Only returned with view=full. |

## Endpoints that return a Advertiser

- [Google Ads Transparency advertiser search](https://okdata.online/apis/google/advertisers/search/) (`google.advertisers.search`): $0.004 per call · about 10 advertisers per page
