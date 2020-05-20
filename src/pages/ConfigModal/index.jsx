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
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import countries from './countries.js';

const noop = () => {};

const { Option } = Select;

const TzfModal = props => {
  const {
    visible = false,
    onCancel = noop,
    onOk = noop,
    type = 'tzf',
    dataSource = {},
  } = props;
  const { getFieldDecorator } = props.form;

  const [currency, setCurrency] = useState(currencies[0]);
  const [monetaryUnit, setMonetaryUnit] = useState('万元');

  const [modalType, setModalType] = useState(type);
  const [action, setAction] = useState('create');

  // 更新 modalType
  useEffect(() => {
    // 判断 dataSource 是否为空对象，如果不是空对象，那执行的是更新操作
    if (_isEmpty(dataSource)) {
      setAction('create');
      setMonetaryUnit('万元');
      setCurrency(currencies[0]);
      setModalType(type);
    } else {
      const {
        tyshxydm,
        monetaryUnit,
        currency,
        investmentAmount,
        investmentProportion,
        name,
        location,
        action,
        id,
      } = dataSource;

      setAction('update');
      props.form.setFieldsValue({
        tyshxydm,
        name,
        location,
        investmentAmount: parseFloat(investmentAmount),
        investmentProportion: parseFloat(investmentProportion),
      });
      setModalType(type);
      setMonetaryUnit(monetaryUnit);
      setCurrency(currency);
    }
  }, [type, visible, dataSource]);

  function handleOk() {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onOk({
          ...values,
          currency,
          monetaryUnit,
          nodeType: modalType === 'tzf' ? 'tzf' : 'dwtzf',
          // action,
          id: _get(dataSource, 'id'),
        });
      }
    });
  }

  function handleCancel() {
    onCancel();
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

  function onMonetaryUnitChange(val) {
    setMonetaryUnit(val);
  }

  const selectBefore = (
    <Select
      defaultValue={currencies[0]}
      style={{ width: 118 }}
      onChange={onCurrencyChange}
      value={currency}
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

  const selectAfter = (
    <Select
      defaultValue="万元"
      // style={{ width: 130 }}
      onChange={onMonetaryUnitChange}
      value={monetaryUnit}
    >
      <Option value="万元">万元</Option>
      <Option value="元">元</Option>
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
          background: config.node[modalType].stroke,
        }}
      />
      <span>
        {action === 'create' ? '添加' : '修改'}
        {modalType === 'tzf' ? '投资方' : '对外投资方'}
      </span>
      <Popover
        content={`切换成${
          modalType === 'tzf' ? '添加对外投资方' : '添加投资方'
        }`}
        placement="bottom"
        title={null}
      >
        {action === 'create' ? (
          <Icon
            type="swap"
            style={{ marginLeft: 8, fontSize: '12px', cursor: 'pointer' }}
            onClick={swapModalType}
          />
        ) : null}
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
          background: config.node[modalType].stroke,
          borderColor: config.node[modalType].stroke,
        }}
        onClick={handleOk}
      >
        确定
      </Button>
    </>
  );

  function onSearch() {}

  return (
    <Modal
      title={titleDom}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      maskClosable={false}
      footer={footer}
      destroyOnClose={true}
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
          })(<Input allowClear />)}
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
          })(<Input allowClear />)}
        </Form.Item>

        <Form.Item label="国家(地区)">
          {getFieldDecorator('location', {
            rules: [
              {
                required: true,
                message: '请选择国家(地区)',
              },
            ],
          })(
            <Select
              showSearch
              placeholder="选择国家(地区)"
              optionFilterProp="children"
              onSearch={onSearch}
              allowClear
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {countries.map(item => {
                return (
                  <Option value={item.gjhdqjc} key={uuidv4()}>
                    {item.gjhdqjc}
                  </Option>
                );
              })}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="投资金额">
          {getFieldDecorator('investmentAmount', {
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
          })(
            <Input
              type="number"
              addonBefore={selectBefore}
              addonAfter={selectAfter}
              allowClear
            />,
          )}
        </Form.Item>

        <Form.Item label="投资比例">
          {getFieldDecorator('investmentProportion', {
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
              allowClear
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(TzfModal);
