import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarotListComponent } from './tarot-list.component';

describe('TarotListComponent', () => {
  let component: TarotListComponent;
  let fixture: ComponentFixture<TarotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarotListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
