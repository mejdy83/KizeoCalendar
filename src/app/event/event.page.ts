import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { DatePipe, formatDate } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

import{EmailComposer} from '@ionic-native/email-composer/ngx';
@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.css'],
})
export class EventPage implements OnInit {
  title: string;
  imageURL: string;
  mail=[];
  description: string;
  start: string;
  end: string;
  key: any;

  constructor(
    public modalController: ModalController,
    public emailComposer: EmailComposer, 
    private router: Router,
    public navParams: NavParams, 
    public afDB: AngularFireDatabase)
    {
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
  sendMail() {
  //   let email = {
  //     to: 'support@tub.bzh',
  //     cc: '',
  //     subject: 'Support application transporteur TUB',
  //     body: 'Bonjour, <br><br> Je recontre actuellement un problème XXXXXXX .<br><br> Merci pour votre aide.<br> Cordialement,',
  //     isHtml: true
  //   };
  //   this.emailComposer.open(email);
  // }
      
    
    this.emailComposer.isAvailable().then((available) =>{
      if(available) {
        
        console.log("ici");
        let email = {
          to: this.mail,
          cc: '',
          bcc:'',
          attachments: [
            
          ],
          subject: 'Kizeo Calendar : Invitation à un évènement:'+this.title,
          body: "Un utilisateur souhaite vous inviter à l'évènement"+this.description+" à partir de "+formatDate(this.navParams.get('startTime'), 'medium', 'fr-FR')+" au "+formatDate(this.navParams.get('startTime'), 'medium', 'fr-FR'),
          isHtml: false
        }
      
        this.emailComposer.open(email);
      }
      else{
        
        console.log("LA");
        
      }
      }).catch((error)=>console.log(error));}
    
  
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
