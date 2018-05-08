import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {

  data:any;
  fft_no:any;
  label:any[] = [];
  date:any;
  dateNow:any;
  user_no:any;

  constructor(private http:HttpService,private datePipe: DatePipe) { 
  }

  ngOnInit() { 
     this.load(); 
   
  }
  
  load(){
    let data = [
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	542,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	908,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	876,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	344,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:987,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	345,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2},
      {timestamp : '2018-04-11 1:40',x_hz:	2.54,    x_amp:	959.57,   y_hz:	3.07, y_amp:	1866.1, z_hz:	5.25,  z_amp:	2582.55	  ,no :2}
    ];
    // this.http.get('/v/fft')
    // .subscribe((items:any)=>{
    //   this.data = items.json();
    //   //this.fft_no = items[0].timestamp;
    this.data = data; 
      console.log(this.data);
      let len = this.data.length;
      if(len > 60)
      len = 60;
      /* x axi*/
      let Arr:Array<any>=[];
      for(let i = 0; i < len ; i++)
      {
        
         console.log(this.data[i])
        this.lineChartData[0].data[i] = this.data[i].x_amp;
        this.lineChartData[1].data[i] = this.data[i].y_amp;
        this.lineChartData[2].data[i] = this.data[i].z_amp;
        Arr.push(this.data[i].timestamp)
        // this.lineChartLabels[i] = this.data[i].timestamp;
        // this.data[i].timestamp
      }
      this.lineChartLabels = Arr;

  //})
  }
  public lineChartData:Array<any> = [
    {data: [], label: 'acccel_x'},
    {data: [], label: 'acccel_y'},
    {data: [], label: 'acccel_z'}

  ];

  public lineChartLabels:Array<any> = [];
 
  
  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  changetime(day){
    this.date.setDate( this.date.getDate() + day );
    this.dateNow = this.datePipe.transform(this.date,"yyyy-MM-dd");
//    this.count(this.dateNow);  
  }
  // count(date){
  //   this.http.get(`/v/count?date=${date}&user_no=${this.user_no}`)    
  //   .subscribe((items:any)=>{
  //     this.data = items.json();
  //     if(this.data.length == 0){
  //       this.barChartData = [{data:[0], label:'Parkinson\'tremor' }];
  //     } else {
  //       console.log(this.data)

  //       let Arr:any[]=[{data:[0], label:'Parkinson\'tremor' }];

  //       for(let i=0; i<this.data.length; i++)
  //       {
  //         Arr[0].data.push(this.data[i].count);
  //       }
        
  //       this.barChartData = Arr;
  //       }
  //   })
  // }
}
