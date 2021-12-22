import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { Documents } from "../_models";

@Injectable({ providedIn: "root" })
export class DocumentsService {
  constructor(private http: HttpClient) {}

  list(pageIndex: number, pageSize: number, search: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/documents-request/list?per_page=${pageSize}&page=${pageIndex}&search=${search}`
    );
  }

  get(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/documents-request/${id}`);
  }

  delete(id: string) {
    return this.http.delete<any>(
      `${environment.apiUrl}/documents-request/destroy/${id}`
    );
  }

  save(id: string, data: Documents) {
    let formData = new FormData();
    formData.append("user_id", data.user_id);
    formData.append("document_name", data.document_name);
    formData.append("document_status", data.document_status);

    if (id) {
      if (data.user_file) {
        formData.append("user_file", data.user_file);
      }
      formData.append("id", data.id);
      return this.http
        .post<any>(
          `${environment.apiUrl}/documents-request/update/${id}`,
          formData,
          {
            reportProgress: true,
            observe: "events",
          }
        )
        .pipe(
          map((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                const progress = Math.round((100 * event.loaded) / event.total);
                return { status: "progress", message: progress };

              case HttpEventType.Response:
                return event.body;
              default:
                return `Unhandled event: ${event.type}`;
            }
          })
        );
    }

    return this.http.post<any>(
      `${environment.apiUrl}/documents-request/create`,
      formData
    );
  }
}
