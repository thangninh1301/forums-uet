import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class updateListConvTranfer {

  constructor() { }
  
  @Output() onUpdate = new EventEmitter<boolean>();
  // bắt sự kiện thay đổi conv id
  changeListConv(){
    this.onUpdate.emit(true);
  }
}