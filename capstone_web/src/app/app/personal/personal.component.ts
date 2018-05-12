import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { FileUploader } from 'ng2-file-upload';


const URL = 'http://capstone.cafe24app.com/v/';


@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})


export class PersonalComponent implements OnInit {

//
uploader:FileUploader;
hasBaseDropZoneOver:boolean;
hasAnotherDropZoneOver:boolean;
response:string;
//

  id:number;
  data:any;
  no:any;
  sex:any ="no";


  


  constructor(private route: ActivatedRoute,private router:Router, private http:HttpService) { 

    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise( (resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe( res => this.response = res );


  }


  ngOnInit() { 
  //   this.route.params.subscribe(params => {
  //     this.id = +params['no']; // (+) converts string 'id' to a number
  //     console.log('으아앙');
  //     console.log(this.id)
  //     // In a real app: dispatch action to load the details here.
  //  });
   this.data_load()
  }

  data_load(){

    this.no = JSON.parse(localStorage.getItem('currentUser')).no;

    let body = {
      user_no:this.no
    }
    this.http.post('/v/patient/info',body)
    .subscribe((data:any)=>{
      // let data ={
      //   no:'1',
      //   name:"kim",
      //   type:2,
      //   sex:"man",
      //   brithday: 704024,
      //   score:3
      // } 
      this.data = data.json(); 
      console.log(this.data);
      if(this.data[0].gender == "0")
      {
        this.sex = "Man";
      }
      else if(this.data[0].gender == "1")
      {
        this.sex = "Woman";
      }


      })
      
  }


  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }


  move_doctor(){
    this.router.navigate(['doctor'])
  }

  move_add(){
    this.router.navigate(['add'])
  }
  changUrl(str){
    this.router.navigate([str])
  }
}
