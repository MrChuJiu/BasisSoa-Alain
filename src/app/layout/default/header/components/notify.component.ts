import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { WebsocketService } from '@core/service/websocket.service';

/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
  <notice-icon
    [data]="data"
    [count]="count"
    [loading]="loading"
    btnClass="alain-default__nav-item"
    btnIconClass="alain-default__nav-item-icon"
    (select)="select($event)"
    (clear)="clear($event)"
    (popoverVisibleChange)="loadData()"></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNotifyComponent {
  data: NoticeItem[] = [
    {
      title: '通知',
      list: [],
      emptyText: '暂无通知',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: '清空通知',
    },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待办',
    },
  ];
  count = 0;
  loading = false;

  constructor(private msg: NzMessageService, private cdr: ChangeDetectorRef,private websocket:WebsocketService) {
    this.websocket.getmsgArrCount().subscribe( data => {
      this.count = data;
    })
  }

  private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {

      const newItem = { ...item };

      if (newItem.datetime)
        newItem.datetime = "消息接收时间:" + distanceInWordsToNow(item.datetime, {
          locale: (window as any).__locale__,
        });

      if (newItem.extra && newItem.status) {
          newItem.color = {
            todo: undefined,
            processing: 'blue',
            urgent: 'red',
            doing: 'gold',
          }[newItem.status];
      }

      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData() {
    if (this.loading) return;
    this.loading = true;

    //加载通知
    this.data = this.updateNoticeData(this.websocket.GetMsg());

    this.loading = false;
    this.cdr.detectChanges();

  }

  clear(type: string) {
    this.data.find(w => w.title === type).list.forEach((v) => {
       this.websocket.SetMsgDel(v.id)
    });
    this.data.find(w => w.title === type).list = [];
    this.msg.success(`清空了 ${type}`);
  }

  select(res: any) {
    this.websocket.SetMsgRead(res.item.id);
  }
}
