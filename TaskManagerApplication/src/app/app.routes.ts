import { Routes } from '@angular/router';
import { KanbanBoardComponent } from '../kanban-board/kanban-board.component';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { TaskSearchComponent } from '../task-search/task-search.component';

export const routes: Routes = [
    {
        path: "",
        component: KanbanBoardComponent
    },
    {
        path: "create-task",
        component: TaskCreateComponent
    },
    {
        path: "edit-task",
        component: TaskEditComponent
    },
    {
        path: "search-task",
        component: TaskSearchComponent
    }
];
