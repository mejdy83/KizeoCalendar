import { Component, OnInit ,ViewChild} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { EventPage } from '../event/event.page';
import { ActionSheetController } from '@ionic/angular';
import { ImagePicker,ImagePickerOptions } from '@awesome-cordova-plugins/image-picker/ngx';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.page.html',
  styleUrls: ['./calendrier.page.scss'],
})
export class CalendrierPage implements OnInit {
  currentDate = new Date();
  currentMonth: string;
  showAddEvent: boolean;
  securepath: any = window;
  url:any;
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
  foo: any;
  imageurl: any;
  constructor(public modalController: ModalController, private camera: Camera,private actionsheet: ActionSheetController,public storage:Storage,
    public afDB: AngularFireDatabase,private imagePicker: ImagePicker,private domsanitize: DomSanitizer) {
    this.loadEvent()
   }

   pickImagesFromLibrary(){
    const options: ImagePickerOptions = {
      quality: 100,
      maximumImagesCount: 1,
    };
    this.imagePicker.getPictures(options).then((imageresult)=> {
    console.log('image Picker Results', imageresult);

     for(let i=0; i<imageresult.length; i++){
      this.url = this.securepath.Ionic.WebView.convertFileSrc(imageresult[i]);
     }
    }, rror=>{
      console.log('Image Picker Error:', rror);
    });
  }
  async selectimageOptions(){
    const actionsheet = await this.actionsheet.create({
     header: "Choisissez la source de l'image",
     buttons: [
       {
         text: 'Choisir dans la gallerie',
         handler: ()=>{
           this.pickImagesFromLibrary();
           console.log('Image Selected from Gallery');
         }
       },
       {
         text: 'Prendre une photo',
         handler: ()=>{
           this.chooseFromCamera(this.camera.PictureSourceType.CAMERA);
           console.log('Camera Selected');
         }
       },
       {
         text: 'Annuler',
         role: 'cancel'
       }
     ]
    });
    await actionsheet.present();
  }
  chooseFromCamera(sourceType){
    const options: CameraOptions = {
       quality: 100,
       mediaType: this.camera.MediaType.PICTURE,
       destinationType: this.camera.DestinationType.FILE_URI,
       encodingType: this.camera.EncodingType.JPEG,
       sourceType: sourceType,
    };

    this.camera.getPicture(options).then((result) => {
      console.log('Camera URL',result);
      // this.imageurl = result;
      this.imageurl = this.securepath.Ionic.WebView.convertFileSrc(result);
    }, error=>{
      console.log('Error CAMERA', error);
    });
  }
  sanitizeUrl(imageUrl){
    return this.domsanitize.bypassSecurityTrustUrl(imageUrl);
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
    console.log(this.newEvent.mail.split(','))
    this.afDB.list('Events').push({
      title: this.newEvent.title,
      startTime:  (this.newEvent.startTime),
      endTime: (this.newEvent.endTime),
      description: this.newEvent.description,
      imageURL: this.newEvent.imageURL,
      mail:this.newEvent.mail.split(',')
    });
    await this.storage.set('', {
      title: this.newEvent.title,
      startTime:  this.newEvent.startTime,
      endTime: this.newEvent.endTime,
      description: this.newEvent.description,
      imageURL: this.newEvent.imageURL,
      mail:this.newEvent.mail.split(','),
    });
    this.showHideForm();
    this.loadEvent();
  }
 
  loadEvent() {
    console.log(this.minDate)
    //console.log(this.myCalendar)
    if(navigator.onLine){
      this.foo=this.afDB.list('Events').snapshotChanges(['child_added']).subscribe(actions => {
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
  ionViewDidLeave() {
    this.foo.unsubscribe();
  }
}
