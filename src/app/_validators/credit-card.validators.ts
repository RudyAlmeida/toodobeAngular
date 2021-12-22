import {
  Directive,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  NG_ASYNC_VALIDATORS,
  Validator,
  AbstractControl,
} from "@angular/forms";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Directive({
  selector: "[appCreditCardValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => CreditCardValidators),
      multi: true,
    },
  ],
})
export class CreditCardValidators implements Validator {
  @Input() initialEmail: string;
  @Input() validateOnlyDifferentEmails: boolean;
  @Output() selectedFlag: EventEmitter<any> = new EventEmitter();

  constructor() {}

  getCardFlag(cardnumber): Observable<string> {
    cardnumber = cardnumber.replace(/[^0-9]+/g, "");

    const cards = {
      visa: /^4[0-9]{12}(?:[0-9]{3})/,
      mastercard: /^5[1-5][0-9]{14}/,
      diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
      amex: /^3[47][0-9]{13}/,
      hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
      elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})/,
      jcb: /^(?:2131|1800|35\d{3})\d{11}/,
    };

    for (let flag in cards) {
      if (cards[flag].test(cardnumber)) {
        return of(flag);
      }
    }

    return of("");
  }

  validate(c: AbstractControl): Observable<{ [key: string]: any }> {
    if (c.value && c.value.length === 16) {
      this.selectedFlag.emit("");
      return this.getCardFlag(c.value).pipe(
        map((flag) => {
          this.selectedFlag.emit(flag);
          if (!flag) {
            return {
              invalidNumber: true,
            };
          }
          return null;
        })
      );
    }

    return of();
  }
}
