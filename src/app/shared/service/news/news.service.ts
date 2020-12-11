import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {User} from "../../model/Account/Users";

@Injectable({
  providedIn: 'root'
})

export class NewService{

  constructor( private http: HttpClient) {

  }

  getNews(ACCESS_TOKEN){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.get<User[]>(`${environment.apiUrl}/api/v1/article?offset=0&limit=10` , {headers});

  }
}
