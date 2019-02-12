import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysAdminOrganizeViewComponent } from './organize/view/view.component';
import { SysAdminRoleViewComponent } from './role/view/view.component';
import { SysAdminModuleViewComponent } from './module/view/view.component';
import { SysAdminUserViewComponent } from './user/view/view.component';

const routes: Routes = [
  { path: 'organize', component: SysAdminOrganizeViewComponent },
  { path: 'role', component: SysAdminRoleViewComponent },
  { path: 'module', component: SysAdminModuleViewComponent },
  { path: 'user', component: SysAdminUserViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysAdminRoutingModule { }

