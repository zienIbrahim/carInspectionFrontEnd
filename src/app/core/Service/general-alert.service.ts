import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastMessage, ToastMessageData } from '../model/model';
import { TranslateService } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class GeneralAlertService {
  constructor() {}

  private alert: BehaviorSubject<ToastMessage[]> = new BehaviorSubject<ToastMessage[]>([]);
  show(header: ToastMessageData, body: ToastMessageData,Link="") {
    this.alert.next([]);
    this.alert.next(this.alert.getValue().concat({ header, body, uuid: uuid(),Link:Link}));
}

remove(toastID: string) {
  this.alert.next(this.alert.value.filter((toast) => toast.uuid !== toastID));
}
get $alerts(): Observable<ToastMessage[]>{
  return this.alert.asObservable()
}
}
