import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class idUserTransferService {

  constructor() { }
  
  @Output() idUser = new EventEmitter<any>();
  // bắt sự kiện thay đổi conv id
  changeIdUser(id){
    this.idUser.emit(id);
  }
}