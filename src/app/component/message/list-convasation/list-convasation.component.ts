import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '../../../shared/service/account/account.service'
import { StringeeService } from "../../../shared/service/Message/stringee.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { idConvTransferService } from "../../../shared/service/Message/idConvTransferService.service"
import { idUserTransferService } from "../../../shared/service/Message/idUserTransferService.service"
import { updateListConvTranfer } from "../../../shared/service/Message/updateListConvTranfer.service";
import { ConvidFocusService } from "../../../shared/service/Message/ConvidFocusService.service";
import {updateAsReadTransfer} from "../../..//shared/service/Message/updateAsReadTransfer.service"
import {createdGroupChatTransfer} from "../../../shared/service/Message/createdGroupChatTransfer.service"
import {groupChatNameTransferService} from "../../../shared/service/Message/groupChatNameTransfer.service"
import {listAllUserTransferService} from "../../../shared/service/Message/listAllUserTransfer.service";

@Component({
  selector: 'app-list-convasation',
  templateUrl: './list-convasation.component.html',
  styleUrls: ['./list-convasation.component.scss']
})
export class ListConvasationComponent implements OnInit {
  listUser = null;
  checkChangeList = 1;
  // convasation = null;
  searchFriend: any;
  userNameLogin: any;
  idUser: any;
  timer: any;
  test = null;
  focus: any // nhận id convs bên message để focus
  @Input() convasation: any; // mảng chứa convs

  constructor(
    private accountService: AccountService,
    private stringeeService: StringeeService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private idConvTransferService: idConvTransferService,
    private idUserTransferService: idUserTransferService,
    private updateListConvTranfer: updateListConvTranfer,
    private ConvidFocusService: ConvidFocusService,
    private updateAsReadTransfer: updateAsReadTransfer,
    private createdGroupChatTransfer : createdGroupChatTransfer,
    private groupChatNameTransferService: groupChatNameTransferService,
    private listAllUserTransferService: listAllUserTransferService,
  ) { }

  ngOnInit(): void {

    // bắt sự kiện Url thay đổi
    this._activeRoute.paramMap.subscribe(x => {
      this.getUpdateListConv();
      this.getEventAsRead();
    });
    // this.getConv();
    this.getIdUserMaster();
    this.getFocus();

    // this.stringeeService.Connect(localStorage.getItem("tokenAccess"));
    // // update profile lên stringee
    // this.stringeeService.stringeeClient.on('connect', (res) => {
    //   this.stringeeService.listentUpdate(localStorage.getItem("tokenAccess"));
    // });

  }

  /**
   * click icon để mở form tạo group chat
   */
  openGroupChat(){
    this.createdGroupChatTransfer.changeAsRead();
  }

  /**
   * bắt sự kiện click vào input để thực hiện đánh dấu là đã đọc
   */
  getEventAsRead(){
    this.updateAsReadTransfer.onAsRead.subscribe(data =>{
      this.stringeeService.markConversationAsRead(this.focus);
    })
  }

  // bắt sự kiện thay đổi id từ bên message để thực hiện focus vào cuộc trò chuyện
  getFocus() {
    this.ConvidFocusService.convid.subscribe(data => {
      this.focus = data;
    });
  }

  /**
   * lấy userName người đăng nhập
   */
  getIdUserMaster() {
    // this.idUser = this.stringeeService.getCurrentUserIdFromAccessToken(localStorage.getItem("tokenAccess"));
    this.idUser = this.accountService.userValue._id;
    this.userNameLogin = this.accountService.userValue.fullName;
    console.log(this.userNameLogin);
  }

  /**
   * get danh sách convasation
   */
  getConv() {
    this.stringeeService.getLastConversation((status, code, message, convs) => {
      this.convasation = convs;
    });
  }

  /**
   * bắt sự kiện update list convs bên mesage
   */
  getUpdateListConv() {
    this.updateListConvTranfer.onUpdate.subscribe(data => {
      this.getConv();
    });

  }

  /**
   * get danh sách user
   */
  getUser() {
    var token = this.accountService.userValue.accessToken;
    this.accountService.getAll(token).pipe(first()).subscribe(users => {
      var data = users["data"]
      this.listUser = data["Users"];
    })
  }

  /***
   * tạo cuộc trò chuyện khi click vào list user
   *  search input
   */
  @ViewChild('searchInput') searchInput: ElementRef;
  CreateConv(user) {
    // bỏ giá trị ô search khi đã click vào user
    this.searchInput.nativeElement.value = "";
    // đổi đường link trên thanh Url
    this.stringeeService.creatAConversation(user._id, (status, code, message, conv) => {
      this._router.navigate(['/message/convasation/' + conv.id]);
    });

    this.checkChangeList = 1;
    // truyền id user người cần trò chuyện sang bên chat
    this.idUserTransferService.changeIdUser(user._id);

    // this.accountService.getById(user._id, localStorage.getItem("tokenAccess"))
    //   .subscribe(users => {
    //     this.test = users.data.user;
    //     debugger
    //   });

  }

  /**
   * khi mở một cuộc trò chuyện
   */
  choseConvid(conv) {
    conv.unreadCount = 0;
    if(!conv.isGroup){
      for (let user of conv.participants) {
        if (user.userId != this.idUser) {
          this.idUserTransferService.changeIdUser(user.userId);
          break;
        }
      }
    }else{
      this.groupChatNameTransferService.changeGroupChat(conv.name);
    }
    
    this.idConvTransferService.changeConvid(conv.id);
    this.stringeeService.markConversationAsRead(conv.id);
  }

  /**
   * tính thời gian chênh lệch của khi gửi tin nhắn và hiện tại
   */
  calculateTime(time: any) {
    let changeTime = new Date(time);
    let date2 = new Date();
    this.timer = Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(changeTime.getFullYear(), changeTime.getMonth(), changeTime.getDate())) / (1000 * 60 * 60 * 24));
    if (this.timer <= 1) {
      return 1;
    } else if (this.timer > 1 && this.timer <= 7) {
      return 2;
    } else {
      return 3;
    }
  }

  /**
   * lấy danh sách người dùng
   */
  listFriend() {
    this.checkChangeList = 2;
    this.getUser();
  }

  /**
   * lấy danh sách cuộc trò chuyện
   */
  listConv() {
    this.checkChangeList = 1;
  }


}
