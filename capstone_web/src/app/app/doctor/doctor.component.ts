import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  datas:any;
  man:any="Man";
  woman:any="Woman";
  constructor(private router:Router, private http:HttpService ) { }

  ngOnInit() {
    this.data_load()
  }

  data_load(){
    this.http.get('/v/researcher',{})
    .subscribe((item:any)=>{

    this.datas = item.json();
    
    
    
    })
  }//end data_load
  person(no){
    localStorage.setItem('currentUser', JSON.stringify({no:no}));
    this.router.navigate(['personal',{no:no}])
  }

  move_add(){
    this.router.navigate(['add'])
  }
}//end oninit
