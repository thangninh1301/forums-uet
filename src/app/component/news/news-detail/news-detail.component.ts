import {Component, Input, OnInit} from '@angular/core';
import {NewDetailService} from '../../../shared/service/news/newdetail.service';
import {faClock, faHeart, faPaperclip, faPaperPlane, faUser} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../shared/service/account/account.service';
import {UserComment} from '../../../shared/model/News/UserComment';
import {NewDetailCommentService} from '../../../shared/service/news/newdetail-comment.service';
import { DomSanitizer } from '@angular/platform-browser';
import {Author} from "../../../shared/model/News/Author";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  providers: [NewDetailCommentService]
})
export class NewsDetailComponent implements OnInit {

  userComments: Array<UserComment>;
  author: Array<Author>;
  @Input() url = '/assets/img/thread image.png';
  @Input() threadTitle: string;
  @Input() htmlText: string;
  @Input() file: File;
  imgPath: any;
  content: string;
  time: string;
  title: string;
  articleLike: number;
  faUser = faUser;
  faClock = faClock;
  faHeart = faHeart;
  faPaperClip = faPaperclip;
  faPaperPlane = faPaperPlane;
  config = {
    autofocus: true,
    enableDragAndDropFileToEditor: true,
    uploader: {
      insertImageAsBase64URI: true,
      url: 'https://uploadpicture696.herokuapp.com/api/file/upload',
      format: 'json',
      pathVariableName: 'path',
      filesVariableName: 'images',
      minHeight: 350,
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
      buttons: '|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,file,video,table,link,|,align,undo,redo,\n,selectall,cut,copy,paste,|,hr,symbol,fullsize,preview,find',
      buttonsMD: '|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,image,file,video,table,|,align,undo,redo|,font,fontsize,fullsize,preview',
      buttonsSM: '|,bold,underline,italic,|,superscript,subscript,|,ul,ol,|,image|,font,fontsize,fullsize,preview',
      buttonsXS: '|,bold,italic,|,ul,ol,|,image|,font,fontsize,fullsize,preview'
    }
  };

  getDetail() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.newDetailService.getNewDetail(id, this.accountService.userValue.accessToken).subscribe((res: any) => {
      const data = res.data;
      const article = data.articleWithId;
      this.author = article.author;
      this.content = article.content;
      this.time = article.publishedAt;
      this.title = article.title;
      this.userComments = article.coments;
      this.articleLike = article.like
      console.log(this.author[0].picture_url);
      let authImgUrl = 'data:image/jpeg;base64,' + this.author[0].picture_url;
      console.log(authImgUrl);
      this.imgPath = this.sanitizer.bypassSecurityTrustUrl(authImgUrl);
    });
  }


  pressLike() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.newDetailService.clickLike(id, this.accountService.userValue.accessToken).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

  postComment() {
    const data = {
      articleId: this.activatedRoute.snapshot.paramMap.get('id'),
      text: this.htmlText
    };

    this.newDetailService.pressComment(data, this.accountService.userValue.accessToken).subscribe((res: any) => {
      this.newDetailCommentService.setupSocketConnection();
      this.newDetailCommentService.socket.emit('user.comment', {
        articleId: this.activatedRoute.snapshot.paramMap.get('id'),
        text: this.htmlText
      });
      this.newDetailCommentService.socket.on('user.comment.success', (data) => {
        this.getDetail();
      });
    }, error => {
      this.newDetailCommentService.socket.on('user.comment.err', (data) => {
        console.log("fail");
      });
    });
  }


  constructor(private newDetailService: NewDetailService,
              private activatedRoute: ActivatedRoute,
              private accountService: AccountService,
              private newDetailCommentService: NewDetailCommentService,
              private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.getDetail();
    this.newDetailCommentService.setupSocketConnection();
    this.newDetailCommentService.socket.on('user.comment.success', (data) => {
      console.log(1);
      this.getDetail();
    });
    this.newDetailCommentService.socket.on('user.comment.update', (data) => {
      console.log(2);
      this.getDetail();
      this.newDetailCommentService.socket.emit('user.comment.noti', data);
    });
    // this.activatedRoute.paramMap.subscribe(x => {
    //   this.getDetail();
    // });
  }
}
