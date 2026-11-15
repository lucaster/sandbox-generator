import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  calcLair,
  calcLairFromRolls,
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
        this.lairs = [calcLairFromRolls(link.biome, link.rolls)];
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
    // The 2023 book delegates the total number of monsters and their treasure
    // to an external bestiary. These are the book's worked-example values,
    // used here to show the per-room distribution.
    const exampleBestiary = {
      totalMonsters: 200,
      treasure: { sp: 4000, gems: 4 },
      percentInLair: 50,
    };
    this.lairs = biomes.map((biome) => calcLair(biome, exampleBestiary));
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
