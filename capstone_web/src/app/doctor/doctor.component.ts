import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  data:any;
  constructor(private router:Router, private http:HttpClient ) { }

  ngOnInit() {
    this.data_load()
  }

  data_load(){
    this.http.get('/v/researcher',{})
    .subscribe((item:any)=>{

    this.data = item; 
    })
  }//end data_load
  person(no){
    this.router.navigate(['personal',{no:no}])
  }

  move_add(){
    this.router.navigate(['add'])
  }
}//end oninit
