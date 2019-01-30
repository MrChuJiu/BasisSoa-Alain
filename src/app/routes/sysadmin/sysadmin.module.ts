import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SysadminRoutingModule } from './sysadmin-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    SysadminRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysadminModule { }
