import { AlertOptions, AlertTrigger } from 'projects/ng-alertbar/src/lib/interface';
import { Subject } from 'rxjs';

export class NgAlertbarService {
  private _trigger = new Subject<AlertTrigger>();
  trigger$ = this._trigger.asObservable();

  constructor() {}

  /**
   * Triggers an alert with the given message and options
   *
   * If no options are passed, the alert will use the existing component configuration
   *
   * The options provided will only apply to the alert that opens from this trigger
   *
   * @param message The message to display within the alert
   * @param options One off alert options to apply for this alert instance
   */
  triggerAlert(message: string, options?: AlertOptions) {
    this._trigger.next({ message: message, options: options });
  }
}
