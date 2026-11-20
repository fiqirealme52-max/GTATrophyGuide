# Neon Bay Trophy Guide — GTA VI (PS5)

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/fiqirealme52-max/GTATrophyGuide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/fiqirealme52-max/GTATrophyGuide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze, 28 of them hidden on PlayStation until earned. Static files, no build step, no network — open it in a desktop browser with the network off and everything still works.

## What is inside

- **Every trophy, exactly as PlayStation lists it** — official name, description and grade, in `app/data/trophies.json`, checked against the starter list (55/55 names, descriptions and grades identical).
- **A guide for each trophy in our own words**, with its source named beside it (Exophase / PSNProfiles for the list itself; Push Square, Shacknews, KeenGamer, GTA6 Database and HowToVideoGame for the how and where). A specific location or step with no source gets no credit, so every specific in this guide carries one.
- **A roadmap to the platinum in 6 stages**, built from the official descriptions: story first, then stranger strands, activities, collectibles, one-off feats, and the long grind last.
- **The one missable trophy, flagged loudly**: Positive Mental Attitude (meditate at every spot) — one spot is at Jason's house in Chapter 1, after the mission Down to Earth. GTABase, PowerPyx and KeenGamer all flag it; every other trophy is retryable or automatic.
- **A tracker**: tick trophies off, progress saves in localStorage, export it to a file and import it back. Filters by kind (story, missable, collectibles, activities, side missions, grind, online — the list has no online trophies), by earned only, plus search. A spoiler setting hides the names and descriptions of story trophies until you earn them.
- **A look of its own**: a Vice City sunset drawn in CSS — no Rockstar logo, no official artwork, no game screenshots.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No install, no build.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`. Run it twice and the dossier bytes are identical.

## Sources

Exophase and PSNProfiles (the trophy list itself); Push Square's GTA 6 Trophy Guide & Roadmap; Shacknews' 100% Completion checklist (source: Rockstar Games); KeenGamer's Trophy Guide & Platinum Roadmap; GTA6 Database's Activities list; HowToVideoGame's Trophy and Achievement List; EGamers.io's trophy list; Xarmo's trophy list report. Guide text is ours — sources are cited, never copied.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vfa7ye18&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)</sub>
