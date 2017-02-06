import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageService{
    public KeyLocalStorage: String;
    constructor(private http:Http){
        this.http=http;
    }
    getLocalStorage(Key:string){
        this.KeyLocalStorage = localStorage.getItem(Key);
        if(this.KeyLocalStorage){
            return this.KeyLocalStorage;
        }
    }
    setLocalStorage(Key:string, Data:string, Params?:string){
        localStorage.setItem(Key, JSON.stringify({data:Data, params:Params}));
    }
    DeleteLocalStorage(Key:string){
        localStorage.removeItem(Key);
    }

}