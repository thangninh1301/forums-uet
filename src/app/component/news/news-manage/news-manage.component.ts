import { Component, OnInit } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { NewManageService } from "../../../shared/service/news/newmanage.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {AccountService} from "../../../shared/service/account/account.service"
@Component({
  selector: 'app-news-manage',
  templateUrl: './news-manage.component.html',
  styleUrls: ['./news-manage.component.scss']
})
export class NewsManageComponent implements OnInit {
  listArticle : any;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faThumbsUp = faThumbsUp;
  faComment = faComment;

  constructor( 
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private newManageService : NewManageService,
    private accountService: AccountService,
    ) {

   }

  ngOnInit(): void {
    this.getArtical();
  }

  getArtical(){
    this.newManageService.getNewManage(this.accountService.userValue.accessToken).subscribe(data => {
      var datainit = data['data'];
      this.listArticle = datainit['articles'];
      console.log(this.listArticle);
    })
  }

}
