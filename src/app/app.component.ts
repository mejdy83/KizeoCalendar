import { Component } from '@angular/core';  
import { Router } from '@angular/router';
 import { Platform } from '@ionic/angular';  
 import { Storage } from '@ionic/storage-angular';
@Component({  
   selector: 'app-root',  
   templateUrl: 'app.component.html',  
   styleUrls: ['app.component.scss']  
 })  
 export class AppComponent {  
   navigate: any;  
  
   constructor(  private storage: Storage, 
     private platform: Platform,  private router: Router,
     
   ) {   
    this.sideMenu()
    this.router.navigateByUrl('/calendrier');
   }  
   async ngOnInit(){
    await this.storage.create();
    console.log(navigator.onLine)
   }
   initializeApp() {  
     this.platform.ready().then(() => {  
      
     });  
   }  
   sideMenu() {  
     this.navigate =   
     [  
         { 
         title : 'Calendrier',
         url   : '/calendrier',
         icon  : 'calendar' 
         },
       { 
         title : 'Liste des events',  
         url   : '/home',  
         icon  : 'book'  
       },
       { 
        title : 'Statistiques',  
        url   : '/stat',  
        icon  : 'book'  
      }
       
     ];  
   }  
 } 