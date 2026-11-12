# Meta Ad Library API

> Ads running on Facebook and Instagram, by keyword or advertiser.

Canonical page: https://okdata.online/apis/meta/

3 endpoints, $0.004 to $0.004 per call. Region: Global. No Meta Ad Library login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [Meta Ad Library search](https://okdata.online/apis/meta/ads/search/) | `meta.ads.search` | Ad[] | $0.004 per call · about 30 ads per page |
| [Meta Ad Library ad detail](https://okdata.online/apis/meta/ads/get/) | `meta.ads.get` | Ad | $0.004 per call |
| [Meta advertiser ads](https://okdata.online/apis/meta/advertisers/ads/list/) | `meta.advertisers.ads.list` | Ad[] | $0.004 per call · about 30 ads per page |

## Good for

- Ad intelligence: `meta.ads.search`, `meta.ads.get`, `meta.advertisers.ads.list`
- Competitor monitoring: `meta.ads.search`, `meta.ads.get`, `meta.advertisers.ads.list`
