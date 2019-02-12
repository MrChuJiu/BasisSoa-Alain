import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzMessageService, NzFormatEmitEvent, NzMenuItemDirective, NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema } from '@delon/form';

@Component({
  selector: 'app-sys-admin-organize-view',
  templateUrl: './view.component.html',
})
export class SysAdminOrganizeViewComponent implements OnInit {

  nodes:any[] = [];
  // 存储组织数据
  organizeInfo:any = null;

  @ViewChild('treeCom') treeCom;
  //右键下拉的组件
  private dropdown: NzDropdownContextComponent;
  //事件产生的数据
  private downEvent:NzFormatEmitEvent;
  //是否编辑
  private isEdit:boolean = true;


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
      Category:{
        type: 'string',
        title: '类别',
        enum: [
            { label: '集团', value: 'GROUP' },
            { label: '公司', value: 'COMPANY' },
            { label: '部门', value: 'DEPARTMENT' },
            { label: '小组', value: 'TEAM' }
        ],
        default: 'DEPARTMENT',
        ui: {
            change:(event) => {
              this.sfCategorychange(event);
            },
            widget: 'select',
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
      IsExpand: {
        type: 'boolean',
        title: '是否默认展开',
        ui: {
          "spanLabelFixed": 100,
            "grid": {
              "span": 16
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

  //SF配置企业
  //表单数据操作
  @ViewChild('sfg') sfg: SFComponent;
  schemag: SFSchema = {
     properties: {
      ShortName: {
        type: "string",
        title: "简称",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Logo: {
        type: "string",
        title: "Logo",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      WeChat: {
        type: "string",
        title: "负责人微信",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      RegNo: {
        type: "string",
        title: "工商登记号",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Layers: {
        type: "string",
        title: "公司位置",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      ChkHead: {
        type: "string",
        title: "支票抬头",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      InvHead: {
        type: "string",
        title: "发票抬头",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Address: {
        type: "string",
        title: "公司地址",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Website: {
        type: "string",
        title: "公司官网",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      Email: {
        type: "string",
        title: "公司邮箱",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      OrgCode: {
        type: "string",
        title: "机构代码",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      BankNo: {
        type: "string",
        title: "银行账号",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },
      MobilePhone: {
        type: "string",
        title: "公司电话",
        maxLength: 64,
        ui:  {
          "spanLabelFixed": 100,
          "grid": {
            "span": 12
          }
       }
      },

    },
    required: [  ],
    ui:  {
      hidden:true,
      "spanLabelFixed": 100,
      "grid": {
        "span": 24
      }
   }
  };


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
      this.http.get('/SysOrganize/GetOrganizeTreeList').subscribe( (res:any) => {
            this.nodes = res.data;
      });
  }

  //点击查看事件
  TreeClick(event,isEdit:boolean):void {
    this.isEdit = isEdit;
    let Patams = {
      id : event.node.key,
    }
    this.http.get('/SysOrganize',Patams).subscribe((res:any) => {
        this.organizeInfo = res.data;

        if(isEdit) {
           this.sfDefaultValue();
        }
      
        //this.sf.setValue('/Category',this.sf.value['Category']);
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
    this.http.delete('/SysOrganize',Patams).subscribe((res:any) => {
      this.TreeInit();
    });
    this.dropdown.close();
  }

  //添加子项目
  downAdd(e: NzMenuItemDirective):void {
    this.isEdit = true;
    this.organizeInfo = {};
    this.organizeInfo.enabledMark = true;
    this.organizeInfo.isExpand = true;
    this.organizeInfo.category = "DEPARTMENT";
    this.organizeInfo.parentId =  this.downEvent.node.key;
    this.sfDefaultValue();
    this.dropdown.close();
  }

  //表单赋值
  sfDefaultValue():void {
    this.schema.properties.FullName.default = this.organizeInfo.fullName;
    this.schema.properties.FullNameEn.default = this.organizeInfo.fullNameEn;
    this.schema.properties.Category.default = this.organizeInfo.category;
    this.schema.properties.Description.default = this.organizeInfo.description;
    this.schema.properties.EnabledMark.default = this.organizeInfo.enabledMark;
    this.schema.properties.SortCode.default = this.organizeInfo.sortCode;
    this.schema.properties.IsExpand.default = this.organizeInfo.isExpand;


    this.schemag.properties.ShortName.default = this.organizeInfo.shortName;
    this.schemag.properties.Logo.default = this.organizeInfo.logo;
    this.schemag.properties.WeChat.default = this.organizeInfo.weChat;
    this.schemag.properties.RegNo.default = this.organizeInfo.regNo;
    this.schemag.properties.Layers.default = this.organizeInfo.layers;
    this.schemag.properties.ChkHead.default = this.organizeInfo.chkHead;
    this.schemag.properties.InvHead.default = this.organizeInfo.invHead;
    this.schemag.properties.Address.default = this.organizeInfo.address;
    this.schemag.properties.Website.default = this.organizeInfo.website;
    this.schemag.properties.Email.default = this.organizeInfo.Eemail;
    this.schemag.properties.OrgCode.default = this.organizeInfo.orgCode;
    this.schemag.properties.BankNo.default = this.organizeInfo.bankNo;
    this.schemag.properties.MobilePhone.default = this.organizeInfo.mobilePhone;

    this.sfCategorychange(this.organizeInfo.category);
  }

  //下拉组织类型Change
  sfCategorychange(valie):void {
    if(valie === 'GROUP' || valie === 'COMPANY') {
      this.schemag.ui["hidden"] = false ;
    }else {

      this.schemag.ui["hidden"] = true ;
    }


    setTimeout(()=>this.sfg.refreshSchema(),0)

  }

  //添加一个根组织
  AddOrganizeInfo():void {
   this.isEdit = true;
   this.organizeInfo = {};
   this.organizeInfo.enabledMark = true;
   this.organizeInfo.isExpand = true;
   this.organizeInfo.category = "DEPARTMENT";
   this.organizeInfo.parentId = "00000000-0000-0000-0000-000000000000";
   this.sfDefaultValue();
  }
  //提交组织
  submit():void  {
    let Params:any = {};

    Object.assign(Params,this.sf.value,this.sfg.value);

    if(Params.id != undefined && Params.id != null) {
     this.http.put(`/SysOrganize/${Params.id}`,Params).subscribe( (res:any) => {
        this.TreeInit();
     });
    }else{
     this.http.post('/SysOrganize',Params).subscribe( (res:any) => {
         this.TreeInit();
     });
    }
  }


}
