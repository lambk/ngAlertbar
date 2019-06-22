import { animate, style, transition, trigger } from '@angular/animations';

const slide = trigger('slide', [
  transition(':enter', [style({ transform: 'translateY(-100%)' }), animate('300ms ease-out')]),
  transition(':leave', [animate('200ms ease-in', style({ transform: 'translateY(-100%' }))])
]);

export { slide };
