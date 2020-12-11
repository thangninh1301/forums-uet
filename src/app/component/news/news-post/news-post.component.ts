import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/service/account/account.service';

interface postResponse {
  success: number;
  status: string;
}


@Component({
  selector: 'app-news-post',
  templateUrl: './news-post.component.html',
  styleUrls: ['./news-post.component.scss']
})
export class NewsPostComponent implements OnInit {
  @Input() threadTitle: string;
  @Input() htmlText: string;
  @Input() url: string = '/assets/img/thread image.png';
  @Input() file: File;

  config = {
    enableDragAndDropFileToEditor: true,
    uploader: {
      format: 'json',
      url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
      defaultHandlerSuccess: function (data, resp) {
        this.selection.insertImage(data.baseurl + data.files);
      },
    },
    minHeight: 350,
    toolbarStickyOffset: 1,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    buttons: "|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,font,fontsize,brush,paragraph,|,image,file,video,table,link,|,align,undo,redo,\n,selectall,cut,copy,paste,|,hr,symbol,fullsize,preview,find",
    buttonsMD: "|,bold,strikethrough,underline,italic,|,superscript,subscript,|,ul,ol,|,outdent,indent,|,image,file,video,table,|,align,undo,redo|,font,fontsize,fullsize,preview",
    buttonsSM: "|,bold,underline,italic,|,superscript,subscript,|,ul,ol,|,font,fontsize,fullsize,preview",
    buttonsXS: "|,bold,italic,|,ul,ol,|,font,fontsize,fullsize,preview"
  };

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public updateTitle(event: any) {
    this.threadTitle = event.target.value;
  }

  public onFileSelected(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
    // const img = event.target.files[0];
    // const formData = new FormData();
    // formData.append('file', img);
    // this.http.post('https://xdsoft.net/jodit/connector/index.php?action=fileUpload', formData)
    //   .subscribe(res => {
    //     console.log(res);
    //   });
  }

  postThread() {
    const now: Date = new Date();
    if (this.url === '/assets/img/thread image.png') { this.url = ''; }
    const body = {
      title: this.threadTitle,
      content: this.htmlText,
      profileImage: this.url,
      publishedAt: now,
    };
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.accountService.userValue.accessToken
      }),
    };
    this.http.post('https://forumsapi.herokuapp.com/api/v1/article/create', body, httpOptions)
      .subscribe(res => {
        const result = JSON.parse(JSON.stringify(res));
        if (!result.success) {
          alert(result.reason);
        } else {
          // this.router.navigateByUrl('news');
          alert('Post succeed');
        }
      });
  }
}

