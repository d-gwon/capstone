import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { InfoComponent} './info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data:any;
  Morris
  constructor(private router:Router, private http:HttpClient) { }

  info(){
    this.router.navigate(['info'])
  }

  ngOnInit() {
  
  }
changUrl(str){
  this.router.navigate([str])
}

}

