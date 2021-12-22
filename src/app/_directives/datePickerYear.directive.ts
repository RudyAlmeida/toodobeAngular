import {
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Directive,
} from "@angular/core";

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY",
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "YYYY",
    monthYearA11yLabel: "YYYY",
  },
};

@Directive({
  selector: "[myDatepicker]",
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePicker {
  @Input() value = "";
  @Input() minimumDate: boolean = false;
  @Output() dateChange = new EventEmitter();

  constructor(public el: ElementRef) {}
  ngOnInit() {}
}
