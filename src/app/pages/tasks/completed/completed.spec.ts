import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Completed } from './completed';

describe('Completed', () => {
  let component: Completed;
  let fixture: ComponentFixture<Completed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Completed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Completed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
