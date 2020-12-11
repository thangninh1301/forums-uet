import { Component, OnInit } from '@angular/core';
import { StringeeService } from "../../shared/service/Message/stringee.service";
import { AccountService } from "../../shared/service/account/account.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {userNameOtherTransferService} from "../../shared/service/Message/userNameOtherTransferService.service";
import {userOtherTransferService} from "../../shared/service/Message/userOtherTransfer.service"
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  convasation: any; // mảng chưa danh sách các conversation
  messages: any; // mảng chứa tin nhắn của 1 conversation
  idUser: any; // id người đang đăng nhập
  idUrl: any;
  userInfor: any;
  token: any;
  loading = true;

  constructor(
    private stringeeService: StringeeService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userNameOtherTransferService : userNameOtherTransferService,
    private userOtherTransferService: userOtherTransferService,
    ) { }


  ngOnInit(): void {

    // this.test();
    
    this.token = this.accountService.userValue.accessToken;
    this.stringeeService.Connect(this.accountService.userValue.accessToken);

    this.idUser = this.stringeeService.getCurrentUserIdFromAccessToken(this.accountService.userValue.accessToken);
    let sefl = this;
    // bắt sự kiện Url thay đổi
    this.activatedRoute.paramMap.subscribe(x => {
      this.stringeeService.stringeeClient.on('connect', (res) => {
        this.getConv();
        this.stringeeService.listentUpdate(this.token);
    });
    });
    
    
  }
  // lấy danh sách các conversation
  getConv() {
    let self = this;
    this.stringeeService.getLastConversation((status, code, message, convs) => {
      this.convasation = convs;
      //lấy id của conversation đầu tiên để đẩy lên route
      this.router.navigate(['/message/convasation/' + convs[0].id]).then(() => {
        //nếu thành công thì sẽ thực hiện lấy messages
        this.getLastMessage();
      });
      if(!convs[0].isGroup){
        for (let parti of convs[0].participants) {
          if (parti.userId != this.idUser) {

            this.accountService.getById(parti.userId, this.accountService.userValue.accessToken)
              .subscribe(users => {
                var data = users['data']
                this.userInfor = data['user'];
                this.userNameOtherTransferService.changeUserNameOther(this.userInfor.fullName);
  
                // truyền dữ liệu cho component infor user
                this.userOtherTransferService.transferUsername(this.userInfor.fullName);
                this.userOtherTransferService.transferEmail(this.userInfor.email);
                this.userOtherTransferService.transferPhone(this.userInfor.phone);
              });
  
            break;
          }
        }
      }else{
        this.userNameOtherTransferService.changeUserNameOther(convs[0].name);

        // truyền dữ liệu cho component infor user
        this.userOtherTransferService.transferUsername(convs[0].name);

      }
      



    });
  }

  // lấy các message cuối cùng
  getLastMessage() {
    this.idUrl = this.activatedRoute.snapshot.paramMap.get('id');
    this.stringeeService.getLastMessage(this.idUrl, (status, code, message, msgs) => {
      this.messages = msgs;

      if(this.messages && this.messages.length > 0){
        this.messages.forEach(element => {
          this.accountService.getById(element.sender, this.accountService.userValue.accessToken)
            .subscribe(users => {
              var data = users['data'];
              var obj = data['user'];
              var name = obj.fullName;
              element.fullName = name;
            })
  
        });
      }
    });

  }

}
