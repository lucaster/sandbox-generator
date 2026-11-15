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

  it('replays the linked lair from the biome and rolls', () => {
    const fixture = createPage({ biome: 'Forest', rolls: '3,4,2,5,6' });
    const component = fixture.componentInstance;

    expect(component.lairs).toHaveSize(1);
    expect(component.linked()).toBe(true);
    expect(component.lairs[0].biome).toBe('Forest');
    expect(component.lairs[0].inhabitants).toBe('Wolves');
    expect(component.lairs[0].layout).toBe(4);
    expect(fixture.nativeElement.textContent).toContain(
      'Showing the lair linked from the hex overall map.'
    );
  });

  it('shows an error for invalid lair parameters', () => {
    const fixture = createPage({ biome: 'Forest', rolls: '3,x' });
    const component = fixture.componentInstance;

    expect(component.lairs).toHaveSize(0);
    expect(component.linkError()).toContain('Unable to load the linked lair');
    const alert = fixture.nativeElement.querySelector('[role=alert]') as HTMLElement;
    expect(alert.textContent).toContain('Unable to load the linked lair');
  });
});
