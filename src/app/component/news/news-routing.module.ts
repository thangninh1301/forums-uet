import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component'
import { NewsPostComponent } from './news-post/news-post.component';
import { NewsManageComponent } from './news-manage/news-manage.component'


const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
  },
  {
    path: 'news-detail/:id',
    component: NewsDetailComponent
  },
  {
    path: 'news-post',
    component: NewsPostComponent
  },
  {
    path: 'news-manage',
    component: NewsManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
