import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "./shared/service/account/Auth-Guard"

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./component/management/management.module').then(x => x.ManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'account', 
    loadChildren: () => import('./component/account/account.module').then(x => x.AccountModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
