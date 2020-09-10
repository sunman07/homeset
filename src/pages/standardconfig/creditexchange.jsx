import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Button,
  Select,
  Table,
  Divider,
  Input,
  Form,
  Row,
  Col,
  message,
} from 'antd';
import {
  getScoreForModule,
  toSubmitModule,
  getModuleForExchange,
  delModuleOfExchange,
} from '@/services/service';
import styles from './standardconfig.less';
const CreditExchange = forwardRef((props, ref) => {
  // 积分模块submitCredit
  const { Option } = Select;
  const { onPointClose } = props;
  const [modulesData, setModulesData] = useState([]);

  const [pointInput, setPointInput] = useState(Number);
  // 表单搜索按钮
  const [selectedRowKey, setSelectedRowKey] = useState(String);
  // 学分兑换表格分页参数
  const [pointGetParams, setPointGetParams] = useState({
    Page: 1,
    PageCount: 999,
  });
  // 学分兑换表格总数
  const [pointSum, setPointSum] = useState(Number);
  // 预览项
  const [selectedView, setSelectedView] = useState([]);
  //展示项目
  const [selectedDisplay, setSelectedDisplay] = useState([]);
  //表格
  const [moduleEntry, setModuleEntry] = useState([]);
  const [form] = Form.useForm();
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>,
    );
  }
  useImperativeHandle(ref, () => ({
    onFinish: onFinish,
  }));
  const onFinish = value => {
    if (selectedRowKey.length === 0) {
      message.error('请选择要兑换的模块');
      return;
    }
    form
      .validateFields()
      .then(value => {
        let valueCopy = Object;
        valueCopy.Score = Number(value.Score);
        const params = { ModuleCode: selectedRowKey, ...valueCopy };
        console.log(params, '这是啥子');
        toSubmitModule(params).then(res => {
          if (res.status === 200) {
            message.success('成功提交');
            onPointClose();
          }
        });
      })
      .catch(err => {
        // 验证不通过时进入
        console.log(err);
      });
  };

  const rowSelection = {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKey);
      setSelectedRowKey(selectedRowKeys);
    },
    getCheckboxProps(record) {
      return {
        // name: record.name,
      };
    },
    selectedRowKeys: selectedRowKey,
  };

  //获取需要兑换的模块
  const getModulePoints = () => {
    setModuleEntry(true);
    getScoreForModule(pointGetParams).then(res => {
      let entryCopy = [];
      if (res.status === 200) {
        setModuleEntry(false);
        res.data.List.map(item => {
          if (item.Used === 1) {
            entryCopy.push(item.ModuleCode);
          }
        });
        console.log(res.data.List,'entry')
        setModulesData(res.data.List);
        setPointSum(res.data.Total);
        setSelectedRowKey(entryCopy);
      } else {
        message.error('兑换模块获取失败');
      }
    });
  };
  let entrySelected = [];
  // 获取兑换的信息
  const getExchangePoints = () => {
    getModuleForExchange().then(res => {
      if (res.status === 200) {
        res.data.List.map(item => {
          entrySelected.push(item.ModuleGroupCode);
        });
        setSelectedView(res.data.List);
      } else {
        message.error('兑换模块获取失败');
      }
    });
  };

  //积分兑换分页
  const pageScoreChange = page => {
    let pageInterface = { ...pointGetParams };
    pageInterface.Page = page;
    setPointGetParams(pageInterface);
  };

  useEffect(() => {
    getExchangePoints();
  }, []);
  useEffect(() => {
    getModulePoints();
  }, [pointGetParams]);

  const columnPoints = [
    {
      title: '模块名称',
      dataIndex: 'ModuleName',
      key: 'ModuleName',
    },
    {
      title: '包含项目数量',
      dataIndex: 'ItemsNum',
      key: 'ItemsNum',
    },
  ];

  const readDetails = items => {
    let valueDisplay = '';
    items.map(item => {
      valueDisplay += ' ' + item;
    });
    valueDisplay += '(每10积分兑换1学分)';
    return valueDisplay;
  };

  const handleViewChange = (value, x) => {
    console.log(value, x);
  };

  const onGetClose = key => {
    let params = { ModuleGroupCode: key };
    delModuleOfExchange(params).then(res => {
      if (res.status === 200) {
        message.success('删除成功');
      }
    });
  };

  return (
    <div className={styles.exchangeForScore}>
      <Divider orientation="left">1.请复选要兑换的模块</Divider>
      <Table
        columns={columnPoints}
        dataSource={modulesData}
        rowSelection={rowSelection}
        loading={moduleEntry}
        rowKey="ModuleCode"
        pagination={
          false
          //  total: pointSum,
          //  pageSize: 999,
          // onChange: page => pageScoreChange(page),
        }
        className={styles.tableDivision}
      ></Table>
      <Divider orientation="left">2.请设置兑换的积分值</Divider>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={onFinish}
        onSubmit={onFinish}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="Score"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请设置正确的兑换积分值',
                },
              ]}
              initialValue={'1'}
            >
              <Input
                placeholder="请设置兑换的积分值(请输入正整数)"
                maxLength={10}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider orientation="left">3.结果</Divider>
      <Select
        mode="tags"
        placeholder="Please select"
        defaultValue={entrySelected}
        style={{ width: '100%' }}
        onChange={handleViewChange}
        onDeselect={onGetClose}
        open={false}
        bordered={false}
      >
        {selectedView &&
          selectedView.map(item => (
            <Option key={item.ModuleGroupCode}>
              {readDetails(item.ModuleName)}
            </Option>
          ))}
      </Select>
    </div>
  );
});

export default CreditExchange;
