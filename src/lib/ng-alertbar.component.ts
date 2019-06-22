import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  defaultBackgroundColor,
  defaultBorderColor,
  defaultLifetimeMs,
  defaultShowDelayMs,
  defaultTextColor
} from 'projects/ng-alertbar/src/lib/defaults';
import { NgAlertbarService } from 'projects/ng-alertbar/src/lib/ng-alertbar.service';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'ngab-alert-bar',
  template: `
    <div *ngIf="show" class="ng-alert-bar-wrapper">
      <div
        class="ng-alert-bar"
        [style.background]="backgroundColor"
        [style.border-color]="borderColor"
      >
        <span class="ng-alert-bar-text" [style.color]="textColor">
          ng-alertbar works!
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

  show = false;
  private destroy = new Subject<void>();

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.alertBarService.trigger$.pipe(delay(this.showDelay)).subscribe(() => (this.show = true));
    this.alertBarService.trigger$
      .pipe(delay(this.showDelay + this.lifeTime))
      .subscribe(() => (this.show = false));
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
