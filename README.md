# Sandbox Generator

A procedural **tabletop RPG sandbox generator** that builds a 19-hex regional map
with biomes, landmarks, settlements, lairs, dungeons, and per-hex content.

The rules and tables are based on the **2023 edition** of
*Atelier Clandestin – Sandbox Generator*. The project is still based on the 2023
version of the book.

> A 2024 edition PDF is also included in the repo root for reference, but its tables
> differ from the 2023 edition. The 2023 edition is the source of truth for the
> current implementation.

The main application is an Angular 20 single-page app that renders the generated map
as SVG entirely in the browser — no backend required.

## Features

- **19-hex regional map** generated from a hex adjacency graph.
- **Biomes** — grassland, forest, hills, marsh, mountains. Each new hex has a 50%
  chance to inherit the previous hex's biome.
- **Features** — landmarks, settlements (hamlet, village, city, castle, tower, abbey),
  lairs, and dungeons.
- **Nested random tables** — results can chain into more tables, e.g.
  `Landmark → Natural → Vegetal → …`, tracking the full roll path.
- **Settlement generator** — size, population, occupation, layout, points of interest,
  defenses, dispositions, ruler, notable NPCs, secrets, and events.
- **Lair generator** — inhabitants by biome, percentage inside/outside the lair,
  occupied neighboring hexes, and a layout.
- **Faction generator** — political domains from castles, cities, towers, abbeys,
  and intelligent lairs, with contested hexes, relationships, and events.
- **Wilderness encounters** — a `2d6` table routing to dragons, factions, NPCs,
  biome monsters, and wizards, with contested-hex and no-nearby-faction handling.
- **Name generator** — pattern-based place names such as `{B} {A}`,
  `{D}-on-the-hill`, and `{D}sby`, with multiple variants.
- **SVG rendering** — hex polygons, biome backgrounds, feature icons, and hex numbers.
- **Deterministic tests** — most generators accept an injectable `rollFn`, so dice
  can be fixed in unit tests.

## Book coverage

The book's generation procedures are only partially implemented. The hex map,
landmarks, settlements (hamlets, villages, cities, castles, towers, abbeys),
lairs, factions, and wilderness encounters exist; dungeons, the detail
generators, and the sea rules do not.

See [`COVERAGE.md`](COVERAGE.md) for a section-by-section comparison against the
2023 edition, the remaining gaps, and a suggested implementation order.

## Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/summary` |
| `/summary` | Landing page with links to the features |
| `/hex-draw-patch` | **Main workspace** — draw random biome, feature, faction, and content patches |
| `/hex-draw` | Static, hardcoded example of the 19-hex map |
| `/settlements` | Generate a hamlet and a village |
| `/lairs` | Generate one lair per biome |
| `/encounters` | Generate a map and roll wilderness encounters per hex |
| `/page1` | Low-level manual testing of individual tables |
| `/hello-angular` | Angular scaffold demo |

## Tech stack

- **Angular 20.3** — standalone components, signals, `ChangeDetectionStrategy.OnPush`
- **TypeScript 5.9**
- **SCSS**
- **Jasmine + Karma** for unit tests
- Raw DOM APIs for SVG (no charting/rendering library)

## Getting started

### Prerequisites

- **Node.js** 20.19+, 22.12+, or 24+
- **npm**
- **Chrome** (for the headless test runner)

### Install and run

```bash
git clone https://github.com/lucaster/sandbox-generator.git
cd sandbox-generator/sandbox-generator-ng
npm install
npm start
```

Open <http://localhost:4200/>.

> `npm start` runs `ng serve --poll 2000`. The polling interval is there to make file
> watching reliable on WSL, VMs, and network drives.

### Scripts

| Command | Description |
|---|---|
| `npm start` | Start the dev server on port 4200 |
| `npm run build` | Production build into `dist/` |
| `npm run watch` | Development build in watch mode |
| `npm test` | Run unit tests with Karma (headless Chrome) |

## Project structure

```
sandbox-generator/
├── sandbox-generator-ng/          # Main Angular application
│   └── src/
│       ├── app/
│       │   ├── pages/             # Feature pages (hex-draw-patch, settlements, lairs, …)
│       │   ├── components/        # Shared UI components
│       │   └── utils/             # Small helpers
│       ├── data/                  # Random tables and generators
│       ├── dice/                  # Dice helpers
│       ├── domain/                # RandomTable types
│       ├── drawing/               # Hex geometry and SVG helpers
│       └── assets/images/         # Biome and feature icons
├── sandbox-generator-vue/         # Vue 3 + Vite experiment (default scaffold)
├── sandbox-generator-vue-cdn/     # Single-file Vue CDN demo
├── sandbox-generator-ts/          # Plain TypeScript skeleton (dice only)
├── prove/                         # Visual/experimental proofs and icon assets
└── Atelier Clandestin … .pdf      # Rules source
```

Only `sandbox-generator-ng` is actively developed. The other folders are experiments
and prototypes.

## How it works

### 1. Random tables

All content is driven by chained random tables (`src/domain/random-table.ts`):

```ts
type RandomTable = { id: number; title: string; options: Options };

type Options = {
  [key: number]: string | OptionWithFollowUp;
};

type OptionWithFollowUp = {
  text: string;
  nextTable: RandomTable;
};
```

A roll either ends on a string or continues into another table. The generator keeps
the whole path, which is why the UI can show both the final result and how it was
reached (e.g. `Landmark | Natural | Vegetal | Centennial tree`).

### 2. Patch generation pipeline

The `/hex-draw-patch` page layers generators on top of each other. Each layer
reads the previous ones, so the order matters:

```
biomes → features → lairs (inhabitants) → factions
```

| Stage | Generator | Input | Output |
|---|---|---|---|
| Biomes | `calcHexesBiome` (`src/data/data.ts`) | optional `rollFn` | one biome per hex |
| Features | `calcHexesDetailedFeature` (`src/data/data.ts`) | optional `rollFn` | feature path per hex |
| Lairs | `calcLair` (`src/data/lairs.ts`) | a hex's biome | inhabitant, layout, outside hexes |
| Factions | `calcFactions` (`src/data/factions.ts`) | features + lair inhabitants | `factions`, `hexFactions`, `contestedHexes` |
| Content | `calcHexesDetailedContentWithDetails` (`src/data/content.ts`) | optional `rollFn` | treasure and information delivery per hex |

Dependencies between the stages:

- **Biomes** are independent. Each new hex has a 50% chance to inherit the
  previous hex's biome.
- **Features** do not depend on biomes. `drawFeatureHexPatch` still generates a
  biome map when a lair is present, because the lair stage needs it.
- **Lairs** depend on the biome: `calcLair(biome)` rolls the inhabitant from that
  biome's table.
- **Factions** depend on features and on lair inhabitants. Castles, cities,
  towers, abbeys, and intelligent lairs create factions; hamlets, villages,
  dungeons, and landmarks do not. A lair with no known inhabitant is treated as
  non-intelligent, so it creates no faction.
- **Content** is independent of the other layers.

Two different notions of adjacency are used:

- `currHexNextHex` in `src/data/data.ts` is the generation spanning tree used to
  grow the map. It is **not** full adjacency.
- `src/data/hex-grid.ts` holds the canonical axial coordinates for the 19-hex
  patch and the real neighbour lists used for domains, tower enslavement, abbey
  parishes, lair alliances, and relationships.

Every generator accepts an optional `rollFn(faces)` so tests can fix the dice;
`src/dice/dice.ts` provides the default.

### 3. The 19-hex map

The region is a radius-2 hex (1 + 6 + 12 = 19 hexes), encoded as an adjacency list in
`currHexNextHex` inside `src/data/data.ts`:

```
            08
       19        09
   18       02       10
       07       03
   17       01       11
       06       04
   16       05       12
       15       13
            14
```

`src/drawing/hex-ops.ts` handles flat-top hex geometry (neighbors and vertices), and
`src/drawing/hex.ts` (`SvgDrawer`) draws polygons, images, symbols, and text into an
`<svg>`. For generation rules that need real neighbours, `src/data/hex-grid.ts` is
the canonical topology; `currHexNextHex` is only the map-growing tree.

### 4. Wilderness encounters

`calcWildernessEncounter` in `src/data/encounters.ts` rolls `2d6` for an encounter
in one hex:

| 2d6 | Result |
|---|---|
| 2 | Dragon |
| 3 | Other faction |
| 4–6 | Faction |
| 7 | NPCs |
| 8–11 | Biome |
| 12 | Wizard |

Faction encounters use the current hex's factions and Other faction encounters
use an adjacent hex's faction. A contested hex rolls `1d6` (`1–4` one faction,
`5–6` multiple). If neither the current hex nor an adjacent one has a faction,
the encounter falls back to a biome monster. Dragon, Wizard, and NPC results are
routing flags: their dedicated generators belong to separate book chapters.

The `/encounters` page generates a map, then rolls and logs encounters for a
chosen hex.

## Development conventions

- Standalone components only; no NgModules.
- Use signals (`signal`, `computed`, `input`) and `ChangeDetectionStrategy.OnPush`.
- Prefer native control flow (`@if`, `@for`, `@switch`) over structural directives.
- Component selectors use the `app-` prefix.
- Feature pages live in `src/app/pages/{feature}/`.
- Keep generation logic in `src/data/` and rendering logic in `src/drawing/`.
- Strict TypeScript; prefer inference and avoid `any`.
- Generate components with `ng generate component --skip-tests`.

See `.github/copilot-instructions.md` for the full convention list.

## Known limitations

- The 19-hex layout is duplicated between `hex-draw` and `hex-draw-patch`.
- `src/data/biomes.ts` is empty, and `@svgdotjs/svg.js` is declared but unused.

## Possible next steps

- Add dungeon generation, the largest missing subsystem.
- Add the detail generators: coat of arms, criminal organization, dragon, guild,
  house, NPC, tavern, and wizard.
- Add adventures at sea.
- Forward `rollFn` through the remaining generators, such as the name generator.
- Extract the hex layout into a single shared helper.
- Add map export (PNG/PDF) if needed.
- Decide whether the Vue/TS/prove experiments should be kept or removed.

## Acknowledgements

Rules and tables are based on the 2023 edition of *Sandbox Generator* by Atelier
Clandestin. The 2023 PDF is the reference for this project; the 2024 edition PDF is
also included in the repository, but its tables are different and it is not the
version currently implemented.

## License

No license file is currently included in this repository.
