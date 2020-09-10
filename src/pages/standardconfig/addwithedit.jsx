import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Form,
  Row,
  Button,
  Col,
  message,
  Modal,
  Input,
  Select,
  DatePicker,
} from 'antd';
import {
  getGrade,
  getModuleDic,
  getObjectDic,
  getStandardsDic,
  addStandardItem,
  editsStandardItem,
} from '@/services/service';
import styles from './standardconfig.less';
import moment from 'moment';
const { option } = Select;
const { RangePicker } = DatePicker;
const AddOrEditContent = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const { changeEditStatus, transferEdits } = props;
  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: '请输入有效日期!' }],
  };
  const [moduleEntry, setModuleEntry] = useState([]);
  const [objectEntry, setObjectEntry] = useState([]);
  const [standardEntry, setStandardEntry] = useState([]);
  const [itemOnInitial, setItemOnInitial] = useState({});
  const judgeForEdit = JSON.stringify(transferEdits) !== '{}';
  useImperativeHandle(ref, () => ({
    onFinish: onFinish,
  }));
  let doInitialValue = Object;

  if (judgeForEdit) {
    let initialValue = transferEdits;
    initialValue.StartDate = moment(transferEdits.StartDate).format(
      'YYYY-MM-DD',
    );
    initialValue.EndDate = moment(transferEdits.EndDate).format('YYYY-MM-DD');
    doInitialValue = initialValue;
  } else {
    form.setFieldsValue({
      DateTime: '',
    });
  }

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

    const paramsItems = judgeForEdit ? doInitialValue.ModuleCode : null;

    getObjectDic(paramsItems).then(res => {
      console.log(paramsItems, res.data.List);
      if (res.status === 200) {
        setObjectEntry(res.data.List);
      } else {
        message.error('获取项目字典失败');
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

  const onModuleChange = values => {
    getItemSum(values);
    form.setFieldsValue({ ItemCode: '' });
    form.setFieldsValue({ StandardName: '' });
  };

  const onItemChange = values => {
    console.log(values);
  };

  useEffect(() => {
    getSelectSum();
  }, []);

  const onFinish = value => {
    form
      .validateFields()
      .then(value => {
        let params = value;
        params.StartDate = moment(params.DateTime[0]._d).format('YYYY-MM-DD');
        params.EndDate = moment(params.DateTime[0]._d).format('YYYY-MM-DD');
        params.SingleScore = Number(params.SingleScore);
        params.MaxScore = Number(params.MaxScore);

        if (!judgeForEdit) {
          addStandardItem(params).then(res => {
            if (res.data.Msg === '添加标准成功') {
              message.success(res.data.Msg);
              changeEditStatus();
            } else {
              message.error(res.data.Msg);
            }
          });
        } else {
          params.StandardCode = doInitialValue.StandardCode;
          editsStandardItem(params).then(res => {
            if (res.data.Msg === '编辑标准成功') {
              message.success(res.data.Msg);
              changeEditStatus();
            } else {
              message.error(res.data.Msg);
            }
          });
        }
      })
      .catch(err => {
        // 验证不通过时进入
      });
  };
  return (
    <div className={styles.addWithEdit}>
      {true && (
        <Form
          form={form}
          style={{ width: '100%', marginBottom: 15 }}
          onFinish={onFinish}
          onSubmit={onFinish}
        >
          <Form.Item
            name="ModuleCode"
            rules={[{ required: true, message: '请输入模块名称!' }]}
            style={{ width: '90%' }}
            placeholder="请选择所属模块"
            label="所属模块"
            initialValue={judgeForEdit ? doInitialValue.ModuleCode : null}
          >
            <Select onChange={onModuleChange} placeholder="请选择所属模块">
              {moduleEntry &&
                moduleEntry.length > 0 &&
                moduleEntry.map(i => (
                  <Option value={i.code} key={i.code}>
                    {i.code_name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ItemCode"
            rules={[{ required: true, message: '请输入所属项目!' }]}
            style={{ width: '90%' }}
            label="所属项目"
            initialValue={judgeForEdit ? doInitialValue.ItemCode : null}
          >
            <Select placeholder="请选择所属项目" onChange={onItemChange}>
              {objectEntry &&
                objectEntry.length > 0 &&
                objectEntry.map(i => (
                  <Option value={i.ItemCode} key={i.ItemCode}>
                    {i.ItemName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="StandardName"
            rules={[{ required: true, message: '请输入标准名称!' }]}
            style={{ width: '90%' }}
            placeholder="请选择标准名称"
            label="标准名称"
            initialValue={judgeForEdit ? doInitialValue.StandardName : null}
          >
            <Input placeholder="请输入标准名称" />
          </Form.Item>
          <Form.Item
            name="SingleScore"
            label="积分范围"
            // className={styles.indentText}
            style={{ width: '90%' }}
            rules={[
              {
                required: true,
                message: '请输入有效积分范围!',
                pattern: new RegExp(/^(\d+)(.\d{0,2})?$/, 'g'),
              },
            ]}
            initialValue={judgeForEdit ? doInitialValue.SingleScore : null}
          >
            <Input placeholder="请输入积分范围" />
          </Form.Item>
          <Form.Item
            name="MaxScore"
            rules={[
              {
                required: true,
                message: '请输入有效最高积分!',
                pattern: new RegExp(/^(\d+)(.\d{0,2})?$/, 'g'),
              },
            ]}
            style={{ width: '90%' }}
            label="最高积分"
            initialValue={judgeForEdit ? doInitialValue.MaxScore : null}
          >
            <Input placeholder="请输入最高积分" />
          </Form.Item>

          <Form.Item
            name="DateTime"
            label="有效日期"
            {...rangeConfig}
            initialValue={[
              moment(doInitialValue.StartDate),
              moment(doInitialValue.EndDate),
            ]}
          >
            <RangePicker style={{ width: '88%' }} />
          </Form.Item>
          <Form.Item
            name="Info"
            // rules={[{ required: true, message: '请输入其他描述!' }]}
            style={{ width: '90%', paddingLeft: '14px' }}
            label="其他描述"
            initialValue={
              judgeForEdit && doInitialValue.Info ? doInitialValue.Info : null
            }
          >
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      )}
    </div>
  );
});
export default AddOrEditContent;
