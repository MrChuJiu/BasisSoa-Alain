import { Injectable, Inject, Injector } from '@angular/core';
import { ITokenService, DA_SERVICE_TOKEN, JWTTokenModel } from '@delon/auth';
import { WSAEACCES } from 'constants';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd';


let subject = webSocket(`wss://localhost:5001/ApiWebSocket`);


@Injectable({
  providedIn: 'root'
})
///Websocket服务
export class WebsocketService {

  private msgArr:Array<NoticetemplateModule> = new  Array<NoticetemplateModule>();

  private msgArrCount: Subject<number> = new Subject();

  //初始化的时候 链接服务器
  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,private injector: Injector) {

    subject = webSocket(`wss://localhost:5001/ApiWebSocket?Authorization=${this.tokenService.get<JWTTokenModel>(JWTTokenModel).token}`);

    subject.subscribe( 
      (msg:NoticetemplateModule) => { 
        this.injector.get(NzNotificationService).success(msg.title,msg.description);

        this.msgArr.push(msg);
        this.SetmsgArrCount();
       
      }, 
      (err) => console.log(err), 
      () => console.log('complete') 
    );
  }

  //订阅消息长度

  getmsgArrCount():Observable<number>{
    return this.msgArrCount.asObservable();
  }

  setmsgArrCount(count:number):void{
    this.msgArrCount.next(count);
  }

  //发送消息
  SendMsg(msg:NoticetemplateModule) {
    subject.next(msg);
  }
  //获取消息列表
  GetMsg() {
    return this.msgArr.filter( (v) => {
        return !v.delete;
    });
  }
  //设置消息已读
  SetMsgRead(id:string){
     this.msgArr.forEach( (v) => {
          if(v.id == id) {
              v.read = true;
              return;
          }
     });
     this.SetmsgArrCount();

  }

    //设置消息删除
  SetMsgDel(id:string){
      this.msgArr.forEach( (v) => {
           if(v.id == id) {
               v.delete = true;
               return;
           }
      });
      this.SetmsgArrCount();
 
   }

  SetmsgArrCount(){
    //返回未读的数据
    this.setmsgArrCount(this.msgArr.filter((value) => {
      return !value.read && !value.delete
    }).length)

  }

}



export  class NoticetemplateModule{

  id:string
  //标题
  title:string;   
  //头像        
  avatar:string;  
  //消息类型        
  type:string;  
  //时间
  datetime:string;
  //说明       
  description:string;
  //着急状态 Color
  status:string;
  //是否已读
  read:boolean;
  //额外信息
  extra:string;

  //是否移除
  delete:boolean = false; 
}