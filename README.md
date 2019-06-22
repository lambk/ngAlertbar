# ngAlertbar

A configurable alertbar for Angular

## Installation

1. Install using npm

```
npm install --save ng-alertbar
```

2. Add the `themes/default.css` stylesheet to your angular.json

3. Import `NgAlertBarModule` into your angular module

```
@NgModule({
  imports: [..., NgAlertbarModule.forRoot()]
})
```

4. Inject `NgAlertBarService` and call `triggerAlert(...)`

```
constructor(private alertBarService: NgAlertBarService) {}

ngOnInit() {
  const options: AlertOptions = {...};
  this.alertBarService.triggerAlert('Custom message', options);
}
```

## Options

| Option Name     | Description                                                                                                                 | Type                | Default                                           | Required |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------- | -------- |
| lifeTime        | The time in ms between the alert opening and auto-closing                                                                   | number              | 5000                                              |          |
| showDelay       | The time in ms between the alert trigger firing and the alert showing                                                       | number              | 100                                               |          |
| backgroundColor | The background color of the alert                                                                                           | string              | 'linear-gradient(to top right, #9ce29c, #c9f9b9)' |          |
| borderColor     | The border color of the alert                                                                                               | string              | '#34a40e'                                         |          |
| textColor       | The color of the alert text                                                                                                 | string              | 'black'                                           |          |
| widthMode       | 'full': The alert will take up the whole width of the container<br /> 'partial': The alert will only use the space required | 'full' \| 'partial' | 'partial'                                         |          |
