import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/service/account/Auth-Guard';
import { ManagementComponent } from './management.component';


const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'news',
        loadChildren: () => import('../news/news.module').then(x => x.NewsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'message',
        loadChildren: () => import('../message/message.module').then(x => x.MessageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/news',
        pathMatch: 'full'
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
