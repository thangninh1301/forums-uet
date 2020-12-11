import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {User} from "../../model/Account/Users";

@Injectable({
  providedIn: 'root'
})

export class NewManageService{

  constructor( private http: HttpClient) {

  }

  getNewManage(ACCESS_TOKEN){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.get<User[]>(`${environment.apiUrl}/api/v1/article?offset=0&limit=10` , {headers});

  }
}
