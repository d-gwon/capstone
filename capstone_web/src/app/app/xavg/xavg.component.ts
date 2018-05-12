import { Component, OnInit,Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-xavg',
  templateUrl: './xavg.component.html',
  styleUrls: ['./xavg.component.css']
})
export class XavgComponent implements OnInit {

  @Input() user_id:any;
  value:any;
  no:any;
  date:any;
  dateNow:any;
  constructor(private router:Router, private route: ActivatedRoute, private http:HttpService,private datePipe: DatePipe) { }

  ngOnInit() {
    this.avg();
  };



  avg(){
    this.date = new Date();
    this.dateNow = this.datePipe.transform(this.date,"yyyy-MM-dd");
    
    this.no = JSON.parse(localStorage.getItem('currentUser')).no;
    console.log('응아아앙');
    console.log(this.no);
    console.log(this.dateNow);
    let body = {
      user_no:this.no,
      day:this.dateNow
    }
     this.http.post('/v/average',body)
     .subscribe((datas:any)=>{


      this.value =datas.json();
      console.log(this.value[0].avg);
      
     });
  }
}
