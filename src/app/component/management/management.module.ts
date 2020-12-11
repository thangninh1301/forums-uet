import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { ManagementComponent } from './management.component';


@NgModule({
  declarations: [ManagementComponent],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    ToolbarModule,
  ]
})
export class ManagementModule { }
