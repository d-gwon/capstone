import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  no:any;
  id:any;
  pwd:any;
  user:any;
  constructor(private router:Router,private http:HttpService) { 
    // this.check();
  }
 
  ngOnInit() {
   this.login();
    
  } 
  
  // check(){
  //   if(localStorage.getItem('currentUser')){
  //     const data = JSON.parse(localStorage.getItem('currentUser'))
  //     console.log("???");
  //     console.log(data);
  //     if(data.type == 1)
  //       this.router.navigate(['doctor'])
  //     else(data.type == 2)
  //       this.router.navigate(['patient'])   
  //   };
  // }

  login(){
    
    let body = {
      id:this.id,
      password:this.pwd
    }
     this.http.post('/v/login',body)
     .subscribe((datas:any)=>{
      console.log('aa'); 
      console.log(datas);
      //  let data = {
      //    name:"kim",
      //    type:2
      //  }
      this.user=datas.json();
       localStorage.setItem('currentUser', JSON.stringify({no:this.user[0].user_no}));
      console.log(this.user[0].type);
      console.log(this.user[0].user_no);

      this.no = JSON.parse(localStorage.getItem('currentUser')).no;
      console.log('TEST');
      console.log(this.no);
      if(this.user[0].type === 1)
        this.router.navigate(['doctor'])
      else if(this.user[0].type === 0) 
        {     
          // this.router.navigate(['xavg',this.user[0].user_no]);                
          // this.router.navigate(['accumulated',this.user[0].user_no]);                
          this.router.navigate(['patient']);      
        }
     })
  }

  

}
