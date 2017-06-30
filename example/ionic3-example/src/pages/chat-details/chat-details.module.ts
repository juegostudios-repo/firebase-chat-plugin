import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatDetailsPage } from './chat-details';

@NgModule({
  declarations: [
    ChatDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatDetailsPage),
  ],
  exports: [
    ChatDetailsPage
  ]
})
export class ChatDetailsPageModule {}
