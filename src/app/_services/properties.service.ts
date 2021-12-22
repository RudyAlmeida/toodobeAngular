import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Properties } from "../_models";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class PropertiesService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(
      `${environment.apiUrl}/properties/list?per_page=100&page=1`
    );
  }

  getById(id: String) {
    return this.http.get(`${environment.apiUrl}/properties/${id}`);
  }

  register(properties: Properties) {
    return this.http.post(
      `${environment.apiUrl}/properties/create`,
      properties
    );
  }

  update(id: String, properties: Properties) {
    return this.http.put(
      `${environment.apiUrl}/properties/update/${id}`,
      properties
    );
  }

  save(id: string, properties: Properties) {
    if (id) {
      return this.update(id, properties);
    }

    return this.register(properties);
  }

  delete(id: String) {
    return this.http.delete(`${environment.apiUrl}/properties/destroy/${id}`);
  }
}
