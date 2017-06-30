import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewChatPage } from './add-new-chat';

@NgModule({
  declarations: [
    AddNewChatPage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewChatPage),
  ],
  exports: [
    AddNewChatPage
  ]
})
export class AddNewChatPageModule {}
