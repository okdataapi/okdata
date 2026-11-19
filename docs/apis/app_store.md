# App Store API

> Any iPhone, iPad or Mac app in any country's store: price, ratings, version and developer, and its latest written reviews.

Canonical page: https://okdata.online/apis/app_store/

2 endpoints, $0.001 to $0.001 per call. Region: Global. No App Store login or cookies needed.

| Endpoint | ID | Returns | Price |
|---|---|---|---|
| [App Store app details](https://okdata.online/apis/app_store/apps/get/) | `app_store.apps.get` | Product | $0.001 per call |
| [App Store reviews](https://okdata.online/apis/app_store/apps/reviews/list/) | `app_store.apps.reviews.list` | Review[] | $0.001 per call · about 50 reviews per page |

## Good for

- Product research: `app_store.apps.get`, `app_store.apps.reviews.list`
- Competitor monitoring: `app_store.apps.get`
- Word of mouth: `app_store.apps.reviews.list`
