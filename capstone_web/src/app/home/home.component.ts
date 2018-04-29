import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data:any;
  Morris
  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit() {
    //this.load();
  //   document.getElementById('dashboard-bar-1').data = this.data;

  //   this.Morris.Bar({
  //     element: 'dashboard-test',
  //     data: [
  //         { y: 'Oct 10', a: 75, b: 35 },
  //         { y: 'Oct 11', a: 64, b: 26 },
  //         { y: 'Oct 12', a: 78, b: 39 },
  //         { y: 'Oct 13', a: 82, b: 34 },
  //         { y: 'Oct 14', a: 86, b: 39 },
  //         { y: 'Oct 15', a: 94, b: 40 },
  //         { y: 'Oct 16', a: 96, b: 41 }
  //     ],
  //     xkey: 'y',
  //     ykeys: ['a', 'b'],
  //     labels: ['New Users', 'Returned'],
  //     barColors: ['#33414E', '#1caf9a'],
  //     gridTextSize: '10px',
  //     hideHover: true,
  //     resize: true,
  //     gridLineColor: '#E5E5E5'
  // });
  }
changUrl(str){
  this.router.navigate([str])
}

}
