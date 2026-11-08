import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  calcDungeon,
  calcDungeonCorridor,
  type Dungeon,
  type DungeonArea,
  type DungeonCorridor,
  type DungeonLevel,
} from '../../../data/dungeon';

@Component({
  selector: 'app-dungeons',
  imports: [TitleCasePipe],
  templateUrl: './dungeons.html',
  styleUrl: './dungeons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dungeons implements OnInit {

  readonly areaCount = signal(1);
  readonly dungeon = signal<Dungeon | null>(null);
  readonly corridorSamples = signal<{ [key: string]: DungeonCorridor }>({});

  ngOnInit(): void {
    this.onGenerateDungeon();
  }

  onAreaCountInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isInteger(value) && value > 0) {
      this.areaCount.set(value);
    }
  }

  onGenerateDungeon(): void {
    this.dungeon.set(calcDungeon({ areaCount: this.areaCount() }));
    this.corridorSamples.set({});
  }

  onGenerateCorridor(area: DungeonArea, level: DungeonLevel): void {
    const key = `${area.number}-${level.number}`;
    this.corridorSamples.update((samples) => ({
      ...samples,
      [key]: calcDungeonCorridor({
        hasDeeperLevel: area.levels.some((candidate) => candidate.depth > level.depth),
        hasHigherLevel: area.levels.some((candidate) => candidate.depth < level.depth),
      }),
    }));
  }

  depthLabel(depth: number): string {
    return ['I', 'II', 'III', 'IV', 'V', 'VI'][depth - 1] ?? `${depth}`;
  }
}
