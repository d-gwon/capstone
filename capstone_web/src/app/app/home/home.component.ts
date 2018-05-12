import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import { InfoComponent} './info.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  datas:any;
  no:any;
  Morris
  constructor(private router:Router, private route: ActivatedRoute, private http:HttpService) { }

  // info(){
  //   this.router.navigate(['info'])
  // }

  ngOnInit() {
    this.name();
  }
changUrl(str){
  this.router.navigate([str])
}

  name(){
    this.no = JSON.parse(localStorage.getItem('currentUser')).no;
    console.log(this.no,'what');
    let body = {
      user_no:this.no
    }
    this.http.post('/v/patient/info',body)
    .subscribe((item:any)=>{

    this.datas = item.json();
      console.log(this.datas);
    });

  }

}

