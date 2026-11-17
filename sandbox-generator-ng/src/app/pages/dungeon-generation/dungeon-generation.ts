import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import {
  generateLevelFloorPlan,
  type DungeonDepth,
  type DungeonFloorConnection,
  type DungeonFloorNode,
  type DungeonFloorPlan,
  type PlacedDungeonCorridor,
  type PlacedDungeonRoom,
} from '../../../data/dungeon';

type FloorPlanNodeShape = 'entrance' | 'corridor' | 'room' | 'exit';
type FloorPlanConnectionStyle =
  | 'ingresso'
  | 'corridoio'
  | 'porta'
  | 'segreta'
  | 'scala'
  | 'loop';

type FloorPlanDiagramNode = {
  key: string;
  shape: FloorPlanNodeShape;
  label: string;
  subtitle: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  outline: string;
};

type FloorPlanDiagramConnection = {
  key: string;
  style: FloorPlanConnectionStyle;
  label: string;
  d: string;
};

type FloorPlanDiagram = {
  width: number;
  height: number;
  nodes: FloorPlanDiagramNode[];
  connections: FloorPlanDiagramConnection[];
};

const floorPlanColumnGap = 176;
const floorPlanRowGap = 88;
const floorPlanLeft = 96;
const floorPlanTop = 72;
const floorPlanMargin = 48;

function floorPlanNodeKey(node: DungeonFloorNode): string {
  return `${node.kind}:${node.id}`;
}

function floorPlanPoint(value: number): number {
  return Math.round(value * 100) / 100;
}

function floorPlanPolygon(points: Array<[number, number]>): string {
  const coordinates = points
    .map(([x, y]) => `${floorPlanPoint(x)} ${floorPlanPoint(y)}`)
    .join(' L ');
  return `M ${coordinates} Z`;
}

export function floorPlanOutline(shape: string | null, width: number, height: number): string {
  const left = -width / 2;
  const right = width / 2;
  const top = -height / 2;
  const bottom = height / 2;
  const skew = width * 0.18;
  const cut = Math.min(width, height) * 0.22;

  switch (shape) {
    case 'Parallelogram':
      return floorPlanPolygon([
        [left + skew, top],
        [right, top],
        [right - skew, bottom],
        [left, bottom],
      ]);
    case 'Trapezium':
      return floorPlanPolygon([
        [left + skew, top],
        [right - skew, top],
        [right, bottom],
        [left, bottom],
      ]);
    case 'Pentagon':
      return floorPlanPolygon([
        [0, top],
        [right, top + height * 0.35],
        [right, bottom],
        [left, bottom],
        [left, top + height * 0.35],
      ]);
    case 'Hexagon':
      return floorPlanPolygon([
        [left + skew, top],
        [right - skew, top],
        [right, 0],
        [right - skew, bottom],
        [left + skew, bottom],
        [left, 0],
      ]);
    case 'Octagon':
      return floorPlanPolygon([
        [left + cut, top],
        [right - cut, top],
        [right, top + cut],
        [right, bottom - cut],
        [right - cut, bottom],
        [left + cut, bottom],
        [left, bottom - cut],
        [left, top + cut],
      ]);
    case 'Oval/Circle': {
      const rx = width / 2;
      const ry = height / 2;
      return `M ${-rx} 0 A ${rx} ${ry} 0 1 0 ${rx} 0 A ${rx} ${ry} 0 1 0 ${-rx} 0 Z`;
    }
    default:
      return `M ${left} ${top} H ${right} V ${bottom} H ${left} Z`;
  }
}

@Component({
  selector: 'app-dungeon-generation',
  imports: [TitleCasePipe],
  templateUrl: './dungeon-generation.html',
  styleUrl: './dungeon-generation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DungeonGeneration implements OnInit {
  readonly depths: DungeonDepth[] = [1, 2, 3, 4, 5, 6];
  readonly roomCount = signal(12);
  readonly depth = signal<DungeonDepth | null>(null);
  readonly includeRoomShapes = signal(false);
  readonly floorPlan = signal<DungeonFloorPlan | null>(null);
  readonly diagram = computed(() => {
    const plan = this.floorPlan();
    return plan ? this.createFloorPlanDiagram(plan) : null;
  });

  ngOnInit(): void {
    this.onGenerate();
  }

  onRoomCountInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isInteger(value) && value > 0) {
      this.roomCount.set(value);
    }
  }

  onDepthChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'random') {
      this.depth.set(null);
      return;
    }
    const depth = Number(value);
    if (Number.isInteger(depth) && depth >= 1 && depth <= 6) {
      this.depth.set(depth as DungeonDepth);
    }
  }

  onIncludeRoomShapesChange(event: Event): void {
    this.includeRoomShapes.set((event.target as HTMLInputElement).checked);
  }

  onGenerate(): void {
    this.floorPlan.set(
      generateLevelFloorPlan({
        roomCount: this.roomCount(),
        depth: this.depth() ?? undefined,
        includeRoomShapes: this.includeRoomShapes(),
      }),
    );
  }

  depthLabel(depth: number): string {
    return ['I', 'II', 'III', 'IV', 'V', 'VI'][depth - 1] ?? `${depth}`;
  }

  nodeLabel(node: DungeonFloorNode): string {
    switch (node.kind) {
      case 'Ingresso':
        return 'Ingresso';
      case 'corridoio':
        return node.id;
      case 'stanza':
        return `Room ${node.id}`;
      case 'uscita':
        return `Uscita (${node.direction})`;
    }
  }

  connectionLabel(connection: DungeonFloorConnection): string {
    let via: string;
    if (typeof connection.via === 'string') {
      via = connection.via;
    } else if ('developed' in connection.via) {
      const outlet = connection.via;
      via = outlet.door
        ? `${outlet.door.position} ${outlet.door.type} to ${outlet.door.destination.toLowerCase()}`
        : (outlet.side ?? outlet.type.toLowerCase().replace(/_/g, ' '));
    } else {
      via = `${connection.via.position} ${connection.via.type}`;
    }
    return `${this.nodeLabel(connection.from)} → ${this.nodeLabel(connection.to)} (${via})${connection.loop ? ' [loop]' : ''}`;
  }

  private createFloorPlanDiagram(plan: DungeonFloorPlan): FloorPlanDiagram {
    const roomByNumber = new Map(plan.rooms.map((room) => [room.number, room]));
    const corridorById = new Map(plan.corridors.map((corridor) => [corridor.id, corridor]));
    const levels = new Map<string, number>();
    const nodes: FloorPlanDiagramNode[] = [];
    const queue: DungeonFloorNode[] = [];

    const visit = (node: DungeonFloorNode, level: number): void => {
      const key = floorPlanNodeKey(node);
      if (levels.has(key)) {
        return;
      }
      levels.set(key, level);
      nodes.push(this.createDiagramNode(node, roomByNumber, corridorById));
      queue.push(node);
    };

    visit({ kind: 'Ingresso', id: 'Ingresso' }, 0);
    for (let index = 0; index < queue.length; index++) {
      const current = queue[index];
      const currentKey = floorPlanNodeKey(current);
      const nextLevel = (levels.get(currentKey) ?? 0) + 1;
      for (const connection of plan.connections) {
        if (floorPlanNodeKey(connection.from) === currentKey) {
          visit(connection.to, nextLevel);
        }
      }
    }

    const nodesByLevel = new Map<number, FloorPlanDiagramNode[]>();
    for (const node of nodes) {
      const level = levels.get(node.key) ?? 0;
      const group = nodesByLevel.get(level) ?? [];
      group.push(node);
      nodesByLevel.set(level, group);
    }

    let maxLevel = 0;
    let maxPerLevel = 0;
    for (const [level, group] of nodesByLevel) {
      maxLevel = Math.max(maxLevel, level);
      maxPerLevel = Math.max(maxPerLevel, group.length);
      group.forEach((node, index) => {
        node.x = floorPlanLeft + level * floorPlanColumnGap;
        node.y = floorPlanTop + index * floorPlanRowGap;
      });
    }

    const nodesByKey = new Map(nodes.map((node) => [node.key, node]));
    const connections = plan.connections.map((connection, index) => {
      const from = nodesByKey.get(floorPlanNodeKey(connection.from))!;
      const to = nodesByKey.get(floorPlanNodeKey(connection.to))!;
      const toTheRight = to.x > from.x;
      const x1 = toTheRight ? from.x + from.width / 2 : from.x - from.width / 2;
      const x2 = toTheRight ? to.x - to.width / 2 : to.x + to.width / 2;
      const y1 = from.y;
      const y2 = to.y;
      const d = connection.loop
        ? `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 48} ${x2} ${y2}`
        : `M ${x1} ${y1} L ${x2} ${y2}`;
      return {
        key: `${index}`,
        style: connection.loop ? 'loop' : this.connectionStyle(connection),
        label: this.connectionLabel(connection),
        d,
      };
    });

    const maxHalfWidth = Math.max(...nodes.map((node) => node.width / 2));
    const maxHalfHeight = Math.max(...nodes.map((node) => node.height / 2));
    return {
      width: floorPlanLeft + maxLevel * floorPlanColumnGap + maxHalfWidth + floorPlanMargin,
      height: floorPlanTop + (maxPerLevel - 1) * floorPlanRowGap + maxHalfHeight + floorPlanMargin,
      nodes,
      connections,
    };
  }

  private createDiagramNode(
    node: DungeonFloorNode,
    rooms: Map<number, PlacedDungeonRoom>,
    corridors: Map<string, PlacedDungeonCorridor>,
  ): FloorPlanDiagramNode {
    const key = floorPlanNodeKey(node);
    if (node.kind === 'Ingresso') {
      return this.diagramNode(key, 'entrance', 'Ingresso', 'entrance', 96, 48);
    }
    if (node.kind === 'corridoio') {
      const sections = corridors.get(node.id)?.sections.length ?? 0;
      return this.diagramNode(
        key,
        'corridor',
        node.id,
        `${sections} section${sections === 1 ? '' : 's'}`,
        84,
        44,
      );
    }
    if (node.kind === 'stanza') {
      const room = rooms.get(Number(node.id));
      const subtitle = room ? `${room.type} · ${room.length}×${room.width}` : '';
      const roomNode = this.diagramNode(
        key,
        'room',
        `Room ${node.id}`,
        subtitle,
        112,
        56,
        floorPlanOutline(room?.shape ?? null, 112, 56),
      );
      if (room?.shape) {
        roomNode.title += ` — ${room.shape}`;
      }
      return roomNode;
    }
    return this.diagramNode(key, 'exit', `Uscita ${node.direction ?? ''}`, 'stairs', 96, 44);
  }

  private diagramNode(
    key: string,
    shape: FloorPlanNodeShape,
    label: string,
    subtitle: string,
    width: number,
    height: number,
    outline = floorPlanOutline(null, width, height),
  ): FloorPlanDiagramNode {
    return {
      key,
      shape,
      label,
      subtitle,
      title: subtitle ? `${label} — ${subtitle}` : label,
      x: 0,
      y: 0,
      width,
      height,
      outline,
    };
  }

  private connectionStyle(connection: DungeonFloorConnection): FloorPlanConnectionStyle {
    if (connection.via === 'ingresso') {
      return 'ingresso';
    }
    if (connection.via === 'sbocco di corridoio') {
      return 'corridoio';
    }
    if ('developed' in connection.via) {
      if (connection.via.type === 'SCALE') {
        return 'scala';
      }
      return connection.via.type === 'PORTA_SEGRETA' ? 'segreta' : 'porta';
    }
    return connection.via.type === 'Secret door' ? 'segreta' : 'porta';
  }
}
