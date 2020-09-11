import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  Fragment,
} from 'react';
import { Table, Divider, Row, Col, Button, message } from 'antd';
import styles from './standardconfig.less';
import { getApproveScore } from '@/services/service';
const MainContent = forwardRef((props, ref) => {
  const {
    mainData,
    pageTotal,
    pageChange,
    mainloading,
    onReset,
    openDetails,
  } = props;
  const [selectedRowKey, setSelectedRowKey] = useState(String);
  const [pageNum, setPageNum] = useState(1);
  useImperativeHandle(ref, () => ({
    subPageChange: subPageChange,
  }));
  const subPageChange = value => {
    setPageNum(value);
    pageChange(value);
  };

  //状态select字典
  const statusRead = [
    { statusCode: 12, name: '待审批' },
    { statusCode: 13, name: '审批不通过' },
    { statusCode: 14, name: '审批通过' },
  ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
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
        return (
          <a
            onClick={() => {
              openDetails(record);
            }}
          >
            点击查看
          </a>
        );
      },
    },
    {
      title: '附件',
      dataIndex: 'address',
      render: (text, record) => {
        return <a>点击查看</a>;
      },
    },
    {
      title: '审批状态',
      dataIndex: 'ApprovalStatus',
      render: (text, record) => {
        return (
          <span>
            {
              statusRead[
                statusRead.findIndex(value => value.statusCode === text)
              ].name
            }
          </span>
        );
      },
    },
  ];

  //选择行
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRowKey);
      setSelectedRowKey(selectedRowKeys);
    },
  };

  //审批接口 getApproveScore

  const toApproveScore = params => {
    getApproveScore(params).then(res => {
      if (res.status === 200 && res.data.Msg === '操作成功') {
        message.success(res.data.Msg);
      } else {
        message.error('操作失败');
      }
    });
  };

  //不通过审批

  const unApprove = () => {
    console.log(selectedRowKey, '已选择');
    if (selectedRowKey.length === 0) {
      message.error('请您选择后再操作');
    } else {
      const params = {
        RecordId: selectedRowKey,
        RejectReason: '',
        ApprovalStatus: 13,
      };
      toApproveScore(params);
      onReset();
    }
  };

  const doApprove = () => {
    if (selectedRowKey.length === 0) {
      message.error('请您选择后再操作');
    } else {
      const params = {
        RecordId: selectedRowKey,
        RejectReason: '',
        ApprovalStatus: 14,
      };
      toApproveScore(params);
      onReset();
    }
  };
  return (
    <Fragment>
      <Row className={styles.mainApprove}>
        <Col span="24" align="right">
          <Button
            onClick={unApprove}
            className={styles.buttonApprove}
            htmlType="button"
          >
            审批不通过
          </Button>
          <Button onClick={doApprove} type="primary">
            审批通过
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={mainData}
        rowSelection={rowSelection}
        rowKey="RecordId"
        loading={mainloading}
        pagination={{
          total: pageTotal,
          pageSize: 10,
          current: pageNum,
          onChange: page => subPageChange(page),
        }}
        className={styles.tablePeri}
        bordered={true}
        hideOnSinglePage={false}
      />
    </Fragment>
  );
});
export default MainContent;
