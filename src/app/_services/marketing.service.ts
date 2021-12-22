import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class MarketingService {
  constructor(private http: HttpClient) {}

  list(perPage: number = 100, search: string = "", page: number = 1) {
    return this.http.get<any>(
      `${environment.apiUrl}/marketing/list?per_page=${perPage}&search=${search}&page=${page}`
    );
  }
}
