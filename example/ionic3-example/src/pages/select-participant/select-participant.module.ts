import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectParticipantPage } from './select-participant';

@NgModule({
  declarations: [
    SelectParticipantPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectParticipantPage),
  ],
  exports: [
    SelectParticipantPage
  ]
})
export class SelectParticipantPageModule {}
