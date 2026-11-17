import {
  generateLevelFloorPlan,
  type DungeonFloorConnection,
  type DungeonFloorNode,
  type DungeonFloorOutlet,
} from './dungeon';

function seededRoll(initialSeed = 41) {
  let seed = initialSeed;
  return (faces: number) => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed % faces) + 1;
  };
}

function isOutlet(via: DungeonFloorConnection['via']): via is DungeonFloorOutlet {
  return typeof via !== 'string' && 'developed' in via;
}

function nodeKey(node: DungeonFloorNode): string {
  return `${node.kind}:${node.id}`;
}

describe('generateLevelFloorPlan', () => {
  it('starts from an entrance corridor with at least one outlet', () => {
    const plan = generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll() });

    expect(plan.corridors[0].id).toBe(plan.entranceCorridorId);
    expect(plan.connections.filter((connection) => connection.via === 'ingresso').length).toBe(1);
    const entranceOutlets = plan.connections.filter(
      (connection): connection is DungeonFloorConnection & { via: DungeonFloorOutlet } =>
        connection.from.kind === 'corridoio' &&
        connection.from.id === plan.entranceCorridorId &&
        isOutlet(connection.via),
    );
    expect(
      entranceOutlets.some(
        (connection) =>
          connection.via.type === 'PORTA_STANZA' || connection.via.type === 'PORTA_SEGRETA',
      ),
    ).toBeTrue();
  });

  it('generates rooms on demand up to the requested count and keeps the plan connected', () => {
    const plan = generateLevelFloorPlan({ roomCount: 8, depth: 3, rollFn: seededRoll(7) });

    expect(plan.rooms.length).toBe(8);
    expect(plan.rooms.map((room) => room.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    const reachable = new Set<string>(['Ingresso:Ingresso']);
    let changed = true;
    while (changed) {
      changed = false;
      for (const connection of plan.connections) {
        if (reachable.has(nodeKey(connection.from)) && !reachable.has(nodeKey(connection.to))) {
          reachable.add(nodeKey(connection.to));
          changed = true;
        }
      }
    }
    for (const corridor of plan.corridors) {
      expect(reachable.has(`corridoio:${corridor.id}`)).toBeTrue();
    }
    for (const room of plan.rooms) {
      expect(reachable.has(`stanza:${room.number}`)).toBeTrue();
    }
  });

  it('marks undeveloped outlets and records room doors as outlets', () => {
    const plan = generateLevelFloorPlan({ roomCount: 5, rollFn: seededRoll(19) });
    const roomOutlets = plan.connections.filter(
      (connection): connection is DungeonFloorConnection & { via: DungeonFloorOutlet } =>
        isOutlet(connection.via) && connection.from.kind === 'stanza',
    );

    expect(roomOutlets.length).toBeGreaterThan(0);
    for (const connection of roomOutlets) {
      expect(connection.via.door).toBeDefined();
      expect(connection.via.source.id).toBe(connection.from.id);
    }
  });

  it('reaches the requested room count across unlucky roll sequences', () => {
    for (const seed of [3, 12, 28, 115, 141]) {
      const plan = generateLevelFloorPlan({ roomCount: 5, depth: 2, rollFn: seededRoll(seed) });
      expect(plan.rooms.length).toBe(5);
    }
  });

  it('is deterministic for a seeded roll function', () => {
    const first = generateLevelFloorPlan({ roomCount: 4, rollFn: seededRoll(123) });
    const second = generateLevelFloorPlan({ roomCount: 4, rollFn: seededRoll(123) });

    expect(first.rooms.map((room) => [room.number, room.type, room.size])).toEqual(
      second.rooms.map((room) => [room.number, room.type, room.size]),
    );
    expect(first.corridors.map((corridor) => corridor.end)).toEqual(
      second.corridors.map((corridor) => corridor.end),
    );
  });

  it('links leftover leaf-corridor outlets to existing rooms without changing roomCount', () => {
    const plan = generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) });
    const loops = plan.connections.filter((connection) => connection.loop);

    expect(plan.rooms.length).toBe(plan.roomCount);
    expect(loops.length).toBeGreaterThan(0);

    const roomIds = new Set(plan.rooms.map((room) => `stanza:${room.number}`));
    const branchingCorridors = new Set(
      plan.connections
        .filter((connection) => !connection.loop && connection.from.kind === 'corridoio')
        .map((connection) => connection.from.id),
    );

    for (const connection of loops) {
      expect(connection.from.kind).toBe('corridoio');
      expect(connection.to.kind).toBe('stanza');
      expect(roomIds.has(nodeKey(connection.to))).toBeTrue();
      expect(branchingCorridors.has(connection.from.id)).toBeFalse();
      expect(isOutlet(connection.via)).toBeTrue();
      if (isOutlet(connection.via)) {
        expect(connection.via.type).not.toBe('SCALE');
        expect(connection.via.developed).toBeTrue();
      }
    }
  });

  it('does not duplicate existing direct edges with loop connections', () => {
    const plan = generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) });
    const loops = plan.connections.filter((connection) => connection.loop);
    const pairKey = (connection: DungeonFloorConnection) =>
      [nodeKey(connection.from), nodeKey(connection.to)].sort().join('|');
    const loopPairs = new Set(loops.map(pairKey));

    expect(loopPairs.size).toBe(loops.length);
    for (const connection of plan.connections.filter((item) => !item.loop)) {
      expect(loopPairs.has(pairKey(connection))).toBeFalse();
    }
  });

  it('is deterministic for loop connections', () => {
    const loopEdges = (plan: ReturnType<typeof generateLevelFloorPlan>) =>
      plan.connections
        .filter((connection) => connection.loop)
        .map((connection) => `${nodeKey(connection.from)}->${nodeKey(connection.to)}`);

    const first = generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) });
    const second = generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) });

    expect(loopEdges(first).length).toBeGreaterThan(0);
    expect(loopEdges(first)).toEqual(loopEdges(second));
  });
});
