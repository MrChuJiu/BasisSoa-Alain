import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { SFButton, SFComponent, SFSchema } from '@delon/form';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sys-pro-settings-base',
  templateUrl: './base.component.html',
  styles  : [ `
  .avatar {
    width: 144px;
    height: 144px;
    margin-bottom: 12px;
    overflow: hidden;
    border-radius: 100px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 100px;
  }
  ` ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SysProSettingsBaseComponent implements OnInit {
  

  avatar = '';
  userLoading = true;
  userInfo: any;


  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      realName: {
        type: "string",
        title: "真实姓名",
        maxLength:64
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
      weChat: {
        type: "string",
        title: "微信",
        maxLength:64
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
    required: ["realName", "email"],
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
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.requestOnInit();
  }

  requestOnInit() {
    this.http.get(`/SysUser/GetTokenUserDetails`).subscribe( (res:any) => {
      if(res.code == 200) {
        this.userLoading = false;
        this.userInfo = res.data;
        this.sfFromDataInit();
      }
    });
  }
  

  submit() {

    let Params = {
      headIcon:this.userInfo.headIcon
    };

    Object.assign(Params,this.sf.value);


    this.http.put(`/SysUser/${this.userInfo.id}`, Params).subscribe((res: any) => {
      this.requestOnInit();
    });
  }

      //为表单赋值
      sfFromDataInit() {
        this.schema.properties.realName.default = this.userInfo.realName;
        this.schema.properties.birthday.default = this.userInfo.birthday;
        this.schema.properties.tel.default = this.userInfo.tel;
        this.schema.properties.weChat.default = this.userInfo.weChat;
        this.schema.properties.description.default = this.userInfo.description;
        this.sf.refreshSchema();
      }

      UploadChange(event) {
        if(event.type == "success") {
            this.userInfo.headIcon =  environment.SERVER_URL+'/../'  + event.file.response.data;
         }
      }
  
}
