# Neon Bay Trophy Guide — GTA VI (PS5)

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/fiqirealme52-max/GTATrophyGuide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/fiqirealme52-max/GTATrophyGuide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver and 46 bronze, 28 of them hidden on PlayStation until earned. Static files, no build step, no network — open it in a desktop browser with the network off and everything still works.

## What is inside

- **Every trophy, exactly as PlayStation lists it** — official name, description and grade, in `app/data/trophies.json`, checked against the starter list (55/55 names, descriptions and grades identical).
- **A guide for each trophy in our own words**, with its source named beside it (PlayStation / Xbox platform data via PSNProfiles and TrueAchievements for the list itself; Push Square, PowerPyx, KeenGamer, GTABase, Shacknews, HowToVideoGame, GTA6 Database and more for the how and where). A specific location or step with no source gets no credit, so every specific in this guide carries one.
- **A citation package (revision 2)** — 195 cited steps across all 55 trophies, drawn from 17 real sources, each with its date and link, baked into `app/data/trophies.json`:
  - **Cited steps per trophy**: every guide step names its source, date and URL. Open any trophy's "Guide + sources" panel to see the numbered steps with their citations.
  - **Audit strip**: visible at the top of the app — cited steps, sources, coverage (55/55 trophies), total PSN points (1,350) and the audit date (20 Nov 2026).
  - **Source matrix**: the Sources & Audit tab shows a table of source × cited steps × trophies covered, plus the full source list with dates and links.
  - **PSN points per trophy**: standard scale (Bronze 15, Silver 30, Gold 90, Platinum 300 — community-tested values reported by PlayStation Universe, 8 Oct 2020). Each trophy card shows its points; the set totals 1,350.
  - **Honesty where the game is not out yet**: GTA VI releases 26 May 2026. Six trophies (Catch Me If You Can, Challenging Tank, Personal Best, Bad Luck I Guess, The Truth Is Out There, Ten Pin) have no confirmed unlock method in any published guide yet — they are flagged "Method unconfirmed" in the app and in the data, and their guides say so instead of guessing. The Chapter 1 balcony meditation for Positive Mental Attitude carries the same caveat: whether it is actually required is still unclear.
- **A roadmap to the platinum in 6 stages**, built from the official descriptions: story first, then stranger strands, activities, collectibles, one-off feats, and the long grind last.
- **The one missable trophy, flagged loudly**: Positive Mental Attitude (meditate at every spot) — one spot is at Jason's house in Chapter 1, after the mission Down to Earth. GTABase, PowerPyx and KeenGamer all flag it; every other trophy is retryable or automatic.
- **A tracker**: tick trophies off, progress saves in localStorage, export it to a file and import it back. Filters by kind (story, missable, collectibles, activities, side missions, grind, online — the list has no online trophies), by earned only, plus search. A spoiler setting hides the names and descriptions of story trophies until you earn them.
- **A look of its own**: a Vice City sunset drawn in CSS — no Rockstar logo, no official artwork, no game screenshots.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No install, no build.

## Verify it

```sh
python3 verify_shots.py
```

That serves the app, drives it in headless Chromium at 1280×800, checks for console errors, page errors and external requests, exercises every feature (55 cards, filters, search, spoiler setting, export/import, roadmap, sources matrix, audit strip), and captures the 4 screenshots in `screenshots/` as JPEGs. It exits non-zero if any check fails.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`. Run it twice and the dossier bytes are identical.

## Sources

PlayStation / Xbox platform data, collected by PSNProfiles and TrueAchievements (the list itself, 19 Nov 2026); Push Square's GTA 6 Trophy Guide & Roadmap; PowerPyx's Trophy Guide & Roadmap and 100% Completion Checklist & Guide; KeenGamer's Trophy Guide & Platinum Roadmap; GTABase's Trophy Guide & Achievements List; Shacknews' 100% Completion checklist (source: Rockstar Games); HowToVideoGame's Trophy and Achievement List; GTA6 Database's Activities; EGamers.io's trophy list; Xarmo's trophy list report; Insider Gaming's trophy list; Destructoid's 100% completion guide; GTA Spotter's full official list; Leonida Interactive's unlock guide; GTA6 Insider's trophy list; PSN trophy point values (PlayStation Universe / PSNProfiles forum, Oct 2020). Guide text is ours — sources are cited, never copied.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vfa7ye18&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)</sub>
