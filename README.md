# 🏏 HOWZAT?! — Cricket Higher/Lower

A browser game built with plain HTML, CSS, and JavaScript. Two cricketers
step up to the crease, one stat is shown, and you guess whether the next
player's number is **higher** or **lower**. Get it right and they swap in,
your streak grows, and a new challenger walks out. Get it wrong once and
you're **out** — add your name to the leaderboard and try to beat your best.

No frameworks, no build step, no dependencies. Open it and play, or push it
straight to GitHub Pages.

## Contents

- [Features](#features)
- [Play locally](#play-locally)

- [How it works](#how-it-works)
- [Project structure](#project-structure)
- [Customizing](#customizing)
- [About the data](#about-the-data)
- [Roadmap ideas](#roadmap-ideas)
- [License](#license)

## Features

- 🎲 **Random stat category every round** — matches played, career runs,
  batting average, centuries, highest score, or wickets taken.
- 📈 **Streak-based scoring** with a persistent personal best.
- 🏆 **Local leaderboard** — top 10 names, saved in the browser.
- 🎨 **Cricket-themed scorecard design** — stitched-seam dividers, a
  flip-digit reveal animation, and an "OUT" stamp when you're dismissed.
- ♿ **Accessible basics covered** — keyboard-usable controls, visible
  focus states, and `prefers-reduced-motion` respected.
- 📱 **Responsive** — cards stack vertically on narrow screens.

## Play locally

Just open `index.html` in any browser — that's it.

If your browser blocks scripts from loading over `file://`, run a quick
local server instead:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.



## How it works

1. A category is picked at random (e.g. "Batting Average").
2. The current player's value for that category is shown.
3. The challenger's value is hidden behind a `?` — you guess **Higher** or
   **Lower**.
4. Correct → the challenger becomes the new "current player" for the next
   round, your streak ticks up.
5. Wrong → the round ends, your streak is your final score, and you can
   save it to the leaderboard.

A tie counts as a correct guess, same convention as most higher/lower games.

## Project structure

```
.
├── index.html    → page structure and markup
├── style.css     → visual design (stadium/scorecard theme)
├── script.js     → game state, round logic, scoring, leaderboard
├── players.js    → dataset of cricketers and their career stats
└── README.md     → you are here
```

## Customizing

**Add or edit players** — open `players.js` and add an object with the
same shape as the existing entries:

```js
{ name: "New Player", country: "England", era: "2015–present",
  matches: 90, runs: 6500, average: 47.1, hundreds: 18,
  highestScore: 210, notOut: false, wickets: 0 }
```

**Add or edit stat categories** — edit the `STAT_CATEGORIES` array near the
top of `script.js`. Each entry needs a `key` matching a `players.js` field,
a display `label`, and a `unit`:

```js
{ key: "average", label: "Batting Average", unit: "average" }
```

**Restyle it** — all design tokens (colors, fonts) are defined as CSS
custom properties at the top of `style.css`, so re-theming is mostly a
matter of changing values in one place.

**Make the leaderboard shared/global** — right now scores live in the
browser's `localStorage`, so they're per-device only. Wiring up a small
backend (Firebase, Supabase, or a tiny API) would let everyone share one
leaderboard — ask if you'd like a hand setting that up.

## About the data

Stats are **career Test-match figures**. Test cricket has been recorded
continuously since 1877, which is what makes it possible to fairly line up
players across eras — Don Bradman against Virat Kohli, Shane Warne against
Ravichandran Ashwin — on the same sheet.

A handful of still-active players have approximate figures (their careers
are ongoing as of the 2025/26 season). For exact, up-to-date numbers, cross-
check against a source like [ESPNcricinfo Statsguru](https://stats.espncricinfo.com/ci/engine/stats/index.html).

## Roadmap ideas

- Global leaderboard via a lightweight backend
- Filter/game modes by format (Test / ODI / T20I) or by era
- Difficulty levels (e.g. narrower stat margins for "hard" mode)
- Sound effects and a proper crowd-noise ambience toggle
- Share-your-streak card for social media

## License

Free to use, modify, and deploy for any purpose. Attribution appreciated
but not required.
