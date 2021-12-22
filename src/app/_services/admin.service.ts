import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AdminService {
  constructor(private http: HttpClient) {}

  listUsers(pageIndex: number, pageSize: number, search: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/admin/users/list?per_page=${pageSize}&page=${pageIndex}&search=${search}`
    );
  }

  getUser(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/admin/users/${id}`);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(
      `${environment.apiUrl}/admin/users/destroy/${id}`
    );
  }

  saveUser(id: string, data: any) {
    if (id) {
      return this.http.post<any>(
        `${environment.apiUrl}/admin/users/update/${id}`,
        data
      );
    }

    return this.http.post<any>(
      `${environment.apiUrl}/admin/users/create`,
      data
    );
  }
}
