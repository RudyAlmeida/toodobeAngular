import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { RegisterFormsList } from "../_models";

@Injectable({ providedIn: "root" })
export class RegisterService {
  constructor(private http: HttpClient) {}

  getAllRegistrationForm() {
    return this.http.get<any[]>(`${environment.apiUrl}/registration-form/list`);
  }

  getFormsByPath(
    path: string,
    pageIndex: number,
    pageSize: number,
    search: string
  ) {
    return this.http.get<RegisterFormsList>(
      `${environment.apiUrl}${path}?per_page=${pageSize}&page=${pageIndex}&search=${search}`
    );
  }

  getFormsByPathAndId(path: string, id: string) {
    return this.http.get<RegisterFormsList>(
      `${environment.apiUrl}${path}/${id}`
    );
  }

  getByIdRegistrationForm(id: String) {
    return this.http.get(`${environment.apiUrl}/registration-form/${id}`);
  }

  registerRegistrationForm(data) {
    return this.http.post(
      `${environment.apiUrl}/registration-form/create`,
      data
    );
  }

  updateRegistrationForm(id: string, data) {
    return this.http.post(
      `${environment.apiUrl}/registration-form/update/${id}`,
      data
    );
  }

  saveRegistrationForm(id: string, data: any) {
    if (id) {
      return this.updateRegistrationForm(id, data);
    } else {
      return this.registerRegistrationForm(data);
    }
  }

  deleteRegistrationForm(id: String) {
    return this.http.delete(
      `${environment.apiUrl}/registration-form/destroy/${id}`
    );
  }

  registerBanckInformationForm(data) {
    return this.http.post(`${environment.apiUrl}/bank/create`, data);
  }

  updateBanckInformationForm(id: string, data) {
    return this.http.post(`${environment.apiUrl}/bank/update/${id}`, data);
  }

  deleteBanckInformationForm(id: String) {
    return this.http.delete(`${environment.apiUrl}/bank/destroy/${id}`);
  }

  saveBanckInformationForm(id: string, data: any) {
    if (id) {
      return this.updateBanckInformationForm(id, data);
    } else {
      return this.registerBanckInformationForm(data);
    }
  }

  registerProjectsForm(data) {
    return this.http.post(`${environment.apiUrl}/projects/create`, data);
  }

  updateProjectsForm(id: string, data) {
    return this.http.post(`${environment.apiUrl}/projects/update/${id}`, data);
  }

  deleteProjectsForm(id: String) {
    return this.http.delete(`${environment.apiUrl}/projects/destroy/${id}`);
  }

  deleteByPathAndId(path: string, id: string) {
    return this.http.delete<RegisterFormsList>(
      `${environment.apiUrl}${path}/destroy/${id}`
    );
  }

  saveProjectsForm(id: string, data: any) {
    if (id) {
      return this.updateProjectsForm(id, data);
    } else {
      return this.registerProjectsForm(data);
    }
  }
}
