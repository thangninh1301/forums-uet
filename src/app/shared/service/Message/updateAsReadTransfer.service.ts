import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class updateAsReadTransfer {

  constructor() { }
  
  @Output() onAsRead = new EventEmitter<boolean>();
  // bắt sự kiện thay đổi conv id
  changeAsRead(){
    this.onAsRead.emit(true);
  }
}