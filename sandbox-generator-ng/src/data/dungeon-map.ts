import type {
  DungeonFloorConnection,
  DungeonFloorNode,
  DungeonFloorOutlet,
  DungeonFloorPlan,
  PlacedDungeonRoom,
} from './dungeon';

export type DungeonMapPoint = { x: number; y: number };

export type DungeonMapRoom = {
  number: number;
  label: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: string | null;
  secret: boolean;
};

export type DungeonMapPassageStyle =
  | 'entrance'
  | 'corridor'
  | 'door'
  | 'secret'
  | 'stairs'
  | 'loop';

export type DungeonMapPassage = {
  key: string;
  from: string;
  to: string;
  points: DungeonMapPoint[];
  style: DungeonMapPassageStyle;
  direct: boolean;
  length: number;
  label: string;
};

export type DungeonMapCorridor = {
  key: string;
  label: string;
  x: number;
  y: number;
  loop: boolean;
};

export type DungeonMapDoor = {
  key: string;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
  secret: boolean;
  loop: boolean;
  label: string;
};

export type DungeonMapStair = {
  key: string;
  x: number;
  y: number;
  direction: 'SU' | 'GIU';
  label: string;
};

export type DungeonMap = {
  tileSize: number;
  width: number;
  height: number;
  rooms: DungeonMapRoom[];
  corridors: DungeonMapCorridor[];
  doors: DungeonMapDoor[];
  passages: DungeonMapPassage[];
  stairs: DungeonMapStair[];
  entrance: DungeonMapPoint | null;
};

type MapFeature = {
  key: string;
  kind: 'entrance' | 'room' | 'exit';
  node: DungeonFloorNode;
  room?: PlacedDungeonRoom;
};

type MapDoorInfo = {
  type: string;
  position: string;
  destination: string;
};

type MapEdge = {
  key: string;
  a: string;
  b: string;
  style: DungeonMapPassageStyle;
  label: string;
  direct: boolean;
  length: number;
  corridors: string[];
  door?: MapDoorInfo;
};

type MapRect = { cx: number; cy: number; hw: number; hh: number };

const tileSize = 16;
const mapMargin = 3;
const directDoorLength = 2;
const entranceNode: DungeonFloorNode = { kind: 'Ingresso', id: 'Ingresso' };

function nodeKey(node: DungeonFloorNode): string {
  return `${node.kind}:${node.id}`;
}

function isOutlet(via: DungeonFloorConnection['via']): via is DungeonFloorOutlet {
  return typeof via !== 'string' && 'developed' in via;
}

function nodeLabel(node: DungeonFloorNode): string {
  switch (node.kind) {
    case 'Ingresso':
      return 'Ingresso';
    case 'corridoio':
      return node.id;
    case 'stanza':
      return `Room ${node.id}`;
    case 'uscita':
      return `Stairs ${node.direction ?? ''}`;
  }
}

function edgeStyle(connection: DungeonFloorConnection): DungeonMapPassageStyle {
  if (connection.loop) {
    return 'loop';
  }
  if (connection.via === 'ingresso') {
    return 'entrance';
  }
  if (connection.via === 'sbocco di corridoio') {
    return 'corridor';
  }
  if (isOutlet(connection.via)) {
    if (connection.via.type === 'SCALE') {
      return 'stairs';
    }
    if (
      connection.via.type === 'PORTA_SEGRETA' ||
      connection.via.door?.type === 'Secret door'
    ) {
      return 'secret';
    }
    return connection.via.door ? 'door' : 'corridor';
  }
  return connection.via.type === 'Secret door' ? 'secret' : 'door';
}

function edgeDoor(connection: DungeonFloorConnection): MapDoorInfo | undefined {
  if (isOutlet(connection.via)) {
    if (connection.via.door) {
      return connection.via.door;
    }
    if (connection.via.type === 'PORTA_SEGRETA') {
      return {
        type: 'Secret door',
        position: connection.via.side ?? 'Secret',
        destination: 'Room',
      };
    }
    if (connection.via.type === 'PORTA_STANZA') {
      return {
        type: 'Door',
        position: connection.via.side ?? 'Door',
        destination: 'Room',
      };
    }
    return undefined;
  }
  if (connection.via === 'ingresso' || connection.via === 'sbocco di corridoio') {
    return undefined;
  }
  return connection.via;
}

function buildFeatures(plan: DungeonFloorPlan): Map<string, MapFeature> {
  const features = new Map<string, MapFeature>();
  features.set(nodeKey(entranceNode), {
    key: nodeKey(entranceNode),
    kind: 'entrance',
    node: entranceNode,
  });
  for (const room of plan.rooms) {
    const node: DungeonFloorNode = { kind: 'stanza', id: `${room.number}` };
    features.set(nodeKey(node), {
      key: nodeKey(node),
      kind: 'room',
      node,
      room,
    });
  }
  for (const connection of plan.connections) {
    for (const node of [connection.from, connection.to]) {
      if (node.kind !== 'uscita') {
        continue;
      }
      const key = nodeKey(node);
      if (!features.has(key)) {
        features.set(key, { key, kind: 'exit', node });
      }
    }
  }
  return features;
}

function corridorLength(plan: DungeonFloorPlan, node: DungeonFloorNode): number {
  if (node.kind !== 'corridoio') {
    return 0;
  }
  const corridor = plan.corridors.find((candidate) => candidate.id === node.id);
  return corridor ? corridor.sections.reduce((total, section) => total + section.length, 0) : 0;
}

function buildEdges(
  plan: DungeonFloorPlan,
  features: Map<string, MapFeature>,
): MapEdge[] {
  const nodes = new Map<string, DungeonFloorNode>();
  const neighbors = new Map<string, Set<string>>();
  const addNeighbor = (a: string, b: string): void => {
    const set = neighbors.get(a) ?? new Set<string>();
    set.add(b);
    neighbors.set(a, set);
  };

  for (const connection of plan.connections) {
    const from = nodeKey(connection.from);
    const to = nodeKey(connection.to);
    nodes.set(from, connection.from);
    nodes.set(to, connection.to);
    addNeighbor(from, to);
    addNeighbor(to, from);
  }

  const featureOfNode = new Map<string, string>(
    [...features.keys()].map((key) => [key, key]),
  );
  const queue = [...features.keys()];
  for (let index = 0; index < queue.length; index++) {
    const key = queue[index];
    for (const neighbor of neighbors.get(key) ?? []) {
      if (featureOfNode.has(neighbor)) {
        continue;
      }
      featureOfNode.set(neighbor, featureOfNode.get(key)!);
      queue.push(neighbor);
    }
  }

  const corridorsByFeature = new Map<string, string[]>();
  for (const connection of plan.connections) {
    for (const node of [connection.from, connection.to]) {
      if (node.kind !== 'corridoio') {
        continue;
      }
      const featureKey = featureOfNode.get(nodeKey(node));
      if (!featureKey) {
        continue;
      }
      const ids = corridorsByFeature.get(featureKey) ?? [];
      if (!ids.includes(node.id)) {
        ids.push(node.id);
      }
      corridorsByFeature.set(featureKey, ids);
    }
  }

  const edges: MapEdge[] = [];
  const byKey = new Map<string, MapEdge>();
  for (const connection of plan.connections) {
    const a = featureOfNode.get(nodeKey(connection.from));
    const b = featureOfNode.get(nodeKey(connection.to));
    if (!a || !b || a === b || !features.has(a) || !features.has(b)) {
      continue;
    }
    const throughCorridor =
      connection.from.kind === 'corridoio' || connection.to.kind === 'corridoio';
    const direct =
      !throughCorridor &&
      features.get(a)?.kind === 'room' &&
      features.get(b)?.kind === 'room';
    const length = Math.max(
      corridorLength(plan, connection.from),
      corridorLength(plan, connection.to),
      direct ? directDoorLength : 0,
    );
    const style = edgeStyle(connection);
    const door = edgeDoor(connection);
    const key = [a, b].sort().join('|') +
      `#${style}#${door?.type ?? ''}#${connection.loop ? 'loop' : ''}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.length = Math.max(existing.length, length);
      existing.direct = existing.direct && direct;
      continue;
    }
    const edge: MapEdge = {
      key,
      a,
      b,
      style,
      door,
      direct,
      length,
      corridors: [
        ...new Set([...(corridorsByFeature.get(a) ?? []), ...(corridorsByFeature.get(b) ?? [])]),
      ],
      label: `${nodeLabel(nodes.get(nodeKey(connection.from))!)} → ${nodeLabel(nodes.get(nodeKey(connection.to))!)}`,
    };
    byKey.set(key, edge);
    edges.push(edge);
  }
  return edges;
}

function hashKey(key: string): number {
  let hash = 0;
  for (const character of key) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function featureRect(feature: MapFeature): MapRect {
  if (feature.kind === 'room' && feature.room) {
    return {
      cx: 0,
      cy: 0,
      hw: Math.max(1, feature.room.length / 2),
      hh: Math.max(1, feature.room.width / 2),
    };
  }
  if (feature.kind === 'exit') {
    return { cx: 0, cy: 0, hw: 1, hh: 1 };
  }
  return { cx: 0, cy: 0, hw: 0.6, hh: 0.6 };
}

function exitDistance(rect: MapRect, ux: number, uy: number): number {
  const tx = ux === 0 ? Number.POSITIVE_INFINITY : rect.hw / Math.abs(ux);
  const ty = uy === 0 ? Number.POSITIVE_INFINITY : rect.hh / Math.abs(uy);
  return Math.min(tx, ty);
}

function rectsOverlap(a: MapRect, b: MapRect, padding: number): boolean {
  return (
    Math.abs(a.cx - b.cx) < a.hw + b.hw + padding &&
    Math.abs(a.cy - b.cy) < a.hh + b.hh + padding
  );
}

function segmentIntersectsRect(
  a: DungeonMapPoint,
  b: DungeonMapPoint,
  rect: MapRect,
  padding: number,
): boolean {
  const minX = rect.cx - rect.hw - padding;
  const maxX = rect.cx + rect.hw + padding;
  const minY = rect.cy - rect.hh - padding;
  const maxY = rect.cy + rect.hh + padding;
  let t0 = 0;
  let t1 = 1;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const clip = (p: number, q: number): boolean => {
    if (p === 0) {
      return q >= 0;
    }
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };
  return (
    clip(-dx, a.x - minX) &&
    clip(dx, maxX - a.x) &&
    clip(-dy, a.y - minY) &&
    clip(dy, maxY - a.y)
  );
}

function candidatePlacement(
  parent: MapRect,
  child: MapRect,
  length: number,
  radiusScale: number,
  angle: number,
): MapRect {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const distance =
    length * radiusScale + exitDistance(parent, ux, uy) + exitDistance(child, ux, uy);
  return {
    cx: parent.cx + ux * distance,
    cy: parent.cy + uy * distance,
    hw: child.hw,
    hh: child.hh,
  };
}

function findPlacement(
  parent: MapRect,
  child: MapRect,
  length: number,
  key: string,
  placed: Map<string, MapRect>,
): MapRect {
  const baseAngle = ((hashKey(key) % 360) * Math.PI) / 180;
  const offsets = [0];
  for (let step = 1; step <= 48; step++) {
    const turn = (step * Math.PI) / 48;
    offsets.push(turn, -turn);
  }

  const others = [...placed.values()];
  let radiusScale = 1;
  let attempts = 0;
  while (attempts++ < 40) {
    for (const offset of offsets) {
      const candidate = candidatePlacement(parent, child, length, radiusScale, baseAngle + offset);
      if (others.every((rect) => !rectsOverlap(candidate, rect, 0.6))) {
        return candidate;
      }
    }
    radiusScale = radiusScale < 2 ? radiusScale * 1.15 : radiusScale * 1.4;
  }
  return candidatePlacement(parent, child, length, radiusScale, baseAngle);
}

function placeFeatures(features: Map<string, MapFeature>, edges: MapEdge[]): Map<string, MapRect> {
  const placements = new Map<string, MapRect>();
  const neighbors = new Map<string, string[]>();
  const edgeByPair = new Map<string, MapEdge>();
  const pairKey = (a: string, b: string): string => [a, b].sort().join('|');
  const addNeighbor = (a: string, b: string): void => {
    const list = neighbors.get(a) ?? [];
    if (!list.includes(b)) {
      list.push(b);
    }
    neighbors.set(a, list);
  };
  for (const edge of edges) {
    addNeighbor(edge.a, edge.b);
    addNeighbor(edge.b, edge.a);
    edgeByPair.set(pairKey(edge.a, edge.b), edge);
  }

  const entranceKey = nodeKey(entranceNode);
  const entrance = placements.get(entranceKey) ?? {
    ...featureRect(features.get(entranceKey)!),
    cx: 0,
    cy: 0,
  };
  placements.set(entranceKey, entrance);

  const queue = [entranceKey];
  for (let index = 0; index < queue.length; index++) {
    const parentKey = queue[index];
    for (const neighbor of neighbors.get(parentKey) ?? []) {
      if (placements.has(neighbor)) {
        continue;
      }
      const feature = features.get(neighbor);
      if (!feature) {
        continue;
      }
      const edge = edgeByPair.get(pairKey(parentKey, neighbor))!;
      const placement = findPlacement(
        placements.get(parentKey)!,
        featureRect(feature),
        edge.length,
        `${edge.key}:${neighbor}`,
        placements,
      );
      placements.set(neighbor, placement);
      queue.push(neighbor);
    }
  }

  for (const [key, feature] of features) {
    if (!placements.has(key)) {
      placements.set(
        key,
        findPlacement(entrance, featureRect(feature), mapMargin + 8, key, placements),
      );
    }
  }

  const minX = Math.min(...[...placements.values()].map((rect) => rect.cx - rect.hw));
  const minY = Math.min(...[...placements.values()].map((rect) => rect.cy - rect.hh));
  const shiftX = mapMargin - minX;
  const shiftY = mapMargin - minY;
  for (const rect of placements.values()) {
    rect.cx += shiftX;
    rect.cy += shiftY;
  }
  return placements;
}

function passagePoints(a: MapRect, b: MapRect): DungeonMapPoint[] {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) {
    return [{ x: a.cx, y: a.cy }];
  }
  const ux = dx / distance;
  const uy = dy / distance;
  return [
    { x: a.cx + ux * exitDistance(a, ux, uy), y: a.cy + uy * exitDistance(a, ux, uy) },
    { x: b.cx - ux * exitDistance(b, ux, uy), y: b.cy - uy * exitDistance(b, ux, uy) },
  ];
}

function roomRectOf(room: DungeonMapRoom): MapRect {
  return {
    cx: room.x + room.width / 2,
    cy: room.y + room.height / 2,
    hw: room.width / 2,
    hh: room.height / 2,
  };
}

function routeAroundRooms(
  start: DungeonMapPoint,
  end: DungeonMapPoint,
  obstacles: MapRect[],
  segmentClear: (from: DungeonMapPoint, to: DungeonMapPoint) => boolean,
): DungeonMapPoint[] | null {
  const step = 1;
  const pad = 4;
  const xs = [start.x, end.x, ...obstacles.flatMap((r) => [r.cx - r.hw, r.cx + r.hw])];
  const ys = [start.y, end.y, ...obstacles.flatMap((r) => [r.cy - r.hh, r.cy + r.hh])];
  const minX = Math.min(...xs) - pad;
  const maxX = Math.max(...xs) + pad;
  const minY = Math.min(...ys) - pad;
  const maxY = Math.max(...ys) + pad;
  const cols = Math.floor((maxX - minX) / step) + 1;
  const rows = Math.floor((maxY - minY) / step) + 1;
  if (cols < 2 || rows < 2 || cols > 400 || rows > 400) {
    return null;
  }

  const colOf = (x: number): number => Math.round((x - minX) / step);
  const rowOf = (y: number): number => Math.round((y - minY) / step);
  const pointAt = (col: number, row: number): DungeonMapPoint => ({
    x: minX + col * step,
    y: minY + row * step,
  });
  const indexOf = (col: number, row: number): number => row * cols + col;
  const isFree = (col: number, row: number): boolean =>
    col >= 0 && col < cols && row >= 0 && row < rows &&
    !obstacles.some((rect) => {
      const point = pointAt(col, row);
      return (
        Math.abs(point.x - rect.cx) <= rect.hw + 0.3 &&
        Math.abs(point.y - rect.cy) <= rect.hh + 0.3
      );
    });

  const nearestCell = (
    origin: DungeonMapPoint,
    target: DungeonMapPoint,
  ): { index: number; point: DungeonMapPoint } | null => {
    const baseCol = colOf(origin.x);
    const baseRow = rowOf(origin.y);
    let best: { index: number; point: DungeonMapPoint } | null = null;
    let bestDistance = Infinity;
    for (let row = -12; row <= 12; row++) {
      for (let col = -12; col <= 12; col++) {
        const c = baseCol + col;
        const r = baseRow + row;
        if (!isFree(c, r)) {
          continue;
        }
        const point = pointAt(c, r);
        if (!segmentClear(origin, point)) {
          continue;
        }
        const distance = Math.hypot(point.x - target.x, point.y - target.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = { index: indexOf(c, r), point };
        }
      }
    }
    return best;
  };

  const startCell = nearestCell(start, end);
  const endCell = nearestCell(end, start);
  if (!startCell || !endCell) {
    return null;
  }

  const previous = new Int32Array(cols * rows).fill(-1);
  const visited = new Uint8Array(cols * rows);
  const queue = [startCell.index];
  visited[startCell.index] = 1;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (let head = 0; head < queue.length; head++) {
    const current = queue[head];
    if (current === endCell.index) {
      break;
    }
    const col = current % cols;
    const row = Math.floor(current / cols);
    for (const [dc, dr] of directions) {
      const nextCol = col + dc;
      const nextRow = row + dr;
      if (!isFree(nextCol, nextRow)) {
        continue;
      }
      const next = indexOf(nextCol, nextRow);
      if (visited[next] || !segmentClear(pointAt(col, row), pointAt(nextCol, nextRow))) {
        continue;
      }
      visited[next] = 1;
      previous[next] = current;
      queue.push(next);
    }
  }

  if (!visited[endCell.index]) {
    return null;
  }
  const cells: Array<{ col: number; row: number }> = [];
  for (let cell = endCell.index; cell !== -1; cell = previous[cell]) {
    cells.push({ col: cell % cols, row: Math.floor(cell / cols) });
  }
  const path = cells.reverse().map((cell) => pointAt(cell.col, cell.row));
  return [start, ...path, end];
}

function simplifyPath(points: DungeonMapPoint[]): DungeonMapPoint[] {
  if (points.length <= 2) {
    return points;
  }
  const result = [points[0]];
  for (let index = 1; index < points.length - 1; index++) {
    const previous = points[index - 1];
    const current = points[index];
    const next = points[index + 1];
    const cross =
      (current.x - previous.x) * (next.y - current.y) -
      (current.y - previous.y) * (next.x - current.x);
    if (Math.abs(cross) > 0.01) {
      result.push(current);
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

function routePassage(
  a: MapRect,
  b: MapRect,
  rooms: DungeonMapRoom[],
  aKey: string,
  bKey: string,
): DungeonMapPoint[] {
  const direct = passagePoints(a, b);
  if (direct.length < 2) {
    return direct;
  }
  const start = direct[0];
  const end = direct[1];

  const excluded = new Set([aKey, bKey]);
  const obstacles = rooms
    .filter((room) => !excluded.has(`stanza:${room.number}`))
    .map(roomRectOf);
  const blocked = (from: DungeonMapPoint, to: DungeonMapPoint): boolean =>
    obstacles.some((rect) => segmentIntersectsRect(from, to, rect, 0.2));

  if (!blocked(start, end)) {
    return direct;
  }

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const candidates: DungeonMapPoint[] = [];
  for (const offset of [4, 8, 12, 16, 24, 32, 48, 64, -4, -8, -12, -16, -24, -32, -48, -64]) {
    candidates.push(
      { x: midX + offset, y: midY + offset },
      { x: midX + offset, y: midY - offset },
      { x: midX, y: midY + offset },
      { x: midX + offset, y: midY },
    );
  }
  for (const rect of obstacles) {
    for (const x of [rect.cx - rect.hw - 2, rect.cx + rect.hw + 2]) {
      for (const y of [rect.cy - rect.hh - 2, rect.cy + rect.hh + 2]) {
        candidates.push({ x, y });
      }
    }
  }

  for (const waypoint of candidates) {
    if (!blocked(start, waypoint) && !blocked(waypoint, end)) {
      return [start, waypoint, end];
    }
  }
  for (const first of candidates) {
    if (blocked(start, first)) {
      continue;
    }
    for (const second of candidates) {
      if (!blocked(first, second) && !blocked(second, end)) {
        return [start, first, second, end];
      }
    }
  }

  const anchor = (rect: MapRect, point: DungeonMapPoint): DungeonMapPoint => ({
    x: rect.cx + (point.x - rect.cx) * 0.3,
    y: rect.cy + (point.y - rect.cy) * 0.3,
  });
  const gridPath = routeAroundRooms(
    anchor(a, start),
    anchor(b, end),
    obstacles,
    (from, to) => !blocked(from, to),
  );
  if (gridPath && gridPath.length >= 2) {
    const fullPath = [start, ...gridPath, end];
    for (const candidate of [simplifyPath(fullPath), fullPath]) {
      let clear = true;
      for (let index = 1; index < candidate.length && clear; index++) {
        clear = !obstacles.some((rect) =>
          segmentIntersectsRect(candidate[index - 1], candidate[index], rect, -0.1),
        );
      }
      if (clear) {
        return candidate;
      }
    }
  }
  return direct;
}

function passageLabelPoint(points: DungeonMapPoint[]): DungeonMapPoint {
  let best: DungeonMapPoint = points[0] ?? { x: 0, y: 0 };
  let bestLength = -1;
  let vertical = false;
  for (let index = 1; index < points.length; index++) {
    const dx = points[index].x - points[index - 1].x;
    const dy = points[index].y - points[index - 1].y;
    const length = Math.abs(dx) + Math.abs(dy);
    if (length > bestLength) {
      bestLength = length;
      vertical = Math.abs(dy) > Math.abs(dx);
      best = {
        x: (points[index].x + points[index - 1].x) / 2,
        y: (points[index].y + points[index - 1].y) / 2,
      };
    }
  }
  return vertical ? { x: best.x + 1.8, y: best.y + 0.3 } : { x: best.x, y: best.y - 1.3 };
}

function roomRect(room: PlacedDungeonRoom, placement: MapRect): DungeonMapRoom {
  return {
    number: room.number,
    label: `${room.number}`,
    subtitle: room.size.toLowerCase(),
    x: Math.round((placement.cx - room.length / 2) * 10) / 10,
    y: Math.round((placement.cy - room.width / 2) * 10) / 10,
    width: room.length,
    height: room.width,
    shape: room.shape,
    secret: room.eSegreta,
  };
}

function rectExit(
  center: DungeonMapPoint,
  toward: DungeonMapPoint,
  rect: DungeonMapRoom,
): { point: DungeonMapPoint; orientation: 'horizontal' | 'vertical' } {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const left = rect.x - center.x;
  const right = rect.x + rect.width - center.x;
  const top = rect.y - center.y;
  const bottom = rect.y + rect.height - center.y;

  const tx = dx > 0 ? right / dx : dx < 0 ? left / dx : Number.POSITIVE_INFINITY;
  const ty = dy > 0 ? bottom / dy : dy < 0 ? top / dy : Number.POSITIVE_INFINITY;
  const t = Math.max(0, Math.min(1, Math.min(tx, ty)));
  return {
    point: { x: center.x + dx * t, y: center.y + dy * t },
    orientation: tx < ty ? 'vertical' : 'horizontal',
  };
}

export function buildDungeonMap(plan: DungeonFloorPlan): DungeonMap {
  const features = buildFeatures(plan);
  const edges = buildEdges(plan, features);
  const placements = placeFeatures(features, edges);

  const rooms: DungeonMapRoom[] = [];
  const roomByFeature = new Map<string, DungeonMapRoom>();
  for (const feature of features.values()) {
    if (feature.kind !== 'room' || !feature.room) {
      continue;
    }
    const rect = roomRect(feature.room, placements.get(feature.key)!);
    rooms.push(rect);
    roomByFeature.set(feature.key, rect);
  }

  const passages: DungeonMapPassage[] = [];
  const corridors: DungeonMapCorridor[] = [];
  const labeledCorridors = new Set<string>();
  const doors: DungeonMapDoor[] = [];
  const stairs: DungeonMapStair[] = [];

  for (const edge of edges) {
    const a = placements.get(edge.a)!;
    const b = placements.get(edge.b)!;
    const points = routePassage(a, b, rooms, edge.a, edge.b);
    let length = 0;
    for (let index = 1; index < points.length; index++) {
      length += Math.hypot(
        points[index].x - points[index - 1].x,
        points[index].y - points[index - 1].y,
      );
    }
    passages.push({
      key: edge.key,
      from: edge.a,
      to: edge.b,
      points,
      style: edge.style,
      direct: edge.direct,
      length,
      label: edge.label,
    });

    for (const corridor of edge.corridors) {
      if (labeledCorridors.has(corridor)) {
        continue;
      }
      labeledCorridors.add(corridor);
      corridors.push({
        key: `corridor:${corridor}`,
        label: corridor,
        loop: edge.style === 'loop',
        ...passageLabelPoint(points),
      });
    }

    if (edge.door) {
      for (const [featureKey, index] of [
        [edge.a, 1],
        [edge.b, points.length - 2],
      ] as Array<[string, number]>) {
        const rect = roomByFeature.get(featureKey);
        if (!rect) {
          continue;
        }
        const toward = points[Math.max(0, Math.min(points.length - 1, index))] ?? {
          x: a.cx,
          y: a.cy,
        };
        const exit = rectExit({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }, toward, rect);
        const secret = edge.style === 'secret' || edge.door.type === 'Secret door';
        doors.push({
          key: `${edge.key}@${featureKey}`,
          x: exit.point.x,
          y: exit.point.y,
          orientation: exit.orientation,
          secret,
          loop: edge.style === 'loop',
          label: `${edge.door.position} ${edge.door.type} to ${edge.door.destination.toLowerCase()}`,
        });
      }
    }
  }

  for (const feature of features.values()) {
    if (feature.kind !== 'exit') {
      continue;
    }
    const placement = placements.get(feature.key)!;
    stairs.push({
      key: feature.key,
      x: placement.cx,
      y: placement.cy,
      direction: feature.node.direction ?? 'GIU',
      label: feature.node.direction === 'SU' ? 'Stairs up' : 'Stairs down',
    });
  }

  const maxX = Math.max(...[...placements.values()].map((rect) => rect.cx + rect.hw));
  const maxY = Math.max(...[...placements.values()].map((rect) => rect.cy + rect.hh));

  return {
    tileSize,
    width: Math.ceil(maxX + mapMargin) * tileSize,
    height: Math.ceil(maxY + mapMargin) * tileSize,
    rooms,
    corridors,
    doors,
    passages,
    stairs,
    entrance: { x: placements.get(nodeKey(entranceNode))!.cx, y: placements.get(nodeKey(entranceNode))!.cy },
  };
}
