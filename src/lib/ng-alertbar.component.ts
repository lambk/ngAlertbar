import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { defaults } from 'projects/ng-alertbar/src/lib/defaults';
import { Subject, timer } from 'rxjs';
import { mapTo, switchMap, take, takeUntil } from 'rxjs/operators';
import { slide } from './animations';
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

  @Input() queueing = defaults.queueingEnabled;
  @Input() lifeTime = defaults.lifeTimeMs;
  @Input() showDelay = defaults.showDelayMs;

  @Input() backgroundColor = defaults.backgroundColor;
  tempBackgroundColor: string;
  @Input() borderColor = defaults.borderColor;
  tempBorderColor: string;
  @Input() textColor = defaults.textColor;
  tempTextColor: string;

  @Input() widthMode = defaults.widthMode;
  tempWidthMode: 'full' | 'partial';
  @Input() closeButton = defaults.closeButtonEnabled;
  tempCloseButton: boolean;

  @Output() open = new EventEmitter<AlertTrigger>();
  @Output() close = new EventEmitter<void>();

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

  /**
   * The trigger stream after waiting the specified showDelay since the alert was triggered
   */
  get openTriggerPostDelay$() {
    return this.alertBarService.trigger$.pipe(
      switchMap(trigger => {
        const options = trigger.options;
        const showDelay = (options && options.showDelayMs) || this.showDelay;
        return timer(showDelay).pipe(mapTo(trigger));
      }),
      takeUntil(this.destroy)
    );
  }

  /**
   * The trigger stream after waiting the specified lifetime since the alert opened
   */
  get postAlertLifetime$() {
    return this.open.pipe(
      switchMap(({ options }) => {
        const lifeTime = (options && options.lifeTimeMs) || this.lifeTime;
        return timer(lifeTime);
      }),
      takeUntil(this.destroy)
    );
  }

  /**
   * The service cancel trigger
   */
  get cancelTrigger$() {
    return this.alertBarService.cancel$.pipe(takeUntil(this.destroy));
  }

  /**
   * Timer representing the delay taken for an alert to animate when exiting
   */
  get alertLeaveTimer() {
    return timer(ALERT_LEAVE_ANIMATION_DURATION).pipe(take(1));
  }

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.openTriggerPostDelay$.subscribe(trigger => this.onTrigger(trigger));
    this.queuePop.subscribe(trigger => this.showAlert(trigger));
    this.postAlertLifetime$.subscribe(() => this.onClose());
    this.cancelTrigger$.subscribe(() => this.onClose());
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  private onTrigger(trigger: AlertTrigger) {
    if (this.queueing && !(trigger.options && trigger.options.bypassQueue) && this.show) {
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
    this.assignTempOptions(trigger.options);
    this.message = trigger.message;
    this.show = true;
    this.open.emit(trigger);
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
    this.close.emit();
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
