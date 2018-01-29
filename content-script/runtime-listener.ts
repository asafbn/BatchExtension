import { async } from "@angular/core/testing";

export class RuntimeListener {
   
    constructor() {
        this.initializeMessagesListener();
    }
     initializeMessagesListener() {
        
          chrome.runtime.onMessage.addListener(
             (request, sender, sendResponse)=> {
                if( request.Mmethod == "getText"){
                    const htmlResponse = {data: document.all[0].innerHTML,method: "getText"}
                     sendResponse(htmlResponse); //same as innerText
                }
            }
        ); 
        
        
    }
} 