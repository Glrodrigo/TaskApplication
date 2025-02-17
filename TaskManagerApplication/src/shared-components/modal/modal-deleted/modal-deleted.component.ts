import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-deleted',
  standalone: true,
  imports: [],
  templateUrl: './modal-deleted.component.html',
  styleUrl: './modal-deleted.component.scss'
})
export class ModalDeletedComponent {

    constructor(
      private dialogRef: MatDialogRef<ModalDeletedComponent>
    ){
  
    }
  
    deletedClose(){
      this.dialogRef.close();
    }
}
