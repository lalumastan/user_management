import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "../model/user.model";
import { Observable } from "rxjs/internal/Observable";
import { ApiResponse } from "../model/api.response";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {}

  baseUrlPrefix: string = "http://localhost:8080/";
  authUrl: string = this.baseUrlPrefix + "auth/";
  userUrl: string = this.baseUrlPrefix + "users/";

  login(loginPayload: Object): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.authUrl + "login",
      loginPayload
    );
  }

  getUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.userUrl);
  }

  getUserById(_id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.userUrl + _id);
  }

  createUser(user: User): Observable<ApiResponse> {    
    return this.http.post<ApiResponse>(this.userUrl + "add", user);
  }

  updateUser(user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.userUrl + "update", user);
  }

  deleteUser(_id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.userUrl + "delete/" + _id);
  }

  logout(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.authUrl + "logout");
  }
}
