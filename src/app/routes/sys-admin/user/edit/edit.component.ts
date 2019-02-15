import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFButton, SFComponent } from '@delon/form';
import { environment } from '@env/environment';
@Component({
  selector: 'app-sys-admin-user-edit',
  templateUrl: './edit.component.html',
  styles  : [ `
  .avatar {
    width: 144px;
    height: 144px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 100px;
  }
  ` ]

})
export class SysAdminUserEditComponent implements OnInit {
  @Input() Id = '';
  userInfo:any = {};



  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      account: {
        type: "string",
        title: "用户名",
        maxLength:64
      },
      realName: {
        type: "string",
        title: "真实姓名",
        maxLength:64
      },
      userPassword: {
        type: "string",
        title: "密码",
        maxLength:64
      },
      headIcon: {
        type: 'string',
        title: '',
        ui: {
            widget: 'custom'
        },
        default: 'https://b-ssl.duitang.com/uploads/item/201603/15/20160315000033_rhe4u.jpeg'
      },
      custom: {
        type: 'string',
        title: '头像',
        enum: [
          {
            status: 'done',
          },
        ],
        ui: {
          widget: 'upload',
          action: '/File?FileType=0',
          limit:1,
          showUploadList:false,
          change: (args) => {
              if(args.type == "success") {
                  this.userInfo.headIcon = environment.SERVER_URL+'/../' + args.file.response.data;
                  this.sf.setValue('/headIcon',environment.SERVER_URL+'/../'  + args.file.response.data);
              }
          },
        },
      },
     
      birthday: {
        type: 'string',
        title: "出生日期",
        format: 'date-time',
      },
      tel: {
        type: "string",
        title: "手机号",
        maxLength:64
      },
      email: {
        type: "string",
        title: "电子邮件",
        maxLength:64
      },
      weChat: {
        type: "string",
        title: "微信",
        maxLength:64
      },
      organizeId: {
        type: 'string',
        title: '组织',
        enum: [
        ],
        ui: {
          widget: 'tree-select',
          change: (s:any) => {
            console.log(s);
            this.userInfo.organizeId = s;
            this.getRole(s);
          },
        }
      },
      roleId: {
        type: 'string',
        title: '角色',
        enum: [
        ],
        ui: {
          widget: 'tree-select',
        }
      },
      isAdministrator: {
        type: 'boolean',
        title: '是否管理员',
        ui: {
          widget: 'checkbox',
          grid: {
            span: 8
          }
        },
        default: false,
      },
      enabledMark: {
        type: 'boolean',
        title: '是否可用',
        ui: {
          widget: 'checkbox',
          grid: {
            span: 8
          }
        },
        default: true,
      },
      multiUserLogin: {
        type: 'boolean',
        title: '多用户登录',
        ui: {
          widget: 'checkbox',
          grid: {
            span: 8
          }
        },
        default: false,
      },
      description:{
        type: 'string',
        title: '描述',
        ui: {
            widget: 'textarea',
            autosize: { minRows: 2, maxRows: 6 }
        }
      }
    },
    required: ["account", "roleId", "organizeId", "realName", "email", "userPassword"],
    ui: {
      "spanLabelFixed": 100,
      "grid": {
        "span": 24
      }
    }
  };
  //SF表单按钮
  sfbutton: SFButton = { submit: '提交', submit_type: 'primary', reset: '重置', reset_type: 'default' }

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
      this.getOrganize();

    
    //编辑还是添加
    if(this.Id != '0') {
       this.http.get(`/SysUser/GetUserDetails`,{Id:this.Id}).subscribe( (res:any) => {
         if(res.code == 200) {

           this.userInfo = res.data;
           this.getRole(this.userInfo.organizeId);
           this.sfFromDataInit();
         }
       });
    }
   
  }

  submit() {
   console.log(this.sf.value);
    let Params: any = {};

    Object.assign(Params, this.sf.value);

    if (this.Id != '0') {
        this.http.put(`/SysUser/${this.Id}`, Params).subscribe((res: any) => {
          this.drawerRef.close('ok');
        });
      } else {
        this.http.post('/SysUser', Params).subscribe((res: any) => {
            this.drawerRef.close('ok');
        });
      }
  }

    //请求组织下拉
    getOrganize() {
      this.http.get('/SysOrganize/GetOrganizeTreeList').subscribe((res: any) => {
        if (res.code == 200) {
          console.log(res.data);
          this.schema.properties.organizeId.enum = res.data;
          this.userInfo = this.sf.value;
          this.sfFromDataInit();
        } else {
          this.msgSrv.info(res.message);
        }
      });
    }

      //请求角色下拉
  getRole(value) {
    this.http.get('/SysRole/GetRoleTreeList',{Id:value}).subscribe((res: any) => {
      if (res.code == 200) {
         this.schema.properties.roleId.enum = res.data;
         this.userInfo = this.sf.value;
         this.sfFromDataInit();
      } else {
        this.msgSrv.info(res.message);
      }
    });
  }


    //为表单赋值
    sfFromDataInit() {
      this.schema.properties.account.default = this.userInfo.account;
      this.schema.properties.realName.default = this.userInfo.realName;
      this.schema.properties.userPassword.default = this.userInfo.userPassword;

      this.schema.properties.headIcon.default = this.userInfo.headIcon;

      this.schema.properties.birthday.default = this.userInfo.birthday;
      this.schema.properties.tel.default = this.userInfo.tel;
      this.schema.properties.email.default = this.userInfo.email;
      this.schema.properties.weChat.default = this.userInfo.weChat;
      this.schema.properties.roleId.default = this.userInfo.roleId;
      this.schema.properties.organizeId.default = this.userInfo.organizeId;
      this.schema.properties.isAdministrator.default = this.userInfo.isAdministrator;
      this.schema.properties.enabledMark.default = this.userInfo.enabledMark;
      this.schema.properties.multiUserLogin.default = this.userInfo.multiUserLogin;
      this.schema.properties.description.default = this.userInfo.description;

   
      this.sf.refreshSchema();
    }

}
