import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzMessageService, NzFormatEmitEvent, NzMenuItemDirective, NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema, SFButton } from '@delon/form';
import { STColumn } from '@delon/abc';



@Component({
  selector: 'app-sys-admin-module-view',
  templateUrl: './view.component.html',
})
export class SysAdminModuleViewComponent implements OnInit {
  nodes:any[] = [];
  // 存储组织数据
  moduleInfo:any = null;
  datas:any[] = [];

  @ViewChild('treeCom') treeCom;
  //右键下拉的组件
  private dropdown: NzDropdownContextComponent;
  //事件产生的数据
  private downEvent:NzFormatEmitEvent;
  //是否编辑
  private isEdit:boolean = false;
  //控制Tabs的
  private SelectIndex:number = 0;

  //SF配置
  //表单数据操作
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
     properties: {
      FullName: {
        type: "string",
        title: "中文名称",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      FullNameEn: {
        type: "string",
        title: "英文名称",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Icon: {
        type: "string",
        title: "图标",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      UrlAddress: {
        type: "string",
        title: "前台路由",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      ApiUrl: {
        type: "string",
        title: "后台接口",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      SortCode: {
        type: "string",
        title: "排序",
        maxLength: 10,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Description: {
        type: 'string',
        title: '描述',
        ui: {
            widget: 'textarea',
            autosize: { minRows: 2, maxRows: 6 }
        }
      },
      EnabledMark: {
        type: 'boolean',
        title: '是否有效',
        ui: {
          "spanLabelFixed": 100,
            "grid": {
              "span": 8
            }
        },
        default: true,
      },
      IsMenu: {
        type: 'boolean',
        title: '是不是菜单',
        ui: {
          "spanLabelFixed": 100,
            "grid": {
              "span": 8
            }
        },
        default: true,
      },
      IsExpand: {
        type: 'boolean',
        title: '是否默认展开',
        ui: {
          "spanLabelFixed": 100,
            "grid": {
              "span": 8
            }
        },
        default: true,
      },

    },
    required: [  ],
    ui:  {
      "spanLabelFixed": 100,
      "grid": {
        "span": 24
      }
   }
  };

  @ViewChild('sfAuth') sfAuth:SFComponent;
  schemaAuth: SFSchema = {
    properties: {
      product: {
          type: 'array',
          title: '请求接口',
          items: {
              type: 'object',
              properties: {
                actionName: {
                      type: 'string',
                      title: '方法名称'
                  },
                  requestMethod: {
                      type: 'string',
                      title: '请求方式',
                      enum: [
                          { label: 'GET', value: 'GET' },
                          { label: 'POST', value: 'POST' },
                          { label: 'PUT', value: 'PUT' },
                          { label: 'DELETE', value: 'DELETE' }
                      ],
                      default: 'GET',
                      ui: {
                          widget: 'select'
                      }
                  },
                  acl: {
                    type: 'string',
                    title: 'ACL',
                  },
                  enabledMark: {
                    type: 'boolean',
                    title: '是否可用',
                    default: true,
                  },
                  description: {
                    type: 'string',
                    title: '描述',
                    ui: {
                        widget: 'textarea',
                        autosize: { minRows: 2, maxRows: 6 }
                    }
                  }
              },
              required: [ 'name', 'price' ]
          },
          ui: { grid: { arraySpan: 12 } }
      }
  }
  };

  //ST显示模块按钮
  columns: STColumn[] = [
    { title: '方法名称', index: 'actionName' },
    { title: 'ACL',  index: 'acl' },
    { title: '请求方式', index: 'requestMethod' },
    { title: '是否可用', index: 'enabledMark' },
    { title: '说明', index: 'description' },
  ];


  constructor(
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private nzDropdownService: NzDropdownService
  ) { 
    this.TreeInit();
  }

  ngOnInit(): void {
    
  }
  //初始化组织树
  TreeInit(): void {
      this.http.get('/SysModule/GetModuleTreeList').subscribe( (res:any) => {
            this.nodes = res.data;
      });
  }

  //点击查看事件
  TreeClick(event,isEdit:boolean):void {
    this.SelectIndex = 0;
    this.isEdit = isEdit;
    let Patams = {
      id : event.node.key,
    }
    this.http.get('/SysModule',Patams).subscribe((res:any) => {
        this.moduleInfo = res.data;
        this.datas = res.data.sysModuleActionDtos;
        this.sfDefaultValue();
    });
  }

  //右键
  contextMenu(event: NzFormatEmitEvent, template: TemplateRef<void>): void {
    this.downEvent = event;
    this.dropdown = this.nzDropdownService.create(event.event, template);
  }
    
  //修改按钮
  downUpdate(e: NzMenuItemDirective): void {

    this.TreeClick(this.downEvent,true);
    this.dropdown.close();
  }
  //删除按钮
  downdelete(e: NzMenuItemDirective): void {
    let Patams = {
      id : this.downEvent.node.key,
    }
    this.http.delete('/SysModule',Patams).subscribe((res:any) => {
      this.TreeInit();
    });
    this.dropdown.close();
  }

  //添加子项目
  downAdd(e: NzMenuItemDirective):void {
    this.SelectIndex = 0;
    this.isEdit = true;
    this.moduleInfo = {};
    this.moduleInfo.isExpand = true;
    this.moduleInfo.isMenu = false;
    this.moduleInfo.enabledMark = true;
    this.moduleInfo.parentId =  this.downEvent.node.key;
    this.sfDefaultValue();
    this.dropdown.close();
  }

  //表单赋值
  sfDefaultValue():void {
    this.schema.properties.FullName.default = this.moduleInfo.fullName;
    this.schema.properties.FullNameEn.default = this.moduleInfo.fullNameEn;
    this.schema.properties.Icon.default = this.moduleInfo.icon;
    this.schema.properties.UrlAddress.default = this.moduleInfo.urlAddress;
    this.schema.properties.ApiUrl.default = this.moduleInfo.apiUrl;
    this.schema.properties.Description.default = this.moduleInfo.description;
    this.schema.properties.EnabledMark.default = this.moduleInfo.enabledMark;
    this.schema.properties.SortCode.default = this.moduleInfo.sortCode;

    this.schema.properties.IsMenu.default = this.moduleInfo.isMenu;
    this.schema.properties.IsExpand.default = this.moduleInfo.isExpand;

    this.schemaAuth.properties.product.default = this.moduleInfo.sysModuleActionDtos;
  }


  //添加一个根组织
  AddModuleInfo():void {
    this.isEdit = true;
    this.SelectIndex = 0;
   this.moduleInfo = {};
   this.moduleInfo.isExpand = true;
   this.moduleInfo.isMenu = false;
   this.moduleInfo.enabledMark = true;
   this.moduleInfo.parentId = "00000000-0000-0000-0000-000000000000";
   this.sfDefaultValue();
  }

 //Tabs改变回调
  SelectChange(event:any) {
    this.SelectIndex = event.index;
  }

  //下一步
  clickNext():void {
    this.SelectIndex = 1;
    //判断是不是新建，有没有勾选 是否菜单
    if( (this.sf.value.id == undefined || this.sf.value.id  == null) && this.sf.value.IsMenu == false && this.sfAuth.value.product.length == 0)  {
        
      let MenuRequest = [
        {
           acl: "GET",
           actionName:"",
           description: "",
           enabledMark: true,
           requestMethod: "GET"
       },
          {
              acl: "POST",
              actionName:"",
              description: "",
              enabledMark: true,
              requestMethod: "POST"
          },
          {
            acl: "PUT",
            actionName:"",
            description: "",
            enabledMark: true,
            requestMethod: "PUT"
        },
        {
          acl: "DELETE",
          actionName:"",
          description: "",
          enabledMark: true,
          requestMethod: "DELETE"
      },
      ];

      this.sfAuth.schema.properties.product.default = MenuRequest;
      this.sfAuth.refreshSchema();
    }


    if(this.sf.value.IsMenu == true) {
      this.sfAuth.schema.properties.product.default = [];
      this.sfAuth.refreshSchema();
    }

  }
  clickPrevious():void {
    this.SelectIndex = 0;
  }
  

  //提交组织
  submit():void  {
    let Params:any = {};

    Object.assign(Params,this.sf.value);

    Params.sysModuleActionDtos = this.sfAuth.value.product;

    if(Params.id != undefined && Params.id != null) {
     this.http.put(`/SysModule/${Params.id}`,Params).subscribe( (res:any) => {
        this.TreeInit();
     });
    }else{
     this.http.post('/SysModule',Params).subscribe( (res:any) => {
         this.TreeInit();
     });
    }
  }

}
