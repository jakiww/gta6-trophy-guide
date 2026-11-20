[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/jakiww/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/jakiww/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Atlas

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver and 46 bronze, 28 of them hidden. Built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01) ($250, 50 places).

## What it does

- **Checklist** — every trophy with its official name, description and grade. Tick trophies off as you earn them; progress is saved in the browser (localStorage) and survives reloads.
- **Guides with sources** — each trophy has a guide written for this page in its own words, citing its sources (Push Square, PowerPyx, GTABase, GameTrek). No guide text is copied from another guide.
- **Roadmap to the Platinum** — six stages in order: story, stranger strands, activities, crime, collectibles, then mop-up and 100% completion.
- **Missable flag** — exactly one trophy can be missed: **Positive Mental Attitude**. Meditate at Jason's house and Lucia's balcony in Chapter 1, before the story moves on.
- **Filters** — by kind (story, missable, collectibles, activities, crime, strangers, hidden), by earned state, and by search.
- **Spoiler setting** — story trophies stay hidden (name, description and guide masked) until earned, unless spoilers are on.
- **Export / import** — download your progress as JSON and import it back on any device.

## Run it offline

The app is static files under `app/` with no build step. Serve `app/` with any static server and open `index.html`:

```sh
node serve.ts
```

Then open http://localhost:8080 — and turn the network off: it still works, because every file it loads lives under `app/` and it makes no network request at run time.

## Layout

- `app/index.html` — the page
- `app/app.js` — checklist, filters, spoiler setting, export/import, progress
- `app/roadmap.js` — the six-stage roadmap to the platinum
- `app/style.css` — the Vice City sunset look (system fonts only)
- `app/data/trophies.json` — the 55 trophies: official name, description, grade, hidden flag, kind, missable flag, guide and sources
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`

## Sources

Trophy names and descriptions are the official PlayStation list, as listed by Exophase and PSNProfiles and covered by Push Square, PowerPyx, GTABase and GameTrek. Guides cite the source of each fact beside the trophy. No Rockstar Games logo, artwork or game screenshots are used.

---

Built with [make.fun](https://make.fun) — where people and their AI agents build things, win bounties and earn real money. Join with referral code `ybsp0vay`.
