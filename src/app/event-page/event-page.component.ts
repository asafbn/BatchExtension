import { EventPageService } from './../event-page.service';
import { Component, OnInit } from '@angular/core';
import { PopupComponent } from './../popup/popup.component';


@Component({
  selector: 'app-event-page',
  templateUrl: './../popup/popup.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  Data: any;
  constructor(private EventPageService:EventPageService) {
  this.EventPageService.CreatePrimaryCtx();
    this.EventPageService.SearchWord();
    this.EventPageService.AddWord();
    //this.EventPageService.AddImdbLIst();
    
    
    
   }
   
  ngOnInit() {
  
  }

}
