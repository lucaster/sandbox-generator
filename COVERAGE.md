# Book coverage

This document compares the generation procedures in the **2023 edition** of
*Atelier Clandestin – Sandbox Generator* with what is actually implemented in
`sandbox-generator-ng`.

The project is based on the 2023 edition. A 2024 edition PDF is also present in the
repo, but its tables differ, so it should not be used to verify the current code.

The comparison is based on the book's table of contents and its tables, matched
against `src/data/random-tables.ts`, `src/data/data.ts`, `src/data/content.ts`,
`src/data/settlements.ts`, `src/data/lairs.ts`, `src/data/factions.ts`,
`src/data/encounters.ts`, and `src/data/names.ts`.

## At a glance

The book is organised as a top-down pipeline:

```
Hex map → Features → Landmarks / Settlements / Lairs → Dungeons → Detail generators → Sea
```

Coverage is concentrated in the first part of that pipeline.

| Book chapter | Status | Notes |
|---|---|---|
| Hex Map | **Done** | Biomes, feature outline, factions, and wilderness random encounters work. Biome encounter tables match the 2023 edition and every entry is reachable. |
| Landmarks | **Done** | Natural, artificial, and magic tables match the 2023 edition. Content, treasure chance, and information delivery are implemented. |
| Settlements | **Done** | Names, hamlets, villages, cities, castles, towers, and abbeys all match the 2023 edition. |
| Lairs | **Done** | Inhabitants, optional outside percentage and hexes, layout, per-room monster/treasure distribution, and the `% in lair` patrol distinction match the 2023 edition. Total monsters and treasure are caller-supplied because the book delegates them to a bestiary. |
| Dungeons | **Not implemented** | No cross-section, levels, structure, special rooms, or dungeon example logic. |
| Generators | **Not implemented** | No coat of arms, criminal organization, dragon, guild, house, NPC, tavern, or wizard generator. |
| Adventures at sea | **Not implemented** | No sea features or sea encounter tables. |

Counting generation subsections (examples excluded): **17 of 31 are complete
and 14 are absent.** Roughly half of the book's generation content is represented
in code. The implemented tables are faithful to the 2023 edition; the gaps are
mostly missing sections and generator logic.

## Chapter details

### Hex Map

| Subsection | Status | What exists | What is missing / wrong |
|---|---|---|---|
| Biomes | **Done** | `tableStartingHexBiome`, `tableNextHexBiome`, `calcHexesBiome` | — |
| Encounters per Biome | **Done** | Five biome tables and `calcBiomeEncounter` in `src/data/lairs.ts`, matching the 2023 edition | Tables use keys `2..12` and roll `2d6`, so all entries are reachable and no roll returns `undefined`. |
| Features | **Done** | `tableNextHexFeature`, settlement sub-table, feature map drawing, and the book's fixed starting features (village in hex 1, dungeon in hex 2) | — |
| Factions | **Done** | `calcFactions`, `calcFactionRelationship`, `calcFactionEvent`, and `isIntelligentLair` in `src/data/factions.ts`. Castle/city seven-hex domains, tower enslavement, abbey parishes, intelligent-lair factions and alliances, contested hexes, `2d6` relationships, and `1d6`/`1d12` events match the 2023 edition. | Criminal organizations, guilds, dragons, and wizard encounters are not faction sources yet because those generators are absent. |
| Random Encounters | **Done** | `calcWildernessEncounter` and the `2d6`/`1d6` tables in `src/data/encounters.ts` | Dragon, Other faction, Faction, NPCs, Biome, and Wizard routing; contested-hex faction count; and the no-nearby-faction biome fallback match the 2023 edition. |

### Landmarks

The tables for all three landmark families match the 2023 edition.

| Subsection | Status | Notes |
|---|---|---|
| Natural Landmarks | **Done** | Fauna, Geological A/B, Vegetal A/B, and Water tables match the 2023 edition. |
| Artificial Landmarks | **Done** | Labor, Mysterious, Religious, Ruin, Small structure, and Travel tables match the 2023 edition. |
| Magic Landmarks | **Done** | Area under a spell, Enchanted item, Magic path, Magic remains, Place of power, and Strange phenomenon tables match the 2023 edition. |
| Content | **Done** | `calcContent` rolls the content type and nested detail, checks the type's treasure chance on `1d100` (Hazard 25%, Empty 15%, Monsters 50%), and rolls how Empty information is conveyed. Special rewards are variable and left to the DM. |

### Settlements

| Subsection | Status | Notes |
|---|---|---|
| Names | **Done** | All 30 patterns and component tables A–H are present, including the `†`/`‡` variants. |
| Hamlets | **Done** | Main building, peasant houses, layout, `2d6` disposition, and the `1d6` secret check match the 2023 edition. |
| Villages | **Done** | Size, occupation, layout, general locations (blacksmith, market, tavern, well), special locations, unique defenses, guards (`1d3+3 × size`), `2d6` disposition, neutral-ruler `1d6` disposition, notable NPCs, ruler, secret, and event match the 2023 edition. |
| Cities | **Done** | Size/population, main occupations, characteristics, appearance (including color scheme), general and special locations, buildings of interest, walls, entrances, guards, siege supplies, notable NPCs, rulers, disposition, and events match the 2023 edition. Housing uses the 1d20 all-types option. |
| Castles | **Done** | Name, condition, keep (shape, levels, features, jails, supplies, treasure), defensive structures, towers and walls, gatehouse, moat encounters, garrison composition and command levels, `2d6` disposition, and events match the 2023 edition. The book's moat table says `1d6` but lists eight results, so `1d8` is used. |
| Towers | **Done** | Wizard level (at least 9, with a 25% chance of a `1d6` apprentice), aboveground and underground level counts, level connections, material, shape, `1d3` details, inside appearance, special equipment, and ground/aboveground/top/underground/bottom level usage match the 2023 edition. The wizard level uses the book's `2d6` wizard table, raised to the tower minimum of 9. |
| Abbeys | **Done** | Name (including `Good-`, `Our-Lady-of-`, and `Saint-` variants), size, monk/nun count, abbot/abbess level, structure and land, core locations, one additional location per category, farming/workshop/other activities, major-abbey fame (including religious artifacts and relics with saint and spell level), events, and history match the 2023 edition. |

### Lairs

Implemented in `src/data/lairs.ts`:

- Inhabitants by biome.
- Optional percentage of monsters outside the lair (`1d6 × 10%`).
- One or two outside hexes (`1d8`, splitting on 8 and rolling `1d8` for each
  group).
- Layout from the book table (`1d8`, or `1d3` for small groups and lone
  monsters).
- Per-room distribution of monsters and treasure using the layout percentages.
  The largest remainder method keeps every total intact.
- The `% in lair` check and the patrol-vs-lair distinction.

The 2023 book delegates the total number of monsters and their treasure to an
external bestiary, so `calcLair` accepts them from the caller. If they are not
provided, the room distributions are `null` but the lair structure is still
generated.

Layout 3 prints `40/20/20` in the 2023 diagrams (sums to 80); the corrected
`40/30/30` is used. Layout 4 uses the order of the book's worked example
(`10/20/20/50`), which is the same multiset as the diagram's `20/50/10/20`.

### Factions

Implemented in `src/data/factions.ts`:

- Castles and cities create seven-hex domains. Overlapping big domains have a
  3-in-6 chance of being the same faction; otherwise their shared hexes are
  contested.
- Towers, abbeys, and intelligent lairs start with a one-hex domain. Towers can
  magically enslave adjacent hamlets, villages, lairs, and dungeons (`1d6`), and
  abbeys absorb adjacent hamlets and villages into their parish.
- Adjacent lairs of the same intelligent creature have a 3-in-6 chance of
  belonging to the same faction. The book leaves the intelligent-monster list to
  the bestiary, so `isIntelligentLair` uses a curated subset of the five biome
  tables and can be overridden.
- Factions with neighbouring territories or contested hexes roll `2d6` for
  relationships (`Open war` through `Alliance`).
- Each faction rolls `1d6` for an event; on a `1`, `1d6` gives the timing and
  `1d12` gives the nature.
- The patch draws a coloured shape and number for each faction in every claimed
  hex. Contested hexes show every claimant, and the page lists each faction's
  hexes, relationships, and event.
- Criminal organizations, guilds, dragons, and wizard encounters are not faction
  sources yet because the corresponding generators are not implemented.

### Random Encounters

Implemented in `src/data/encounters.ts`:

- `calcWildernessEncounter` rolls `2d6` for Dragon (`2`), Other faction (`3`),
  Faction (`4-6`), NPCs (`7`), Biome (`8-11`), or Wizard (`12`).
- Faction encounters use the current hex's factions. Other faction encounters use
  a faction from an adjacent hex. A contested hex rolls `1d6` to decide whether
  one (`1-4`) or multiple (`5-6`) factions are involved.
- If neither the current hex nor an adjacent one has a faction, a faction result
  falls back to a biome encounter.
- Biome encounters roll on the fitting table through `calcBiomeEncounter` in
  `src/data/lairs.ts`. The monster does not belong to a faction.
- Dragon and Wizard only flag that the next lair/tower is theirs, and NPCs only
  flag friendly non-faction NPCs, because those generators are separate chapters.
- The `/encounters` page generates a map and rolls encounters for a chosen hex.

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

## Remaining issues

The implemented tables and generation rules match the 2023 edition. The remaining
items are housekeeping:

- `src/data/biomes.ts` is empty, and `@svgdotjs/svg.js` is declared but unused.

## Suggested priority

If the goal is to match the book's core hexcrawl loop, the highest-value order is:

1. **Add dungeons**, which is the largest single missing subsystem.
2. **Add the Generators chapter** and **Adventures at sea** last; they are
   detail layers rather than prerequisites for the core loop.
