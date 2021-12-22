import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Server } from '../_models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServerService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Server[]>(`${environment.apiUrl}/servers`);
    }

    getById(id: String) {
        return this.http.get(`${environment.apiUrl}/servers/${id}`);
    }

    register(server: Server) {
        return this.http.post(`${environment.apiUrl}/servers`, server);
    }

    update(id: String, server: Server) {
        return this.http.put(`${environment.apiUrl}/servers/${id}`, server);
    }

    delete(id: String) {
        return this.http.delete(`${environment.apiUrl}/servers/${id}`);
    }
}