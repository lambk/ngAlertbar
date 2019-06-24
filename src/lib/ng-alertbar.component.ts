import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject, timer } from 'rxjs';
import { mapTo, switchMap, take, takeUntil } from 'rxjs/operators';
import { slide } from './animations';
import {
  defaultBackgroundColor,
  defaultBorderColor,
  defaultLifetimeMs,
  defaultShowCloseButton,
  defaultShowDelayMs,
  defaultTextColor,
  defaultWidthMode
} from './defaults';
import { AlertOptions, AlertTrigger } from './interface';
import { NgAlertbarService } from './ng-alertbar.service';

const ALERT_LEAVE_ANIMATION_DURATION = 200;

@Component({
  selector: 'ng-alertbar',
  template: `
    <div *ngIf="show" [@slide] class="ng-alert-bar-wrapper">
      <div
        class="ng-alert-bar"
        [class.full-width]="isFullWidth"
        [style.background]="tempBackgroundColor || backgroundColor"
        [style.border-color]="tempBorderColor || borderColor"
      >
        <span class="ng-alert-bar-text" [style.color]="tempTextColor || textColor">
          {{ message }}
          <span *ngIf="showCloseButton" class="ng-alert-close" (click)="onClose()">&times;</span>
        </span>
      </div>
    </div>
  `,
  styleUrls: ['./ng-alertbar.component.css'],
  animations: [slide]
})
export class NgAlertbarComponent implements OnInit, OnDestroy {
  private queue: AlertTrigger[] = [];
  private queuePop = new Subject<AlertTrigger>();

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
  @Input() closeButton = defaultShowCloseButton;
  tempCloseButton: boolean;

  show = false;
  message: string;
  private destroy = new Subject<void>();

  get isFullWidth() {
    if (this.tempWidthMode) {
      return this.tempWidthMode === 'full';
    }
    return this.widthMode === 'full';
  }

  get showCloseButton() {
    if (this.tempCloseButton != null) {
      return this.tempCloseButton;
    }
    return this.closeButton;
  }

  get openEvent() {
    return this.alertBarService.trigger$.pipe(
      switchMap(trigger => {
        const options = trigger.options;
        const showDelay = (options && options.showDelayMs) || this.showDelay;
        return timer(showDelay).pipe(mapTo(trigger));
      }),
      takeUntil(this.destroy)
    );
  }

  get autoCloseEvent() {
    return merge(this.openEvent, this.queuePop).pipe(
      switchMap(({ options }) => {
        const lifeTime = (options && options.lifeTimeMs) || this.lifeTime;
        return timer(lifeTime);
      }),
      takeUntil(this.destroy)
    );
  }

  get cancelEvent() {
    return this.alertBarService.cancel$.pipe(takeUntil(this.destroy));
  }

  get alertLeaveTimer() {
    return timer(ALERT_LEAVE_ANIMATION_DURATION).pipe(take(1));
  }

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.openEvent.subscribe(trigger => this.onTrigger(trigger));
    this.queuePop.subscribe(trigger => this.showAlert(trigger));
    this.autoCloseEvent.subscribe(() => this.onClose());
    this.cancelEvent.subscribe(() => this.onClose());
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  private onTrigger(trigger: AlertTrigger) {
    if (this.show) {
      this.queue.push(trigger);
      return;
    }
    this.showAlert(trigger);
  }

  /**
   * Sets up temp variables and shows the alert
   * @param trigger The trigger to display
   */
  private showAlert(trigger: AlertTrigger) {
    this.clearTempOptions(); // Clear previous temporary options
    this.message = trigger.message;
    this.show = true;
    this.assignTempOptions(trigger.options);
  }

  /**
   * Closes any open alert. If there are any alerts waiting in the queue,
   * the alert is popped off the queue and emitted for opening
   */
  onClose() {
    this.closeAlert();
    if (this.queue.length > 0) {
      this.alertLeaveTimer.subscribe(() => {
        this.queuePop.next(this.queue.shift());
      });
    }
  }

  private closeAlert() {
    this.show = false;
  }

  /**
   * Clears out any temporary config options so that they
   * do not persist beyond their single use
   */
  private clearTempOptions(): void {
    this.tempBackgroundColor = null;
    this.tempBorderColor = null;
    this.tempTextColor = null;
    this.tempWidthMode = null;
    this.tempCloseButton = null;
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
    this.tempCloseButton = options.closeButton;
  }
}
