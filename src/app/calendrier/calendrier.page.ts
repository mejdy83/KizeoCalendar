import { Component, OnInit ,ViewChild} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CalendarComponent, CalendarMode } from 'ionic2-calendar/calendar';
import { CalendarService } from 'ionic2-calendar/calendar.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { EventPage } from '../event/event.page';
@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.page.html',
  styleUrls: ['./calendrier.page.scss'],
})
export class CalendrierPage implements OnInit {
  currentDate = new Date();
  currentMonth: string;
  showAddEvent: boolean;
  minDate = new Date().toISOString();
  allEvents = [];
  newEvent = {
    title: '',
    description: '',
    imageURL: '',
    startTime: '',
    endTime: '',
    mail:''
  };
  @ViewChild(CalendrierPage, {static: false}) myCalendar: CalendarComponent;
  constructor(public modalController: ModalController,public storage:Storage,
    public afDB: AngularFireDatabase) {
    this.loadEvent()
   }
  async checkStorage(){
    
    
    this.storage.forEach((key, value, index) => {
      console.log(key.key)
      if(key.key==''){
        this.afDB.list('Events').push({
          title: key.title,
          startTime:  (key.startTime),
          endTime: (key.endTime),
          description: key.description,
          imageURL: key.imageURL,
          mail:key.mail
        });
      }
    });
  }
  showHideForm(){ 
    this.showAddEvent = !this.showAddEvent;
    this.newEvent = {
      title: '',
      description: '',
      imageURL: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      mail:''
    };
  }
  
  async addEvent() {
    //console.log(this.newEvent)
    this.afDB.list('Events').push({
      title: this.newEvent.title,
      startTime:  (this.newEvent.startTime),
      endTime: (this.newEvent.endTime),
      description: this.newEvent.description,
      imageURL: this.newEvent.imageURL,
      mail:this.newEvent.mail
    });
    await this.storage.set('', {
      title: this.newEvent.title,
      startTime:  this.newEvent.startTime,
      endTime: this.newEvent.endTime,
      description: this.newEvent.description,
      imageURL: this.newEvent.imageURL,
      mail:this.newEvent.mail,
    });
    this.showHideForm();
    this.loadEvent();
  }
 
  loadEvent() {
    //console.log(this.myCalendar)
    if(navigator.onLine){
      this.afDB.list('Events').snapshotChanges(['child_added']).subscribe(actions => {
        this.allEvents=[]
        actions.forEach(async action => {
         // console.log('date'+action.payload.exportVal().endTime);
          this.allEvents.push({
            title: action.payload.exportVal().title,
            startTime:  new Date(action.payload.exportVal().startTime),
            endTime: new Date(action.payload.exportVal().endTime),
            description: action.payload.exportVal().description,
            imageURL: action.payload.exportVal().imageURL,
            mail:action.payload.exportVal().mail,
            key:action.key
          });
          await this.storage.set(action.key, {
            title: action.payload.exportVal().title,
            startTime:  new Date(action.payload.exportVal().startTime),
            endTime: new Date(action.payload.exportVal().endTime),
            description: action.payload.exportVal().description,
            imageURL: action.payload.exportVal().imageURL,
            mail:action.payload.exportVal().mail,
            key:action.key
          });
        });
      });

    }
    else{
      this.storage.forEach((key, value, index) => {
       // console.log(key.key)
        this.allEvents.push(key);
        console.log(key)
      });
    }
   // console.log(this.allEvents)
  }
  onViewTitleChanged(title: string) {
    this.currentMonth = title;
  }
  async onEventSelected(event: any) {
    console.log('Event: ' + JSON.stringify(event));
    const modal = await this.modalController.create({
      component: EventPage,
      componentProps: event
    })
    modal.onDidDismiss().then(()=>
    this.loadEvent())
    
    modal.present();
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  onTimeSelected(ev: any) {
    const selected = new Date(ev.selectedTime);
    this.newEvent.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.newEvent.endTime = (selected.toISOString());
  }
  async ngOnInit() {
    this.loadEvent()
    await this.storage.create();
  }

}
