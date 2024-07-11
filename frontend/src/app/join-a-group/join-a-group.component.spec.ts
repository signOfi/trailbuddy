import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAGroupComponent } from './join-a-group.component';

describe('JoinAGroupComponent', () => {
  let component: JoinAGroupComponent;
  let fixture: ComponentFixture<JoinAGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinAGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinAGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
