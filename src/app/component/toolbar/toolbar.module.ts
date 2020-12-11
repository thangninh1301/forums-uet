import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AvatarModule } from 'ngx-avatar';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    AvatarModule,
    FontAwesomeModule
  ],
  exports: [NavbarComponent , FooterComponent]
})
export class ToolbarModule { }
