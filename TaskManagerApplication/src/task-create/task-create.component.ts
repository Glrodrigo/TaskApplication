import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../shared-components/menu/menu/menu.component';
import { Task } from '../domain/task';
import { Status } from '../domain/status';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GeneralMethods } from '../shared-components/general/general-methods';
import { TaskService } from '../service/task-service';
import { LoadComponent } from '../shared-components/load/load/load.component';


@Component({
  selector: 'app-task-create',
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
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})

export class TaskCreateComponent {

  constructor(
    public methods: GeneralMethods,
    public taskService: TaskService
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
  public taskDate: Date | null = null;
  public task: Task = {
    title: '',
    description: '',
    status: 1
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

    this.task.status = this.statusList.filter(item => item.name == name)[0].code;
  }

  toggleStatusDropdown() {
    this.showStatusDropdown = !this.showStatusDropdown;
  }

  createEvent(task: Task){
    this.task.concludedDate = this.taskDate ? new Date(this.taskDate) : undefined;
    let validateFields = this.validateFields(this.task.status, this.task.title, this.task.concludedDate);

    if (!validateFields){
      this.methods.alertMessage("Campos vazios ou preenchidos incorretamente")
      return;
    }

    this.isLoading = true;

    this.createAsync(this.task);
  }

  createAsync(task: Task){

    this.taskService.postTask(task).subscribe(
      response => {

        if (response != true){
          this.isLoading = false;
          this.methods.openErrorDialog();
          return;
        }

        this.isLoading = false;
        this.methods.openDialog();

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
}
