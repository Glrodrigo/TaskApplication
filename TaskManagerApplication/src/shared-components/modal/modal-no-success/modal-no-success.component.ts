import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-no-success',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal-no-success.component.html',
  styleUrl: './modal-no-success.component.scss'
})
export class ModalNoSuccessComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalNoSuccessComponent>
  ){

  }

  noSuccessClose(){
    this.dialogRef.close();
  }
}
