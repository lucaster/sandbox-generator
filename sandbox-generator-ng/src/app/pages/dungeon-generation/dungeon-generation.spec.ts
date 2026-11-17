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
});
