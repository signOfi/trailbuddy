import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupEventComponent } from './manage-group-event.component';

describe('ManageGroupEventComponent', () => {
  let component: ManageGroupEventComponent;
  let fixture: ComponentFixture<ManageGroupEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGroupEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGroupEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
