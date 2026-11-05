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
- **Name generator** — pattern-based place names such as `{B} {A}`,
  `{D}-on-the-hill`, and `{D}sby`, with multiple variants.
- **SVG rendering** — hex polygons, biome backgrounds, feature icons, and hex numbers.
- **Deterministic tests** — generators accept an injectable `rollFn`, so dice can be
  fixed in unit tests.

## Book coverage

The book's generation procedures are only partially implemented. The hex map,
landmarks, settlement names, hamlets, villages, and part of the lair generator
exist; factions, cities, castles, towers, abbeys, dungeons, the detail generators,
and the sea rules do not.

See [`COVERAGE.md`](COVERAGE.md) for a section-by-section comparison against the
2023 edition, the known rule and logic gaps, and a suggested implementation order.

## Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/summary` |
| `/summary` | Landing page with links to the features |
| `/hex-draw-patch` | **Main workspace** — draw random biome, feature, and content patches |
| `/hex-draw` | Static, hardcoded example of the 19-hex map |
| `/settlements` | Generate a hamlet and a village |
| `/lairs` | Generate one lair per biome |
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

### 2. Generation pipeline

1. Pick a table (biome, feature, or content).
2. Roll a die for the number of options.
3. If the result chains, recurse into the next table and accumulate the path.
4. Flatten the path to its most specific value or icon.
5. Render the hex map.

The engine lives in `src/data/data.ts`; dice helpers are in `src/dice/dice.ts`.

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
`src/drawing/hex.ts` (`SvgDrawer`) draws polygons, images, and text into an `<svg>`.

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

- **Lair encounter tables use keys `2..12`**, but the table roller assumes contiguous
  keys starting at `1`. As a result, `options[1]` is `undefined` and `options[12]` is
  never selected. This affects `calcLair` in `src/data/lairs.ts`.
- `calcHexesBiome` does not forward a custom `rollFn` to the starting-hex roll, so
  tests cannot fully control biome randomness.
- The 19-hex layout is duplicated between `hex-draw` and `hex-draw-patch`.
- Some domain functions still contain `console.info` / `console.debug` logging.
- `src/data/biomes.ts` is empty, and `@svgdotjs/svg.js` is declared but unused.

## Possible next steps

- Fix the lair table key range and make the roller key-aware.
- Forward `rollFn` consistently through all generators.
- Extract the hex layout into a single shared helper.
- Add treasure chance, dungeon generation, and full city generation.
- Add map export (PNG/PDF) if needed.
- Decide whether the Vue/TS/prove experiments should be kept or removed.

## Acknowledgements

Rules and tables are based on the 2023 edition of *Sandbox Generator* by Atelier
Clandestin. The 2023 PDF is the reference for this project; the 2024 edition PDF is
also included in the repository, but its tables are different and it is not the
version currently implemented.

## License

No license file is currently included in this repository.
