import { Component, Input } from '@angular/core';
import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule,TranslatePipe],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers: [{provide: CdkStepper, useExisting: StepperComponent}],

})
export class StepperComponent extends CdkStepper {
  @Input() Steps: any[] = [];  // Input the steps array

  nextStep() {
    if (this.selectedIndex < this.steps.length - 1) {
      this.selectedIndex++;
    }
  }
  prevStep() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  onClick(index: number) {
    this.selectedIndex = index;
  }
  log(step:any){
console.log(step)
  }
}
