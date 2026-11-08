import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import {
  calcHexesBiome,
  calcHexesDetailedFeature,
  type Hexes,
  type HexesDetailed,
} from '../../../data/data';
import {
  calcWildernessEncounter,
  type WildernessEncounter,
} from '../../../data/encounters';
import { calcFactions, type FactionResult } from '../../../data/factions';
import { calcLair } from '../../../data/lairs';

@Component({
  selector: 'app-encounters',
  imports: [],
  templateUrl: './encounters.html',
  styleUrl: './encounters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Encounters implements OnInit {
  readonly hexes = Array.from({ length: 19 }, (_, index) => index + 1);
  readonly hex = signal(1);
  readonly biomes = signal<Hexes>({});
  readonly features = signal<HexesDetailed>({});
  readonly factions = signal<FactionResult | null>(null);
  readonly encounter = signal<WildernessEncounter | null>(null);
  readonly history = signal<WildernessEncounter[]>([]);

  ngOnInit(): void {
    this.generateMap();
  }

  generateMap() {
    const biomes = calcHexesBiome();
    const features = calcHexesDetailedFeature();

    const lairInhabitants: { [hex: number]: string } = {};
    for (const key of Object.keys(features)) {
      const hex = Number(key);
      if (features[hex].includes('Lair')) {
        lairInhabitants[hex] = calcLair(biomes[hex]).inhabitants;
      }
    }

    this.biomes.set(biomes);
    this.features.set(features);
    this.factions.set(calcFactions(features, { lairInhabitants }));
    this.encounter.set(null);
    this.history.set([]);
  }

  onHexChange(event: Event) {
    this.hex.set(Number((event.target as HTMLSelectElement).value));
  }

  onRollEncounter() {
    const factions = this.factions();
    if (!factions) {
      return;
    }

    const hex = this.hex();
    const encounter = calcWildernessEncounter({
      hex,
      biome: this.biomes()[hex],
      hexFactions: factions.hexFactions,
    });
    this.encounter.set(encounter);
    this.history.update((history) => [encounter, ...history]);
  }

  featureLabel(hex: number): string {
    const details = this.features()[hex];
    return details ? details[details.length - 1] : '—';
  }

  factionLabel(hex: number): string {
    const factions = this.factions();
    if (!factions) {
      return '—';
    }
    const numbers = factions.hexFactions[hex] ?? [];
    return numbers.length ? numbers.join(', ') : 'none';
  }
}
