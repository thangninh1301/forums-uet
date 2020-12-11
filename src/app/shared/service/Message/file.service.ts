import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor( private httpClient : HttpClient) { }

  saveFileToServer(file , ACCESS_TOKEN ):Observable<any>{
    const headers = new HttpHeaders({ "X-STRINGEE-AUTH": ACCESS_TOKEN });
    return this.httpClient.post<any>('https://api.stringee.com/v1/file/upload?uploadType=multipart', file , { headers } );
  }
}
