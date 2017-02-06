import {Injectable} from "@angular/core"
import {EventEmitter} from "@angular/core"
import {Http} from '@angular/http';
import 'rxjs/Rx'
 
@Injectable()
export class OffersService{

   url_service:string = 'http://localhost:8000/api/buscaOfertasporRanking';
   url_soaservice:string = 'http://localhost:8000/SOA/';

   list1Event: EventEmitter<any> = new EventEmitter();
 
   constructor(private http: Http){
       this.http = http;
   }
 
   getOffers (page:number){
       return this.http.get(this.url_service + '?AliasConexion=TBJCL&IDConsumidor=http%3A%2F%2Fsearchjob.trabajando.com&CodigoLocale=es_CL&IDDominio=857&AliasOrden=5&RegistrosPorPagina=4&Pagina='+page.toString()+'&IDRegiones=&IDCiudades=&IDComunas=&IDCarreras=&IDTipoCargos=&IDTipoContratos=&IdRangoSalario=&IDJornadas=&IDSectores=&IDAreas=&IDClasificacion=&TextoLibreBuscaEmpresa=1&IDIinstituciones=&IDGradoEscolar=&TextoLibre=&CodigoOferta=0&Cargo=&SueldoFrom=0&SueldoTo=0&Exclusiva=0&FechaPublicacionFrom=0&FechaPublicacionTo=0&TextoLibreBuscaCarreras=1&TextoLibreBuscaCuerpo=1&RetornaDescripcionOferta=0&IDCanales=&FacetaRegiones=0&FacetaRegionesCantidad=0&FacetaCarreras=0&FacetaCarrerasCantidad=0&FacetaSueldos=0&FacetaSueldosCriterios=0&IDEmpresas=&TipoDominio=&IDFormaPagoSalario=&avisociego=0').map(res => res.json());
   }
   //Final version
   getOfferDetail (offerId:number){
       return this.http.get(this.url_soaservice + '/jobs-v1.4/rest/json/getjob?jobid='+offerId+'&country=CL&client=PortalPersonas&token=PortalPersonas').map(res => res.json());
    }
    //Simulated api version
   /* getOfferDetail(jobId:number){
        const url= `api/jobs/${jobId}`;        
        return this.http.get(url).map(res => res.json());
    }*/
}
