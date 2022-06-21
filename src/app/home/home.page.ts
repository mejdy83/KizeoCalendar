import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  allEvents: any[];
 searchTerm:string;
  constructor(public afDB: AngularFireDatabase) {}
ngOnInit(){
  this.loadEvent()
}
loadEvent() {
  //console.log(this.myCalendar)
  this.afDB.list('Events').snapshotChanges(['child_added']).subscribe(actions => {
    this.allEvents=[]
    actions.forEach(action => {
      console.log(action.key)
    //   this.start = formatDate(new Date(action.payload.exportVal().startTime), 'medium', 'fr-FR');
    // this.end = formatDate(navParams.get('endTime'), 'medium', 'fr-FR'); }
     // console.log('date'+action.payload.exportVal().endTime);
      this.allEvents.push({
        key:action.key,
        title: action.payload.exportVal().title,
        startTime:  formatDate(new Date(action.payload.exportVal().startTime), 'medium', 'fr-FR'),
        endTime: formatDate(new Date(action.payload.exportVal().endTime), 'medium', 'fr-FR'),
        description: action.payload.exportVal().description,
        imageURL: action.payload.exportVal().imageURL
      });
      
    });
  });
  console.log(this.allEvents)
}
}
