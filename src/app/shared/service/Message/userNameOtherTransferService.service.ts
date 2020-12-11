import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class userNameOtherTransferService {

  constructor() { }
  
  @Output() UserNameOther = new EventEmitter<any>();
  // bắt sự kiện thay đổi tên người trong cuộc trò chuyện
  changeUserNameOther(name){
    this.UserNameOther.emit(name);
  }
}