import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal-success.component.html',
  styleUrl: './modal-success.component.scss'
})
export class ModalSuccessComponent {

  constructor(
    private dialogRef: MatDialogRef<ModalSuccessComponent>
  ){

  }

  successClose(){
    this.dialogRef.close();
  }
}
