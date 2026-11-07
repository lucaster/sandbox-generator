import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { calcLair, type LairTreasure } from '../../../data/lairs';

@Component({
  selector: 'app-lairs',
  imports: [JsonPipe, NgTemplateOutlet],
  templateUrl: './lairs.html',
  styleUrl: './lairs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lairs implements OnInit {

  lairs: ReturnType<typeof calcLair>[] = [];

  ngOnInit(): void {
    this.onCalcLairs();
  }

  onCalcLairs() {
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
