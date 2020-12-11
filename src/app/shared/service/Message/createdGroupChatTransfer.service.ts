import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class createdGroupChatTransfer {

  constructor() { }
  
  @Output() isDisplay = new EventEmitter<boolean>();
  // bắt sự kiện thay đổi conv id
  changeAsRead(){
    this.isDisplay.emit(true);
  }
}