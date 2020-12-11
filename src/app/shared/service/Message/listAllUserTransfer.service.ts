import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class listAllUserTransferService {

  constructor() { }
  
  @Output() listUser = new EventEmitter<any>();
  // bắt sự kiện thay đổi conv id
  getListUser(listUser){
    this.listUser.emit(listUser);
  }
}