import { Injectable } from "@angular/core"
import { Headers, Http } from '@angular/http';
import {EventEmitter} from "@angular/core"
import 'rxjs/Rx'

import  { Event } from '../class/event.class';
import  { EventType } from '../class/event-type.class';

import { StorageService } from '../shared/services/storage.service';

@Injectable()
export class EventService{
    
    // private eventUrl = 'http://192.168.1.166:3000/api/events';   //Node PC Del Sur
    private eventUrl = 'http://localhost:3000/api/events';
    //private eventTypeUrl = 'http://192.168.1.166:3000/api/eventTypes';    //Node PC Del Sur
    private eventTypeUrl = 'http://localhost:3000/api/eventTypes';
    list1Event: EventEmitter<any> = new EventEmitter();
    private headers = new Headers({'Content-Type':'application/json'});

    private dateKey:string = '';
    constructor(private http: Http){
        this.http = http;
    }
    // EVENTS
    //Observable
    getEvents(start?:string,end?:string){
        let url:any;
        if(start && end){
            url = `${this.eventUrl}?start=${start}&end=${end}`;
        }else{
            url = this.eventUrl;
        }
        return this.http.get(url)
                .map(res => 
                    {
                        return res.json();
                    })
    }
    //Promise
    /*getEvents(start?:string,end?:string):Promise<Event[]> {
        let url:any;
        if(start && end){
            url = `${this.eventUrl}?start=${start}&end=${end}`;
        }else{
            url = this.eventUrl;
        }        
        return this.http.get(url, { headers: this.headers })
                    .toPromise()
                    .then(res => <Event[]> res.json().data as Event[])
                    .catch(this.handleError);
                    //.then(data => { return data; });
    }*/

    addEvent(event:Event):Promise<Event>{
        return this.http.post( this.eventUrl, JSON.stringify(event), { headers : this.headers })
            .toPromise()
            .then(()=> event)
            .catch(this.handleError);
    }
    updateEvent(event:Event):Promise<Event>{
        const url = `${this.eventUrl}/${event.id}`;
        return this.http.put(url, JSON.stringify(event), { headers : this.headers })
            .toPromise()
            .then(()=> event)
            .catch(this.handleError);
    }
    deleteEvent(eventId:number):Promise<number>{
        const url = `${this.eventUrl}/${eventId}`;
        return this.http.delete( url, { headers : this.headers })
            .toPromise()
            .then( () => eventId )
            .catch(this.handleError);
    }

    // EVENT TYPES
    getEventType(evId: number):Promise<EventType>{
        const url = `${this.eventTypeUrl}/${evId}`;
        //Promise version
        return this.http.get(url)
                    .toPromise()
                    .then(res => <EventType> res.json().data as EventType)
                    .catch(this.handleError);
                    //.then(data => { return data });
        //return this.http.get(url).map(res => res.json());
    }

    addEventType(eventType:EventType):Promise<EventType>{
        return this.http.post(this.eventTypeUrl,JSON.stringify(eventType), {headers:this.headers})
            .toPromise()
            .then(()=> eventType)
            .catch(this.handleError);
    }
    
    private handleError(error:any):Promise<any>{
          console.error('An error occurred', error); //devMode
          return Promise.reject(error.message || error);
    }
}
