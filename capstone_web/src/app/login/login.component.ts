import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  id:any;
  pwd:any;
  constructor(private router:Router,private http:HttpClient) { 
    // this.check();
  }
  check(){
    if(localStorage.getItem('currentUser')){
      let data = JSON.parse(localStorage.getItem('currentUser'))
      if(data.type == 1)
        this.router.navigate(['doctor'])
      else(data.type == 2)
        this.router.navigate(['patient'])   
      
    };
  }

  login(){
     //this.http.post('/v/login',{})
     //.subscribe((data:any)=>{
       let data = {
         name:"kim",
         type:2
       }
      localStorage.setItem('currentUser', JSON.stringify({name:data.name,type:data.type}));
      if(data.type == 1)
        this.router.navigate(['doctor'])
      else(data.type == 2)
        this.router.navigate(['patient'])      
     //})
    
  }

  ngOnInit() {
  }

}
