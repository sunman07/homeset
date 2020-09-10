import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
  Button,
  Select,
  Layout,
  Row,
  Col,
  Popover,
  Table,
  Drawer,
  Divider,
  Input,
  Modal,
} from 'antd';
import { getConfigEntry,getMainEntry} from '@/services/service';
import moment from 'moment';
import styles from './standardconfig.less';
import classNames from 'classnames';
import HeaderGroup from '@/components/Header';
import SearchSubUnit from './searchform';
import MainContent from './maincontent';
import CreditExchange from './creditexchange';
import ProjectMaintenance from './maintenance';
import ModuleMaintenance from './modulemain';
import AddOrEditContent from './addwithedit';

const { Option } = Select;
const { Header, Content } = Layout;

const StandardConfigSecondary = () => {
  const [configEntry, setConfigEntry] = useState([]);
  const [paramsOfEntry, setParamsOfEntry] = useState({
    Page: 1,
    PageCount: 20,
    ApprovalStatus:12,
  });
  // 表格条目总数
  const [mainTotal, setMainTotal] = useState(Number);
  // 积分兑换显示隐藏 pointVisible
  const [pointVisible, setPointVisible] = useState(false);
  //项目显示隐藏
  const [objectVisible, setObjectVisible] = useState(false);
  //模块显示隐藏
  const [moduleVisible, setModuleVisible] = useState(false);
  //添加编辑标准显示隐藏
  const [editOrEditVisible, setEditOrEditVisible] = useState(false);

  //传递编辑
  const [transferEdits, setTransferEdits] = useState(Object);
  //判断编辑还是新增 设置标题
  const judgeForEditTitle =
    JSON.stringify(transferEdits) !== '{}' ? '编辑标准' : '新增标准';

  const [mainloading, setMainloading] = useState(false);
  const changeEditStatus = () => {
    setEditOrEditVisible(false);
  };
  const openOrEditStatus = () => {
    setTransferEdits({});
    setEditOrEditVisible(true);
  };

  const onModuleClose = () => {
    setModuleVisible(false);
  };

  const onObjectClose = () => {
    setObjectVisible(false);
  };

  const onFinish = values => {
    let searchValues = Object.assign(values, paramsOfEntry);
    setParamsOfEntry(searchValues);
  };

  const getEditItem = record => {
    console.log(record);
    setTransferEdits(record);
    setEditOrEditVisible(true);
  };
  //获取子组件方法
  const scoreForExchange = useRef(null);
  const editForContent = useRef(null);
  const onCredit = values => {
    //引用子组件方法
    scoreForExchange.current.onFinish();
  };

  const onStandardOk = values => {
    //引用子组件方法
    editForContent.current.onFinish();
    onReset();
  };
  //分页
  const onPageChange = values => {
    let copyOfEntry = {
      ...paramsOfEntry,
    };
    copyOfEntry.Page = values;
    setParamsOfEntry(copyOfEntry);
  };
  // 表单重置
  const onReset = () => {
    setParamsOfEntry({
      Page: 1,
      PageCount: 20,
      ApprovalStatus:12,
    });
  };
  //获取标准列表
  const getConfigForStandard = () => {
    setMainloading(true);
 
    getMainEntry(paramsOfEntry).then(res => {
      console.log(paramsOfEntry,res)
      setConfigEntry([{code:'12311'},{code:'122123'},{code:'22123'}]);
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
       // setConfigEntry(res.data.List);
      }
    });

/*     getConfigEntry(paramsOfEntry).then(res => {
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
    }); */
  };

  //如果切换了select 弹出抽屉
  const selectDrawer = value => {
    if (value === '学分兑换') {
      setPointVisible(true);
    } else if (value === '项目维护') {
      setObjectVisible(true);
    } else if (value === '模块维护') {
      setModuleVisible(true);
    }
  };

  const onPointClose = () => {
    setPointVisible(false);
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
            <Row>
              <Col span={24} className={styles.rightControl}>
                <Select style={{ width: 110 }} onChange={selectDrawer} value="">
                  <Option value="模块维护">模块维护</Option>
                  <Option value="项目维护">项目维护</Option>
                  <Option value="学分兑换">学分兑换</Option>
                </Select>{' '}
                <Button
                  type="primary"
                  onClick={() => {
                    openOrEditStatus();
                  }}
                >
                  新增标准
                </Button>
              </Col>
            </Row>
            <MainContent
              className={styles.tablePeri}
              getEditItem={getEditItem}
              mainloading={mainloading}
              mainData={configEntry}
              pageTotal={mainTotal}
              pageChange={onPageChange}
            />
          </Content>
          <Drawer
            getContainer={false}
            title="学分兑换"
            placement="right"
            width="50%"
            closable={true}
            destroyOnClose={true}
            onClose={onPointClose}
            visible={pointVisible}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button onClick={onPointClose} style={{ marginRight: 8 }}>
                  取消
                </Button>
                <Button onClick={onCredit} type="primary">
                  确定
                </Button>
              </div>
            }
          >
            <CreditExchange
              onCredit={onCredit}
              onPointClose={onPointClose}
              ref={scoreForExchange}
            />
          </Drawer>
          <Drawer
            getContainer={false}
            title="项目维护"
            placement="right"
            width="50%"
            closable={true}
            destroyOnClose={true}
            onClose={onObjectClose}
            visible={objectVisible}
          >
            <ProjectMaintenance />
          </Drawer>
          {/* ModuleMaintenance */}
          <Drawer
            getContainer={false}
            title="模块维护"
            placement="right"
            width="50%"
            closable={true}
            destroyOnClose={true}
            onClose={onModuleClose}
            visible={moduleVisible}
          >
            <ModuleMaintenance />
          </Drawer>
          <Modal
            title={judgeForEditTitle}
            visible={editOrEditVisible}
            onOk={onStandardOk}
            onCancel={changeEditStatus}
            destroyOnClose={true}
          >
            <AddOrEditContent
              className={styles.addWithEdit}
              changeEditStatus={changeEditStatus}
              transferEdits={transferEdits}
              ref={editForContent}
            />
          </Modal>
        </Layout>
      </Fragment>
    </>
  );
};

export default StandardConfigSecondary;
