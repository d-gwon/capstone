import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})

export class PersonalComponent implements OnInit {
  id:number;
  data:any;
  constructor(private route: ActivatedRoute,private router:Router, private http:HttpClient) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.id = +params['no']; // (+) converts string 'id' to a number
      console.log(this.id)
      // In a real app: dispatch action to load the details here.
   });
   this.data_load()
  }

  data_load(){
    //this.http.post('/v/patient/info?id=${id}',{})
    //.subscribe((data:any)=>{
      let data ={
        no:'1',
        name:"kim",
        type:2,
        sex:"man",
        brithday: 704024,
        score:3
      } 
      this.data = data; 
    //  }
  }

  navi(){
    this.router.navigate(['doctor'])
  }
}
