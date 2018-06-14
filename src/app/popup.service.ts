import { PopupComponent } from './popup/popup.component';
import { async } from '@angular/core/testing';
import { promise } from 'selenium-webdriver';
import { Injectable } from '@angular/core';
import { EventPageService } from './event-page.service';
import { EventPageComponent } from './event-page/event-page.component';
import { resolve } from 'q';
import { Http } from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';




@Injectable()
export class PopupService {
  responseData: any;
  List:any;
  isMovie =false;
  count=0;
  url="";
  urlCount=0;
  result;
  webSite;
  genre;
  time;
  rating;
  openinigThisWeek=[];
  nowPlaying=[];
  comingSoon=[];
  steamTmp=[];
  isGame=false;
  steamNaT=[];
  steamTS=[];
  steamUP=[];
  steamSpecial=[];
  isSong=false;
  soundTmp=[];
  soundt10=[]
  soundt20=[];

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
          {this.url=match[2];}
          console.log(match.input);
         if(match.input=="https://www.imdb.com/")
          {
            this.isMovie=true;
            resolve();
          }
          if(match.input=="https://store.steampowered.com/")
          {
            this.isGame=true;
            this.http.get("https://store.steampowered.com/").toPromise().then(steamResponse=>{
              this.steamTmp = steamResponse['_body'].match(/tab_item_name\">[a-zA-Z0-9_ \:\=\!\'\?\@\#\$\%\^\&\*\(\)\-\+]*/g);
              let index = this.steamTmp[0].indexOf(">")+1;
              for(let i=0 ; i<this.steamTmp.length ; i++)
              this.steamTmp[i] = this.steamTmp[i].substr(index);
            
              resolve();
            })
            
          }
          if(match.input=="https://soundcloud.com/stream" ||match.input=="https://soundcloud.com/charts/top")
          {
            this.isSong=true;
            this.http.get("https://soundcloud.com/charts/top").toPromise().then(soundResponse=>{
              this.soundTmp=soundResponse['_body'].match(/itemprop="url"[a-zA-Z0-9_ \:\=\!\'\?\@\#\$\%\^\&\*\(\)\-\+\"\/\>\.\;]*/g);
              
              for(let i=0 ; i<this.soundTmp.length ; i++){
                let index = this.soundTmp[i].indexOf(">")+1;
                this.soundTmp[i] = this.soundTmp[i].substr(index);
              }
              console.log(this.soundTmp);
              
              resolve();
            });
            
          }
        

            
          
        });
        
    });
}
movieProp(){
  return new Promise<void>(resolve => {
    for(let i=0;i<this.List.length;i++)
    {
      this.urlCount++;
      this.http.get("http://api.duckduckgo.com/?q=!g " + this.url + " " +this.List[i].name + "+&format=json")
    .toPromise().then(response=>{
      
      this.getResult(response).then(()=>{
        
        this.List[i].url=this.result;
        if(this.webSite=="imdb")
        {
          this.List[i].genre=this.genre;
          this.List[i].time=this.time;
          this.List[i].rating=this.rating;
          
        }

      })
      if(this.urlCount==this.List.length){
        chrome.storage.sync.set({'total':this.List});
        resolve();
        }

    });
    
    }
    
    })
   
}

 getResult(response):Promise<void>{
  return new Promise<void>(resolve => {
//this.result=response._body.match(/class=\"_Rm\">([\w*|\:|\/|\-|\_|\.|\(|\)]*)/)[1];
this.result=response._body.match(/class=\"iUh30\">([\w*|\:|\/|\-|\_|\.|\(|\)]*)/)[1];
this.webSite=this.result.match(/:\/\/(www?\.)?(\w*)(.[^/:]+)/)[2];
console.log(this.result);

if(this.webSite=="imdb" )
{
  
  this.http.get(this.result).toPromise().then(Secondresponse=>{
      this.rating=Secondresponse['_body'].match("\"ratingValue\">(\\d\\.\\d)</span")[1];
      this.time=Secondresponse['_body'].match("datetime=\"[a-zA-Z0-9_ ]*\">([a-zA-Z0-9_ ]*)</time>")[1];
      this.genre=Secondresponse['_body'].match("\"genre\">(\\w*)</span>")[1];
      resolve();
  });   
}
else{resolve();}
  

  });
}
  ImdbOTW(){
    let index: number = 0;
    let text: any = "";
    return new Promise<void>(resolve => {
      this.http.get("https://www.imdb.com/").toPromise().then(imdbResponse=>{
        while(true)
        {
            text = imdbResponse['_body'].match("hm_otw_t"+index+"\"\>([a-zA-Z0-9_ \:\=\!\'\?\@\#\$\%\^\&\*\(\)\-\+\,\;]*)\</a\>");
            if(text && text.length > 0) {
              this.openinigThisWeek.push(text[1])
              index++
            }
            else {
              break;
            }
        }
              
              resolve();
            })
            
    })
    
  }
  ImdbNP(){
    let index: number = 0;
    let text: any = "";
    return new Promise<void>(resolve => {
      this.http.get("https://www.imdb.com/").toPromise().then(imdbResponse=>{
        while(true)
        {
            text = imdbResponse['_body'].match("hm_cht_t"+index+"\"\>([a-zA-Z0-9_ \:\=\!\'\?\@\#\$\%\^\&\*\(\)\-\+\,\;]*)\</a\>");
            if(text && text.length > 0) {
              this.nowPlaying.push(text[1])
              index++
            }
            else {
              break;
            }
        }
              
              resolve();
            })
         
            
    })
  }
  ImdbCS(){
    let index: number = 0;
    let text: any = "";
    return new Promise<void>(resolve => {
      
      this.http.get("https://www.imdb.com/").toPromise().then(imdbResponse=>{
        while(true)
        {
            text = imdbResponse['_body'].match("hm_cs_t"+index+"\"\>([a-zA-Z0-9_ \:\=\!\'\?\@\#\$\%\^\&\*\(\)\-\+\,\;]*)\</a\>");
            if(text && text.length > 0) {
              this.comingSoon.push(text[1])
              index++
            }
            else {
              break;
            }
        }
              resolve();
            })
         
            
    })  
    
  }
  steamNAT()
  {
    for(let i=0;i<10;i++)
    {
      this.steamNaT.push(this.steamTmp[i]);
    }
    
  }
  steamTOPS(){
  
    for(let i=30;i<40;i++)
    {
      this.steamTS.push(this.steamTmp[i]);
    }
  }
  steamUPC()
  {
    for(let i=60;i<70;i++)
    {
      this.steamUP.push(this.steamTmp[i]);
    }
  }
  steamSP()
  {
    for(let i=70;i<80;i++)
    {
      this.steamSpecial.push(this.steamTmp[i]);
    }
  }
  soundT10()
  {
    for(let i=0;i<10;i++)
    {
      this.soundt10.push(this.soundTmp[i])
    }
  }
  soundT20()
  {
    for(let i=0;i<20;i++)
    {
      this.soundt20.push(this.soundTmp[i])
    }
  }

}
