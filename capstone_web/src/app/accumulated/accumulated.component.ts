import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service'
@Component({
  selector: 'app-accumulated',
  templateUrl: './accumulated.component.html',
  styleUrls: ['./accumulated.component.css']
})
export class AccumulatedComponent implements OnInit {
  garago:any;
  constructor(private http:HttpService) { 
    this.load();
  }

  ngOnInit() {
  }
  load(){
    this.http.get('/')
    .subscribe((data:any)=>{
      data = data.json();
      this.garago = data.value;
    })
  }
  
}
