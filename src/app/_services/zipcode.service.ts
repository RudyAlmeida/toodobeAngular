import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { delay, map } from "rxjs/operators";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class ZipcodeService {
  constructor(private http: HttpClient) {}

  checkZipCode(cep: string) {
    return this.http
      .get<any>(`//viacep.com.br/ws/${cep}/json/`)
      .pipe(delay(1000))
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
