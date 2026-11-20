import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { generateLevelFloorPlan } from '../../../data/dungeon';
import { DungeonGeneration, floorPlanOutline } from './dungeon-generation';

function seededRoll(initialSeed = 41) {
  let seed = initialSeed;
  return (faces: number) => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed % faces) + 1;
  };
}

describe('DungeonGeneration page', () => {
  it('generates and displays the floor plan of a single level', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const plan = component.floorPlan();
    expect(plan).not.toBeNull();
    if (!plan) {
      throw new Error('The floor plan should be generated when the page initializes.');
    }
    expect(plan.rooms.length).toBe(plan.roomCount);
    expect(plan.corridors.length).toBeGreaterThan(0);

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Level floor plan');
    expect(text).toContain('Entrance corridor: C1');
    expect(text).toContain('Corridors');
    expect(text).toContain('Connections');
  });

  it('regenerates the plan with the selected room count and depth', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const roomsInput = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
    roomsInput.value = '5';
    roomsInput.dispatchEvent(new Event('input'));

    const depthSelect = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    depthSelect.value = '2';
    depthSelect.dispatchEvent(new Event('change'));

    component.onGenerate();
    fixture.detectChanges();

    const plan = component.floorPlan()!;
    expect(plan.roomCount).toBe(5);
    expect(plan.rooms.length).toBe(5);
    expect(plan.depth).toBe(2);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Depth II');
  });

  it('draws every node and connection in a deterministic schematic layout', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const plan = component.floorPlan()!;
    const diagram = component.diagram()!;

    const expectedKeys = new Set(
      plan.connections.flatMap((connection) => [
        `${connection.from.kind}:${connection.from.id}`,
        `${connection.to.kind}:${connection.to.id}`,
      ]),
    );
    expect(diagram.nodes.length).toBe(expectedKeys.size);
    expect(new Set(diagram.nodes.map((node) => node.key)).size).toBe(diagram.nodes.length);
    expect(new Set(diagram.nodes.map((node) => `${node.x}:${node.y}`)).size).toBe(
      diagram.nodes.length,
    );
    expect(diagram.connections.length).toBe(plan.connections.length);
    expect(diagram.nodes.some((node) => node.shape === 'room')).toBeTrue();
    expect(diagram.nodes.some((node) => node.shape === 'corridor')).toBeTrue();
    for (const node of diagram.nodes.filter((node) => node.shape === 'room')) {
      expect(node.outline).toBe(floorPlanOutline(null, node.width, node.height));
    }
    expect(diagram.width).toBeGreaterThan(0);
    expect(diagram.height).toBeGreaterThan(0);

    const svg = fixture.nativeElement.querySelector('svg.floor-plan-svg') as SVGSVGElement;
    expect(svg).not.toBeNull();
    expect(svg.querySelectorAll('.floor-plan-node').length).toBe(diagram.nodes.length);
    expect(svg.querySelectorAll('.floor-plan-connection').length).toBe(diagram.connections.length);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Level diagram');
  });

  it('maps each room shape to a distinct SVG outline', () => {
    const rectangle = floorPlanOutline('Rectangle/Square', 112, 56);
    expect(floorPlanOutline(null, 112, 56)).toBe(rectangle);
    for (const shape of [
      'Parallelogram',
      'Trapezium',
      'Pentagon',
      'Hexagon',
      'Octagon',
      'Oval/Circle',
    ]) {
      expect(floorPlanOutline(shape, 112, 56)).not.toBe(rectangle);
    }
    expect(floorPlanOutline('Oval/Circle', 112, 56)).toContain(' A ');
    expect(floorPlanOutline('Pentagon', 112, 56)).not.toBe(
      floorPlanOutline('Hexagon', 112, 56),
    );
  });

  it('draws rooms with the generated shape when room shapes are included', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const shapesCheckbox = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    shapesCheckbox.checked = true;
    shapesCheckbox.dispatchEvent(new Event('change'));
    component.onGenerate();
    fixture.detectChanges();

    const plan = component.floorPlan()!;
    const diagram = component.diagram()!;
    const shapeByNumber = new Map(plan.rooms.map((room) => [room.number, room.shape]));
    const roomNodes = diagram.nodes.filter((node) => node.shape === 'room');

    expect(roomNodes.length).toBe(plan.rooms.length);
    for (const node of roomNodes) {
      const roomNumber = Number(node.key.split(':')[1]);
      expect(node.outline).toBe(
        floorPlanOutline(shapeByNumber.get(roomNumber) ?? null, node.width, node.height),
      );
    }
    expect(fixture.nativeElement.querySelectorAll('.floor-plan-node path').length).toBe(
      diagram.nodes.length,
    );
  });

  it('centers each diagram column vertically', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.floorPlan.set(generateLevelFloorPlan({ roomCount: 12, rollFn: seededRoll(41) }));
    fixture.detectChanges();

    const diagram = component.diagram()!;
    const columns = new Map<number, number[]>();
    for (const node of diagram.nodes) {
      columns.set(node.x, [...(columns.get(node.x) ?? []), node.y]);
    }
    const allYs = [...columns.values()].flat();
    const top = Math.min(...allYs);
    const bottom = Math.max(...allYs);

    expect(columns.size).toBeGreaterThan(1);
    for (const ys of columns.values()) {
      expect(Math.abs(Math.min(...ys) - top - (bottom - Math.max(...ys)))).toBeLessThanOrEqual(1);
    }
  });

  it('draws loop connections as curved paths to existing rooms', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.floorPlan.set(generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) }));
    fixture.detectChanges();

    const plan = component.floorPlan()!;
    const loopCount = plan.connections.filter((connection) => connection.loop).length;
    expect(loopCount).toBeGreaterThan(0);

    const diagram = component.diagram()!;
    const loopConnections = diagram.connections.filter((connection) => connection.style === 'loop');
    expect(loopConnections.length).toBe(loopCount);
    for (const connection of loopConnections) {
      expect(connection.d).toContain(' Q ');
      expect(connection.label).toContain('[loop]');
    }
    expect(diagram.connections.filter((connection) => connection.style !== 'loop').length).toBe(
      plan.connections.length - loopCount,
    );

    const svg = fixture.nativeElement.querySelector('svg.floor-plan-svg') as SVGSVGElement;
    expect(svg.querySelectorAll('.floor-plan-connection--loop').length).toBe(loopCount);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Loop to existing room');
  });

  it('hides loops from both the map and the diagram when unchecked', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.floorPlan.set(generateLevelFloorPlan({ roomCount: 6, rollFn: seededRoll(1) }));
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const loopPassages = component.map()!.passages.filter((passage) => passage.style === 'loop');
    expect(loopPassages.length).toBeGreaterThan(0);
    expect(component.visibleMap()!.passages.length).toBe(component.map()!.passages.length);
    expect(component.visibleDiagram()!.connections.some((c) => c.style === 'loop')).toBeTrue();

    const checkbox = root.querySelector('#show-loops') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.showLoops()).toBeFalse();
    expect(component.visibleMap()!.passages.some((p) => p.style === 'loop')).toBeFalse();
    expect(component.visibleMap()!.doors.every((door) => !door.loop)).toBeTrue();
    expect(component.visibleMap()!.corridors.every((corridor) => !corridor.loop)).toBeTrue();
    expect(component.visibleMap()!.rooms).toEqual(component.map()!.rooms);
    expect(component.visibleDiagram()!.connections.some((c) => c.style === 'loop')).toBeFalse();
    expect(root.querySelectorAll('svg.dungeon-map-svg .map-passage--loop').length).toBe(0);
    expect(root.querySelectorAll('svg.floor-plan-svg .floor-plan-connection--loop').length).toBe(0);
    expect(root.textContent).not.toContain('Loop to existing room');

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.visibleMap()!.passages.length).toBe(component.map()!.passages.length);
    expect(root.querySelectorAll('svg.dungeon-map-svg .map-passage--loop').length).toBe(
      loopPassages.length,
    );
    expect(root.textContent).toContain('Loop to existing room');
  });

  it('renders the dungeon map by default with rooms, passages and doors', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const map = component.map()!;

    expect(component.view()).toBe('map');
    expect(map.rooms.length).toBe(component.floorPlan()!.rooms.length);

    const svg = fixture.nativeElement.querySelector('svg.dungeon-map-svg') as SVGSVGElement;
    expect(svg).not.toBeNull();
    expect(svg.querySelector('.map-background')).not.toBeNull();
    expect(svg.querySelectorAll('.map-room').length).toBe(map.rooms.length);
    expect(svg.querySelectorAll('.map-passage').length).toBe(map.passages.length);
    expect(map.corridors.length).toBeGreaterThan(0);
    expect(svg.querySelectorAll('.map-corridor-label').length).toBe(map.corridors.length);
    expect(svg.querySelector('.map-corridor-label')!.textContent).toContain('C1');
    expect(svg.querySelectorAll('.map-door').length).toBe(map.doors.length);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Dungeon map');
  });

  it('sketches map walls by default and restores straight paths when unchecked', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;

    expect(component.handDrawn()).toBeTrue();
    const wall = root.querySelector('svg.dungeon-map-svg .map-passage-wall')!;
    const sketchedD = wall.getAttribute('d')!;
    expect(sketchedD).toContain('C');

    const roomWall = root.querySelector('svg.dungeon-map-svg .map-room-wall')!;
    const sketchedRoomD = roomWall.getAttribute('d')!;
    expect(sketchedRoomD).toContain('C');

    const checkbox = root.querySelector('#hand-drawn') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.handDrawn()).toBeFalse();
    const straightD = root.querySelector('svg.dungeon-map-svg .map-passage-wall')!.getAttribute('d')!;
    expect(straightD).not.toBe(sketchedD);
    expect(straightD).toMatch(/^M [\d.-]+ [\d.-]+ L /);
    expect(root.querySelector('svg.dungeon-map-svg .map-room-wall')!.getAttribute('d')).not.toBe(
      sketchedRoomD,
    );

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(root.querySelector('svg.dungeon-map-svg .map-passage-wall')!.getAttribute('d')).toBe(
      sketchedD,
    );
    expect(root.querySelector('svg.dungeon-map-svg .map-room-wall')!.getAttribute('d')).toBe(
      sketchedRoomD,
    );
  });

  it('draws direct room doors as dashed links instead of corridors', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const generated = component.floorPlan()!;
    const [first, second] = generated.rooms;
    component.floorPlan.set({
      ...generated,
      corridors: [],
      connections: [
        {
          from: { kind: 'Ingresso', id: 'Ingresso' },
          to: { kind: 'stanza' as const, id: `${first.number}` },
          via: 'ingresso',
        },
        {
          from: { kind: 'stanza' as const, id: `${first.number}` },
          to: { kind: 'stanza' as const, id: `${second.number}` },
          via: { type: 'Door', position: 'north', destination: 'Room', details: null },
        },
      ],
    });
    fixture.detectChanges();

    const directPassages = component.map()!.passages.filter((passage) => passage.direct);
    expect(directPassages.length).toBe(1);

    const svg = fixture.nativeElement.querySelector('svg.dungeon-map-svg') as SVGSVGElement;
    const link = svg.querySelector('.map-room-link')!;
    expect(svg.querySelectorAll('.map-room-link').length).toBe(1);
    expect(link.getAttribute('stroke-dasharray')).toBe('6 4');
    expect(link.parentElement!.querySelector('.map-passage-wall')).toBeNull();
    expect(link.parentElement!.querySelector('.map-passage-floor')).toBeNull();
  });

  it('switches between the map and the schematic diagram', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const root = fixture.nativeElement as HTMLElement;

    const mapSection = root.querySelector('.map-section') as HTMLElement;
    const diagramSection = root.querySelector('.diagram-section') as HTMLElement;
    expect(mapSection.classList.contains('is-hidden')).toBeFalse();
    expect(diagramSection.classList.contains('is-hidden')).toBeTrue();

    const diagramRadio = root.querySelector(
      'input[name="dungeon-view"][value="diagram"]',
    ) as HTMLInputElement;
    diagramRadio.checked = true;
    diagramRadio.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.view()).toBe('diagram');
    expect(mapSection.classList.contains('is-hidden')).toBeTrue();
    expect(diagramSection.classList.contains('is-hidden')).toBeFalse();
  });

  it('rebuilds the map when the level is regenerated', async () => {
    await TestBed.configureTestingModule({
      imports: [DungeonGeneration],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DungeonGeneration);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const roomsInput = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
    roomsInput.value = '6';
    roomsInput.dispatchEvent(new Event('input'));
    component.onGenerate();
    fixture.detectChanges();

    expect(component.map()!.rooms.length).toBe(6);
    expect(
      (fixture.nativeElement as HTMLElement).querySelectorAll('svg.dungeon-map-svg .map-room')
        .length,
    ).toBe(6);
  });
});
