import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Profile, User } from "../_models";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: String) {
    return this.http.get(`${environment.apiUrl}/users/${id}`);
  }

  register(user: Profile) {
    let formData = new FormData();
    if (user.user_image) {
      formData.append("user_image", user.user_image);
    }
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("password_confirmation", user.password_confirmation);
    formData.append("mobile", user.mobile);
    formData.append("registry_code", user.registry_code);
    formData.append("birthday", user.birthday);
    formData.append("address_city", user.address_city);
    formData.append("address_state", user.address_state);
    formData.append("address_country", user.address_country);

    return this.http.post(`${environment.apiUrl}/profile/update`, formData);
  }

  update(user: User) {
    return this.http.put(`${environment.apiUrl}/profile/update`, user);
  }

  delete(id: String) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
