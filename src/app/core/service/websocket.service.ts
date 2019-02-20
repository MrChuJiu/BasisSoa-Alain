import { Injectable, Inject } from '@angular/core';
import { ITokenService, DA_SERVICE_TOKEN, JWTTokenModel } from '@delon/auth';
import { WSAEACCES } from 'constants';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject } from 'rxjs';
import { environment } from '@env/environment';


let subject = webSocket(`wss://localhost:5001/ApiWebSocket`);


@Injectable({
  providedIn: 'root'
})
///Websocket服务
export class WebsocketService {

  private msgArr: Array<NoticetemplateModule>;

  //初始化的时候 链接服务器
  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {

    subject = webSocket(`wss://localhost:5001/ApiWebSocket?Authorization=${this.tokenService.get<JWTTokenModel>(JWTTokenModel).token}`);

    subject.subscribe( 
      (msg:string) => { this.msgArr.push(JSON.parse(msg)) }, // Called whenever there is a message from the server.
      (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
    // subject.complete;
    // subject.error({code:4000, reason:'I think our a[pp'})
  }

  SendMsg(msg:NoticetemplateModule) {
    subject.next(msg);
    //subject.next(JSON.stringify({message: 'some message'}));
  }
  GetMsg() {
    return this.msgArr;
  }

}



export  class NoticetemplateModule{
  //标题
  title:string;   
  //头像        
  avatar:string;  
  //消息类型        
  type:string;  
  //说明       
  datetime:string;
  //着急状态
  status:string;
}