import { Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AccountService } from "../../../shared/service/account/account.service";
import { StringeeService } from "../../../shared/service/Message/stringee.service";
import { idUserTransferService } from "../../../shared/service/Message/idUserTransferService.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { userNameOtherTransferService } from "../../../shared/service/Message/userNameOtherTransferService.service"
import { updateListConvTranfer } from "../../../shared/service/Message/updateListConvTranfer.service"
import { FileService } from "../../../shared/service/Message/file.service";
import { updateAsReadTransfer } from "../../../shared/service/Message/updateAsReadTransfer.service";
import { ConvidFocusService } from "../../../shared/service/Message/ConvidFocusService.service";
import { FileSave } from "../../../shared/model/Message/File";
import { PostFileService } from "../../../shared/service/Message/post-file.service"
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { createdGroupChatTransfer } from "../../../shared/service/Message/createdGroupChatTransfer.service"
import CustomStore from 'devextreme/data/custom_store';
import { groupChatNameTransferService } from "../../../shared/service/Message/groupChatNameTransfer.service";
import {listAllUserTransferService} from "../../../shared/service/Message/listAllUserTransfer.service";


import {
  DxTreeViewComponent
} from 'devextreme-angular';

class fileSnippet {
  constructor(public src: string, public file: File) { }
}
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  userInfor = null;
  check = false;
  nameOther = null; // tên người khác trong cuộc trò chuyện
  userName = null;
  idUser = null;
  imgsrc: string;
  checkZoom = false;
  filePath: any;
  val = null;
  fileSave: FileSave;
  notscrolly = true;
  notEmptyPost = true;
  load = false; // hiện animation scroll
  loadTyping = true; // hiện typing
  checkTyping = false; // hiện tin nhắn đang nhập
  showEmojiPicker = false;
  messageEmoji = '';
  @Input() messages: any // mảng chứa tin nhắn trong 1 conversation
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set = 'facebook';
  isDisplayGroupChat = false;

  gridDataSource: any;
  gridBoxValue: number[] = [1];

  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  treeDataSource: any;
  treeBoxValue: string[];
  listUser = null;
  listUserIDInGroup: any;
  groupChatName: string;
  userIdTyping = [];
  userTyping = [];
  componentTreeview: any;

  constructor(
    private accountService: AccountService,
    private stringeeService: StringeeService,
    private idUserTransferService: idUserTransferService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private userNameOtherTransferService: userNameOtherTransferService,
    private updateListConvTranfer: updateListConvTranfer,
    private fileService: FileService,
    private updateAsReadTransfer: updateAsReadTransfer,
    private ConvidFocusService: ConvidFocusService,
    private postFileService: PostFileService,
    private spiner: NgxSpinnerService,
    private createdGroupChatTransfer: createdGroupChatTransfer,
    private groupChatNameTransferService: groupChatNameTransferService,
    private listAllUserTransferService: listAllUserTransferService,

  ) {

  }

  ngOnInit(): void {

    this.getUser();
    // bắt sự kiện Url thay đổi
    this._activatedRoute.paramMap.subscribe(x => {

      this.getUserNameOther();
      this.getLastMessage();
      this.postIdConvs();
      this.idUserTransferService.idUser.subscribe(val => {
        this.val = val;
        this.getUserInfor();
        this.groupChatName = null;
      });
      this.groupChatNameTransferService.groupName.subscribe(val => {
        this.groupChatName = val;
        var obj = {
          fullName: val
        }
        this.userInfor = obj;
      })


    });
    // lấy username user đang đăng nhập
    this.userName = this.accountService.userValue.fullName;
    //lấy id user đăng nhập
    this.idUser = this.accountService.userValue._id;

    // nhận biết sự thay đổi trên stringee để tiến hành update tin nhắn mới nhất
    this.stringeeService.stringeeChat.on('onObjectChange', (info) => {
      this.getLastMessage();
    });
    //-------------------------------------------------------- typing

    //  kích hoạt sự kiện khi người dùng gõ tin nhắn - thêm người dùng dang gõ tin nhắn vào mảng
    let self = this;

    this.stringeeService.stringeeClient.on("userBeginTypingListener", (msg) => {
      if(this.userIdTyping){
        if(!self.userIdTyping.includes(msg.userId)){
          self.userIdTyping.push(msg.userId);
          self.userTyping.push(msg);
        }
      }else{
        this.userIdTyping.push(msg.userId);
        this.userTyping.push(msg);
      }
      this.checkTyping = true;
      this.spiner.show();
    });
    // kích hoạt sự kiện khi người dùng dừng gõ tin nhắn - xóa người dùng dừng gõ tin nhắn khỏii mảng
    this.stringeeService.stringeeClient.on("userEndTypingListener",  (msg) => {
      for(let i=0 ; i < this.userTyping.length; i++){
        if(this.userTyping[i].userId == msg.userId){
          this.userTyping.splice(i, 1);
          this.userIdTyping.splice(i,1);
        }
      }
      this.checkTyping = false;
      this.loadTyping == false;

    });
    //------------------------------------------------------------------------ entyping
    this.getIsDisplayGroupChat();
  }

  syncTreeViewSelection(e) {
    if (!e.value) {
      this.componentTreeview.unselectAll();
    }
  }

  treeView_itemSelectionChanged(e) {
    this.treeBoxValue = e.component.getSelectedNodeKeys();
    this.componentTreeview = e.component;
  }

  // -------------

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


  /**
   * mở phần tạo nhóm chat
   */
  getIsDisplayGroupChat() {
    this.createdGroupChatTransfer.isDisplay.subscribe(data => {
      // debugger
      this.isDisplayGroupChat = !this.isDisplayGroupChat;

    })
  }

  // tạo nhóm chat
  @ViewChild('InputName') InputName: ElementRef;
  createChatGroup() {
    var groupName = this.InputName.nativeElement.value;
    this.stringeeService.creatGroupConversation(this.treeBoxValue, groupName, (status, code, message, conv) => {
      if (status == true) {
        this.isDisplayGroupChat = !this.isDisplayGroupChat;
        this.ConvidFocusService.changeConvidFocus(conv.id);
        this._router.navigate(['/message/convasation/' + conv.id]);
        this.groupChatName = groupName;
        var obj = {
          fullName: groupName
        }
        this.userInfor = null;
        this.userInfor = obj;
        this.componentTreeview.unselectAll();
        this.treeBoxValue = [];
      }
    })
  }

  //------------------------typing----------------------------//
  // hàm nhận biết người dùng có đang gõ phím hay ko
  trackingUserTyping(event) {
    let self = this;
    const idUrl = this._activatedRoute.snapshot.paramMap.get('id');
    this.stringeeService.userBeginTyping(idUrl, this.accountService.userValue._id);
    this.showEmojiPicker = false;
  }
  // hàm nhận biết khi người dùng dừng gõ
  trackingUserEndTyping(event) {
    const idUrl = this._activatedRoute.snapshot.paramMap.get('id');
    setTimeout(() => {
      this.stringeeService.userEndTyping(idUrl, this.accountService.userValue._id);
    }, 1000);
  }

  //--------------------------typing----------------------------------//

  /**
   * truyền id convs sang bên list để thực hiện focus
   */
  postIdConvs() {
    const idUrl = this._activatedRoute.snapshot.paramMap.get('id');
    this.ConvidFocusService.changeConvidFocus(idUrl);
  }

  /**
   * lấy userName người trong cuộc trod chuyện đầu tiên khi vừa đăng nhập
   */
  getUserNameOther() {
    this.userNameOtherTransferService.UserNameOther.subscribe(val => {
      this.nameOther = val;
    })
  }

  /**
   * lấy thông tin user đang trong cuộc trò chuyện
   */
  getUserInfor() {

    this.accountService.getById(this.val, this.accountService.userValue.accessToken)
      .subscribe(users => {
        var data = users['data']
        this.userInfor = data['user'];
      })
  }

  /**
   * sự kiện click vào input
   */
  clickInput() {
    this.updateAsReadTransfer.changeAsRead();
  }

  /**
   * lấy các message cuối cùng
   */
  getLastMessage() {
    // lấy ì conv từ url
    const idUrlTest = this._activatedRoute.snapshot.paramMap.get('id');
    this.stringeeService.getLastMessage(idUrlTest, (status, code, message, msgs) => {
      this.messages = msgs;
      if(this.messages && this.messages.length > 0){
        this.messages.forEach(element => {
          this.listUser.forEach(objUser => {
            if(element.sender == objUser._id){
              var name = objUser.fullName;
              element.fullName = name;
            }
          });
          
  
        });
      }
      
    });
    // chuyền sự kiện thay đổi sang bên list convasation để  update lại list convasation 
    this.updateListConvTranfer.changeListConv();
  }

  /** 
   * gửi tin nhắn dạng text
  */
  sendMessage(event) {
    const idUrl = this._activatedRoute.snapshot.paramMap.get('id');
    if (event.target.value != "") {
      var message = event.target.value;
      this.stringeeService.sendTextMessage(idUrl, message);
      // sau khi gửi reset lại value thẻ area
      event.target.value = "";
      // cập nhật lại message
      this.getLastMessage();
      // chuyền sự kiện thay đổi sang bên list convasation để  update lại list convasation 
      this.updateListConvTranfer.changeListConv();
      // khi gửi tin nhắn thì đánh dấu là đã đoc cho chính mình
      // this.updateAsReadTransfer.changeAsRead();
    }
    this.checkTyping = false;
  }

  /**
   * mở emoji
   */
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
   * gửi emoji
   * @param event 
   */
  addEmoji(event) {
    const { messageEmoji } = this;
    console.log(`${event.emoji.native}`)
    const text = `${messageEmoji}${event.emoji.native}`;
    this.messageEmoji = text;
    // this.showEmojiPicker = false;
  }

  /**
   * gửi tin nhắn file
   */
  // up file
  selectedFile: fileSnippet;
  processImg(fileInput: any) {
    const file: File = fileInput.files[0];

    const render = new FileReader();

    this.fileSave = new FileSave();
    const idUrl = this._activatedRoute.snapshot.paramMap.get('id');

    render.addEventListener('load', async (event: any) => {
      this.selectedFile = new fileSnippet(event.target.result, file);
      // với FormData, chúng ta có thể submit dữ liệu lên server thông qua AJAX như là đang submit form bình thường.
      const idUrl = this._activatedRoute.snapshot.paramMap.get('id');
      var formData = new FormData();
      formData.set("file", file);

      // nếu file input là img
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {

        // tải file lên serve stringee cung cấp
        this.fileService.saveFileToServer(formData, this.accountService.userValue.accessToken).subscribe(data => {
          this.filePath = data;

          this.stringeeService.sendImgMessage(idUrl, this.filePath.filename);
          this.getLastMessage();
          // up date list conv
          this.updateListConvTranfer.changeListConv();
          // update conv là đã xem
          this.updateAsReadTransfer.changeAsRead();

          // lưu file img vào database
          this.fileSave.filePath = this.filePath.filename;
          this.fileSave.fileType = "img";
          this.fileSave.fileName = "img";
          this.fileSave.convId = idUrl;

          // post file vào database của mình
          this.postFileService.saveFile(this.fileSave, this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {

          });
        });

      }

      // thêm file dang pdf
      else if (file.type == 'application/pdf') {
        this.fileService.saveFileToServer(formData, this.accountService.userValue.accessToken).subscribe(data => {
          this.filePath = data;
          var fileName = file.name;
          var length = file.size;

          // console.log(fileName + " adsdas" + lenght);

          this.stringeeService.sendFileMessage(idUrl, this.filePath.filename, fileName, length);
          this.getLastMessage();
          // up date list conv
          this.updateListConvTranfer.changeListConv();
          // update conv là đã xem
          this.updateAsReadTransfer.changeAsRead();

          // lưu file pdf vào database
          this.fileSave.filePath = this.filePath.filename;
          this.fileSave.fileType = "pdf";
          this.fileSave.fileName = fileName;
          this.fileSave.convId = idUrl;

          this.postFileService.saveFile(this.fileSave, this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {

          });

        });

      }

      // thêm file dạng docs
      else if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.fileService.saveFileToServer(formData, this.accountService.userValue.accessToken).subscribe(data => {
          this.filePath = data;
          var fileName = file.name;
          var length = file.size;

          // console.log(fileName + " adsdas" + lenght);

          this.stringeeService.sendFileMessage(idUrl, this.filePath.filename, fileName, length);
          this.getLastMessage();
          // up date list conv
          this.updateListConvTranfer.changeListConv();
          // update conv là đã xem
          this.updateAsReadTransfer.changeAsRead();

          // lưu file docs vào database
          this.fileSave.filePath = this.filePath.filename;
          this.fileSave.fileType = "docs";
          this.fileSave.fileName = fileName;
          this.fileSave.convId = idUrl;

          this.postFileService.saveFile(this.fileSave, this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {

          });

        });

      }
      // thêm file dạng excel
      else if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.fileService.saveFileToServer(formData, this.accountService.userValue.accessToken).subscribe(data => {
          this.filePath = data;
          var fileName = file.name;
          var length = file.size;

          // console.log(fileName + " adsdas" + lenght);

          this.stringeeService.sendFileMessage(idUrl, this.filePath.filename, fileName, length);
          this.getLastMessage();
          // up date list conv
          this.updateListConvTranfer.changeListConv();
          // update conv là đã xem
          this.updateAsReadTransfer.changeAsRead();

          // lưu file excel vào database
          this.fileSave.filePath = this.filePath.filename;
          this.fileSave.fileType = "excel";
          this.fileSave.fileName = fileName;
          this.fileSave.convId = idUrl;

          this.postFileService.saveFile(this.fileSave, this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {

          });

        });

      }
      // thêm file dạng ppt
      else if (file.type == 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        this.fileService.saveFileToServer(formData, this.accountService.userValue.accessToken).subscribe(data => {
          this.filePath = data;
          var fileName = file.name;
          var length = file.size;

          // console.log(fileName + " adsdas" + lenght);

          this.stringeeService.sendFileMessage(idUrl, this.filePath.filename, fileName, length);
          this.getLastMessage();
          this.updateListConvTranfer.changeListConv();
          this.updateAsReadTransfer.changeAsRead();

          // lưu file powerpoint vào database
          this.fileSave.filePath = this.filePath.filename;
          this.fileSave.fileType = "ppt";
          this.fileSave.fileName = fileName;
          this.fileSave.convId = idUrl;

          this.postFileService.saveFile(this.fileSave, this.accountService.userValue.accessToken).pipe(first()).subscribe(data => {

          });

        });

      }


    });

    render.readAsDataURL(file);

  }

  // thanh cuộn scroll tự động cuộn xuống
  @ViewChild('scrollMe', { static: false }) scrollMe: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private items = [];

  ngAfterViewInit() {
    this.scrollContainer = this.scrollMe.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

    // Add a new item every 2 seconds
    setInterval(() => {
      this.items.push({});
    }, 2000);
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * cuộn để lấy thêm message
   */
  onScroll() {
    if (this.notscrolly && this.notEmptyPost) {
      this.spiner.show();
      this.notscrolly = false;
      this.loadNextPost();
    }
  }

  /**
   * load next message
   */
  loadNextPost() {
    this.load = true;
    const idUrlTest = this._activatedRoute.snapshot.paramMap.get('id');
    // lấy tin nhắn tiếp theo sau tin nhắn cuối cùng trong trang
    this.stringeeService.getLastMessageBefore(idUrlTest, this.messages[0].sequence, (status, code, message, msgs) => {
      if (msgs.length === 0) {
        this.notEmptyPost = false;
      }
      setTimeout(() => {
        // delay tin nhắn hiện ra
        this.load = false;
        this.messages = msgs.concat(this.messages);
      }, 1500)
      this.notscrolly = true;
    });
  }

  /**
   * thay đổi biến check để ẩn hiện phần extend component
   */
  showInfor() {
    this.check = !this.check;
  }

  // download file
  downloadFile(src: string, name: string) {
    FileSaver.saveAs(src, name);
  }

  /**
   * phóng to img
   * @param src 
   */
  getClickImg(src) {
    this.checkZoom = true;
    this.imgsrc = src;
  }

  // bỏ zoom ảnh
  UnZoom() {
    this.checkZoom = false;
  }


  // nhấn esc để thay đổi biến checkZoom thành false để thoát zoom ảnh
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.checkZoom = false;
  }
}
