import { Component, ChangeDetectionStrategy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-sys-pro-settings-security',
  templateUrl: './security.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SysProSettingsSecurityComponent implements OnInit {
  userInfo: any;

  isPassVisible = false;
  isPhoneVisible = false;
  isEmailVisible = false;

  PassValue = '';
  PhoneValue  = '';
  EmailValue  = '';

  constructor(
    private cdf: ChangeDetectorRef,
    private http: _HttpClient,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
   this.requestOnInit();
  }
  requestOnInit() {
    this.http.get(`/SysUser/GetTokenUserDetails`).subscribe( (res:any) => {
      if(res.code == 200) {
        this.userInfo = res.data;
        this.cdf.markForCheck();    // 进行标注
      }
    });
  }

  showModal(tag:number): void {
    switch(tag) {
      case 1:
      this.isPassVisible = true;
          break;
      case 2:
      this.isPhoneVisible = true;
          break;
      case 3:
      this.isEmailVisible = true;
          break;
     }
  }

  handleCancel(tag:number) {
    switch(tag) {
        case 1:
        this.isPassVisible = false;
            break;
        case 2:
        this.isPhoneVisible = false;
            break;
        case 3:
        this.isEmailVisible = false;
            break;
    }
   
  }
  handleOk(tag:number): void {

    let Params :any = {};

    switch(tag) {
      case 1:
          Params.UserPassword = this.PassValue;
          this.isPassVisible = false;
          break;
      case 2:
          Params.Tel = this.PhoneValue;
         
          this.isPhoneVisible = false;
          break;
      case 3:
          Params.Email = this.EmailValue;
          this.isEmailVisible = false;
          break;
     }
     this.http.put(`/SysUser/${this.userInfo.id}`, Params).subscribe((res: any) => {
          this.isPassVisible = false;
          this.isPhoneVisible = false;
          this.isEmailVisible = false;
          this.requestOnInit();
    });
  }
}
