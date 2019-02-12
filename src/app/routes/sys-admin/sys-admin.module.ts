import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SysAdminRoutingModule } from './sys-admin-routing.module';
import { SysAdminOrganizeViewComponent } from './organize/view/view.component';
import { SysAdminRoleViewComponent } from './role/view/view.component';
import { SysAdminModuleViewComponent } from './module/view/view.component';
import { SysAdminUserViewComponent } from './user/view/view.component';
import { SysAdminUserEditComponent } from './user/edit/edit.component';

const COMPONENTS = [  
  SysAdminOrganizeViewComponent,
  SysAdminRoleViewComponent,
  SysAdminModuleViewComponent,
  SysAdminUserViewComponent
  ];
const COMPONENTS_NOROUNT = [
  SysAdminUserEditComponent
  ];

@NgModule({
  imports: [
    SharedModule,
    SysAdminRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysAdminModule { }
