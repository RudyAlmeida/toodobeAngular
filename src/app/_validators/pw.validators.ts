import { FormGroup } from "@angular/forms";
export class PWChangeValidators {
  static newMatchesConfirm(group: FormGroup) {
    var confirm = group.controls["confirm"];
    if (confirm.value && group.controls["password"].value !== confirm.value)
      confirm.setErrors({ newMatchesConfirm: true });
    return null;
  }
}
