import { PopupComponent } from './popup/popup.component';
import { async } from '@angular/core/testing';
import { promise } from 'selenium-webdriver';
import { Injectable } from '@angular/core';
import { EventPageService } from './event-page.service';
import { EventPageComponent } from './event-page/event-page.component';
import { resolve } from 'q';
import { Http } from '@angular/http';




@Injectable()
export class PopupService {
  responseData: any;
  List:any;
  isImdb=false;
  movieProp;
  count=0;
  url="";
  urlCount=0;
  result;

 

  constructor(private http:Http) {

   }
  
   onClear(){
    chrome.storage.sync.get(['isCleard'],(Lister)=>{
      this.List=[];
      chrome.storage.sync.set({'total':this.List});
      chrome.storage.sync.set({'isCleard':true});
      var ClearNotific= {
        type:'basic',
        title: 'Your List is Empty',
        iconUrl:'assets/Icon-19.png',
        message: 'List was cleard!'
      };
      chrome.notifications.create('clearNotif',ClearNotific);
    });
}
addToList(word):Promise<void>{
  return new Promise<void>(resolve=>{
    if(word){
      this.List.push({name:word});
       chrome.storage.sync.set({'total':this.List});
  }
   
  resolve();
  })

}


  initializeList():Promise<void>{
    return new Promise<void>(resolve=>{
      chrome.storage.sync.get(['total','isCleard'],(update)=>{
        if(update.isCleard){
          this.List=[];
          chrome.storage.sync.set({'total':this.List,'isCleard':false});
        }
      
       else{this.List=update.total;} 
        resolve();
    });
    });
  }
   onChange():Promise<void>{
    return new Promise<void>(resolve=>{
      chrome.storage.onChanged.addListener((changes, namespace)=> {
          if (namespace == "sync" && "total" in changes) {
            this.List=changes["total"].newValue;
            chrome.storage.sync.set({'total':this.List});
            console.log("changed",this.List);
            resolve();
        } 
    });
    
  });
    
}
   sendContentScriptCommand():Promise<void>{
    return new Promise<void>(resolve => {
        const tabQueryData =  { active: true, currentWindow: true };
        chrome.tabs.query(tabQueryData, (tabs) => { 
          let tablink = tabs[0].url;
          this.urlCount=0;
          let match= tablink.match(/:\/\/(www?\.)?(\w*)(.[^/:]+)/);
          
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) 
          this.url=match[2];
          
          for(let i=0;i<this.List.length;i++)
          {
            this.http.get("http://api.duckduckgo.com/?q=!g " + this.url + " " +this.List[i].name + "+&format=json")
          .toPromise().then(response=>{
            this.urlCount++;
            this.getResult(response).then(()=>{
              this.List[i].url=this.result;
              if(this.urlCount==this.List.length){
                chrome.storage.sync.set({'total':this.List});
                resolve();}
                

            })

          });

        }

    /*    const commandMethod ={ Mmethod: "getText" };
           chrome.tabs.sendMessage(tabs[0].id, commandMethod, (htmlResponse) => {
              if(htmlResponse['method'] == "getText"){
                  this.responseData=htmlResponse['data'];
                  resolve();
                
              }
              
              
          });  */            
          
        });
        
    });
}

 getResult(response):Promise<void>{
  return new Promise<void>(resolve => {

  let result="";
this.result=response._body.match(/class=\"_Rm\">([\w*|\:|\/|\-|\_|\.|\(|\)]*)/)[1];
resolve();
  });
}

}
