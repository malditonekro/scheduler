import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import 'bootstrap/dist/css/bootstrap.css';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {  ButtonModule,
          CheckboxModule,
          ConfirmDialogModule, 
          DialogModule,
          FileUploadModule,
          InputTextModule, 
          InputMaskModule,          
          OverlayPanelModule,
          ScheduleModule } from 'primeng/primeng';
import { TitleCasePipe } from './pipes/master.pipes';          
//Services
import { EventService } from './services/event.service';
import { ApplicantService } from './services/applicant.service';
import { StorageService }from './shared/services/storage.service';
//Components
import { AppComponent }  from './app.component';
import { Booking } from './components/booking/booking.component';
import { ModalCustom } from './components/modal/modal.component';

@NgModule({
  imports: [ 
    BrowserModule, 
    HttpModule, 
    NgbModule.forRoot(),
    FormsModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule, 
    DialogModule,
    FileUploadModule,
    InputTextModule, 
    InputMaskModule,
    OverlayPanelModule,          
    ScheduleModule    
  ],
  declarations: [ 
    AppComponent, 
    Booking,
    ModalCustom,
    TitleCasePipe
  ],
  providers: [
    ApplicantService, 
    EventService,
    StorageService
    ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }