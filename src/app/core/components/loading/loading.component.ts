import { Component } from '@angular/core';
import { LoadingService } from '../../Service/loading.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-loading',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
constructor(public LoadingService :LoadingService) {}
}
