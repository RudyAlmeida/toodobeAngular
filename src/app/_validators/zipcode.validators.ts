import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  FormControl,
  ValidationErrors,
} from "@angular/forms";

import { AlertService, ZipcodeService } from "../_services";

export class ZipCodeValidators {
  static varifyZipCode(
    form: FormGroup,
    zipcodeService: ZipcodeService,
    alertService: AlertService
  ) {
    return (input: FormControl, formGroup: FormControl) => {
      // var zipcode = group.controls["address_zipcode"];
      if (input.value && input.value.length === 9) {
        return zipcodeService.checkZipCode(input.value).subscribe(
          (data: any) => {
            if (data.erro) {
              alertService.error("Ops!!! não encontramos o CEP informado.");
              // zipcode.setErrors({ zipcode: true });
              return { zipcode: true };
            }
            form.setValue({
              address_city: data.localidade,
              address_state: data.uf,
              address_neighborhood: data.bairro,
            });

            return null;
          },
          () => {
            form.setValue({
              address_city: "Areiópolis",
              address_state: "SP",
              address_neighborhood: "Targa",
            });
            alertService.error(
              "Ops!!! não conseguimos verificar seu CEP agora, por favor tente novamente mais tarde."
            );
          }
        );
      }
      return null;
    };
  }
}
