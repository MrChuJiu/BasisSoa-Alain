import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { STColumn, STReq, STComponent } from '@delon/abc';
import { SysAdminUserEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-sys-admin-user-view',
  templateUrl: './view.component.html',
})
export class SysAdminUserViewComponent implements OnInit {

  url = `/SysUser`;

  columns: STColumn[] = [
    { title: '行号', type: 'no' },
    { title: '登录账号', index: 'account' },
    { title: '头像', index: 'headIcon', type: 'img', width: '50px'},
    { title: '真名', index: 'realName'},
    { title: '邮箱', index: 'email'},
    { title: '组织名称', index: 'organizeName'},
    { title: '角色名称', index: 'roleName'},
    { title: '登录次数', index: 'logOnCount'},
    { title: '是否管理员', index: 'isAdministrator', type :'yn'},
    { title: '是否多用户登录', index: 'multiUserLogin',type:'yn'},
    { title: '创建人', index: 'creatorUserName'},
    { title: '创建时间', index: 'creatorTime',type:'date'},
    {
      title: '操作',
      buttons: [
        {
          text: 'Edit',
          icon: 'edit',
          click: (record: any) => {
              this.openComponent(record.id);
          }
        },
        {
          icon: 'delete',
          type: 'del',
          click: (record: any, modal: any) => {

          }
        },
      ],
    },
  ];

  @ViewChild('st') st:STComponent;

  req:STReq = {
    //method:'POST',
    //headers:'content-type: text/plain'
  }
  
  constructor(
    private drawerService: NzDrawerService,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
  }

  openComponent(id): void {
    const drawerRef = this.drawerService.create<SysAdminUserEditComponent, { Id: string }, string>({
      nzTitle: '编辑员工',
      nzContent: SysAdminUserEditComponent,
      nzMaskClosable:true,
      nzWidth:650,
      nzContentParams: {
        Id: id
      }
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe(data => {
      if (data === 'ok') {
         this.st.reload();
      }
    });
  }


}
