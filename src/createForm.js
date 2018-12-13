import React from 'react';
import { getValueFromEvent } from './utils';

function createForm() {
  function decorate(WrappedComponent) {
    class Form extends React.Component {
      constructor(props) {
        super(props);

        this.state = {};
        // 事件
        this.cacheAction = {};
        // 初始值及校验信息
        this.fieldsMeta = {};
      }

      onChange = (name, event) => {
        const value = getValueFromEvent(event);
        this.setField(name, { name, value });
      };

      // 目前只支持 onChange 事件
      bindTrigger = (name, action, fn) => {
        const cache = (this.cacheAction[name] = this.cacheAction[name] || {});
        if (!cache[action]) {
          cache[action] = fn.bind(this, name);
        }
        return cache[action];
      };

      getFieldProps = (name, options = {}) => {
        const { initialValue = '', trigger = 'onChange' } = options;
        const inputProps = { value: initialValue };
        inputProps[trigger] = this.bindTrigger(name, trigger, this.onChange);

        const field = this.getField(name);
        if (field && 'value' in field) {
          inputProps.value = field.value;
        }

        const fieldMeta = this.fieldsMeta[name] || {};
        fieldMeta.initialValue = initialValue;
        this.fieldsMeta[name] = fieldMeta;

        return inputProps;
      };

      validate = () => {
        const names = Object.keys(this.fieldsMeta);
        const allValues = {};

        names.map(name => {
          const fieldMeta = this.getFieldMeta(name);
          const field = this.getField(name, true);

          // 数据未改变的话直接读取初始值
          if (!('value' in field) && 'initialValue' in fieldMeta) {
            field.value = fieldMeta.initialValue;
          }
          allValues[name] = field.value;
        });
        return allValues;
      };

      getForm = () => {
        return {
          getFieldProps: this.getFieldProps,
          validate: this.validate,
        };
      };

      // 存入单个标签的数据
      setField(name, field) {
        let stat = { [name]: field };
        if (typeof name === 'object') {
          stat = name;
        }
        this.setState(stat);
      }

      getField(name, copy) {
        const ret = this.state[name];
        if (copy) {
          if (ret) {
            return { ...ret, name };
          }
          return { name };
        }
        return ret;
      }

      getFieldMeta(name) {
        return this.fieldsMeta[name];
      }

      render() {
        return <WrappedComponent form={this.getForm()} {...this.props} />;
      }
    }
    return Form;
  }
  return decorate;
}

export default createForm;
