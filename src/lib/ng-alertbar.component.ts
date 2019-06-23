import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { delayWhen, switchMap, takeUntil } from 'rxjs/operators';
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
import { AlertOptions } from './interface';
import { NgAlertbarService } from './ng-alertbar.service';

@Component({
  selector: 'ngab-alert-bar',
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
          <span *ngIf="showCloseButton" class="ng-alert-close" (click)="close()">&times;</span>
        </span>
      </div>
    </div>
  `,
  styleUrls: ['./ng-alertbar.component.css'],
  animations: [slide]
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
      delayWhen(({ options }) => {
        const showDelay = (options && options.showDelayMs) || this.showDelay;
        return timer(showDelay);
      }),
      takeUntil(this.destroy)
    );
  }

  get autoCloseEvent() {
    return this.alertBarService.trigger$.pipe(
      switchMap(({ options }) => {
        const showDelay = (options && options.showDelayMs) || this.showDelay;
        const lifeTime = (options && options.lifeTimeMs) || this.lifeTime;
        return timer(showDelay + lifeTime);
      }),
      takeUntil(this.destroy)
    );
  }

  get cancelEvent() {
    return this.alertBarService.cancel$.pipe(takeUntil(this.destroy));
  }

  constructor(private alertBarService: NgAlertbarService) {}

  ngOnInit() {
    this.openEvent.subscribe(trigger => {
      this.message = trigger.message;
      this.show = true;
      this.clearTempOptions(); // Clear previous temporary options
      this.assignTempOptions(trigger.options);
    });
    this.autoCloseEvent.subscribe(() => this.close());
    this.cancelEvent.subscribe(() => this.close());
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

  close() {
    this.show = false;
  }
}
