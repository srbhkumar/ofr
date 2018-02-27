import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdmpComponent } from './pdmp.component';

describe('PdmpComponent', () => {
  let component: PdmpComponent;
  let fixture: ComponentFixture<PdmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
