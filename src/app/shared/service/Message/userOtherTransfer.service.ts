import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class userOtherTransferService {

  constructor() { }
  
  @Output() userNameOtherTransfer = new EventEmitter<any>();
  @Output() emailOtherTransfer = new EventEmitter<any>();
  @Output() phoneOtherTransfer = new EventEmitter<any>();
  // bắt sự kiện thay đổi id
  transferUsername(name){
    this.userNameOtherTransfer.emit(name);
  }
  
  transferEmail(email){
    this.emailOtherTransfer.emit(email);
  }
  transferPhone(phone){
    this.phoneOtherTransfer.emit(phone);
  }
}