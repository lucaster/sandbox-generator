import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { d } from '../../../dice/dice';
import {
  calcLair,
  calcLairFromRolls,
  exampleLairBestiary,
  type LairTreasure,
} from '../../../data/lairs';
import { parseLairLink } from '../../lair-link';

@Component({
  selector: 'app-lairs',
  imports: [JsonPipe, NgTemplateOutlet],
  templateUrl: './lairs.html',
  styleUrl: './lairs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lairs implements OnInit {
  private readonly route = inject(ActivatedRoute);

  lairs: ReturnType<typeof calcLair>[] = [];
  readonly linked = signal(false);
  readonly linkError = signal<string | null>(null);

  ngOnInit(): void {
    try {
      const link = parseLairLink(this.route.snapshot.queryParamMap);
      if (link) {
        // The link only carries the lair's own rolls, so the bestiary values
        // come from the example and the % in lair check is rolled now.
        this.lairs = [
          calcLairFromRolls(link.biome, link.rolls, {
            ...exampleLairBestiary,
            encounterRoll: d(100),
          }),
        ];
        this.linked.set(true);
        return;
      }
    } catch (error) {
      this.linkError.set(
        `Unable to load the linked lair: ${error instanceof Error ? error.message : String(error)}`
      );
      return;
    }
    this.onCalcLairs();
  }

  onCalcLairs() {
    this.linked.set(false);
    this.linkError.set(null);
    const biomes = ['Grassland', 'Hills', 'Marsh', 'Forest', 'Mountains'];
    this.lairs = biomes.map((biome) => calcLair(biome, exampleLairBestiary));
  }

  treasureLabel(treasure: LairTreasure | null): string {
    if (!treasure) {
      return '—';
    }
    const parts = Object.entries(treasure)
      .filter(([, amount]) => amount > 0)
      .map(([denomination, amount]) => `${amount} ${denomination}`);
    return parts.length ? parts.join(', ') : '—';
  }
}
