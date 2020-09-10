import React, { useEffect, useState } from 'react';
import { Table, Divider, } from 'antd';
import styles from './standardconfig.less';
const MainContent = props => {
  const { mainData, pageTotal, pageChange, getEditItem, mainloading } = props;
  const [selectedRowKey, setSelectedRowKey] = useState(String);
  const subPageChange = value => {
    pageChange(value);
  };

  const transferParams = item => {
    getEditItem(item);
  };


  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '姓名',
      dataIndex: 'StuName',
      key: 'StuName',
    },
    {
      title: '学号',
      dataIndex: 'StuUserCode',
      key: 'StuUserCode',
    },
    {
      title: '班级',
      dataIndex: 'ClassName',
      key: 'ClassName',
    },
    {
      title: '模块',
      dataIndex: 'ModuleName',
      key: 'ModuleName',
    },
    {
      title: '项目',
      dataIndex: 'ItemName',
      key: 'ItemName',
    },
    {
      title: '标准',
      dataIndex: 'StandardName',
      key: 'StandardName',
    },
    {
      title: '分值',
      dataIndex: 'Score',
      key: 'Score',
    },
    {
      title: '申请时间',
      dataIndex: 'ReportDate',
      key: ' ReportDate',
    },

    {
      title: '详细描述',
      dataIndex: 'address',
      render: (text, record) => {
        return <a onClick={() => transferParams(record)}>点击查看</a>;
      },
    },
    {
      title: '附件',
      dataIndex: 'address',
      render: (text, record) => {
        return <a onClick={() => transferParams(record)}>点击查看</a>;
      },
    },
    {
      title: '审批状态',
      dataIndex: 'ApprovalStatus',
      key: 'ApprovalStatus',
    },
  ];

  //选择行
  const rowSelection = {

    onChange: (selectedRowKeys, selectedRows) => {

      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRowKey);
      setSelectedRowKey(selectedRowKeys);
    },

   // selectedRowKeys: selectedRowKey,
  };

  return (
    <Table
      columns={columns}
      dataSource={mainData}
      rowSelection={
        rowSelection
      }
      rowKey="code"
      loading={mainloading}
      pagination={{
        total: pageTotal,
        onChange: page => subPageChange(page),
      }}
      className={styles.tablePeri}
      /*  current: current,
        pageSize: pageCount,
        
        showSizeChanger: false,
       
      }} */
      bordered={true}
      hideOnSinglePage={false}

    />
  );
};
export default MainContent;
