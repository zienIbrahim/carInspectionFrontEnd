import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor(private translate: TranslateService) { }
  SaveSuccess() {
    return Swal.fire({
      title: "Success",
      text: this.translate.instant('sweetAlert.SaveSuccess'),
      icon: 'success',
      confirmButtonText: this.translate.instant('sweetAlert.cancelButtonText'),
      showConfirmButton: true,
    });
  }
  show(titel: string,message: string,icon:SweetAlertIcon) {
    return Swal.fire({ title: titel, text: message, icon: icon, confirmButtonText: this.translate.instant('sweetAlert.Ok') });
  }
  showConfirm(titel: string,message: string,icon:SweetAlertIcon,content : string | HTMLElement =null) {
    return Swal.fire({
      title: titel, 
      text: message,
      icon: icon,
      html:content,
      showCancelButton: true,
      showConfirmButton: true, 
      cancelButtonText:this.translate.instant('sweetAlert.Cancle'),
      confirmButtonText: this.translate.instant('sweetAlert.Ok'),
    });
  }
}
