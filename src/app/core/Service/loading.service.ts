// loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  private requestCount = 0;

  show() {
    this.requestCount++;
    this.loading.next(true);
  }

  hide() {
    console.log({requestCount:this.requestCount})
    this.requestCount--;
    if (this.requestCount <= 0) {
      console.log({IFrequestCount:this.requestCount})

      this.loading.next(false);
      this.requestCount = 0;
    }
  }
}
