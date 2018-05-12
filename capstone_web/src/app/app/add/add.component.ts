import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  id:any;
  password:any;
  name:any;
  email:any;
  phone:any;
  gender:any;
  birth:any;
  type:any=0;
  parkinson:any=0;

  haha:any;
  constructor(private route: ActivatedRoute,private router:Router, private http:HttpService) { }

  ngOnInit() {
    this.register();
  }

  move_doctor(){
    this.router.navigate(['doctor'])
  }

  register(){
    
    let body = {
      type:this.type,
      password:this.password,
      birth:this.birth,
      gender:this.gender,
      parkinson:this.parkinson,
      name:this.name,
      email:this.email,
      id:this.id,
      phone:this.phone

    }
     this.http.post('/v/register',body)
     .subscribe((datas:any)=>{
      console.log('aa'); 
      console.log(datas);
      //  let data = {
      //    name:"kim",
      //    type:2
      //  }
      this.haha=datas.json();
      console.log("haha");
      console.log(this.haha);
     
        this.router.navigate(['doctor'])
     
     })
  }


}
