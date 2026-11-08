import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  calcDungeon,
  calcDungeonCorridor,
  getDungeonSpecialRoomTableActions,
  rollDungeonSpecialRoomTable,
  type Dungeon,
  type DungeonArea,
  type DungeonCorridor,
  type DungeonLevel,
  type DungeonSpecialRoomTableAction,
  type DungeonSpecialRoomTableRoll,
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
  readonly specialRoomTableResults = signal<Record<string, DungeonSpecialRoomTableRoll[]>>({});

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
    this.specialRoomTableResults.set({});
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

  specialRoomTableActions(room: string): DungeonSpecialRoomTableAction[] {
    return getDungeonSpecialRoomTableActions(room);
  }

  tableEntries(table: DungeonSpecialRoomTableAction['table']): { roll: number; result: string }[] {
    return Object.entries(table.options).map(([roll, result]) => ({
      roll: Number(roll),
      result: typeof result === 'string' ? result : result.text,
    }));
  }

  onRollSpecialRoomTable(
    area: DungeonArea,
    level: DungeonLevel,
    roomNumber: number,
    action: DungeonSpecialRoomTableAction,
  ): void {
    const key = `${area.number}-${level.number}-${roomNumber}-${action.id}`;
    const result = rollDungeonSpecialRoomTable(action);
    this.specialRoomTableResults.update((results) => ({
      ...results,
      [key]: [...(results[key] ?? []), result],
    }));
  }

  specialRoomTableResultKey(
    area: DungeonArea,
    level: DungeonLevel,
    roomNumber: number,
    action: DungeonSpecialRoomTableAction,
  ): string {
    return `${area.number}-${level.number}-${roomNumber}-${action.id}`;
  }
}
