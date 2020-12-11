import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import {FileSave} from "../../model/Message/File";
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PostFileService {

  constructor(private route: Router,
    private http: HttpClient) { }

    /**
     * api luwu file
     * @param file 
     * @param ACCESS_TOKEN 
     */
  saveFile(file : FileSave , ACCESS_TOKEN) {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.post(`${environment.apiUrl}/api/v1/file/save`, file, {headers});
  }

  /**
   * 
   * @param file api get file theo convId
   * @param ACCESS_TOKEN 
   */
  getFileByConvId(convid : any , ACCESS_TOKEN) {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + ACCESS_TOKEN });
    return this.http.get(`${environment.apiUrl}/api/v1/file/convId?convId=${convid}`, {headers});
  }

//   getFileById(convid: any) {
//     return this.http.get<FileSave>(`${environment.apiUrl}/api/Files/${convid}`);
// }

}
