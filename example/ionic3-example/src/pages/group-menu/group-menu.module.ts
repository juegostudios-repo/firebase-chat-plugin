import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupMenuPage } from './group-menu';

@NgModule({
  declarations: [
    GroupMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupMenuPage),
  ],
  exports: [
    GroupMenuPage
  ]
})
export class GroupMenuPageModule {}
