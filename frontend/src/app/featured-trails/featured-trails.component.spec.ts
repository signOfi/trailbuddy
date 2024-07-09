import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedTrailsComponent } from './featured-trails.component';

describe('FeaturedTrailsComponent', () => {
  let component: FeaturedTrailsComponent;
  let fixture: ComponentFixture<FeaturedTrailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedTrailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeaturedTrailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
