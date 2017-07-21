import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';


import { MyApp }                  from './app.component';
import { HomePage }               from '../pages/home/home';
import { RecentChatListPage }     from '../pages/recent-chat-list/recent-chat-list';
import { ChatDetailsPage }        from '../pages/chat-details/chat-details';
import { AddNewChatPage }         from '../pages/add-new-chat/add-new-chat';
import { CreateGroupPage }        from '../pages/create-group/create-group';
import { SelectParticipantPage }  from '../pages/select-participant/select-participant';


import { FirebaseServiceProvider } from '../providers/firebase-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RecentChatListPage,
    ChatDetailsPage,
    AddNewChatPage,
    CreateGroupPage,
    SelectParticipantPage,
   
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RecentChatListPage,
    ChatDetailsPage,
    AddNewChatPage,
    CreateGroupPage,
    SelectParticipantPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseServiceProvider,
    Camera,
    File
  ]
})
export class AppModule {}
