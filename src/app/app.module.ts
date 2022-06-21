import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EventPageModule } from './event/event.module';
import { IonicStorageModule } from '@ionic/storage-angular';
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,IonicStorageModule.forRoot(), IonicModule.forRoot(),
    EventPageModule, AppRoutingModule,AngularFireStorageModule,AngularFireDatabaseModule,AngularFireModule.initializeApp(environment.firebaseConfig)],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
