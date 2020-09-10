import React, { useEffect, useState } from 'react';
import {
  getGrade,
  getModuleDic,
  getObjectDic,
  getStandardsDic,
} from '@/services/service';
import styles from './standardconfig.less';
import { Form, Button, Select, Row, Col, Input, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
const SearchSubUnit = props => {
  const { onSearch, onReset } = props;
  const [moduleEntry, setModuleEntry] = useState([]); // 模块select
  const [objectEntry, setObjectEntry] = useState([]); // 项目select
  const [standardEntry, setStandardEntry] = useState([]); // 项目select
  const [form] = Form.useForm();

  //获取所有字典项
  const getSelectSum = () => {
    //模块字典
    getModuleDic().then(res => {
      if (res.status === 200) {
        setModuleEntry(res.data.list);
      } else {
        message.error('获取模块字典失败');
      }
    });
  };

  const getItemSum = params => {
    //项目字典
    getObjectDic(params).then(res => {
      if (res.status === 200) {
        setObjectEntry(res.data.List);
      } else {
        message.error('获取项目字典失败');
      }
    });
  };

  const getStandardSum = params => {
    //标准字典
    getStandardsDic(params).then(res => {
      if (res.status === 200) {
        setStandardEntry(res.data.List);
      } else {
        message.error('获取标准字典失败');
      }
    });
  };

  useEffect(() => {
    getSelectSum(); // 获取年级
  }, []);

  // 切换模块时
  const moduleChange = moduleCode => {
    getItemSum(moduleCode);
    form.setFieldsValue({ ItemCode: '' });
    form.setFieldsValue({ StandardCode: '' });
  };

  const itemChange = itemCode => {
    getStandardSum(itemCode);
    form.setFieldsValue({ StandardCode: '' });
  };
  //重置表单
  const formReset = event => {
    form.resetFields();
    onReset();
  };

  return (
    <div className={styles.searchform}>
      <Form
        form={form}
        name="horizontal_login"
        layout="inline"
        onFinish={onSearch}
      > <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="ModuleCode" label="班级：">
              <Select
                onChange={moduleChange}
                placeholder="请选择"
                className={styles.selecton}
              >
                {moduleEntry &&
                  moduleEntry.length > 0 &&
                  moduleEntry.map(i => (
                    <Option value={i.code} key={i.code}>
                      {i.code_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ModuleCode" label="学号：">
              <Input className={styles.inputSearch} placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ModuleCode" label="姓名：">
              <Input className={styles.inputSearch} placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ModuleCode" label="状态：">
              <Select
                onChange={moduleChange}
                placeholder="请选择"
                className={styles.selecton}
              >
                {moduleEntry &&
                  moduleEntry.length > 0 &&
                  moduleEntry.map(i => (
                    <Option value={i.code} key={i.code}>
                      {i.code_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row className={styles.rowGrids} gutter={24}>
          <Col span={6}>
            <Form.Item name="ModuleCode" label="模块：">
              <Select
                onChange={moduleChange}
                placeholder="请选择"
                className={styles.selecton}
              >
                {moduleEntry &&
                  moduleEntry.length > 0 &&
                  moduleEntry.map(i => (
                    <Option value={i.code} key={i.code}>
                      {i.code_name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="ItemCode" label="项目：">
              <Select
                onChange={itemChange}
                placeholder="请选择"
                className={styles.selecton}
              >
                {objectEntry &&
                  objectEntry.length > 0 &&
                  objectEntry.map(i => (
                    <Option value={i.ItemCode} key={i.ItemCode}>
                      {i.ItemName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="StandardCode" label="标准：">
              <Select placeholder="请选择" className={styles.selecton}>
                {standardEntry &&
                  standardEntry.length > 0 &&
                  standardEntry.map(i => (
                    <Option value={i.StandardCode} key={i.StandardCode}>
                      {i.StandardName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} align="right" className={styles.btnperi}>
            <Button htmlType="submit" type="primary">
              查询
            </Button>
            <Button htmlType="button" onClick={formReset}>
              重置
            </Button>
          </Col>

        </Row>
      </Form>
    </div>
  );
};

export default SearchSubUnit;
