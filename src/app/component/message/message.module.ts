import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageComponent } from './message.component';
import { ListConvasationComponent } from './list-convasation/list-convasation.component';
import { ChatComponent } from './chat/chat.component';
import { AvatarModule } from 'ngx-avatar';
import { FriendFilterPipe } from "../../shared/pipe/friend-filter.pipe"
import { FormsModule } from '@angular/forms';
import { InforUserComponent } from './infor-user/infor-user.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  DxDropDownBoxModule,
  DxDataGridModule,
  DxTreeViewModule,
} from 'devextreme-angular';


@NgModule({
  declarations: [MessageComponent, ListConvasationComponent, ChatComponent, FriendFilterPipe, InforUserComponent],
  imports: [
    CommonModule,
    MessageRoutingModule,
    AvatarModule,
    FormsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    PickerModule,
    NgMultiSelectDropDownModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxTreeViewModule
    

  ]
})
export class MessageModule { }
