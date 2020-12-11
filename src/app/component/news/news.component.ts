import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import {NewService} from "../../shared/service/news/news.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AccountService} from "../../shared/service/account/account.service"

// import { faCheck} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  listArtical : any;

  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private newService : NewService,
    private accountService: AccountService,
    ) {

   }

  ngOnInit(): void {
    this.getArtical();
  }

  getArtical(){
    this.newService.getNews(this.accountService.userValue.accessToken).subscribe(data => {
      var datainit = data['data'];
      this.listArtical = datainit['articles'];
      console.log(this.listArtical);
    })
  }

  // call Time
  // printMonth(time : any) {
  //   let month = "";
  //   let key = "";
  //   for (let i = 5; i < 7; i++) {
  //     key += time[i];
  //   }

  //   switch (key) {
  //     case "01":
  //       month = 'JAN';
  //       break;
  //     case "02":
  //       month = 'FEB';
  //       break;
  //     case "03":
  //       month = 'MAR';
  //       break;
  //     case "04":
  //       month = 'APR';
  //       break;
  //     case "05":
  //       month = 'MAY';
  //       break;
  //     case "06":
  //       month = 'JUN';
  //       break;
  //     case "07":
  //       month = 'JUL';
  //       break;
  //     case "08":
  //       month = 'AUG';
  //       break;
  //     case "09":
  //       month = 'SEP';
  //       break;
  //     case "10":
  //       month = 'OCT';
  //       break;
  //     case "11":
  //       month = 'NOV';
  //       break;
  //     case "12":
  //       month = 'DEC';
  //       break;

  //     default:
  //       break;
  //   }
  //   return month;
  // }

  // printDay(time : any) {
  //   let day = "";
  //   for (let index = 8; index <= 9; index++){
  //     day += time[index];
  //   }
  //   return day;
  // }

  // printTime(time : any) {
  //   let day = this.printDay(time);
  //   let month = "";
  //   let year = "";
  //   let hour = "";
  //   for (let i = 5; i < 7; i++) {
  //     month += time[i];
  //   }
  //   for (let i = 0; i <= 3; i++) {
  //     year += time[i];
  //   }

  //   for (let j = 11; j <= 15; j++) {
  //     hour += time[j];
  //   }

  //   return day + "-" + month + "-" + year + " at " + hour;
  // }

  faUser = faUser;
  faClock = faClock;
  faThumbsup = faThumbsUp;
  faComment = faComment;
  faLink = faLink;
}
