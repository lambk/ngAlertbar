import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  defaultBackgroundColor,
  defaultBorderColor,
  defaultLifetimeMs,
  defaultShowDelayMs,
  defaultTextColor,
  defaultWidthMode
} from 'projects/ng-alertbar/src/lib/defaults';
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
        [style.background]="backgroundColor"
        [style.border-color]="borderColor"
      >
        <span class="ng-alert-bar-text" [style.color]="textColor">
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
  @Input() borderColor = defaultBorderColor;
  @Input() textColor = defaultTextColor;

  @Input() widthMode = defaultWidthMode;

  show = false;
  message: string;
  private destroy = new Subject<void>();

  get isFullWidth() {
    return this.widthMode === 'full';
  }

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.alertBarService.trigger$.pipe(delay(this.showDelay)).subscribe(message => {
      this.message = message;
      this.show = true;
    });
    this.alertBarService.trigger$
      .pipe(switchMap(() => timer(this.showDelay + this.lifeTime)))
      .subscribe(() => (this.show = false));
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
