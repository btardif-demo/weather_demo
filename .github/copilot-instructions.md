# Copilot Instructions

## Build & Lint Commands

```sh
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run lint      # ESLint across all JS/JSX files
npm run preview   # Preview production build locally
```

No test framework is configured.

## Architecture

Single-page React app (Vite + React 19) that checks weather conditions for lawn moss killer application. The entire app lives in `src/App.jsx` — no routing, no state management library.

**Data flow:** ZIP code (from `?zip=` query param or form input) → Open-Meteo Geocoding API (ZIP to lat/lon) → Open-Meteo Forecast API (5-day daily forecast) → `evaluateDay()` checks against thresholds → render pass/fail cards.

**External APIs (no keys required):**
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

**Weather condition thresholds** (from `.research/weather.md`):
- Temperature ≥ 50°F, no frost (min > 32°F)
- Precipitation probability ≤ 10%
- Precipitation sum = 0

## Design Conventions

**Color scheme:** [Nord Theme](https://www.nordtheme.com/) with Aurora palette for semantic colors:
- `--aurora-green` (#a3be8c): pass/good states
- `--aurora-red` (#bf616a): fail/bad states
- `--aurora-orange` (#d08770): warnings
- `--aurora-yellow` (#ebcb8b): date headers
- `--aurora-purple` (#b48ead): accents, buttons, links

All colors are defined as CSS custom properties in `src/index.css`. Theme switching (dark/light) uses `data-theme` attribute on `<html>`, with `--bg`, `--text`, `--border`, `--shadow` etc. resolving per theme.

**Layout:** Fixed command bar at top (`position: fixed`), content below with `4rem` top padding. Portrait orientation triggers responsive breakpoints: cards stack vertically, subtitle hides, header stacks emoji above title.

**Research docs** in `.research/` contain product requirements (`weather.md`) and API evaluation notes (`api.md`).
