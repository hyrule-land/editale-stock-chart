import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Icon,
  Popover,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';
import currencies from '../util/currencies';
import styles from './index.less';
import config from '../shape/config';

const noop = () => {};

const { Option } = Select;

const TzfModal = props => {
  const { visible = false, onCancel = noop, onOk = noop, type = 'tzf' } = props;
  const { getFieldDecorator } = props.form;

  const [currency, setCurrency] = useState(currencies[0]);
  const [modalType, setModalType] = useState(type);

  // 更新 modalType
  useEffect(() => {
    if (!visible) props.form.resetFields();
    setModalType(type);
  }, [type, visible]);

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onOk({
          ...values,
          currency,
          nodeType: modalType === 'tzf' ? 'tzf' : 'dwtzf',
        });
      }
    });
  }

  function handleCancel() {
    onCancel();
  }

  // 暂时不用
  function submit() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log({
          ...values,
          currency,
        });
      }
    });
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };

  function onCurrencyChange(val) {
    setCurrency(val);
  }

  // uuidv4
  const selectAfter = (
    <Select
      defaultValue={currencies[0]}
      style={{ width: 130 }}
      onChange={onCurrencyChange}
    >
      {currencies.map(item => {
        return (
          <Option value={item} key={uuidv4()}>
            {item}
          </Option>
        );
      })}
    </Select>
  );

  function swapModalType() {
    if (modalType === 'tzf') {
      setModalType('dwtzf');
    } else {
      setModalType('tzf');
    }
  }

  const titleDom = (
    <div className={styles.modalTitle}>
      <div
        className={styles.stripe}
        style={{
          background: config[modalType].stroke,
        }}
      />
      <span>{modalType === 'tzf' ? '添加投资方' : '添加对外投资方'}</span>
      <Popover
        content={`切换成${
          modalType === 'tzf' ? '添加对外投资方' : '添加投资方'
        }`}
        placement="bottom"
        title={null}
      >
        <Icon
          type="swap"
          style={{ marginLeft: 8, fontSize: '12px', cursor: 'pointer' }}
          onClick={swapModalType}
        />
      </Popover>
    </div>
  );

  const footer = (
    <>
      <Button type="default" onClick={handleCancel}>
        取消
      </Button>
      <Button
        type="primary"
        style={{
          background: config[modalType].stroke,
          borderColor: config[modalType].stroke,
        }}
        onClick={handleOk}
      >
        确定
      </Button>
    </>
  );

  return (
    <Modal
      title={titleDom}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      maskClosable={false}
      footer={footer}
    >
      <Form {...formItemLayout}>
        <Form.Item label="投资方名称">
          {getFieldDecorator('name', {
            rules: [
              {
                max: 100,
                message: '名称不得超过100字',
              },
              {
                required: true,
                message: '请输入投资方名称',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="统一社会信用代码">
          {getFieldDecorator('tyshxydm', {
            rules: [
              {
                pattern: /^[a-zA-Z\d]+$/,
                message: '该字段只能输入字母或数字',
              },
              {
                max: 20,
                message: '不得超过20个字符',
              },
              {
                required: false,
                message: '请输入统一社会信用代码',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="国家(地区)">
          {getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: '请选择国家(地区)',
              },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="投资金额">
          {getFieldDecorator('investmentAmount', {
            // initialValue: 0,
            rules: [
              {
                pattern: /^\d+(\.\d+)?$/,
                message: '请输入有效的数字',
              },
              {
                required: true,
                message: '请输入投资金额',
              },
            ],
          })(<Input type="number" addonAfter={selectAfter} />)}
        </Form.Item>

        <Form.Item label="投资比例">
          {getFieldDecorator('investmentProportion', {
            // initialValue: 0,
            rules: [
              {
                required: true,
                message: '请输入投资比例',
              },
            ],
          })(
            <InputNumber
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              // onChange={onChange}
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(TzfModal);
