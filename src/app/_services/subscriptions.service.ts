import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Subscriptions } from "../_models";

@Injectable({ providedIn: "root" })
export class SubscriptionsService {
  constructor(private http: HttpClient) {}

  list(pageIndex: number, pageSize: number, search: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/subscriptions/list?per_page=${pageSize}&page=${pageIndex}&search=${search}`
    );
  }

  get(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/subscriptions/${id}`);
  }

  delete(id: string) {
    return this.http.delete<any>(
      `${environment.apiUrl}/subscriptions/destroy/${id}`
    );
  }

  save(id: string, data: Subscriptions) {
    if (id) {
      return this.http.post<any>(
        `${environment.apiUrl}/subscriptions/update/${id}`,
        data
      );
    }

    return this.http.post<any>(
      `${environment.apiUrl}/subscriptions/create`,
      data
    );
  }
}
