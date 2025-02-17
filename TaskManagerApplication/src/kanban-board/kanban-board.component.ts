import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../shared-components/menu/menu/menu.component';
import { GeneralMethods } from '../shared-components/general/general-methods';
import { TaskService } from '../service/task-service';
import { TaskResponse } from '../domain/task-response';
import { TaskParams } from '../domain/task-params';
import { SharedTaskDataService } from '../service/shared-task-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MenuComponent
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})

export class KanbanBoardComponent {
  
  constructor(
    public methods: GeneralMethods,
    public taskService: TaskService,
    public sharedTaskDataService: SharedTaskDataService,
    private router: Router,
  ) {
    
  }

  ngOnInit(){
    if (this.taskList.length == 0){
      this.getAsync();
    }
  }
  
  public isLoading: boolean = false;
  public taskList: Array<TaskResponse> = [];

  statusList = [
    { label: 'Pendente', value: 'pending', code: 1 },
    { label: 'Em Andamento', value: 'onGoing', code: 2 },
    { label: 'Conclusão', value: 'concluded', code: 3 }
  ];

  getTasksByStatus(status: Number) {
    return this.taskList.filter(task => task.status === status);
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

  getAsync(){

    this.isLoading = true;
    this.taskService.getAll().subscribe(
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
      }
    )
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

  validateStatus(status: Number){
    if (status == null || status == undefined){
      return false;
    }

    return true;
  }
}
