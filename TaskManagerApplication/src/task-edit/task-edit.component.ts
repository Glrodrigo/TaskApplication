import { Component } from '@angular/core';
import { GeneralMethods } from '../shared-components/general/general-methods';
import { TaskService } from '../service/task-service';
import { Status } from '../domain/status';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../shared-components/menu/menu/menu.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadComponent } from '../shared-components/load/load/load.component';
import { SharedTaskDataService } from '../service/shared-task-service';
import { TaskResponse } from '../domain/task-response';
import { Router } from '@angular/router';
import { TaskParams } from '../domain/task-params';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    FormsModule,
    MenuComponent,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    LoadComponent
  ],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss'
})
export class TaskEditComponent {
  constructor(
    private router: Router,
    public methods: GeneralMethods,
    public taskService: TaskService,
    private sharedTaskDataService: SharedTaskDataService
  ){

  }

  public isLoading: boolean = false;
  public statusList: Array<Status> = [];
  public selectedStatusOption: string = '';
  public showStatusDropdown: boolean = false;
  public taskDate: Date | null = null;
  public taskResponse: TaskResponse = {
    id: 0,
    creationDate: '',
    title: '',
    status: 0
  }

  ngOnInit(){

    if (this.statusList.length == 0){
      this.statusOption();
    }

    this.sharedTaskDataService.getData().subscribe(data => {

      const isDataEmpty = !data || Object.keys(data).length === 0;

      if (isDataEmpty) {
        this.eventBack();
      } 
      else {
        this.taskResponse = data;
        this.taskDate = this.taskResponse.concludedDate ? new Date(this.taskResponse.concludedDate) : null;
        this.defaultStatusOption(this.taskResponse.status);
      }
    })
  }

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

    this.taskResponse.status = this.statusList.filter(item => item.name == name)[0].code;
  }

  defaultStatusOption(status: Number){

    const selectedStatus = Number(status)

    if (selectedStatus == 1){
      this.selectedStatusOption = this.statusList[0].name;
    }

    if (selectedStatus == 2){
      this.selectedStatusOption = this.statusList[1].name;
    }

    if (selectedStatus == 3){
      this.selectedStatusOption = this.statusList[2].name;
    }
  }

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  async changeEvent(task: TaskResponse): Promise<void>{

  this.taskResponse.concludedDate = this.taskDate ? new Date(this.taskDate) : undefined;
  let validateFields = this.validateFields(this.taskResponse.status, this.taskResponse.title, this.taskResponse.concludedDate);

  if (!validateFields){
    this.methods.alertMessage("Campos vazios ou preenchidos incorretamente")
    return;
  }

  this.isLoading = true;

  let params: TaskParams = {
    id : task.id,
    status : task.status,
    title: task.title,
    description: task.description,
    concludedDate: task.concludedDate
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

  deleteEvent(task: TaskResponse){
    this.isLoading = true;
    this.taskService.deleteTask(task.id).subscribe(
      response => {

        if (response != true){
          this.isLoading = false;
          this.methods.openErrorDialog();
          return;
        }

        this.isLoading = false;
        this.methods.openDeletedDialog();

        return;
      },
      error => {
        this.isLoading = false;
        error = this.methods.validateError(error)
        this.methods.alertMessage(error);
      }
    )
  }

  validateDate() {
    let message = 'Data deve estar no formato Mês/Dia/Ano (ex: 02/16/2025)';
    
    if (this.taskDate == null || isNaN(this.taskDate.getTime())) {
      this.methods.alertMessage(message);
      return false;
    }
  
    const month = this.taskDate.getMonth();
    const day = this.taskDate.getDate();
    const year = this.taskDate.getFullYear();
    let thisYear = new Date().getFullYear();
  
    if (year < thisYear || year > thisYear +10) {
      message = 'Data inválida';
      this.methods.alertMessage(message);
      return false;
    }
  
    let validateMonth = this.validateMonth(month, year, day);

    if(!validateMonth){
      message = 'Dia inválido para fevereiro';
      this.methods.alertMessage(message);
      return false;
    }

    return true;
  }

  validateMonth(month: number, year: number, day: number){
    if (month === 1) {
      const isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));

      if ((isLeapYear && day > 29) || (!isLeapYear && day > 28)) {
        return false;
      }

      return true;
    }

    return true;
  }

  private validateFields(
    status: Number, title: string, concluded?: Date
  ): boolean{

    if (status == null || status == undefined){
      return false;
    }

    if (title == null || title == undefined){
      return false;
    }

    if (concluded != null && concluded != undefined){
      return this.validateDate();
    }

    return true;
  }

  eventBack(){
    this.router.navigate([""]);
  }
}
