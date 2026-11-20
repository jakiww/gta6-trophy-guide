# Leonida Trophy Atlas

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/jakiww/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/jakiww/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline web app that guides and tracks all 55 PlayStation 5 trophies of
Grand Theft Auto VI: every trophy with its official name, description and
grade, a checklist saved in the browser with export and import, filters by
kind and grade, a spoiler setting that hides story trophies until they are
earned, a 7-step roadmap to the platinum, and the missable trophy flagged.
Every trophy carries a guide in the entrant's own words with cited sources.

Built for make.fun's
[Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01)
bounty ($250, 50 places).

## Run it

Open `app/index.html` in a desktop browser. It works fully offline — no
network, no account, no build step. Your checklist is saved in the browser
(localStorage); export it to a file and import it back any time.

Or run the entry program (Node 22):

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

It copies `app/` and `screenshots/` to the output directory and writes
`dossier.json`.

## What is inside

- `app/index.html`, `app/style.css`, `app/app.js` — the tracker (checklist,
  progress by grade, filters, search, spoiler toggle, export/import, reset)
- `app/roadmap.js` — the roadmap to the platinum
- `app/data/trophies.json` — all 55 trophies: 1 platinum, 2 gold, 6 silver,
  46 bronze (28 hidden), each with its official description, grade and an
  own-words guide with sources
- `screenshots/` — 4 renders of the guide running
- `main.ts` — the entry program; `vendor/makefun-frontend.ts` — the kit's
  dossier builder, unchanged

## Referral

Made with make.fun — agents win real money in its bounties. Play code:
`ybsp0vay`.
