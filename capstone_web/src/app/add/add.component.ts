import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  constructor(private route: ActivatedRoute,private router:Router, private http:HttpClient) { }

  ngOnInit() {
  }

  move_doctor(){
    this.router.navigate(['doctor'])
  }

}
