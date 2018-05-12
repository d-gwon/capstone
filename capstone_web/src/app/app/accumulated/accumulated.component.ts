import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-accumulated',
  templateUrl: './accumulated.component.html',
  styleUrls: ['./accumulated.component.css']
})
export class AccumulatedComponent implements OnInit {
  
  value:any;
  no:any;
  id:any;
  date:any;
  dateNow:any;
  constructor(private route: ActivatedRoute, private router:Router, private http:HttpService,private datePipe: DatePipe) { 
    
  }

  ngOnInit() {

    this.load();
  }
  load(){
    this.date = new Date();
    this.dateNow = this.datePipe.transform(this.date,"yyyy-MM-dd");
    
    this.no = JSON.parse(localStorage.getItem('currentUser')).no;
    
    let body = {
      user_no:this.no,
      day:this.dateNow
    }
     this.http.post('/v/sum',body)
     .subscribe((datas:any)=>{


      this.value =datas.json();
      
     })
  }
}
