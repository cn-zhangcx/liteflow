import React, {Component} from 'react';
import {Button, Popconfirm,Table} from 'antd';
import {Executor,ExecutorModel} from "../model/ExecutorModel";
import ExecutorModal from "./ExecutorModal";
import EnumUtils from "../../../common/utils/EnumUtils";

export interface ExecutorListProps {
    dataSource: Array<Executor>;
    loading: boolean;
    pageConfig: any;
    executorModel: ExecutorModel;
}

export class ExecutorList extends Component<ExecutorListProps, {showModal, executor}> {

    constructor(props) {
        super(props);
        this.state = {showModal: false, executor: new Executor()}
    }

    showEditModal(){
        let that = this;
        that.setState({
            showModal: true
        });
    }

    hideEditModal(){
        this.setState({
            showModal: false
        });
    }

    getModalProps(){
        let that = this;
        return {
            executor: this.state.executor,
            onOk: function (executor: Executor) {
                that.props.executorModel.edit(executor);
                that.hideEditModal();
            },
            onCancel() {
                that.hideEditModal();
            }
        };
    }
    //上线事件
    handleOn (rowData, e){
        this.props.executorModel.on(rowData.id);
    }
    //下线事件
    handleOff (rowData, e){
        this.props.executorModel.off(rowData.id);
    }
    //编辑事件
    handleEdit (rowData, e){
        this.setState({executor : rowData})
        this.showEditModal();
    }

    render(){
        let columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },{
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        },{
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip'
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status, record, index) => {
                const statusStr = EnumUtils.getStatusName(status);
                return statusStr;
            }
        },{
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }, {
            title: '创建人',
            dataIndex: 'user',
            key: 'user',
            render: (user, record, index) => {
                if(user){
                    return user.name;
                }
                return "";
            }
        }, {
            title: '操作',
            dataIndex: 'id',
            key: 'operateInstance',
            render:(text, record, index) => {
                const {status} = record;
                let onOrOffBtn = null;
                if(status == EnumUtils.statusOnline ){
                    onOrOffBtn = (<Popconfirm title='确定下线？' onConfirm={e => this.handleOff(record , e)}>
                        <Button type='ghost' size={'small'} >
                            下线
                        </Button>
                    </Popconfirm>);
                }else{
                    onOrOffBtn = (<Popconfirm title='确定上线？' onConfirm={e => this.handleOn(record , e)}>
                        <Button type='ghost' size={'small'} >
                            上线
                        </Button>
                    </Popconfirm>);
                }
                return <div>
                    <Button size={'small'}  type='ghost' className={"margin-right5"} onClick={e => this.handleEdit(record , e)}>
                        修改
                    </Button>
                    {onOrOffBtn}
                </div>;
            }
        }];
        return (
            <div>
                <Table dataSource={this.props.dataSource}
                       columns={columns}
                       rowKey="id"
                       loading={this.props.loading}
                       pagination={this.props.pageConfig}/>
                {this.state.showModal ? <ExecutorModal {...this.getModalProps()}/> : ''}
            </div>
        );

    }

}

