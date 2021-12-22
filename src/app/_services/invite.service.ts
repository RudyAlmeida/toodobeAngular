import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class InviteService {
  constructor(private http: HttpClient) {}

  list(perPage: number = 100, search: string = "", page: number = 1) {
    return this.http.get<any>(
      `${environment.apiUrl}/invite/list?per_page=${perPage}&search=${search}&page=${page}`
    );
  }

  delete(id: String) {
    return this.http.delete(`${environment.apiUrl}/invite/destroy/${id}`);
  }

  create(data) {
    return this.http.post(`${environment.apiUrl}/invite/create`, data);
  }
}
