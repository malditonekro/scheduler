import { Component, ViewChild, EventEmitter, OnInit,  OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlDirective } from '@angular/forms';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { validateEmail, validateEmailDomain, validateHourFormat, validateDateFormat } from '../../shared/utils/util.master';
import "fullcalendar";
import * as moment from 'moment';
//Services
import { EventService } from '../../services/event.service';
import { OffersService } from '../../services/offers.service';
import { ApplicantService } from '../../services/applicant.service';
import { StorageService } from '../../shared/services/storage.service';
//Classes
import { Event } from '../../class/event.class';
import { EventType } from '../../class/event-type.class';
import { Applicant } from '../../class/applicant.class';

@Component({
    selector: 'booking',
    template: require('./booking.component.html'),
    styles: [require('./booking.component.css')],
    providers: [ EventService, OffersService, ApplicantService ]
})

export class Booking implements OnInit{
    // Session
    user:string="Sebastian Serrano";
    // url manipulation 
    urlSent:string = "localhost:8000?domainId=857&alias=cl&evenType=1&applicants=166268,166269,166271,166272,166274&offer=222522";
    urlEncrypted:string;// = window.btoa(this.urlSent);
    urlDecrypted:string;// = window.atob(this.urlEncrypted);  
    domainId: number //= 857;
    alias:string;//= 'cl';    
    eventType: EventType = new EventType(1,857,"cl","ApplicantId and OfferId"); //(applicant+offerId, applicants or events)    
    //peopleIdUrl: any[] = [166268];
    peopleIdUrl: any[];// = [166268, 166269, 166271, 166272, 166274];
    offerIdUrl : number;// = 222522;
    peopleId: any[];// = this.peopleIdUrl;
    offerId: number;// = this.offerIdUrl;
    // event/calendar manipulation */
    events: Event[];
    es:any;
    header: any;
    event: Event;
    dialogVisible: boolean = false;
    modalTitle: string;    
    actionType: string; //Adding of modifying an event    
    viewStartDate:string;
    viewEndDate:string;
    // date manipulation
    dateNow: string = moment().format('YYYY-MM-DD');
    daySelected: any;
    // offer manipulation
    offer:any;
    /*offerData:any;
    offerDescription:any;*/
    // applicant manipulation
    applicants:any[];
    // utils
    idGen:number=0;
    onInitChcka:boolean=false;
    onInitChckb:string='false';
    previousInterviewer:string='';
    iminterviewer:boolean=false;
    /*  validatiors flags*/
    startFlag:string='false';
    endFlag:string='false';
    startHourFlag:string='false';
    endHourFlag:string='false';
    interviewerFlag:string='false';
    emailFlag:string='false';
    titleFlag:string='false';
    placeFlag:string='false';
    validForm:boolean=false;
    constructor(
        private applicantService:ApplicantService,
        private eventService:EventService,
        private offersService:OffersService,
        private cdRef: ChangeDetectorRef, 
        private storageService:StorageService,
        private modalService:NgbModal
    ) {}
    ngOnInit(){        
        this.urlEncrypted = window.btoa(this.urlSent);
        this.urlDecrypted = window.atob(this.urlEncrypted);
        this.domainId = parseInt(this.getUrlQuery('domainId',this.urlDecrypted));
        this.alias = this.getUrlQuery('alias',this.urlDecrypted);
        this.peopleIdUrl = this.getUrlQuery('applicants',this.urlDecrypted).split(',');
        this.offerIdUrl = parseInt(this.getUrlQuery('offer',this.urlDecrypted));
        this.peopleId = this.peopleIdUrl;
        this.offerId= this.offerIdUrl;
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month'
            //right: 'agendaWeek,agendaDay,month'
            /*
                                                    !!!!!!!!!!!
            Está activado sólo la vista del Mes, para activar las otras, modificar la interacción y manipulación 
            de las horas de inicio y termino del evento, debido al choque entre las horas que ingresa la persona 
            y la hora que toma el evento al crearse/arrastrarse.Otras vistas no solicitadas, dejo la implementación para el siguiente ciclo.

            */
        };
        this.es = {
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            dayNamesShort : ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
        };
        if(this.offerId){
            this.getOfferDetail(this.offerId);
        }
        if(this.peopleId){
            this.getApplicants(this.peopleId);
        }
        this.initModal();
        //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
        this.cdRef.detectChanges();        
    }
    private handleError(error:any):Promise<any>{
          console.error('An error occurred', error); //devMode
          return Promise.reject(error.message || error);
    }
    //Modal open
    open(content:any){
        this.modalService.open(content);
    }
    initModal(){
        if(localStorage.getItem('init_modal')){
            this.onInitChckb = JSON.parse(localStorage.getItem('init_modal')).data;
            if(this.onInitChckb==='false'){//If false, show
                this.onInitChcka=false;
                document.getElementById("initModalBtn").click();
            }
        }else{
            this.onInitChcka=false;
            this.storageService.setLocalStorage('init_modal',this.onInitChckb);
            document.getElementById("initModalBtn").click();
        }
    }
    validInitModal(){
        if(this.onInitChcka){
            this.onInitChckb='true';
            this.storageService.setLocalStorage('init_modal',this.onInitChckb);
        }else{
            this.onInitChckb='false';
            this.storageService.setLocalStorage('init_modal',this.onInitChckb);
        }
        document.getElementById("initCloseBtn").click();        
    }
    getUrlQuery(param:string, url:string) {
        if (!url) {
        url = window.location.href;
        }
        param = param.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    getOfferDetail(id:number){
        /*this.offerData=[];
        this.offerDescription=[];*/
        this.offer={id:'',title:''}

        if(!localStorage.getItem('offer_key')){
            this.offersService.getOfferDetail(id)
                .subscribe(
                    data => { 
                        this.offer.id = data.data.jobId; 
                        this.offer.title = data.data.description.jobTitle;
                        this.storageService.setLocalStorage('offer_key', this.offer, this.offer.id);
                        this.offer = JSON.parse(localStorage.getItem('offer_key')).data;
                    },
                    error => "No data"
                );
        }else{
            let param = JSON.parse(localStorage.getItem('offer_key')).params;
            if(param == id){
                this.offer = JSON.parse(localStorage.getItem('offer_key')).data;
            }else{
                this.offersService.getOfferDetail(id)
                    .subscribe(
                        data => { 
                            this.offer.id = data.data.jobId;
                            this.offer.title = data.data.description.jobTitle;
                        },
                        error => "No data"
                    );
            }
        }
    }
    getApplicants(people:any[]){
        this.applicants = [];
        //localstorage by applicant array
        if(!localStorage.getItem('applicant_key')){
            people.forEach(
                (ppl) => {
                    var appl:any = { data:'', personalInfo:''};
                    this.applicantService.getCv(ppl)
                        .subscribe(
                        data => { 
                            appl.data = data.data, appl.personalInfo = data.data.personalInfo
                            this.applicants.push(appl);
                            this.storageService.setLocalStorage('applicant_key', JSON.stringify(this.applicants));
                        },
                            error => "No hay Datos"
                        );

            });            
        }else{
            let data = JSON.parse(JSON.parse(localStorage.getItem('applicant_key')).data);            
            people.forEach(
                (ppl) => {
                    let noMatch=false;
                    data.forEach(
                        (appli:any)=>{
                            if(appli.data.id == ppl){
                                var applAux:any = { data:'', personalInfo:''};
                                applAux.data = appli.data;
                                applAux.personalInfo = appli.data.personalInfo;
                                this.applicants.push(applAux);
                                noMatch=true;
                            }
                        }
                    );
                    if(!noMatch){
                        var appl:any = { data:'', personalInfo:''};
                        this.applicantService.getCv(ppl)
                            .subscribe(
                            data => { 
                                appl.data = data.data, appl.personalInfo = data.data.personalInfo
                            },
                                error => "No hay Datos"
                            );            
                        this.applicants.push(appl);  
                    }
                }
            );
        }
        //localstorage by people id
        /*people.forEach(
            (ppl) => {
                var appl:any = { data:'', personalInfo:''};
                if(!localStorage.getItem(ppl)){
                    this.applicantService.getCv(ppl)
                        .subscribe(
                        data => { 
                            appl.data = data.data, appl.personalInfo = data.data.personalInfo
                            this.applicants.push(appl);
                            this.storageService.setLocalStorage(ppl, JSON.stringify(data));
                        },
                            error => "No hay Datos"
                        );
                }else{
                    if(localStorage.getItem(ppl)){
                        let data = JSON.parse(JSON.parse(localStorage.getItem(ppl)).data);
                        appl.data = data.data;
                        appl.personalInfo = data.data.personalInfo;                        
                        this.applicants.push(appl);
                    }else{
                        var appl:any = { data:'', personalInfo:''};
                        this.applicantService.getCv(ppl)
                            .subscribe(
                            data => { 
                                appl.data = data.data, appl.personalInfo = data.data.personalInfo
                            },
                                error => "No hay Datos"
                            );            
                        this.applicants.push(appl);                        
                    }
                }
            }
        );*/        
        /*
        people.forEach(dummy => {
           var appl:any = { data:'', personalInfo:''};
            this.applicantService.getCv(dummy)
                .subscribe(
                data => { 
                    appl.data = data.data, appl.personalInfo = data.data.personalInfo
                },
                    error => "No hay Datos"
                );            
            this.applicants.push(appl);
        })*/
    }
    handleDayClick(event:any) {        
        this.event = new Event(0,0,'',0,'','','', false,'','', true);
        this.event.start = event.date.format();
        this.event.end = event.date.format();
        this.offerId = this.offerIdUrl;
        this.getApplicants(this.peopleIdUrl);
        this.getOfferDetail(this.offerIdUrl);
        //this.eventType = new EventType(0,0,'',0,0,'','','','','',false,false,null,'','','');
        this.actionType='add';
        this.modalTitle = 'Agregar evento';        
        this.dialogVisible = true;
        this.previousInterviewer='';
        this.clearFlags();
        this.iminterviewer = false;
        //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
        this.cdRef.detectChanges();
    }
    handleEventClick(e:any) {
        let event:Event;
        this.events.forEach(
            (ev) => {
                if(ev.id == e.calEvent.id){
                    event = ev;
                }
            }
        )
        this.event = new Event(
            event.id,
            event.domainId,
            event.alias,
            event.eventTypeId,
            event.title,
            event.start,
            event.end,
            event.allDay,
            event.url,
            event.className,
            event.editable,
            event.startEditable,
            event.durationEditable,
            event.resourceEditable,
            event.rendering,
            event.overlap,
            event.constraint,
            event.source,
            event.color,
            event.backgroundColor,
            event.borderColor,
            event.textColor,
            event.offerId,
            event.interviewer,
            event.interviewerEmail,
            event.creationDate,
            event.modificationDate,
            event.place,
            event.iAmInterviewer,
            event.sendBackupEmail,
            event.participants,
            event.applicantComment,
            event.internalComment,
            event.file,
            event.hourStart,
            event.hourEnd,
            event.deleted            
        );
        /*let start = event.start;
        let end = event.end;
        if(e.view.name === 'month') {
            start.stripTime();
        }        
        if(end) {
            end.stripTime();
            this.event.end = end.format();
        }else{
            this.event.end = "" ;
        }*/       
        if(!event.hourStart){
            this.event.hourStart = "";
        }
        if(!event.hourEnd){
            this.event.hourEnd = "";
        }
        this.getApplicants(this.event.participants);
        this.getOfferDetail(this.event.offerId);
        this.actionType='edit';
        this.previousInterviewer='';
        this.clearFlags();
        this.iminterviewer = false;
        this.modalTitle = "Detalles del evento "+this.event.id;        
        this.dialogVisible = true;
    }    
    addEvent(e:any):void {
        if(!this.event){
            return;
        }
        var start:string = this.event.start +'T'+this.event.hourStart+':00';
        var end:string = this.event.end +'T'+this.event.hourEnd+':00';
        this.event.start = start;
        this.event.end = end;
        this.event.id = this.idGen;
        this.event.domainId = this.domainId;
        this.event.alias = this.alias;
        this.event.id = this.idGen;
        this.idGen = this.idGen+1;
        if(this.offerIdUrl){
            this.event.offerId = this.offerIdUrl;
        }
        if(this.peopleIdUrl){
            this.event.participants = this.peopleIdUrl;
        }
        this.event.creationDate = moment().format();        
        this.event.modificationDate = moment().format();
        this.event.domainId = this.domainId;
        this.event.alias = this.alias;
        this.event.eventTypeId = this.eventType.id;
        this.event.editable=true;
        this.event.durationEditable = true;
        this.event.startEditable = true;
        this.event.resourceEditable = false; 
        this.event.deleted = false;
        //Service call
        this.eventService.addEvent(this.event)
            .then(event => {
                //Event array update
                this.events.push(event);
                localStorage.removeItem('date_key');
                //Event 
                this.event = null;
            })
            .catch(this.handleError);
                        
        this.dialogVisible = false;
    }
    updateEvent(e?:any){
        //Drag&Drop
        if(e){
            let event:Event;
            this.events.forEach(
                (ev) => {
                    if(ev.id == e.id){
                        event = ev;
                    }
                }
            )
            this.event = new Event(
                event.id,
                event.domainId,
                event.alias,
                event.eventTypeId,
                event.title,
                event.start,
                event.end,
                event.allDay,
                event.url,
                event.className,
                event.editable,
                event.startEditable,
                event.durationEditable,
                event.resourceEditable,
                event.rendering,
                event.overlap,
                event.constraint,
                event.source,
                event.color,
                event.backgroundColor,
                event.borderColor,
                event.textColor,
                event.offerId,
                event.interviewer,
                event.interviewerEmail,
                event.creationDate,
                event.modificationDate,
                event.place,
                event.iAmInterviewer,
                event.sendBackupEmail,
                event.participants,
                event.applicantComment,
                event.internalComment,
                event.file,
                event.hourStart,
                event.hourEnd,
                event.deleted            
            );
            if(e.start){
                this.event.start = e.start.format();
            }else{
                this.event.start = event.start;
            }
            if(e.end){
                this.event.end = e.end.format();
            }else{
                this.event.end = e.start.format();
            }
            let start:string = this.event.start.substr(0,this.event.start.indexOf('T')) + 'T'+this.event.hourStart+':00';
            let end:string = this.event.end.substr(0,this.event.end.indexOf('T')) + 'T'+this.event.hourEnd+':00';            
            this.event.start = start;
            this.event.end = end;
            this.eventService.updateEvent(this.event)
                .then( (event)=> 
                    {
                        let index: number = this.findEventIndexById(event.id); 
                        if(index >= 0) {
                            this.events[index]= event;
                            localStorage.removeItem('date_key');
                            this.event = null;                            
                        }else{
                            this.events.push(event);
                            localStorage.removeItem('date_key');
                            this.event = null;
                        }                        
                    }
                )
                .catch(this.handleError);
           
        //HandleEventClick
        }else if(this.event){
            let start:string = this.event.start.substr(0,this.event.start.indexOf('T')) + 'T'+this.event.hourStart+':00';
            let end:string = this.event.end.substr(0,this.event.end.indexOf('T')) + 'T'+this.event.hourEnd+':00';            
            this.event.start = start;
            this.event.end = end;         
            this.eventService.updateEvent(this.event)
                .then( (event)=> 
                    {
                        let index: number = this.findEventIndexById(event.id);                         
                        if(index >= 0) {
                            this.events[index]= event;
                            localStorage.removeItem('date_key');
                            this.event = null;
                        }else{
                            this.events.push(event);
                            localStorage.removeItem('date_key');
                            this.event = null;
                        }
                    }
                )
                .catch(this.handleError);
        }        
        this.dialogVisible = false;
    }
    deleteEvent() {
        if(this.event){
            this.eventService.deleteEvent(this.event.id)
                .then((eventId)=>
                    { 
                        let index: number = this.findEventIndexById(eventId); 
                        if(index >= 0) {
                            this.events.splice(index, 1);
                            localStorage.removeItem('date_key');
                        }
                        this.event = null;
                    }
                )
                .catch(this.handleError);
        }else{
            alert("Error inesperado, intente nuevamente.");
        }
        this.dialogVisible = false;
    }    
    findEventIndexById(id: number) {
        let index = -1;
        for(let i = 0; i < this.events.length; i++) {
            if(id == this.events[i].id) {
                index = i;
                break;
            }
        }
        
        return index;
    }
    imInterviewer(){
        if(this.iminterviewer){
            this.iminterviewer=false;
            this.event.interviewer = this.previousInterviewer;
        }else{
            this.previousInterviewer = this.event.interviewer;
            this.iminterviewer=true;
            this.event.interviewer = this.user;
        }
    }
    clearFlags(){
        this.startFlag='false';
        this.endFlag='false';
        this.startHourFlag='false';
        this.endHourFlag='false';
        this.interviewerFlag='false';
        this.emailFlag='false';
        this.titleFlag='false';
        this.placeFlag='false';
    }
    doubleValidation(){
        this.globalOnChange({target:{id:'title',value:this.event.title}});
        this.globalOnChange({target:{id:'place',value:this.event.place}});
        this.globalOnChange({target:{id:'interviewer',value:this.event.interviewer}});
        this.globalOnChange({target:{id:'interviewerEmail',value:this.event.interviewerEmail}});
        this.globalOnChange({target:{id:'hourStart',value:this.event.hourStart}});
        this.globalOnChange({target:{id:'hourEnd',value:this.event.hourEnd}});
    }
    checkValidForm(){
        if(
            this.startFlag == '' &&
            this.endFlag == '' &&
            this.startHourFlag == '' &&
            this.endHourFlag == '' &&
            this.interviewerFlag == '' &&
            this.emailFlag  == '' &&
            this.titleFlag == '' &&
            this.placeFlag == ''
        ){
            this.validForm=true;
        }
    }
    globalOnChange(event:any){
        let input=event.target.id;
        let value = event.target.value;
        switch (input) {
            case 'title':
                if(value!=''){
                    if(value.length<4){
                        this.titleFlag="minlength";
                    }else{
                        if(value.length>15){
                            this.titleFlag="maxlength";
                        }else{
                            this.titleFlag="";
                            this.checkValidForm();
                        }                        
                    }
                }else{
                    this.titleFlag="empty";
                }
                break;
            case 'place':
                if(value!=''){
                    if(value.length<4){
                        this.placeFlag="minlength";
                    }else{
                        this.checkValidForm();
                        this.placeFlag="";
                    }
                }else{
                    this.placeFlag="empty";
                }
                break;
            case 'interviewer':
                if(value!=''){
                    if(value.length<4){
                        this.interviewerFlag="minlength";
                    }else{
                        if(value.lenght>25){
                            this.interviewerFlag="maxlength";
                        }else{
                            this.checkValidForm();
                            this.interviewerFlag="";
                        }                        
                    }
                }else{
                    this.placeFlag="empty";
                }
                break;
            case 'interviewerEmail':
                if(value!=''){
                    if(!validateEmail(value)){
                        this.emailFlag="format"
                    }else{
                        if(validateEmailDomain(value)){
                            this.emailFlag="domain"
                        }else{
                            this.checkValidForm()
                            this.emailFlag=""
                        }                        
                    }
                }else{

                    this.emailFlag="empty";
                }
                break;
            case 'hourStart':
                if(value!=''){
                    if(value.length < 5 || !validateHourFormat(value) || value.length > 5){
                        this.startHourFlag="invalid"
                    }else{
                        if(this.event.hourEnd != undefined && this.event.hourEnd != null && (moment(this.event.start).format('YYYY-MM-DD') == moment(this.event.end).format('YYYY-MM-DD'))){
                            let startHour = value+":00";
                            let endHour = this.event.hourEnd+":00";
                            if(startHour > endHour){
                                this.startHourFlag="high"
                            }else{
                                this.checkValidForm()
                                this.startHourFlag=""

                            }
                        }else{
                            this.checkValidForm()
                            this.startHourFlag=""
                        }                        
                        
                    }
                }else{
                    this.startHourFlag="empty"
                }
                break;
            case 'hourEnd':
                if(value!=''){
                    if(value.length < 5 || !validateHourFormat(value) || value.length > 5){
                        this.endHourFlag="invalid"
                    }else{                        
                        if(this.event.hourStart != undefined && this.event.hourStart != null && (moment(this.event.start).format('YYYY-MM-DD') == moment(this.event.end).format('YYYY-MM-DD'))){
                            let startHour = this.event.hourStart+":00";
                            let endHour = value+":00";
                            if(startHour > endHour){
                                this.endHourFlag="lower"
                            }else{
                                this.checkValidForm()
                                this.endHourFlag=""
                            }
                        }else{
                            this.checkValidForm()
                            this.endHourFlag=""
                        }
                        
                    }                    
                }else{
                    this.endHourFlag="empty"
                }
                break;
        }
    }
    verifyLocalStorageExpiration(){
        let hours = 24;
        let now = new Date().getTime();
        let setupTime = localStorage.getItem('setupTime');
        if (setupTime == null) {
            localStorage.setItem('setupTime', now.toString())
        } else {
            if(now-parseInt(setupTime) > hours*60*60*1000) {
                localStorage.clear()
                localStorage.setItem('setupTime', now.toString());
            }
        }
    }
    //Overlay panel
    handleEventMouseOver(e:any){ }    
    //Updates event dates on drag&drop
    handleEventDrop(e:any){ 
        this.updateEvent(e.event);  
    }    
    //Event fetch on view change (Prev, next, weekly, day, monthly)
    handleViewRender(e:any){
        this.viewStartDate = e.view.dayGrid.start.format();
        this.viewEndDate = e.view.dayGrid.end.format();
        var hours = 24; // Reset when storage is more than 24hours
        this.verifyLocalStorageExpiration();
        if(!localStorage.getItem('date_key')){
            this.eventService.getEvents(this.viewStartDate,this.viewEndDate)
                .subscribe(
                    data => {
                        this.storageService.setLocalStorage('date_key', data.data, this.viewStartDate);                
                        this.events = JSON.parse(localStorage.getItem('date_key')).data;
                        this.events.forEach(
                            (ev) => {
                                if(ev.id>this.idGen){
                                    this.idGen = ev.id+1
                                }
                            }
                        )
                    },
                    error => "No event"
                )
        }else{
            let param = JSON.parse(localStorage.getItem('date_key')).params;
            if(param === this.viewStartDate){
                this.events = JSON.parse(localStorage.getItem('date_key')).data;
            }else{
                this.eventService.getEvents(this.viewStartDate,this.viewEndDate)
                    .subscribe(
                        data => {
                            this.events = data.data;
                            this.events.forEach(
                                (ev) => {
                                    if(ev.id>this.idGen){
                                        this.idGen = ev.id+1
                                    }
                                }
                            )
                        },
                        error => "No events"
                    )
            }
        }
    }
    handleEventMouseOut(e:any){ }
    handleEventDragStart(e:any){ }
    handleEventDragStop(e:any){ }
    handleEventResizeStart(e:any){ }
    handleEventResizeStop(e:any){ }
    handleEventResize(e:any){ }
    handleOnDrop(e:any){ }
}


/**
 * SE
 * DETIENE
 * EL
 * DESARROLLO
 * HASTA
 * NUEVO
 * AVISO
 * GG
 * IZI
 * WP
 */