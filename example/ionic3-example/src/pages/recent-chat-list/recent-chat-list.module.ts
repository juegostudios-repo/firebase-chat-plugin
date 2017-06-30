import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecentChatListPage } from './recent-chat-list';

@NgModule({
  declarations: [
    RecentChatListPage,
  ],
  imports: [
    IonicPageModule.forChild(RecentChatListPage),
  ],
  exports: [
    RecentChatListPage
  ]
})
export class RecentChatListPageModule {}
