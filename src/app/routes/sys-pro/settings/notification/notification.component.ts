import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFButton, SFSchema, SFComponent } from '@delon/form';

@Component({
  selector: 'app-sys-pro-settings-notification',
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SysProSettingsNotificationComponent implements OnInit {
  
  userLoading = true;
  userInfo: any;

  multiUserLogin = false;

  constructor(
    private cdf: ChangeDetectorRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
     this.requestOnInit();
  }

  requestOnInit() {
    this.http.get(`/SysUser/GetTokenUserDetails`).subscribe( (res:any) => {
      if(res.code == 200) {
        this.userLoading = false;
        this.userInfo = res.data;
        this.multiUserLogin = res.data.multiUserLogin;
        this.cdf.markForCheck();    // 进行标注
       }
    });
  }

  switchChange(event) {
      this.multiUserLogin = event
      let Params :any = {
        multiUserLogin:this.multiUserLogin
      };
       this.http.put(`/SysUser/${this.userInfo.id}`, Params).subscribe((res: any) => {
            this.requestOnInit();
      });
  }

}
