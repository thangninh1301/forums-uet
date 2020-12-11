import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class idConvTransferService {

  constructor() { }
  
  @Output() convid = new EventEmitter<any>();
  // bắt sự kiện thay đổi conv id
  changeConvid(id){
    this.convid.emit(id);
  }
}