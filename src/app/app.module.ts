import { EventPageService } from './event-page.service';
import { PopupService } from './popup.service';
import {ImdbService} from './imdb.service';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { EventPageComponent } from './event-page/event-page.component';
import { PopupComponent } from './popup/popup.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpModule} from '@angular/http';



@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    EventPageComponent,
    PopupComponent
  ],
  imports: [
  AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [PopupService,EventPageService,ImdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
