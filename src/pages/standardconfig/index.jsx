import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Button,
  Select,
  Layout,
  Form,
  Row,
  Col,
  Popover,
  Table,
  Drawer,
  Divider,
  Input,
  Modal,
  message,
} from 'antd';
import {
  getConfigEntry,
  getMainEntry,
  getApproveScore,
} from '@/services/service';
import moment from 'moment';
import styles from './standardconfig.less';
import classNames from 'classnames';
import HeaderGroup from '@/components/Header';
import SearchSubUnit from './searchform';
import MainContent from './maincontent';
import DetailsSubUnit from './detailsdisplay';

const { Option } = Select;
const { Header, Content } = Layout;

const StandardConfigSecondary = () => {
  const [configEntry, setConfigEntry] = useState([]);
  const [paramsOfEntry, setParamsOfEntry] = useState({
    Page: 1,
    PageCount: 10,
    ApprovalStatus: 12,
  });
  // 表格条目总数
  const [mainTotal, setMainTotal] = useState(Number);
  const [mainloading, setMainloading] = useState(false);
  //查看详情
  const [checkDetails, setCheckDetails] = useState(false);
  //传递详情数据至detailsdisplay
  const [infoDetails, setInfoDetails] = useState(Object);
  //显示详情弹框
  const [uncheckedDetails, setUncheckedDetails] = useState(false);
  const [form] = Form.useForm();
  const openDetails = values => {
    setInfoDetails(values);
    setCheckDetails(true);
  };
  const closeDetails = () => {
    setCheckDetails(false);
    setInfoDetails('');
  };

  //提交审批请求 getApproveScore
  const scoreApproveForm = params => {
    getApproveScore(params).then(res => {
      console.log(res);
      if (res.status === 200 && res.data.Msg === '操作成功') {
        setUncheckedDetails(false);
        setTimeout(() => {
          setCheckDetails(false);
        }, 500);
        message.success(res.data.Msg);
      } else {
        message.error(res.data.Msg);
      }
    });
  };

  //搜索表单提交
  const onFinish = values => {
    console.log(values);
    delete paramsOfEntry.ApprovalStatus;
    let searchValues = Object.assign(values, paramsOfEntry);
    setParamsOfEntry(searchValues);
  };

  // 表单重置
  const onReset = () => {
    pageForContent.current.subPageChange(1);
    setParamsOfEntry({
      Page: 1,
      PageCount: 10,
      ApprovalStatus: 12,
    });
  };

  //获取子组件方法
  const pageForContent = useRef(null);
  const formRef = useRef(null);
  //分页
  const onPageChange = values => {
    let copyOfEntry = {
      ...paramsOfEntry,
    };
    copyOfEntry.Page = values;
    setParamsOfEntry(copyOfEntry);
  };

  //获取主列表 传入子组件
  const getConfigForStandard = () => {
    setMainloading(true);
    setConfigEntry([]);
    getMainEntry(paramsOfEntry).then(res => {
      if (res.status == 200) {
        setMainloading(false);
        let index = 0;
        setMainTotal(res.data.Total);
        res.data.List &&
          res.data.List.forEach(item => {
            index++;
            item.key = index;
            item.StartDate = moment(item.StartDate).format(
              'YYYY-MM-DD HH:mm:ss',
            );
          });
        setConfigEntry(res.data.List);
      }
    });
  };

  const unApprove = value => {
    setUncheckedDetails(true);
  };
  const doApprove = value => {
    console.log(value);
    const params = {
      RecordId: [value],
      RejectReason: '',
      ApprovalStatus: 14,
    };
    scoreApproveForm(params);
    onReset();
  };

  const closeOptions = () => {
    setUncheckedDetails(false);
  };

  const onSubmit = values => {
    console.log('Success:', values, infoDetails.RecordId);
    const params = {
      RecordId: [infoDetails.RecordId],
      ...values,
      ApprovalStatus: 13,
    };
    scoreApproveForm(params);
    onReset();
  };

  const rejectReason = () => {
    //引用form的onSubmit事件(上面)
    formRef.current.submit();
  };

  useEffect(() => {
    getConfigForStandard();
  }, [paramsOfEntry]);

  return (
    <>
      <Fragment>
        <Layout className={classNames(styles.frontpage, styles.drawerWrapper)}>
          <Header>
            {' '}
            <HeaderGroup />
          </Header>
          <SearchSubUnit onSearch={onFinish} onReset={onReset} />
          <Content className={classNames(styles.contentMain)}>
            <MainContent
              className={styles.tablePeri}
              mainloading={mainloading}
              openDetails={openDetails}
              onReset={onReset}
              ref={pageForContent}
              mainData={configEntry}
              pageTotal={mainTotal}
              pageChange={onPageChange}
            />
          </Content>
          <Modal
            title="查看详情"
            visible={checkDetails}
            onCancel={closeDetails}
            destroyOnClose={true}
            footer={
              <div>
                <Button
                  onClick={() => {
                    unApprove(infoDetails.RecordId);
                  }}
                  className={styles.buttonApprove}
                  htmlType="button"
                >
                  审批不通过
                </Button>
                <Button
                  onClick={() => {
                    doApprove(infoDetails.RecordId);
                  }}
                  type="primary"
                >
                  审批通过
                </Button>
              </div>
            }
          >
            <DetailsSubUnit infoDetails={infoDetails} />
          </Modal>
          <Modal
            title="审批不通过"
            visible={uncheckedDetails}
            onOk={rejectReason}
            onCancel={closeOptions}
            destroyOnClose={true}
          >
            <Form name="Reject" ref={formRef} onFinish={onSubmit}>
              <Form.Item
                label="驳回原因"
                name="RejectReason"
                rules={[{ required: true, message: '请输入驳回原因' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </Layout>
      </Fragment>
    </>
  );
};

export default StandardConfigSecondary;
