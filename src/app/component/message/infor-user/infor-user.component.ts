import { Component, Input, OnInit, ViewChild , ElementRef, HostListener} from '@angular/core';
import {userOtherTransferService} from "../../../shared/service/Message/userOtherTransfer.service"
import {ActivatedRoute} from "@angular/router";
import { first } from 'rxjs/operators';
import {PostFileService} from "../../../shared/service/Message/post-file.service";
import {AccountService} from "../../../shared/service/account/account.service";
import {updateListConvTranfer} from "../../../shared/service/Message/updateListConvTranfer.service"

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.scss']
})

export class InforUserComponent implements OnInit {

  checkFile = true;
  checkImg = true;
  // friends : Friend;
  imgsrc : string;
  checkZoom = false;
  idUserInfor : any ; // lấy id user phía bên kia
  // userInfor = null; // user phía bên nhận
  fileSave : any;

   @Input() userInfor = null;
  name : any;
  phone: any;
  email : any;

  constructor( 
    private userOtherTransferService: userOtherTransferService,
    private activatedRoute: ActivatedRoute,
    private postFileService : PostFileService,
    private accountService: AccountService,
    private updateListConvTranfer: updateListConvTranfer
    ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(x => {
      this.getFile();
      this.getUpdate();
      this.userOtherTransferService.userNameOtherTransfer.subscribe(data => {
        this.name = data;
      });
      this.userOtherTransferService.emailOtherTransfer.subscribe(data =>{
        this.email = data;
      });
      this.userOtherTransferService.phoneOtherTransfer.subscribe(data =>{
        this.phone = data;
      });
    });
  }

  /**
   * get file trong cuộc hội thoại
   */
  getFile(){
    const idUrl = this.activatedRoute.snapshot.paramMap.get('id');
    this.postFileService.getFileByConvId(idUrl , this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {
      var dataInit = data['data'];
      this.fileSave = dataInit['file'];
      
    });
  }

   /**
    * bắt sự kiện update bên message
    */
   getUpdate(){
    this.updateListConvTranfer.onUpdate.subscribe(data => {
      this.getFile();
    });
  }
   // ẩn hiện phần xem các file trong đoạn hội thoại
   showFile(){
    this.checkFile = !this.checkFile;
  }
  showImg(){
    this.checkImg = !this.checkImg;
  }

  // zoom img
  getClickImg(src){
    this.checkZoom = true;
    this.imgsrc = src;
  }
  // bỏ zoom img khi click
  UnZoom(){
    this.checkZoom = false;
  }
  
  // download file
  downloadFile(src : string , name:string){
    FileSaver.saveAs(src , name);
  }

  // // thanh cuộn
    ngAfterViewChecked() {
      this.scrollBottom();
      this.scrollBottom_2();
    }
    @ViewChild('scrollMe') private scroll: ElementRef;
    scrollBottom() {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }
    @ViewChild('scrollMe_2') private scroll_2: ElementRef;
    scrollBottom_2() {
      this.scroll_2.nativeElement.scrollTop = this.scroll_2.nativeElement.scrollHeight;
    }
  
     // nhấn esc để thay đổi biến checkZoom thành false để thoát zoom ảnh
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.checkZoom = false;
  }


}
