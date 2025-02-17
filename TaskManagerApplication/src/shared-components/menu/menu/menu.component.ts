import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatMenuTrigger,
    MatMenuModule,
    MatToolbarModule,
    MatIcon,
    CommonModule,
    MatListModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private router: Router){

  }

  onMenuItem(option: string) {

    if (option == '0'){
      this.tasks();
    }

    if (option == '1'){
      this.createTask();
    }
    
    if (option == '2'){
      this.searchTask();
    }

    return;
  }

  tasks(){
    this.router.navigate([''])
  }

  createTask(){
    this.router.navigate(['/create-task'])
  }

  searchTask(){
    this.router.navigate(['/search-task'])
  }
}
