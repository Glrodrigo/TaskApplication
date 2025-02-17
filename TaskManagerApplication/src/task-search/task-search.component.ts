import { Component } from '@angular/core';
import { Status } from '../domain/status';
import { GeneralMethods } from '../shared-components/general/general-methods';
import { TaskService } from '../service/task-service';
import { TaskResponse } from '../domain/task-response';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../shared-components/menu/menu/menu.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { LoadComponent } from '../shared-components/load/load/load.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskParams } from '../domain/task-params';
import { SharedTaskDataService } from '../service/shared-task-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [
        FormsModule,
        MenuComponent,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        LoadComponent
  ],
  templateUrl: './task-search.component.html',
  styleUrl: './task-search.component.scss'
})
export class TaskSearchComponent {
  
    constructor(
      public methods: GeneralMethods,
      public taskService: TaskService,
      public sharedTaskDataService: SharedTaskDataService,
      public router: Router
    ){
  
    }
  
    ngOnInit(){
  
      if (this.statusList.length == 0){
        this.statusOption();
      }
    }
  
    public isLoading: boolean = false;
    public statusList: Array<Status> = [];
    public selectedStatusOption: string = '';
    public showStatusDropdown: boolean = false;
    public taskList: Array<TaskResponse> = [];
    public status: Status = {
      name: '',
      code: 0
    };
  
    statusOption(){
      const optionOne: Status = { 
        name: 'Pendente',
        code: 1,
      };
  
      const optionTwo: Status = { 
        name: 'Em Andamento',
        code: 2,
      };
  
      const optionThree: Status = { 
        name: 'Conclusão',
        code: 3,
      };
  
      this.statusList.push(optionOne, optionTwo, optionThree)
    }
  
    selectStatusOption(name: string) {
      this.selectedStatusOption = name;
      this.showStatusDropdown = false;
  
      this.status = this.statusList.filter(item => item.name == name)[0];
    }
  
    toggleStatusDropdown() {
      this.showStatusDropdown = !this.showStatusDropdown;
    }

    searchEvent(){

      let validateStatus = this.validateStatus(this.status.code);
  
      if (!validateStatus){
        this.methods.alertMessage("Campos vazios ou preenchidos incorretamente")
        return;
      }
  
      this.isLoading = true;

      this.searchAsync(this.status.code)
    }

    searchAsync(statusCode: Number){

      this.taskService.getByStatus(statusCode).subscribe(
        response => {
          
          if (response.length == 0){
            this.isLoading = false;
            this.methods.alertMessage(`Nenhum resultado encontrado`)
            return false;
          }
  
          if (response.length > 0){
            this.taskList = response;
            this.taskList.forEach(element => {
              element.selectedStatus = element.status
            });
          }
  
          this.isLoading = false;
          return this.taskList;
        },
        error => {
          this.isLoading = false;
          error = this.methods.validateError(error);
          this.methods.alertMessage(error);
          return false;
        }
      )
    }

    validateStatus(statusCode: Number){
      if (statusCode == 0 || statusCode == undefined){
        return false;
      }

      return true;
    }

  async updateTaskStatus(task: TaskResponse) {

    if (task.selectedStatus !== undefined) {
      const selectedStatus = Number(task.selectedStatus)

      if (task.status !== selectedStatus) {
        task.status = selectedStatus;

        await this.changeEvent(task);
      }
    }
  }

    async changeEvent(task: TaskResponse): Promise<void>{
  
      let validateStatus = this.validateStatus(
        task.status
      );
  
      if (!validateStatus){
        this.methods.alertMessage("Campos vazios ou preenchidos incorretamente")
        return;
      }
  
      this.isLoading = true;
  
      let params: TaskParams = {
        id : task.id,
        status : task.status
      }
  
      const success = await this.changeAsync(params);
      this.isLoading = false;
  
      if (success){
        this.methods.openDialog();
        return;
      }
  
      if(!success){
        this.methods.openErrorDialog();
        return;
      }
    }
  
    private async changeAsync(task: TaskParams): Promise<boolean>{
  
      try{
        const response = await this.taskService.putTask(task).toPromise();
    
        if (response === false) {
          this.isLoading = false;
          this.methods.alertMessage('Verificar se os dados de envio estão corretos');
          return false;
        }
    
        return true;
      }
      catch(ex){
        this.isLoading = false;
        let error = this.methods.validateError(ex)
        this.methods.alertMessage(error);
        return false;
      }
    }

    change(task: TaskResponse){
      this.sharedTaskDataService.setData(task);
      this.router.navigate(["/edit-task"])
    }
}
