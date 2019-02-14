import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { zip, Subscription } from 'rxjs';


@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CenterComponent implements OnInit {

  private router$: Subscription;
  user: any;
  tabs: any[] = [
    {
      key: 'notice',
      tab: '通知',
    },
    {
      key: 'todo',
      tab: '待办',
    },
  ];

  pos = 0;

  constructor(
    private router: Router,
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    const idx = this.tabs.findIndex(w => w.key === key);
    if (idx !== -1) this.pos = idx;
  }

  ngOnInit(): void {

    zip(this.http.get('/SysUser/GetTokenUserDetails')).subscribe(
      (user:any) => {
        this.user = user[0].data;
        this.cdr.detectChanges();
      },
    );

    this.router$ = this.router.events
      .pipe(filter(e => e instanceof ActivationEnd))
      .subscribe(() => this.setActive());
    this.setActive();
  }

  to(item: any) {
    this.router.navigateByUrl(`/SysPro/center/${item.key}`);
  }

  taging = false;
  tagValue = '';
  @ViewChild('tagInput')
  private tagInput: ElementRef;
  tagShowIpt() {
    this.taging = true;
    this.cdr.detectChanges();
    (this.tagInput.nativeElement as HTMLInputElement).focus();
  }

  tagBlur() {
    const { user, cdr, tagValue } = this;
    if (
      tagValue &&
      user.tags.filter(tag => tag.label === tagValue).length === 0
    ) {
      user.tags.push({ label: tagValue });
    }
    this.tagValue = '';
    this.taging = false;
    cdr.detectChanges();
  }

  tagEnter(e: KeyboardEvent) {
    if (e.keyCode === 13) this.tagBlur();
  }

  ngOnDestroy() {
    this.router$.unsubscribe();
  }
}
