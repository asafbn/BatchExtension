
import { PopupService } from './../popup.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { async } from '@angular/core/testing';
import { EventPageService } from './../event-page.service';
import { EventPageComponent } from './../event-page/event-page.component';
import { promise } from 'selenium-webdriver';
import { ImdbService } from './../imdb.service';
import { Http } from '@angular/http';


@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
    Data: any;
    AddIt;
    total:any;
    isMovie;
    isGame;
    isSong;
    isMovieProp=false;
    
    
   
    
    constructor(
        private PopupService: PopupService,
      
        )
        {
            
            this.initList();
            this.checkStatus();
           
              
        }
     ngOnInit() {
       
    }
    
    initList(){
        this.PopupService.initializeList().then(()=>{
            this.total=this.PopupService.List;
            this.checkChange();
        })
    }
    
    checkStatus(){
        this.PopupService.sendContentScriptCommand().then( () => {
            this.Data=this.PopupService.responseData;
            this.total=this.PopupService.List;
            this.isMovie=this.PopupService.isMovie;
            this.isGame=this.PopupService.isGame;
            this.isSong=this.PopupService.isSong;
            
            
        });

    }
    checkChange(){
        this.PopupService.onChange().then( ()=>{
            this.total=this.PopupService.List;

        });
    }
    clearList(){
            this.PopupService.onClear();
            this.total=[];
    }
    onRemove(word){
        let index=this.total.indexOf(word);
        this.total.splice(index,1);
        chrome.storage.sync.set({'total':this.total,'reWord':true});
    }
    onKeyUp(){
       this.PopupService.addToList(this.AddIt).then(()=>{
        this.total=this.PopupService.List;
        chrome.storage.sync.set({'total':this.total,'isCleard':false});
        this.PopupService.sendContentScriptCommand();
        
       });
       
        
    }
    onSearch(){
        let searchLi;
        for(let i=0; i<this.total.length; i++)
        {
            if(!searchLi){
                searchLi=this.total[i].name;
                continue;
            }
            searchLi += "%0A" + this.total[i].name;
            
        }
        
        if(searchLi!=null){
            chrome.tabs.create({  
                url: "https://batchsearching.firebaseapp.com/search?q=" + searchLi});
        }
      
        
    }
    onOTW(){
        this.PopupService.ImdbOTW().then(()=>{
            for(let i=0;i<this.PopupService.openinigThisWeek.length;i++)
            {
                this.total.push({name:this.PopupService.openinigThisWeek[i]});
                this.checkStatus();
                console.log(this.PopupService.openinigThisWeek[i]);
            }
            
            
            this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
        })
        this.PopupService.openinigThisWeek=[];
    }
    onNP(){
        this.PopupService.ImdbNP().then(()=>{
            for(let i=0;i<this.PopupService.nowPlaying.length;i++)
            {
                this.total.push({name:this.PopupService.nowPlaying[i]});
                this.checkStatus();
                console.log(this.PopupService.nowPlaying[i]);
            }
            this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
        })
        this.PopupService.nowPlaying=[];
    }
    onCS(){
        this.PopupService.ImdbCS().then(()=>{
            for(let i=0;i<this.PopupService.comingSoon.length;i++)
            {
                this.total.push({name:this.PopupService.comingSoon[i]});
                this.checkStatus();
                console.log(this.PopupService.comingSoon[i]);
            }
            this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
        })
        this.PopupService.comingSoon=[];
    }
    onNaT(){
        this.PopupService.steamNAT();
        this.PopupService.steamNaT.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onTOPS(){
        this.PopupService.steamTOPS();
        this.PopupService.steamTS.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onUPC(){
        this.PopupService.steamUPC();
        this.PopupService.steamUP.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onSP(){
        this.PopupService.steamSP();
        this.PopupService.steamSpecial.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onST10(){
        this.PopupService.soundT10();
        this.PopupService.soundt10.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onST20(){
        this.PopupService.soundT20();
        this.PopupService.soundt20.forEach(item=>{
            this.total.push({name:item});
        })
        this.PopupService.List=this.total;
            chrome.storage.sync.set({'total':this.total});
    }
    onMovieProp(){
        this.PopupService.movieProp().then(()=>{
            
            this.total=this.PopupService.List;
            console.log(this.PopupService.List)
            this.isMovieProp=true;
           
        })
        
    }
    
    
           
       
        
    
    
    
    
    
}