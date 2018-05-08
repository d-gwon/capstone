import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TestComponent } from './test/test.component';
import { ChartsModule } from 'ng2-charts';
import { Test2Component } from './test2/test2.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpService } from '../services/http.service';
import { ServerAddr } from '../services/server.addr';
import { HttpModule } from '@angular/http';
import {DatePipe} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoUtilsModule } from './utils';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PersonalComponent } from './personal/personal.component';
import { XavgComponent } from './xavg/xavg.component';
import { AccumulatedComponent } from './accumulated/accumulated.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';


const appRoutes: Routes = [

  {path: '', component: LoginComponent },
  {path: 'doctor', component:  DoctorComponent},
  {path: 'personal', component:  PersonalComponent},
  {path: 'patient', component:  HomeComponent},
  {path: 'info', component:  InfoComponent},
  {path: 'add', component:  AddComponent}


]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    Test2Component,
    CalendarComponent,
    LoginComponent,
    DoctorComponent,
    XavgComponent,
    AccumulatedComponent,
    InfoComponent,
    PersonalComponent,
    AddComponent
    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ChartsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgbModalModule.forRoot(),
    DemoUtilsModule ,
    FormsModule
  ],
  providers: [HttpService,ServerAddr,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
