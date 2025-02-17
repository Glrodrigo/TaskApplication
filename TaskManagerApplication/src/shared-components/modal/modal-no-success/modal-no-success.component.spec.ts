import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoSuccessComponent } from './modal-no-success.component';

describe('ModalNoSuccessComponent', () => {
  let component: ModalNoSuccessComponent;
  let fixture: ComponentFixture<ModalNoSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNoSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalNoSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
