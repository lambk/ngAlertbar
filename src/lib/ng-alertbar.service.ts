import { Subject } from 'rxjs';

export class NgAlertbarService {
  private _trigger = new Subject<string>();
  trigger$ = this._trigger.asObservable();

  constructor() {}

  triggerAlert(message: string) {
    this._trigger.next(message);
  }
}
