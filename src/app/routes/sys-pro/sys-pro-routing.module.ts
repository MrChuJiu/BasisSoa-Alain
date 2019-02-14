import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysProSettingsBaseComponent } from './settings/base/base.component';
import { SysProSettingsSecurityComponent } from './settings/security/security.component';
import { SysProSettingsNotificationComponent } from './settings/notification/notification.component';
import { SettingsComponent } from './settings/settings.component';
import { CenterComponent } from './center/center.component';
import { SysProCenterNoticeComponent } from './center/notice/notice.component';
import { SysProCenterTodoComponent } from './center/todo/todo.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'base', pathMatch: 'full' },
      { path: 'base', component: SysProSettingsBaseComponent },
      { path: 'security', component: SysProSettingsSecurityComponent },
      { path: 'notification', component: SysProSettingsNotificationComponent }
    ],
  },
  {
    path: 'center',
    component: CenterComponent,
    children: [
      { path: '', redirectTo: 'notice', pathMatch: 'full' },
      { path: 'notice', component: SysProCenterNoticeComponent },
      { path: 'todo', component: SysProCenterTodoComponent }
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysProRoutingModule { }
