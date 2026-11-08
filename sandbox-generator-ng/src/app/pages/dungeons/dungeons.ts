import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  calcDungeon,
  calcDungeonCorridor,
  getDungeonSpecialRoomTableActions,
  rollDungeonSpecialRoomTable,
  type Dungeon,
  type DungeonArea,
  type DungeonCorridor,
  type DungeonLink,
  type DungeonLevel,
  type DungeonSpecialRoomTableAction,
  type DungeonSpecialRoomTableRoll,
} from '../../../data/dungeon';

type CrossSectionNode = {
  area: number;
  level: number;
  depth: number;
  sublevel: number;
  roomCount: number;
  x: number;
  y: number;
};

type CrossSectionConnection = {
  type: DungeonLink['type'];
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type CrossSectionDiagram = {
  width: number;
  height: number;
  depthLabelX: number;
  areas: { number: number; x: number }[];
  depths: { number: number; label: string; y: number }[];
  nodes: CrossSectionNode[];
  connections: CrossSectionConnection[];
};

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
  readonly crossSection = computed(() => {
    const dungeon = this.dungeon();
    return dungeon ? this.createCrossSection(dungeon) : null;
  });

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

  private createCrossSection(dungeon: Dungeon): CrossSectionDiagram {
    const nodeWidth = 72;
    const nodeHeight = 42;
    const columnGap = 168;
    const depthGap = 44;
    const sublevelGap = 48;
    const left = 152;
    const firstDepthY = 92;
    const xByArea = new Map(
      dungeon.areas.map((area) => [area.number, left + (area.number - 1) * columnGap]),
    );
    const maxSublevels = Array.from({ length: 6 }, (_, index) => {
      const depth = index + 1;
      return Math.max(1, ...dungeon.areas.flatMap((area) =>
        area.levels
          .filter((level) => level.depth === depth)
          .map((level) => level.sublevel),
      ));
    });
    const depthY: number[] = [];
    let nextDepthY = firstDepthY;
    for (const sublevelCount of maxSublevels) {
      depthY.push(nextDepthY);
      nextDepthY += (sublevelCount - 1) * sublevelGap + nodeHeight + depthGap;
    }

    const nodes = dungeon.areas.flatMap((area) =>
      area.levels.map((level) => ({
        area: area.number,
        level: level.number,
        depth: level.depth,
        sublevel: level.sublevel,
        roomCount: level.roomCount,
        x: xByArea.get(area.number)!,
        y: depthY[level.depth - 1] + (level.sublevel - 1) * sublevelGap,
      })),
    );
    const nodeById = new Map(nodes.map((node) => [`${node.area}-${node.level}`, node]));
    const connections = dungeon.links.flatMap((link) => {
      const target = nodeById.get(`${link.toArea}-${link.toLevel}`);
      const source = link.fromArea === 0
        ? target && { x: target.x, y: 48 }
        : nodeById.get(`${link.fromArea}-${link.fromLevel}`);
      if (!source || !target) {
        return [];
      }

      let { x: x1, y: y1 } = source;
      let { x: x2, y: y2 } = target;
      if (x1 === x2) {
        const direction = y2 >= y1 ? 1 : -1;
        if (link.fromArea !== 0) {
          y1 += direction * nodeHeight / 2;
        }
        y2 -= direction * nodeHeight / 2;
      } else {
        const direction = x2 >= x1 ? 1 : -1;
        x1 += direction * nodeWidth / 2;
        x2 -= direction * nodeWidth / 2;
      }
      return [{ type: link.type, x1, y1, x2, y2 }];
    });

    return {
      width: Math.max(300, left * 2 + (dungeon.areas.length - 1) * columnGap),
      height: nextDepthY,
      depthLabelX: left - nodeWidth / 2 - 4,
      areas: dungeon.areas.map((area) => ({
        number: area.number,
        x: xByArea.get(area.number)!,
      })),
      depths: depthY.map((y, index) => ({
        number: index + 1,
        label: this.depthLabel(index + 1),
        y: y + (maxSublevels[index] - 1) * sublevelGap / 2,
      })),
      nodes,
      connections,
    };
  }
}
