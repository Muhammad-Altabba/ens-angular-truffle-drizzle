import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidRevealedComponent } from './bidrevealed.component';

describe('BidRevealedComponent', () => {
  let component: BidRevealedComponent;
  let fixture: ComponentFixture<BidRevealedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidRevealedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidRevealedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
