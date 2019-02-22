import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { I18NService } from './i18n/i18n.service';
import { NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';

@NgModule({
  providers: [
    I18NService,
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzTop : "75px" }}
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
