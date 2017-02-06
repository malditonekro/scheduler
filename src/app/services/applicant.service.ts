import {Injectable} from "@angular/core"
import {EventEmitter} from "@angular/core"
import {Http} from '@angular/http';
import 'rxjs/Rx'
 
import { Applicant } from '../class/applicant.class';

@Injectable()
export class ApplicantService{

   url_service:string = 'http://localhost:8000/api/buscaOfertasporRanking';
   url_soaservice:string = 'http://localhost:8000/SOA/';

   list1Event: EventEmitter<any> = new EventEmitter();
 
   constructor(private http: Http){
       this.http = http;
   }
 
   //Final version
    getCv (personId:number) {      
        return this.http.get(this.url_soaservice + "/v1.3.5-CL/rest/Applicants/json/" + personId.toString() + "?country=CL&client=PortalPersonas&token=PortalPersonas").map(res => res.json());
    }
    //Simulated api version
    /*getCv (personId:number){
        //const url= `api/applicants/${personId}`;
        const url= `http://localhost:3000/api/applicants/${personId}`;
        return this.http.get(url).map(res=>res.json());
    }*/
}