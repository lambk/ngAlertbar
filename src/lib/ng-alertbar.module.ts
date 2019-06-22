import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgAlertbarService } from 'projects/ng-alertbar/src/lib/ng-alertbar.service';
import { NgAlertbarComponent } from './ng-alertbar.component';

@NgModule({
  declarations: [NgAlertbarComponent],
  imports: [CommonModule, BrowserAnimationsModule],
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
