import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { DatePipe, formatDate } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.css'],
})
export class EventPage implements OnInit {
  title: string;
  imageURL: string;
  mail: string;
  description: string;
  start: string;
  end: string;
  key: any;

  constructor(public modalController: ModalController, private router: Router,
    public navParams: NavParams, public afDB: AngularFireDatabase) {
    this.title = navParams.get('title');
    this.imageURL = navParams.get('imageURL');
    this.mail = navParams.get('mail');
    this.description = navParams.get('description');
    this.start = formatDate(navParams.get('startTime'), 'medium', 'en-EN');
    this.end = formatDate(navParams.get('endTime'), 'medium', 'en-EN');
    this.key = navParams.get('key');
  }
  close() {
    
    this.modalController.dismiss();

  }
  delete() {
    this.afDB.list('Events').remove(this.key);
    this.close();
  }
  update(){
    const date1=new Date(this.end).toISOString()
    console.log(date1)
    this.afDB.list('Events').update(this.key,{
      title: this.title,
      startTime:  new Date(this.start).toISOString(),
      endTime: new Date(this.end).toISOString(),
      description: this.description,
      imageURL: this.imageURL,
      mail:this.mail
    })
    this.close();
  }
  ngOnInit() {
  }

}
