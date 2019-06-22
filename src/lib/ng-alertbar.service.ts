import { Subject } from 'rxjs';

export class NgAlertbarService {
  private _trigger = new Subject<void>();
  trigger$ = this._trigger.asObservable();

  constructor() {}

  triggerAlert() {
    this._trigger.next();
  }
}
