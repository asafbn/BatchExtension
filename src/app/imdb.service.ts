import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ImdbService {
  rating;
  movieProp;
  isMovie=false;

  constructor(private http:Http) { 
    
  }

  movieRating(imdbHtml){
    //this.rating=imdbHtml.match("\"ratingValue\">(\\d\\.\\d)</span");
    
   
  }
}
