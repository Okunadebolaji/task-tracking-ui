import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminSignup } from './superadmin-signup';

describe('SuperadminSignup', () => {
  let component: SuperadminSignup;
  let fixture: ComponentFixture<SuperadminSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperadminSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperadminSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
