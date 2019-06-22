import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  defaultBackgroundColor,
  defaultBorderColor,
  defaultLifetimeMs,
  defaultShowDelayMs,
  defaultTextColor,
  defaultWidthMode
} from 'projects/ng-alertbar/src/lib/defaults';
import { AlertOptions } from 'projects/ng-alertbar/src/lib/interface';
import { NgAlertbarService } from 'projects/ng-alertbar/src/lib/ng-alertbar.service';
import { Subject, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ngab-alert-bar',
  template: `
    <div *ngIf="show" class="ng-alert-bar-wrapper">
      <div
        class="ng-alert-bar"
        [class.full-width]="isFullWidth"
        [style.background]="tempBackgroundColor || backgroundColor"
        [style.border-color]="tempBorderColor || borderColor"
      >
        <span class="ng-alert-bar-text" [style.color]="tempTextColor || textColor">
          {{ message }}
        </span>
      </div>
    </div>
  `,
  styles: []
})
export class NgAlertbarComponent implements OnInit, OnDestroy {
  @Input() lifeTime = defaultLifetimeMs;
  @Input() showDelay = defaultShowDelayMs;

  @Input() backgroundColor = defaultBackgroundColor;
  tempBackgroundColor: string;
  @Input() borderColor = defaultBorderColor;
  tempBorderColor: string;
  @Input() textColor = defaultTextColor;
  tempTextColor: string;

  @Input() widthMode = defaultWidthMode;
  tempWidthMode: 'full' | 'partial';

  show = false;
  message: string;
  private destroy = new Subject<void>();

  get isFullWidth() {
    if (this.tempWidthMode) {
      return this.tempWidthMode === 'full';
    }
    return this.widthMode === 'full';
  }

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.alertBarService.trigger$.pipe(delay(this.showDelay)).subscribe(trigger => {
      this.message = trigger.message;
      this.show = true;
      this.clearTempOptions(); // Clear previous temporary options
      this.assignTempOptions(trigger.options);
    });
    this.alertBarService.trigger$
      .pipe(switchMap(() => timer(this.showDelay + this.lifeTime)))
      .subscribe(() => (this.show = false));
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  /**
   * Clears out any temporary config options so that they
   * do not persist beyond their single use
   */
  private clearTempOptions() {
    this.tempBackgroundColor = null;
    this.tempBorderColor = null;
    this.tempTextColor = null;
    this.tempWidthMode = null;
  }

  /**
   * Assigns the options included in the trigger to the temporary
   * config variables so they can apply for the upcoming alert
   * @param options The options passed in the trigger
   */
  private assignTempOptions(options: AlertOptions) {
    if (!options) {
      return;
    }
    this.tempBackgroundColor = options.backgroundColor;
    this.tempBorderColor = options.borderColor;
    this.tempTextColor = options.textColor;
    this.tempWidthMode = options.widthMode;
  }
}
