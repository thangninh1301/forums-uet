import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvidFocusService {

  constructor() { }
  
  @Output() convid = new EventEmitter<any>();
  // bắt sự kiện thay đổi conv id
  changeConvidFocus(id){
    this.convid.emit(id);
  }
}