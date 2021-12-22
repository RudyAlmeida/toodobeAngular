import { FormGroup } from "@angular/forms";
export class PisPasepValidators {
  static validatePisPasep(group: FormGroup) {
    const pis = group.controls["pis"];

    let ftap = "3298765432";
    let total = 0;
    let resto: any = 0;
    let numPIS = "";
    let strResto = "";

    numPIS = pis.value;

    if (!numPIS) {
      return null;
    }

    for (let i: number = 0; i <= 9; i++) {
      let resultado =
        parseInt(numPIS.slice(i, i + 1)) * parseInt(ftap.slice(i, i + 1));
      total = total + resultado;
    }

    resto = total % 11;

    if (resto != 0) {
      resto = 11 - resto;
    }

    if (resto == 10 || resto == 11) {
      strResto = resto + "";
      resto = strResto.slice(1, 2);
    }

    if (resto != numPIS.slice(10, 11)) {
      pis.setErrors({ pis: true });
    }

    return null;
  }
}
