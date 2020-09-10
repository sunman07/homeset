import React, { useState, useEffect, Fragment } from 'react';
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
  Modal,
  Tag,
} from 'antd';
import styles from './standardconfig.less';
import {
  getProjectItem,
  getModuleDic,
  addObjectItem,
  editsObjectItem,
  removeObjectItem,
  addModuleItem,
  getScoreForModule,
  editsModuleItem,
  removeModuleItem,
} from '@/services/service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const { confirm } = Modal;
const ModuleMaintenance = props => {
  const [form] = Form.useForm();
  const [addItemForm, setAddItemForm] = useState(false);
  const [entryOfItem, setEntryOfItem] = useState([]);
  const [objectEntry, setObjectEntry] = useState([]);
  //addItemForm
  const addItemFun = () => {
    const editIndex = objectEntry.findIndex(item => item.action === 'edit');
    if (editIndex > -1) {
      message.warning('请先保存编辑状态的项目，再添加');
      return;
    }
    form.setFieldsValue({
      ModuleName: '',
      ModuleCode: '',
      ItemsNum: '',
    });
    setAddItemForm(true);
  };

  //模块字典
  const getModuleOptions = () => {
    const params = { Page: 1, PageCount: 999 };
    getScoreForModule(params).then(res => {
      res.data.List.forEach(item => {
        item.action = 'undo';
      });
      if (res.status === 200) {
        setObjectEntry(res.data.List);
      }
    });
  };

  const getItemOfObject = () => {
    const params = { Page: 1, PageCount: 999 };
    getProjectItem(params).then(res => {
      console.log(res);
      setEntryOfItem(res.data.List || []);
    });
  };

  //编辑
  const edit = i => {
    const data = objectEntry.map((item, index) => {
      if (index === i) {
        item.action = 'edit';
        form.setFieldsValue({
          ModuleName: item.ModuleName,
          ModuleCode: item.ModuleCode,
          ItemsNum: item.ItemsNum,
        });
      } else {
        item.action = 'show';
      }
      return item;
    });
    setObjectEntry(data);
  };

  //取消编辑
  const cancelEdit = i => {
    const data = objectEntry.map((item, index) => {
      if (index === i) {
        item.action = 'show';
      }
      return item;
    });
    setObjectEntry(data);
  };
  //保存编辑项
  const saveEdit = index => {
    form
      .validateFields()
      .then(values => {
        /*  const CampusCode = campusData[index].CampusCode;
                 const params = { ...values, ...{ CampusCode } }; */
        editsModuleItem(values).then(res => {
          console.log(res, '返回值');
          if (res.data.Msg === '编辑模块成功') {
            message.success('修改成功');
            getModuleOptions();
          } else {
            message.error(res.data.Msg);
          }
        });
      })
      .catch(errorInfo => {});
  };
  //保存新项目
  const save = () => {
    form
      .validateFields()
      .then(values => {
        addModuleItem(values).then(res => {
          if (res.data.Msg === '添加模块成功') {
            message.success('添加项目成功');
            setAddItemForm(false);
            getModuleOptions();
          } else {
            message.error(res.data.Msg);
          }
        });
      })
      .catch(errorInfo => {});
  };

  //删除项目
  const showDeleteConfirm = item => {
    confirm({
      title: '确认删除该项目?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        del(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const del = item => {
    removeModuleItem(item).then(res => {
      console.log(res);
      if (res.data.Msg === '删除模块成功') {
        message.success('删除模块成功');
        getModuleOptions();
      } else {
        message.error(res.data.Msg);
      }
    });
  };

  useEffect(() => {
    getItemOfObject(), getModuleOptions();
  }, []);

  return (
    <div className={styles.moduleMaint}>
      <Row gutter={24}>
        <Col className={styles.firstRow} span={24}>
          <Button type="primary" onClick={addItemFun}>
            新增
          </Button>
        </Col>
        {/* //entryOfItem */}
        <div className={styles.titleMaint}>
          <Tag>模块名称</Tag>
          <Tag>包含项目数量</Tag>
          <Tag>操作</Tag>
        </div>
        <Form form={form} style={{ width: '100%', marginBottom: 15 }}>
          {objectEntry.map((item, index) => {
            if (item.action === 'edit') {
              return (
                <div className="ant-form ant-form-inline" key={item.ItemCode}>
                  <Form.Item
                    name="ModuleName"
                    rules={[{ required: true, message: '请输入模块名称!' }]}
                    style={{ width: '30%' }}
                    initialValue={item.ModuleName}
                  >
                    <Input maxLength={15} placeholder="请输入模块名称" />
                  </Form.Item>
                  <Form.Item
                    name="ModuleCode"
                    rules={[{ required: true, message: '请输入模块名称!' }]}
                    style={{ display: 'none' }}
                    initialValue={item.ModuleCode}
                  >
                    <Input maxLength={15} placeholder="请输入模块名称" />
                  </Form.Item>
                  <Form.Item
                    name="ItemsNum"
                    rules={[{ required: true }]}
                    style={{ width: '30%' }}
                    initialValue={item.ItemsNum}
                  >
                    <Input maxLength={45} disabled />
                  </Form.Item>

                  <Form.Item style={{ width: '33%' }}>
                    <Button
                      type="link"
                      onClick={() => {
                        saveEdit(index);
                      }}
                    >
                      保存
                    </Button>
                    <span className={styles.lineCuts}>|</span>
                    <Button
                      type="link"
                      onClick={() => {
                        cancelEdit(index);
                      }}
                    >
                      取消
                    </Button>
                  </Form.Item>
                </div>
              );
            } else {
              return (
                <div className="ant-form ant-form-inline" key={item.ItemCode}>
                  <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                    <span>{item.ModuleName}</span>
                  </Form.Item>

                  <Form.Item style={{ width: '30%', textAlign: 'center' }}>
                    <span>{item.ItemsNum}</span>
                  </Form.Item>

                  <Form.Item style={{ width: '33%', textAlign: 'center' }}>
                    <Button
                      type="link"
                      htmlType="submit"
                      onClick={() => edit(index)}
                    >
                      编辑
                    </Button>
                    <span className={styles.lineCuts}>|</span>
                    <Button
                      danger
                      type="text"
                      onClick={() => showDeleteConfirm(item)}
                    >
                      删除
                    </Button>
                  </Form.Item>
                </div>
              );
            }
          })}{' '}
          {addItemForm && (
            <div className="ant-form ant-form-inline" key="addForm">
              <Form.Item
                name="ModuleName"
                rules={[{ required: true, message: '请输入模块名称!' }]}
                style={{ width: '30%' }}
                initialValue={''}
              >
                <Input maxLength={15} placeholder="请输入模块名称" />
              </Form.Item>

              <Form.Item
                name="ItemsNum"
                // rules={[{ required: true }]}
                style={{ width: '30%' }}
                initialValue={''}
              >
                <Input maxLength={45} disabled />
              </Form.Item>
              <Form.Item style={{ width: '33%' }}>
                <Button
                  type="link"
                  onClick={() => {
                    save();
                  }}
                >
                  保存
                </Button>
                <span className={styles.lineCuts}>|</span>
                <Button
                  type="link"
                  onClick={() => {
                    setAddItemForm(false);
                  }}
                >
                  删除
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
        {/* else {
            return (
              <div className="ant-form ant-form-inline" key={item.CampusCode}>
                <Form.Item style={{ width: 200 }}>
                    <span>{item.CampusName}</span>
                </Form.Item>

                <Form.Item style={{ width: 200 }}>
                    <span>{item.LocationCenter}</span>
                </Form.Item>

                <Form.Item style={{ width: 200 }}>
                    <Button
                        type="link"
                        htmlType="submit"
                        onClick={() => edit(index)}
                    >
                        编辑
                  </Button>
                    <Button
                        danger
                        type="text"
                        onClick={() => showDeleteConfirm(item)}
                    >
                        删除
                  </Button>
                </Form.Item>
            </div>
            );
          } */}
      </Row>
    </div>
  );
};

export default ModuleMaintenance;
