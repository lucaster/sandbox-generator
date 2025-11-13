import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtLinkIcon } from './ext-link-icon';

describe('ExtLinkIcon', () => {
  let component: ExtLinkIcon;
  let fixture: ComponentFixture<ExtLinkIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtLinkIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtLinkIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
