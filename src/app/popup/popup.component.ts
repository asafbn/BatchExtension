
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
    AddIt= "add word to list"
    total:any;
    isMovie=false;
    
    
   
    
    constructor(
        private PopupService: PopupService,
        private ImdbService: ImdbService,
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
            this.ImdbService.movieRating(this.Data);
            this.total=this.PopupService.List;
            
            
            
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
        this.PopupService.sendContentScriptCommand().then( () => {
       this.total=this.PopupService.List;
        chrome.storage.sync.set({'total':this.total,'isCleard':false});
        });
        
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
            searchLi += " " + this.total[i].name;
            
        }
        
        if(searchLi!=null){
            chrome.tabs.create({  
                url: "http://www.google.com/search?q=" + searchLi});
        }
      
        
    }
    
    
    
           
       
        
    
    
    
    
    
}