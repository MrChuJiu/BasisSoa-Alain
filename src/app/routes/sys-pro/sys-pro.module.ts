import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SysProRoutingModule } from './sys-pro-routing.module';
import { SysProSettingsBaseComponent } from './settings/base/base.component';
import { SysProSettingsSecurityComponent } from './settings/security/security.component';
import { SysProSettingsNotificationComponent } from './settings/notification/notification.component';
import { SettingsComponent } from './settings/settings.component';
import { CenterComponent } from './center/center.component';
import { SysProCenterNoticeComponent } from './center/notice/notice.component';
import { SysProCenterTodoComponent } from './center/todo/todo.component';

const COMPONENTS = [
  SysProSettingsBaseComponent,
  SysProSettingsSecurityComponent,
  SysProSettingsNotificationComponent,
  SysProCenterNoticeComponent,
  SysProCenterTodoComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    SysProRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    SettingsComponent,
    CenterComponent
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysProModule { }
