import { EventPageComponent } from './event-page/event-page.component';
import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import { PopupComponent } from './popup/popup.component';
declare var jquery:any;
declare var $ :any;

@Injectable()
export class EventPageService {

  constructor() {}
  List = [];
  isImdb=false;
  responseData: any;
  
 

  CreatePrimaryCtx(){
    const MainCtx = {type: "separator" ,id: "MainCtx",title: "Batching",contexts:["selection"]}
    chrome.contextMenus.create(MainCtx);
  }
  SearchWord(){
    const SearchCtx = {id: "SearchCtx",title: "Search",contexts:["selection"]}
    chrome.contextMenus.create(SearchCtx);
    chrome.contextMenus.onClicked.addListener((clickData)=>{
      if(clickData.menuItemId=="SearchCtx" && clickData.selectionText)
      {
        chrome.tabs.create({  
        url: "http://www.google.com/search?q=" + clickData.selectionText});
      }
    });
  }
  AddWord(){
    const AddCtx= {id: "AddCtx",title: "Add to list",contexts:["selection",]}
    chrome.contextMenus.create(AddCtx);
    chrome.contextMenus.onClicked.addListener((clickData)=>{
      if(clickData.menuItemId=="AddCtx" && clickData.selectionText)
      {
        
          chrome.storage.sync.get(['total','isCleard','reWord'],(Lister)=>{
            console.log(Lister.isCleard);
            if(Lister.isCleard)
            {
              this.List=[];
            }
            if(Lister.reWord)
            {
              this.List=Lister.total;
              Lister.reWord=false;
              chrome.storage.sync.set({'reWord':false});
            }
            
            
            this.List.push({name: clickData.selectionText});
            chrome.storage.sync.set({'total':this.List,'isCleard':false});
            var AddNotific= {
              type:'basic',
              title: 'Word Added',
              iconUrl:'assets/Icon-19.png',
              message: clickData.selectionText + ' has been added!'
            };
            chrome.notifications.create('addNotif',AddNotific);
            
          })
      }
    });
  }
 

  
}
