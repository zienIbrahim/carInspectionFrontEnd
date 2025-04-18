// angular import
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { GeneralAlertService } from './core/Service/general-alert.service';
import { AsyncPipe } from '@angular/common';
import { Message } from 'primeng/message';
import { LoadingComponent } from './core/components/loading/loading.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet,Message,LoadingComponent, SpinnerComponent,AsyncPipe]
})
export class AppComponent {
  // public props
    alerts = inject(GeneralAlertService);
  
  title = 'mantis-free-version';
}
