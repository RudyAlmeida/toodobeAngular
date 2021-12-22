import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Billings } from "../_models";

@Injectable({ providedIn: "root" })
export class BillingsService {
  constructor(private http: HttpClient) {}

  list(pageIndex: number, pageSize: number, search: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/billings/list?per_page=${pageSize}&page=${pageIndex}&search=${search}`
    );
  }

  get(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/billings/${id}`);
  }

  delete(id: string) {
    return this.http.delete<any>(
      `${environment.apiUrl}/billings/destroy/${id}`
    );
  }

  save(id: string, data: Billings) {
    if (id) {
      return this.http.post<any>(
        `${environment.apiUrl}/billings/update/${id}`,
        data
      );
    }

    return this.http.post<any>(`${environment.apiUrl}/billings/create`, data);
  }
}
