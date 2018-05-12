import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  data:any;
  fft_no:any;
  dateNow:any;
  date:any;
  user_no:any;

  constructor(private http:HttpService,private datePipe: DatePipe) { }

  ngOnInit() {
    this.date = new Date();
    this.dateNow = this.datePipe.transform(this.date,"yyyy-MM-dd");
    this.count(this.dateNow);
  }
  changeDay(day){
    this.date.setDate( this.date.getDate() + day );
    this.dateNow = this.datePipe.transform(this.date,"yyyy-MM-dd");
    this.count(this.dateNow);  
  }
  count(date){
    this.user_no = JSON.parse(localStorage.getItem('currentUser')).no;
    console.log('graph');
    console.log(this.user_no);
    console.log(this.date);
    this.http.get(`/v/count?date=${date}&user_no=${this.user_no}`)    
    .subscribe((items:any)=>{
      this.data = items.json();
      if(this.data.length == 0){
        this.barChartData = [{data:[0], label:'Parkinson\'tremor' }];
      } else {
        console.log(this.data)

        let Arr:any[]=[{data:[0], label:'Parkinson\'tremor' }];

        for(let i=0; i<this.data.length; i++)
        {
          Arr[0].data.push(this.data[i].count);
        }
        
        this.barChartData = Arr;
        }

    });


  }
  
  
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };



  public barChartLabels:string[] = ['', '1', '2', '3', '4', '5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  // public barChartData:any[] = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Parkinson\'tremor'}
  //   //{data: [28, 48, 40, 19, 86, 27, 90], label: ''}
  // ];
  public barChartData:any[] = [ 
    {data:[], label:'Parkinson\'tremor' }
  ];


  // eventss
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
 
  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }
}
