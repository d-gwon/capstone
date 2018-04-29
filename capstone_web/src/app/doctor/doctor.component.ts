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
    //this.http.post('/v/patient/info',{})
    //.subscribe((data:any)=>{
    let data =[{
      no:'1',
      name:"kim",
      type:2,
      sex:"man",
      brithday: 704024,
      score:3
    },
    {
      no:'2',
      name:"kimsang",
      type:2,
      sex:"man",
      brithday: 704024,
      score:3
    }] 
    this.data = data; 
  //  }
  console.log(this.data);

  }//end data_load
  person(no){
    this.router.navigate(['personal',{no:no}])
  }
}//end oninit
