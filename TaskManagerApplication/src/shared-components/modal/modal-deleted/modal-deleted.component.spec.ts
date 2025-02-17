import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeletedComponent } from './modal-deleted.component';

describe('ModalDeletedComponent', () => {
  let component: ModalDeletedComponent;
  let fixture: ComponentFixture<ModalDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDeletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
