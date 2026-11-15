import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Lairs } from './lairs';

function createPage(query: Record<string, string> = {}) {
  TestBed.configureTestingModule({
    imports: [Lairs],
    providers: [
      provideZonelessChangeDetection(),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { queryParamMap: convertToParamMap(query) } },
      },
    ],
  });
  const fixture = TestBed.createComponent(Lairs);
  fixture.detectChanges();
  return fixture;
}

describe('Lairs page', () => {
  it('keeps showing the five example lairs without link parameters', () => {
    const fixture = createPage();
    const component = fixture.componentInstance;

    expect(component.lairs).toHaveSize(5);
    expect(component.linked()).toBe(false);
  });

  it('replays the linked lair from the named parameters', () => {
    const fixture = createPage({
      biome: 'Forest',
      inhabitantsRoll1: '3',
      inhabitantsRoll2: '4',
      outsideRoll: '2',
      outsideHexesRoll: '5',
      layoutRoll: '6',
    });
    const component = fixture.componentInstance;

    expect(component.lairs).toHaveSize(1);
    expect(component.linked()).toBe(true);
    const lair = component.lairs[0];
    expect(lair.biome).toBe('Forest');
    expect(lair.inhabitants).toBe('Wolves');
    expect(lair.layout).toBe(4);
    // The linked lair shows the same example bestiary as the five examples.
    expect(lair.totalMonsters).toBe(200);
    expect(lair.treasure).toEqual({ sp: 4000, gems: 4 });
    expect(lair.percentInLair).toBe(50);
    expect(lair.encounter === 'lair' || lair.encounter === 'patrol').toBe(true);
    expect(lair.insideMonsters).toBe(160);
    expect(lair.outsideMonsters).toBe(40);
    expect(lair.rooms.map((room) => room.monsters)).toEqual([16, 32, 32, 80]);
    expect(fixture.nativeElement.textContent).not.toContain('—');
    expect(fixture.nativeElement.textContent).toContain(
      'Showing the lair linked from the hex overall map.'
    );
  });

  it('shows an error for invalid lair parameters', () => {
    const fixture = createPage({
      biome: 'Forest',
      inhabitantsRoll1: '3',
      inhabitantsRoll2: 'x',
      outsideRoll: '2',
      outsideHexesRoll: '5',
      layoutRoll: '6',
    });
    const component = fixture.componentInstance;

    expect(component.lairs).toHaveSize(0);
    expect(component.linkError()).toContain('Unable to load the linked lair');
    const alert = fixture.nativeElement.querySelector('[role=alert]') as HTMLElement;
    expect(alert.textContent).toContain('Unable to load the linked lair');
  });
});
