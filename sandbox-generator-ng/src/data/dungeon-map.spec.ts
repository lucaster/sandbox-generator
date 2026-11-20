import { generateLevelFloorPlan } from './dungeon';
import { buildDungeonMap, type DungeonMapRoom } from './dungeon-map';

function seededRoll(initialSeed = 41) {
  let seed = initialSeed;
  return (faces: number) => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed % faces) + 1;
  };
}

function overlaps(a: DungeonMapRoom, b: DungeonMapRoom): boolean {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

function passageLength(points: { x: number; y: number }[]): number {
  let total = 0;
  for (let index = 1; index < points.length; index++) {
    total += Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
  }
  return total;
}

function segmentIntersectsRoom(
  a: { x: number; y: number },
  b: { x: number; y: number },
  room: DungeonMapRoom,
): boolean {
  const minX = room.x + 0.1;
  const maxX = room.x + room.width - 0.1;
  const minY = room.y + 0.1;
  const maxY = room.y + room.height - 0.1;
  if (minX >= maxX || minY >= maxY) {
    return false;
  }
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

describe('buildDungeonMap', () => {
  it('places one non-overlapping room per generated room, inside the map bounds', () => {
    const plan = generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll() });
    const map = buildDungeonMap(plan);

    expect(map.rooms.length).toBe(plan.rooms.length);
    expect(new Set(map.rooms.map((room) => room.number)).size).toBe(map.rooms.length);

    for (const room of map.rooms) {
      expect(room.width).toBeGreaterThan(1);
      expect(room.height).toBeGreaterThan(1);
      expect(room.x).toBeGreaterThanOrEqual(0);
      expect(room.y).toBeGreaterThanOrEqual(0);
      expect(room.x + room.width).toBeLessThanOrEqual(map.width / map.tileSize);
      expect(room.y + room.height).toBeLessThanOrEqual(map.height / map.tileSize);
    }
    for (let i = 0; i < map.rooms.length; i++) {
      for (let j = i + 1; j < map.rooms.length; j++) {
        expect(overlaps(map.rooms[i], map.rooms[j])).toBeFalse();
      }
    }
  });

  it('never overlaps rooms even with many rooms', () => {
    for (const seed of [7, 41, 99]) {
      const plan = generateLevelFloorPlan({ roomCount: 40, rollFn: seededRoll(seed) });
      const map = buildDungeonMap(plan);
      for (let i = 0; i < map.rooms.length; i++) {
        for (let j = i + 1; j < map.rooms.length; j++) {
          expect(overlaps(map.rooms[i], map.rooms[j]))
            .withContext(`seed ${seed}: rooms ${map.rooms[i].number} and ${map.rooms[j].number}`)
            .toBeFalse();
        }
      }
    }
  });

  it('never draws a corridor through a room that is not one of its endpoints', () => {
    for (const seed of [7, 41, 99]) {
      const plan = generateLevelFloorPlan({ roomCount: 30, rollFn: seededRoll(seed) });
      const map = buildDungeonMap(plan);
      for (const passage of map.passages) {
        for (let index = 1; index < passage.points.length; index++) {
          const start = passage.points[index - 1];
          const end = passage.points[index];
          for (const room of map.rooms) {
            const endpoint =
              passage.from === `stanza:${room.number}` || passage.to === `stanza:${room.number}`;
            if (endpoint) {
              continue;
            }
            expect(segmentIntersectsRoom(start, end, room))
              .withContext(`seed ${seed}: passage ${passage.key} segment ${index} crosses room ${room.number}`)
              .toBeFalse();
          }
        }
      }
    }
  });

  it('uses the real room dimensions instead of clamping them to a grid cell', () => {
    const plan = generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(41) });
    const map = buildDungeonMap(plan);

    expect(map.rooms.length).toBe(plan.rooms.length);
    for (const room of map.rooms) {
      const generated = plan.rooms.find((candidate) => candidate.number === room.number)!;
      expect(room.width).toBe(generated.length);
      expect(room.height).toBe(generated.width);
    }
  });

  it('draws passages with the declared length of their corridor', () => {
    const generated = generateLevelFloorPlan({ roomCount: 2, rollFn: seededRoll(7) });
    const room = generated.rooms[0];
    const entrance = { kind: 'Ingresso' as const, id: 'Ingresso' };
    const corridor = { kind: 'corridoio' as const, id: 'C1' };
    const plan = {
      ...generated,
      rooms: [room],
      corridors: [
        {
          id: 'C1',
          sections: [
            { number: 1, length: 6 as const, features: [] },
            { number: 2, length: 6 as const, features: [] },
          ],
          end: 'Door/Portcullis',
        },
      ],
      connections: [
        { from: entrance, to: corridor, via: 'ingresso' as const },
        {
          from: corridor,
          to: { kind: 'stanza' as const, id: `${room.number}` },
          via: { position: 'north', destination: 'Room', type: 'Door', details: null },
        },
      ],
    };

    const map = buildDungeonMap(plan);
    expect(map.passages.length).toBe(1);
    const passage = map.passages[0];
    expect(passage.length).toBeCloseTo(12, 1);
    expect(passage.direct).toBeFalse();
    expect(passageLength(passage.points)).toBeCloseTo(12, 1);
  });

  it('does not treat room connections through a corridor as direct door links', () => {
    const generated = generateLevelFloorPlan({ roomCount: 2, rollFn: seededRoll(7) });
    const [first, second] = generated.rooms;
    const entrance = { kind: 'Ingresso' as const, id: 'Ingresso' };
    const corridor = { kind: 'corridoio' as const, id: 'C1' };
    const door = { position: 'north', destination: 'Room', type: 'Door', details: null };
    const plan = {
      ...generated,
      corridors: [
        {
          id: 'C1',
          sections: [{ number: 1, length: 6 as const, features: [] }],
          end: 'Door/Portcullis',
        },
      ],
      connections: [
        { from: entrance, to: corridor, via: 'ingresso' as const },
        { from: corridor, to: { kind: 'stanza' as const, id: `${first.number}` }, via: door },
        { from: corridor, to: { kind: 'stanza' as const, id: `${second.number}` }, via: door },
      ],
    };

    const map = buildDungeonMap(plan);
    expect(map.passages.length).toBeGreaterThan(0);
    expect(map.passages.every((passage) => !passage.direct)).toBeTrue();
  });

  it('places rooms at organic offsets instead of grid-cell centers', () => {
    const plan = generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(41) });
    const map = buildDungeonMap(plan);
    const centers = map.rooms.map((room) => ({ x: room.x + room.width / 2, y: room.y + room.height / 2 }));

    expect(centers.filter((center) => !Number.isInteger(center.x) || !Number.isInteger(center.y)).length).toBeGreaterThan(
      centers.length / 2,
    );
    for (const passage of map.passages.filter((candidate) => !candidate.direct)) {
      expect(passageLength(passage.points)).toBeCloseTo(passage.length, 1);
    }
  });

  it('labels every generated corridor on a passage', () => {
    const plan = generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(41) });
    const map = buildDungeonMap(plan);
    const corridorIds = plan.corridors.map((corridor) => corridor.id);

    expect(corridorIds.length).toBeGreaterThan(0);
    expect(map.corridors.length).toBe(new Set(corridorIds).size);
    for (const id of corridorIds) {
      expect(map.corridors.some((corridor) => corridor.label === id)).toBeTrue();
    }
    expect(map.corridors.every((corridor) => corridor.x >= 0 && corridor.y >= 0)).toBeTrue();
  });

  it('marks a door between two rooms as a direct link', () => {
    const generated = generateLevelFloorPlan({ roomCount: 2, rollFn: seededRoll(7) });
    const [first, second] = generated.rooms;
    const plan = {
      ...generated,
      corridors: [],
      connections: [
        {
          from: { kind: 'stanza' as const, id: `${first.number}` },
          to: { kind: 'stanza' as const, id: `${second.number}` },
          via: { type: 'Door', position: 'north', destination: 'Room', details: null },
        },
      ],
    };
    const map = buildDungeonMap(plan);

    expect(map.passages.length).toBe(1);
    expect(map.passages[0].direct).toBeTrue();

    const generatedMap = buildDungeonMap(generated);
    expect(generatedMap.passages.some((passage) => !passage.direct)).toBeTrue();
  });

  it('keeps the entrance, rooms and stairs connected by passages', () => {
    const plan = generateLevelFloorPlan({ roomCount: 10, rollFn: seededRoll(7) });
    const map = buildDungeonMap(plan);

    expect(map.entrance).not.toBeNull();
    expect(map.passages.length).toBeGreaterThan(0);
    expect(map.passages.every((passage) => passage.points.length >= 2)).toBeTrue();

    const adjacency = new Map<string, string[]>();
    for (const passage of map.passages) {
      adjacency.set(passage.from, [...(adjacency.get(passage.from) ?? []), passage.to]);
      adjacency.set(passage.to, [...(adjacency.get(passage.to) ?? []), passage.from]);
    }
    const reachable = new Set(['Ingresso:Ingresso']);
    const queue = [...reachable];
    for (let index = 0; index < queue.length; index++) {
      for (const neighbor of adjacency.get(queue[index]) ?? []) {
        if (!reachable.has(neighbor)) {
          reachable.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    for (const room of map.rooms) {
      expect(reachable.has(`stanza:${room.number}`)).toBeTrue();
    }
    for (const stair of map.stairs) {
      expect(reachable.has(stair.key)).toBeTrue();
      expect(stair.label.length).toBeGreaterThan(0);
    }
  });

  it('draws doors, secret doors and stairs from the topological plan', () => {
    const plan = generateLevelFloorPlan({ roomCount: 8, rollFn: seededRoll(12) });
    const map = buildDungeonMap(plan);

    const doorConnections = plan.connections.filter(
      (connection) => typeof connection.via !== 'string' && 'developed' in connection.via
        ? connection.via.door !== undefined
        : connection.via !== 'ingresso' && connection.via !== 'sbocco di corridoio',
    );
    expect(map.doors.length).toBeGreaterThan(0);
    expect(map.doors.every((door) => door.label.length > 0)).toBeTrue();
    expect(doorConnections.length).toBeGreaterThan(0);
    expect(map.doors.some((door) => door.secret)).toBe(
      plan.connections.some(
        (connection) =>
          typeof connection.via !== 'string' &&
          'developed' in connection.via &&
          (connection.via.type === 'PORTA_SEGRETA' ||
            connection.via.door?.type === 'Secret door'),
      ),
    );

    const exitNodes = new Set(
      plan.connections
        .flatMap((connection) => [connection.from, connection.to])
        .filter((node) => node.kind === 'uscita')
        .map((node) => `${node.kind}:${node.id}`),
    );
    expect(map.stairs.length).toBe(exitNodes.size);
    for (const stair of map.stairs) {
      expect(['SU', 'GIU']).toContain(stair.direction);
    }
  });

  it('is deterministic for the same roll sequence', () => {
    const first = buildDungeonMap(
      generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(28) }),
    );
    const second = buildDungeonMap(
      generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(28) }),
    );
    expect(second).toEqual(first);
  });
});
