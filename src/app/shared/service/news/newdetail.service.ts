import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class NewDetailService{
  baseUrlApi = null;

  constructor( private http: HttpClient) {
    this.baseUrlApi = environment.apiUrl;

  }

  getCommentUser(id, ACCESS_TOKEN){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.get(`${this.baseUrlApi}/api/v1/user?userId=${id}` , {headers});
  }
  getNewDetail(id , ACCESS_TOKEN){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.get(`${this.baseUrlApi}/api/v1/article/articleId?articleId=${id}` , {headers});

  }
  clickLike(id, ACCESS_TOKEN){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.post(`${this.baseUrlApi}/api/v1/like`, id , {headers});
  }

  pressComment(body, ACCESS_TOKEN):Observable<any>{
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.post<any>(`${this.baseUrlApi}/api/v1/comment` , body, {headers} );
  }
}
