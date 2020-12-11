import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class groupChatNameTransferService {

  constructor() { }
  
  @Output() groupName = new EventEmitter<any>();
  // bắt sự kiện thay đổi tên nhóm
  changeGroupChat(Name){
    this.groupName.emit(Name);
  }
}