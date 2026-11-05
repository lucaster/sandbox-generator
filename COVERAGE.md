# Book coverage

This document compares the generation procedures in the **2023 edition** of
*Atelier Clandestin – Sandbox Generator* with what is actually implemented in
`sandbox-generator-ng`.

The project is based on the 2023 edition. A 2024 edition PDF is also present in the
repo, but its tables differ, so it should not be used to verify the current code.

The comparison is based on the book's table of contents and its tables, matched
against `src/data/random-tables.ts`, `src/data/data.ts`, `src/data/settlements.ts`,
`src/data/lairs.ts`, and `src/data/names.ts`.

## At a glance

The book is organised as a top-down pipeline:

```
Hex map → Features → Landmarks / Settlements / Lairs → Dungeons → Detail generators → Sea
```

Coverage is concentrated in the first part of that pipeline.

| Book chapter | Status | Notes |
|---|---|---|
| Hex Map | **Partial** | Biomes and feature outline work. Biome encounter tables match the 2023 edition and every entry is reachable. Factions and random encounters are absent. |
| Landmarks | **Mostly complete** | Natural, artificial, and magic tables match the 2023 edition. The content tables exist, but treasure chance and information delivery are not used. |
| Settlements | **Partial** | Names and hamlets are complete. The village generator exists but has rule and logic errors. Cities, castles, towers, and abbeys are absent. |
| Lairs | **Partial** | Inhabitants, outside percentage, outside hexes, and layout are generated. Monster count, treasure, and per-room distribution are missing. |
| Dungeons | **Not implemented** | No cross-section, levels, structure, special rooms, or dungeon example logic. |
| Generators | **Not implemented** | No coat of arms, criminal organization, dragon, guild, house, NPC, tavern, or wizard generator. |
| Adventures at sea | **Not implemented** | No sea features or sea encounter tables. |

Counting generation subsections (examples excluded): **6 of 31 are complete,
5 are partial, and 20 are absent.** Roughly one third of the book's generation
content is represented in code, and about two thirds is missing. The implemented
tables are faithful to the 2023 edition; the gaps are mostly missing sections and
generator logic.

## Chapter details

### Hex Map

| Subsection | Status | What exists | What is missing / wrong |
|---|---|---|---|
| Biomes | **Done** | `tableStartingHexBiome`, `tableNextHexBiome`, `calcHexesBiome` | `calcHexesBiome` does not forward `rollFn` to the starting-hex roll, so tests cannot control that roll. |
| Encounters per Biome | **Partial** | Five biome tables in `src/data/lairs.ts`, matching the 2023 edition | Tables use keys `2..12` and roll `2d6`, so all entries are reachable and no roll returns `undefined`. No standalone encounter generator. |
| Features | **Partial** | `tableNextHexFeature`, settlement sub-table, feature map drawing | The book's "first hex = village, second hex = dungeon" rule is not enforced; the starting table only contains `Village`, and hex 2 is rolled normally. |
| Factions | **Not implemented** | — | No faction creation, political map, domains, tithes, magical enslavement, parish links, lair alliances, relationships, or faction events. |
| Random Encounters | **Not implemented** | — | No 2d6 wilderness encounter table, contested-hex faction count, or Dragon/Wizard/NPC/Biome routing. |

### Landmarks

The tables for all three landmark families match the 2023 edition.

| Subsection | Status | Notes |
|---|---|---|
| Natural Landmarks | **Done** | Fauna, Geological A/B, Vegetal A/B, and Water tables match the 2023 edition. |
| Artificial Landmarks | **Done** | Labor, Mysterious, Religious, Ruin, Small structure, and Travel tables match the 2023 edition. |
| Magic Landmarks | **Done** | Area under a spell, Enchanted item, Magic path, Magic remains, Place of power, and Strange phenomenon tables match the 2023 edition. |
| Content | **Partial** | Hazard, Empty, Special, and Convey tables exist. `tableContentTreasureChance` is defined but never used. No treasure is generated. `tableContentConvey` is never used, so "how the information is learned" is not produced. |

### Settlements

| Subsection | Status | Notes |
|---|---|---|
| Names | **Done** | All 30 patterns and component tables A–H are present, including the `†`/`‡` variants. |
| Hamlets | **Done** | Main building, peasant houses, layout, `2d6` disposition, and the `1d6` secret check match the 2023 edition. |
| Villages | **Partial** | Size, occupation, layout, special locations, defenses, disposition, notable NPCs, ruler, secret, and event exist. Missing general locations (blacksmith, market, tavern, well), guards (`1d3+3 × size`), duplicate rerolls for defenses, and correct disposition dice. |
| Cities | **Not implemented** | No size, occupations, characteristics, appearance, locations, people, or city-specific rules. |
| Castles | **Not implemented** | No castle generation. |
| Towers | **Not implemented** | No tower generation. |
| Abbeys | **Not implemented** | No abbey generation. |

### Lairs

Implemented in `src/data/lairs.ts`:

- Inhabitants by biome.
- Percentage of monsters outside the lair (`1d6 × 10%`).
- One or two outside hexes (`1d8`, splitting on 8).
- A layout number.

Missing:

- Total number of monsters.
- Treasure amount and type.
- Distribution of monsters and treasure across rooms.
- Correct use of the layout table: `lairLayout` is defined and matches the 2023
  edition, but it is unused; the code calls `d(5)` directly instead.
- The `% in lair` check and the patrol-vs-lair distinction.

### Dungeons

Nothing is implemented. Missing pieces include:

- Cross-section and area/depth model.
- Number of levels and links between levels.
- Level size, sub-levels, and same-depth links.
- Number of rooms per level.
- Factions and wandering-monster tables per level.
- Monster level by depth.
- Room types, doors, stairs, traps, and special rooms.
- Treasure placement.
- Megadungeon linking.

### Generators

Nothing is implemented from this chapter:

- Coat of arms (escutcheon, field, charges, etc.).
- Criminal organization.
- Dragon.
- Guild.
- House interiors and loot.
- NPC.
- Tavern (sign, menu, staff, rumours).
- Wizard.

Some related data exists incidentally (for example a tavern entry in the hamlet
main-building table, or a guildhouse in the village points of interest), but there
is no generator behind them.

### Adventures at sea

Nothing is implemented:

- Sea features.
- Encounters per sea location.
- Ships, islands, and sea travel procedures.

## Rule and logic issues

These are correctness problems in implemented code. The table data itself matches
the 2023 edition.

- **Village disposition** rolls `1d20` with grouped results. The 2023 book rolls
  `2d6`, which has a different probability curve.
- **Village ruler disposition when villagers are neutral** rolls `1d2`
  (`1 Hostile`, `2 Welcoming`). The book rolls `1d6` (`1–3 Hostile`,
  `4–6 Welcoming`).
- **Village points of interest** only roll special locations. The book also
  guarantees a blacksmith, market, tavern, and well.
- **Village defenses** do not reroll duplicates, although the book requires it
  and the code comment says to.
- **Village guards** are not generated (`1d3 + 3` multiplied by size).
- **`calcHexesBiome`** calls `calcStartingHexBiome()` without passing `rollFn`.
- **`calcHexesDetailed`** does not enforce the book's fixed starting features
  (village in hex 1, dungeon in hex 2).
- **`tableContentTreasureChance`** is unused; treasure is never rolled.
- **`tableContentConvey`** is unused; the "how the information is conveyed"
  result is never produced.
- **`lairLayout`** is unused; `d(5)` is used instead.
- **Lair generation** does not roll monster count, treasure, or room distribution.
- `src/data/data.ts` and `src/data/names.ts` still contain `console.info`,
  `console.debug`, and `console.log` calls.
- `src/data/biomes.ts` is empty, and `@svgdotjs/svg.js` is declared but unused.

## Suggested priority

If the goal is to match the book's core hexcrawl loop, the highest-value order is:

1. **Fix the village generator logic** (disposition dice, general locations,
   guards, rerolls). The table data is already correct for the 2023 edition.
2. **Finish the content layer**: treasure chance and information delivery.
3. **Finish lairs**: monster count, treasure, room distribution, and the
   patrol/lair distinction.
4. **Add factions and wilderness random encounters**, since they tie the hex map
   together.
5. **Add cities, castles, towers, and abbeys** to complete the Settlements chapter.
6. **Add dungeons**, which is the largest single missing subsystem.
7. **Add the Generators chapter** and **Adventures at sea** last; they are
   detail layers rather than prerequisites for the core loop.
