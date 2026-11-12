"""Static checks of the generated types: mypy --strict reads this file (pytest does not run it).
Each `type: ignore[...]` must be needed, or mypy reports it as unused (strict mode)."""
from __future__ import annotations

from okdata import Account, AsyncOkData, Batch, Item, OkData, Page, Post


def sync_types(ok: OkData) -> None:
    page: Page[Post] = ok.douyin.videos.search(query="露营", sort="latest", max_price="0.05")
    one: Item[Post] = ok.x.posts.get(url="https://x.com/a/status/1")
    single: Item[Account] = ok.x.users.get(username="openai")
    batch: Batch[Account] = ok.x.users.get(ids=["1", "2"])
    likes = page.items[0]["metrics"]["likes"]
    print(page, one, single, batch, likes)
    ok.douyin.videos.search()  # type: ignore[call-arg]
    ok.douyin.videos.search(query="x", sort="loudest")  # type: ignore[arg-type]
    ok.douyin.videos.search(query="x", view="huge")  # type: ignore[arg-type]


async def async_types(ok: AsyncOkData) -> None:
    page: Page[Post] = await ok.douyin.videos.search(query="露营")
    batch: Batch[Account] = await ok.x.users.get(ids=["1"])
    print(page, batch)
