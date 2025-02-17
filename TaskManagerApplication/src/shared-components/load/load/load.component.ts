import { Component } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-load',
  standalone: true,
  imports: [
    MatSpinner
  ],
  templateUrl: './load.component.html',
  styleUrl: './load.component.scss'
})
export class LoadComponent {

  constructor(
    
  ){

  }
}
