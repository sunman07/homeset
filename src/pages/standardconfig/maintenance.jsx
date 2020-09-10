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
} from '@/services/service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const { confirm } = Modal;
const ProjectMaintenance = props => {
  const [form] = Form.useForm();
  const [addItemForm, setAddItemForm] = useState(false);
  const [entryOfItem, setEntryOfItem] = useState([]);
  const [objectEntry, setObjectEntry] = useState([]);
  //addItemForm
  const addItemFun = () => {
    /*  form.setFieldsValue({
             CampusName: '',
             LocationCenter: '',
         }); */
    const editIndex = objectEntry.findIndex(item => item.action === 'edit');
    if (editIndex > -1) {
      message.warning('请先保存编辑状态的项目，再添加');
      return;
    }
    form.setFieldsValue({
      ItemName: '',
      MaxScore: '',
      ModuleCode: '',
      StandardNum: '',
    });
    setAddItemForm(true);
  };

  //模块字典
  const getModuleOptions = () => {
    getModuleDic().then(res => {
      if (res.status === 200) {
        setObjectEntry(res.data.list);
      }
    });
  };

  const getItemOfObject = () => {
    const params = { Page: 1, PageCount: 999 };
    console.log('请求1');
    getProjectItem(params).then(res => {
      res.data.List.forEach(item => {
        item.action = 'undo';
      });

      console.log(res);
      setEntryOfItem(res.data.List || []);
    });
  };

  //编辑
  const edit = i => {
    const data = entryOfItem.map((item, index) => {
      if (index === i) {
        item.action = 'edit';
        form.setFieldsValue({
          ItemName: item.ItemName,
          MaxScore: item.MaxScore,
          ModuleCode: item.ModuleCode,
          StandardNum: item.StandardNum,
        });
      } else {
        item.action = 'show';
      }
      return item;
    });
    setEntryOfItem(data);
  };

  //取消编辑
  const cancelEdit = i => {
    const data = entryOfItem.map((item, index) => {
      if (index === i) {
        item.action = 'show';
      }
      return item;
    });
    setEntryOfItem(data);
  };
  //保存编辑项
  const saveEdit = index => {
    form
      .validateFields()
      .then(values => {
        /*  const CampusCode = campusData[index].CampusCode;
                 const params = { ...values, ...{ CampusCode } }; */
        let validateCopy = values;
        validateCopy.MaxScore = Number(values.MaxScore);
        editsObjectItem(validateCopy).then(res => {
          if (res.data.Msg === '编辑项目成功') {
            message.success('修改成功');
            getItemOfObject();
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
        let validateCopy = values;
        validateCopy.MaxScore = Number(values.MaxScore);
        addObjectItem(validateCopy).then(res => {
          if (res.data.Msg === '添加项目成功') {
            message.success('添加项目成功');
            setAddItemForm(false);
            getItemOfObject();
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
    console.log(item);
    //  const params = { ...item, ...{ Del: '1' } };
    removeObjectItem(item).then(res => {
      console.log(res);
      if (res.data.Msg === '删除项目成功') {
        message.success('删除项目成功');
        getItemOfObject();
      } else {
        message.error(res.data.Msg);
      }
    });
  };

  useEffect(() => {
    getItemOfObject(), getModuleOptions();
  }, []);

  return (
    <div className={styles.projectMaint}>
      <Row gutter={24}>
        <Col className={styles.firstRow} span={24}>
          <Button type="primary" onClick={addItemFun}>
            新增
          </Button>
        </Col>
        {/* //entryOfItem */}
        <div className={styles.titleMaint}>
          <Tag>项目名称</Tag>
          <Tag>最高积分</Tag>
          <Tag>所属模块</Tag>
          <Tag>包含标准数量</Tag>
          <Tag>操作</Tag>
        </div>
        <Form form={form} style={{ width: '100%', marginBottom: 15 }}>
          {entryOfItem.map((item, index) => {
            if (item.action === 'edit') {
              return (
                <div className="ant-form ant-form-inline" key={item.ItemCode}>
                  <Form.Item
                    name="ItemName"
                    rules={[{ required: true, message: '请输入项目名称!' }]}
                    style={{ width: '18%' }}
                    initialValue={item.ItemName}
                  >
                    <Input maxLength={15} placeholder="请输入项目名称" />
                  </Form.Item>
                  <Form.Item
                    name="MaxScore"
                    rules={[{ required: true, message: '请输入最高积分!' }]}
                    style={{ width: '18%' }}
                    initialValue={item.MaxScore}
                  >
                    <Input maxLength={45} placeholder="请输入最高积分" />
                  </Form.Item>
                  <Form.Item
                    name="ModuleCode"
                    rules={[{ required: true, message: '请选择所属模块' }]}
                    style={{ width: '18%' }}
                    initialValue={item.ModuleCode}
                  >
                    <Select>
                      {objectEntry &&
                        objectEntry.map(i => (
                          <Option value={i.code} key={i.code}>
                            {i.code_name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="ItemCode"
                    rules={[{ required: true, message: '请选择所属模块' }]}
                    style={{ display: 'none' }}
                    initialValue={item.ItemCode}
                  >
                    {/* <Select>
                                {entryOfItem &&
                                    entryOfItem.map(i => (
                                        <Option value={i.ItemCode} key={i.ItemCode}>
                                            {i.ItemName}
                                        </Option>
                                    ))}
                            </Select> */}
                  </Form.Item>
                  <Form.Item
                    name="StandardNum"
                    rules={[{ required: true, message: '请输入包含标准数量!' }]}
                    style={{ width: '18%' }}
                    initialValue={item.StandardNum}
                  >
                    <Input maxLength={45} placeholder="请输入包含标准数量" />
                  </Form.Item>
                  <Form.Item style={{ width: '23%' }}>
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
                  <Form.Item style={{ width: '18%', textAlign: 'center' }}>
                    <span>{item.ItemName}</span>
                  </Form.Item>

                  <Form.Item style={{ width: '18%', textAlign: 'center' }}>
                    <span>{item.MaxScore}</span>
                  </Form.Item>

                  <Form.Item style={{ width: '18%', textAlign: 'center' }}>
                    <span>{item.ModuleName}</span>
                  </Form.Item>
                  <Form.Item style={{ width: '18%', textAlign: 'center' }}>
                    <span>{item.StandardNum}</span>
                  </Form.Item>

                  <Form.Item style={{ width: '23%', textAlign: 'center' }}>
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
            <div className="ant-form ant-form-inline">
              <Form.Item
                name="ItemName"
                rules={[{ required: true, message: '请输入项目名称!' }]}
                style={{ width: '18%' }}
              >
                <Input maxLength={15} placeholder="请输入项目名称" />
              </Form.Item>
              <Form.Item
                name="MaxScore"
                rules={[{ required: true, message: '请输入最高积分!' }]}
                style={{ width: '18%' }}
              >
                <Input maxLength={45} placeholder="请输入最高积分" />
              </Form.Item>
              <Form.Item
                name="ModuleCode"
                rules={[{ required: true, message: '请选择所属模块!' }]}
                style={{ width: '18%' }}
              >
                <Select>
                  {objectEntry &&
                    objectEntry.map(i => (
                      <Option value={i.code} key={i.code}>
                        {i.code_name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="LocationCenter"
                rules={[{ required: true, message: '请输入包含标准数量!' }]}
                style={{ width: '18%' }}
              >
                <Input maxLength={45} placeholder="请输入包含标准数量" />
              </Form.Item>
              <Form.Item style={{ width: '23%' }}>
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

export default ProjectMaintenance;
