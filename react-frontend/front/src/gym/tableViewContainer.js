import React, { Component } from 'react';
import { Table, Button } from 'antd';

class TableViewContainer extends Component {
    render() {
        const columns = [
            {
                title: 'Parent',
                children: [{
                    title: 'Table',
                    dataIndex: 'parentTable',
                    key: 'parentTable'
                }, {
                    title: 'Column',
                    dataIndex: 'parentColumn',
                    key: 'parentColumn'
                }]
            },
            {
                title: 'Child',
                children: [{
                    title: 'Table',
                    dataIndex: 'childTable',
                    key: 'childTable'
                }, {
                    title: 'Column',
                    dataIndex: 'childColumn',
                    key: 'childColumn'
                }]
            }
        ];
        return (<div>
            <Table columns={columns} bordered/>
        </div>);
    }
}

export default TableViewContainer