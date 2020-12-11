import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AccountService} from "../../../shared/service/account/account.service";
import {StringeeService} from "../../../shared/service/Message/stringee.service";
import { faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // import font-awesome
  faBell = faBell;


  checkFocusNews = true;
  checkFocusMessage: boolean;
  checkFocusPost : boolean;
  checkFocusManage : boolean;
  // checkFocusManage: boolean;
  userName : string;
  activeUser = false;

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    private accountService: AccountService,
    private stringeeService : StringeeService) {
  }

  ngOnInit(): void {
    this.getUserLogin();
    // xét sự thay đổi trên url
    this.activeRoute.paramMap.subscribe(x => {

    });
  }
  ngOndestroy() {
    // this.routeMessage();
  }
  /**
   * route các page
   * @param val
   * this.router.navigate([`/${val}`])
   */
  routePage(val) {
    if (val == "news") {
      this.checkFocusNews = true;
      this.checkFocusMessage = false;
      this.checkFocusManage = false;
      this.checkFocusPost = false;
    } else if (val == "message") {
      this.checkFocusNews = false;
      this.checkFocusMessage = true;
      this.checkFocusManage = false;
      this.checkFocusPost = false;
    } else if(val == "news/news-post"){
      this.checkFocusNews = false;
      this.checkFocusMessage = false;
      this.checkFocusManage = false;
      this.checkFocusPost = true;
    }else if(val == "news/news-manage"){
      this.checkFocusNews = false;
      this.checkFocusMessage = false;
      this.checkFocusManage = true;
      this.checkFocusPost = false;
    }
    // else if (val == "manage") {
    //   this.checkFocusManage = true;
    //   this.checkFocusMessage = false;
    //   this.checkFocusNews = false;
    // }
    this.router.navigate([`/${val}`]);

  }
  /**
   * lấy thông tin user đăng nhập
   */
  getUserLogin() {
    // lấy username người đăng nhập
    var token = this.accountService.userValue.accessToken;
    this.userName = this.stringeeService.getCurrentUsernameFromAccessToken(token);
    if(this.userName){
      this.activeUser = true;
    }else{
      this.activeUser = false;
    }
  }

  /**
   * đăng xuất
   */
  logout() {
    this.accountService.logout();
    window.location.reload();
  }


}
