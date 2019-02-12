import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzFormatEmitEvent, NzMenuItemDirective, NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema } from '@delon/form';

@Component({
    selector: 'app-sys-admin-role-view',
    templateUrl: './view.component.html',
})
export class SysAdminRoleViewComponent implements OnInit {


    nodes: any[] = [];
    organizenodes: any[] = [];
    // 存储组织数据
    roleInfo: any = null;
    //存储组织Id
    OrganizeId:string = '';

    @ViewChild('treeCom') treeCom;
    //右键下拉的组件
    private dropdown: NzDropdownContextComponent;
    //事件产生的数据
    private downEvent: NzFormatEmitEvent;
    //是否编辑
    private isEdit: boolean = false;


    //SF配置
    //表单数据操作
    @ViewChild('sf') sf: SFComponent;
    schema: SFSchema = {
        properties: {
            FullName: {
                type: "string",
                title: "中文名称",
                maxLength: 64,
                ui: {
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
                ui: {
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
                ui: {
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
        required: [],
        ui: {
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
        this.TreeInitOrganize();
    }

    ngOnInit(): void {

    }
    //初始化角色树
    TreeInit(): void {
        this.http.get('/SysRole/GetRoleTreeList',{Id:this.OrganizeId}).subscribe((res: any) => {
            this.nodes = res.data;
        });
    }

    //初始化组织树
    TreeInitOrganize(): void {
        this.http.get('/SysOrganize/GetOrganizeTreeList').subscribe((res: any) => {
             this.organizenodes = res.data;
        });
    }

    //点击组织事件
    TreeOrganizeClick(event): void {
        this.OrganizeId =  event.node.key;
        let Patams = {
            id: event.node.key,
        }
        this.http.get('/SysRole/GetRoleTreeList', Patams).subscribe((res: any) => {
             this.nodes = res.data;
        });

        //this.http.get('/SysRole/GetRoleTree', Patams).subscribe((res: any) => {
        //    this.organizeInfo = res.data;
        //    this.sfDefaultValue();

        //});

    }


    //点击查看事件
    TreeClick(event, isEdit: boolean): void {
        this.isEdit = isEdit;
        let Patams = {
            id: event.node.key,
        }
        this.http.get('/SysRole', Patams).subscribe((res: any) => {
                this.roleInfo = res.data;
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

        this.TreeClick(this.downEvent, true);
        this.dropdown.close();
    }
    //删除按钮
    downdelete(e: NzMenuItemDirective): void {
        let Patams = {
            id: this.downEvent.node.key,
        }
        this.http.delete('/SysRole', Patams).subscribe((res: any) => {
             this.TreeInit();
        });
        this.dropdown.close();
    }

    //添加子项目
    downAdd(e: NzMenuItemDirective): void {
        this.isEdit = true;
        this.roleInfo = {};
        this.roleInfo.enabledMark = true;
        this.roleInfo.parentId = this.downEvent.node.key;
        this.roleInfo.organizeId = this.OrganizeId;
        this.sfDefaultValue();
        this.dropdown.close();
    }

    //表单赋值
    sfDefaultValue(): void {
        this.schema.properties.FullName.default = this.roleInfo.fullName;
        this.schema.properties.FullNameEn.default = this.roleInfo.fullNameEn;
        this.schema.properties.Description.default = this.roleInfo.description;
        this.schema.properties.EnabledMark.default = this.roleInfo.enabledMark;
        this.schema.properties.SortCode.default = this.roleInfo.sortCode;
    }

    //添加一个根角色
    AddRoleInfo(): void {
        this.isEdit = true;
        this.roleInfo = {};
        this.roleInfo.enabledMark = true;
        this.roleInfo.parentId = "00000000-0000-0000-0000-000000000000";
        this.roleInfo.organizeId = this.OrganizeId;
        this.sfDefaultValue();
    }
    //提交角色
    submit(): void {
        let Params: any = {};

        Object.assign(Params, this.sf.value);

        if (Params.id != undefined && Params.id != null) {
            this.http.put(`/SysRole/${Params.id}`, Params).subscribe((res: any) => {
                this.TreeInit();
            });
        } else {
            this.http.post('/SysRole', Params).subscribe((res: any) => {
                this.TreeInit();
            });
        }
    }


}
