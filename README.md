# ngAlertbar

A configurable alertbar for Angular

## Installation

1. Install using npm

```
npm install --save ng-alertbar
```

2. Add the `themes/default.css` stylesheet to your angular.json styles array

3. Import `NgAlertBarModule` into your angular module

```
@NgModule({
  imports: [..., NgAlertbarModule.forRoot()]
})
```

4. Add the alertbar component to your app template

```
  <ng-alertbar [lifeTime]="3000" ...></ng-alertbar>
```

5. Inject `NgAlertBarService` and call `triggerAlert(...)`

```
constructor(private alertBarService: NgAlertBarService) {}

ngOnInit() {
  const options: AlertOptions = {...};
  this.alertBarService.triggerAlert('Custom message', options);
}
```

## Options

| Option Name           | Description                                                                                                                                                               | Type                                                                                              | Default                                           | Required |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------- |
| queueing (component)  | boolean                                                                                                                                                                   | Whether to add incoming alert triggers to a queue for later display if an alert is currently open | true                                              |          |
| bypassQueue (trigger) | Whether the alert should not respect the queueing process. If set to false, the alert will be displayed immediately upon trigger even if another alert is currently shown | boolean                                                                                           | false                                             |          |
| lifeTime              | The time in ms between the alert opening and auto-closing. If the lifetime is set to 0, the alert will not autoclose                                                      | number                                                                                            | 5000                                              |          |
| showDelay             | The time in ms between the alert trigger firing and the alert showing                                                                                                     | number                                                                                            | 100                                               |          |
| backgroundColor       | The background color of the alert                                                                                                                                         | string                                                                                            | 'linear-gradient(to top right, #9ce29c, #c9f9b9)' |          |
| borderColor           | The border color of the alert                                                                                                                                             | string                                                                                            | '#34a40e'                                         |          |
| textColor             | The color of the alert text                                                                                                                                               | string                                                                                            | 'black'                                           |          |
| widthMode             | 'full': The alert will take up the whole width of the container<br /> 'partial': The alert will only use the space required                                               | 'full' \| 'partial'                                                                               | 'partial'                                         |          |
| html                  | Whether to inject the provided message as html or render it as plaintext                                                                                                  | boolean                                                                                           | false                                             |          |

Note: Options denoted with (component) can only be applied as a component input, whereas options denoted with (trigger) can only be applied to individual alert triggers
