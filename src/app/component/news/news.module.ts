import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewsPostComponent } from './news-post/news-post.component';
import { HttpClientModule } from '@angular/common/http';

import { JoditAngularModule } from 'jodit-angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewsManageComponent } from './news-manage/news-manage.component';


@NgModule({
  declarations: [NewsComponent, NewsDetailComponent, NewsPostComponent, NewsManageComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    JoditAngularModule,
    FormsModule,
    RouterModule
  ]
})
export class NewsModule { }
