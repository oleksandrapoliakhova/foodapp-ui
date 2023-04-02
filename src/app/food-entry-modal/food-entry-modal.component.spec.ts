import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FoodEntryModalComponent} from './food-entry-modal.component';

describe('FoodEntryModalComponent', () => {
  let component: FoodEntryModalComponent;
  let fixture: ComponentFixture<FoodEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodEntryModalComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FoodEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
