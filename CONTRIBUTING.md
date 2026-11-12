# Contributing

Issues and pull requests are welcome. Everything under `typescript/`, `cli/`, `python/` and `docs/` is exported
from the okdata monorepo, where the endpoint catalog lives and the packages are published from. A pull request
here is applied there and comes back with the next export, so expect a maintainer to port it rather than merge it
as is.

Please do not edit generated files by hand: `typescript/src/generated/`, `python/src/okdata/_generated/`,
`docs/` and the platform tables in `README.md` are rewritten from the catalog on every export. If an endpoint's
description, parameters or price look wrong, open an issue; the fix belongs in the catalog.

All tests run offline against local mock servers: no key, no network, nothing charged.

## TypeScript SDK and command line

One npm workspace at the repository root holds `typescript/` (`@okdata/sdk`) and `cli/` (`okdata`); the CLI gets
`../typescript` as `@okdata/sdk`, so it builds before the SDK is installed from npm.

```sh
npm install
npm run typecheck -w typescript
npm test -w typescript                              # unit tests against a local mock server
npm run build -w typescript                         # typescript/dist/
npm run typecheck -w cli
npm test -w cli                                     # in-process tests against a local mock API
npm run build -w cli                                # cli/dist/bin.js; needs the SDK's dist first
node cli/dist/bin.js find 小红书 评论
OKDATA_LIVE_KEY=okd_... npm test -w typescript      # adds a live smoke test of the free routes only
```

`npm run typecheck`, `npm test` and `npm run build` in the root run both packages in order.

## Python SDK

```sh
cd python
python3 -m venv .venv && . .venv/bin/activate
pip install -e '.[dev]'
pytest                                              # against a local mock server
mypy                                                # --strict; settings in pyproject.toml
OKDATA_LIVE_KEY=okd_... pytest                      # adds a live smoke test of the free routes
```

With uv: `uv run --extra dev pytest` and `uv run --extra dev mypy`. `uv build` (or `python -m build`) makes the
sdist and wheel; CI checks that the sdist holds nothing but `src/`, `tests/` and the project files.

## Refreshing from the monorepo (maintainers)

```sh
npm run sync -- --catalog <path to the monorepo>            # rewrite the exported directories and docs
npm run sync -- --catalog <path to the monorepo> --check    # exit 1 if anything is out of date
```
