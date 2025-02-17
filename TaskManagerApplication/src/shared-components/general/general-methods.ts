
import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalSuccessComponent } from "../modal/modal-success/modal-success.component";
import { ModalNoSuccessComponent } from "../modal/modal-no-success/modal-no-success.component";
import { ModalDeletedComponent } from "../modal/modal-deleted/modal-deleted.component";

@Injectable({
  providedIn: 'root'
})
export class GeneralMethods{

    constructor(
      public snackBar: MatSnackBar,
      public router: Router,
      public dialog: MatDialog,
    ){

    }

    alertMessage(message: string): void{
      this.snackBar.open(message, 'Fechar', {
          duration: 8000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
      });
    }

      openDialog(): void {
        const dialogRef = this.dialog.open(ModalSuccessComponent, {
          height: '0.1%',
          width: '0.1%',
          backdropClass: 'custom-backdrop'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['']);
        });
      }
    
      openErrorDialog(): void {
        const dialogRef = this.dialog.open(ModalNoSuccessComponent, {
          height: '0.1%',
          width: '0.1%',
          backdropClass: 'custom-backdrop'
        });
        dialogRef.afterClosed().subscribe(result => {
          
        });
      }

      openDeletedDialog(): void {
        const dialogRef = this.dialog.open(ModalDeletedComponent, {
          height: '0.1%',
          width: '0.1%',
          backdropClass: 'custom-backdrop'
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['']);
        });
      }

    public validateError(error: any): string{
      let errorMessage = '';

      if (error.error?.messages?.length > 0){
        errorMessage = error.error.messages[0].errorType;
      }
      else if (error.status == 0){
        errorMessage = 'Erro ao realizar comunicação, verifique sua conexão';
      }
      else{
        errorMessage = 'Erro desconhecido, tente novamente mais tarde';
      }

      return errorMessage;
    }

    public url(): string{
      let url = "https://localhost:44322";
      return url;
    }
}