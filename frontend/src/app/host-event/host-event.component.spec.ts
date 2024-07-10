import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEventComponent } from './host-event.component';

describe('CreateEventComponent', () => {
  let component: HostEventComponent;
  let fixture: ComponentFixture<HostEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
