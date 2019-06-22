import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgAlertbarService } from 'projects/ng-alertbar/src/lib/ng-alertbar.service';
import { NgAlertbarComponent } from './ng-alertbar.component';

@NgModule({
  declarations: [NgAlertbarComponent],
  imports: [CommonModule],
  exports: [NgAlertbarComponent]
})
export class NgAlertbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgAlertbarModule,
      providers: [NgAlertbarService]
    };
  }
}
