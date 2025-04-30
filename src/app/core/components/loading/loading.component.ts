import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from '../../Service/loading.service';
@Component({
  selector: 'app-loading',
  imports: [],
  standalone: true,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit { 
  isLoading$ = false;
constructor(public loadingService :LoadingService,private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading$ = loading;
      this.cd.detectChanges();
    });
  }
}
